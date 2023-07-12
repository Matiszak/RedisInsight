import { cloneDeep } from 'lodash'
import { AxiosError } from 'axios'

import { cleanup, clearStoreActions, initialStateDefault, mockedStore } from 'uiSrc/utils/test-utils'
import { OAuthSocialSource } from 'uiSrc/slices/interfaces'
import { apiService } from 'uiSrc/services'
import { addErrorNotification, addInfiniteNotification } from 'uiSrc/slices/app/notifications'
import { loadInstances } from 'uiSrc/slices/instances/instances'
import { INFINITE_MESSAGES } from 'uiSrc/components/notifications/components'
import reducer, {
  initialState,
  setSignInDialogState,
  oauthCloudSelector,
  signIn,
  signInSuccess,
  signInFailure,
  getUserInfo,
  getUserInfoSuccess,
  getUserInfoFailure,
  fetchUserInfo,
  addFreeDbFailure,
  addFreeDbSuccess,
  addFreeDb,
  createFreeDb,
  setSelectAccountDialogState,
  createFreeDbSuccess,
  activateAccount,
} from '../../oauth/cloud'

let store: typeof mockedStore
beforeEach(() => {
  cleanup()
  store = cloneDeep(mockedStore)
  store.clearActions()
})

describe('oauth cloud slice', () => {
  describe('reducer, actions and selectors', () => {
    it('should return the initial state on first run', () => {
      // Arrange
      const nextState = initialState

      // Act
      const result = reducer(undefined, {})

      // Assert
      expect(result).toEqual(nextState)
    })
  })

  describe('signIn', () => {
    it('should properly set loading = true', () => {
      // Arrange
      const state = {
        ...initialState,
        loading: true,
      }

      // Act
      const nextState = reducer(initialState, signIn())

      // Assert
      const rootState = Object.assign(initialStateDefault, {
        oauth: {
          cloud: nextState
        }
      })
      expect(oauthCloudSelector(rootState)).toEqual(state)
    })
  })

  describe('signInSuccess', () => {
    it('should properly set the state', () => {
      // Arrange
      const data = 'message'
      const state = {
        ...initialState,
        message: data,
        loading: false,
      }

      // Act
      const nextState = reducer(initialState, signInSuccess(data))

      // Assert
      const rootState = Object.assign(initialStateDefault, {
        oauth: {
          cloud: nextState
        }
      })
      expect(oauthCloudSelector(rootState)).toEqual(state)
    })
  })

  describe('signInFailure', () => {
    it('should properly set the error', () => {
      // Arrange
      const data = 'some error'
      const state = {
        ...initialState,
        loading: false,
        error: data,
      }

      // Act
      const nextState = reducer(initialState, signInFailure(data))

      // Assert
      const rootState = Object.assign(initialStateDefault, {
        oauth: {
          cloud: nextState
        }
      })
      expect(oauthCloudSelector(rootState)).toEqual(state)
    })
  })

  describe('getUserInfo', () => {
    it('should properly set loading = true', () => {
      // Arrange
      const state = {
        ...initialState,
        user: {
          ...initialState.user,
          loading: true,
        }
      }

      // Act
      const nextState = reducer(initialState, getUserInfo())

      // Assert
      const rootState = Object.assign(initialStateDefault, {
        oauth: {
          cloud: nextState
        }
      })
      expect(oauthCloudSelector(rootState)).toEqual(state)
    })
  })

  describe('getUserInfoSuccess', () => {
    it('should properly set the state with fetched data', () => {
      const data = {}
      // Arrange
      const state = {
        ...initialState,
        user: {
          ...initialState.user,
          loading: false,
          data,
        }
      }

      // Act
      const nextState = reducer(initialState, getUserInfoSuccess(data))

      // Assert
      const rootState = Object.assign(initialStateDefault, {
        oauth: {
          cloud: nextState
        }
      })
      expect(oauthCloudSelector(rootState)).toEqual(state)
    })
  })

  describe('getUserInfoFailure', () => {
    it('should properly set the error', () => {
      // Arrange
      const data = 'some error'
      const state = {
        ...initialState,
        user: {
          ...initialState.user,
          loading: false,
          error: data,
        }
      }

      // Act
      const nextState = reducer(initialState, getUserInfoFailure(data))

      // Assert
      const rootState = Object.assign(initialStateDefault, {
        oauth: {
          cloud: nextState
        }
      })
      expect(oauthCloudSelector(rootState)).toEqual(state)
    })
  })

  describe('addFreeDb', () => {
    it('should properly set loading = true', () => {
      // Arrange
      const state = {
        ...initialState,
        user: {
          ...initialState.user,
          freeDb: {
            ...initialState.user.freeDb,
            loading: true,
          }
        }
      }

      // Act
      const nextState = reducer(initialState, addFreeDb())

      // Assert
      const rootState = Object.assign(initialStateDefault, {
        oauth: {
          cloud: nextState
        }
      })
      expect(oauthCloudSelector(rootState)).toEqual(state)
    })
  })

  describe('addFreeDbSuccess', () => {
    it('should properly set the state with fetched data', () => {
      const data = {}
      // Arrange
      const state = {
        ...initialState,
        user: {
          ...initialState.user,
          freeDb: {
            ...initialState.user.freeDb,
            loading: false,
          }
        }
      }

      // Act
      const nextState = reducer(initialState, addFreeDbSuccess(data))

      // Assert
      const rootState = Object.assign(initialStateDefault, {
        oauth: {
          cloud: nextState
        }
      })
      expect(oauthCloudSelector(rootState)).toEqual(state)
    })
  })

  describe('addFreeDbFailure', () => {
    it('should properly set the error', () => {
      // Arrange
      const data = 'some error'
      const state = {
        ...initialState,
        user: {
          ...initialState.user,
          freeDb: {
            ...initialState.user.freeDb,
            loading: false,
            error: data,
          }
        }
      }

      // Act
      const nextState = reducer(initialState, addFreeDbFailure(data))

      // Assert
      const rootState = Object.assign(initialStateDefault, {
        oauth: {
          cloud: nextState
        }
      })
      expect(oauthCloudSelector(rootState)).toEqual(state)
    })
  })

  describe('setSelectAccountDialogState', () => {
    it('should properly set the state', () => {
      // Arrange
      const data = true
      const state = {
        ...initialState,
        isOpenSelectAccountDialog: true
      }

      // Act
      const nextState = reducer(initialState, setSelectAccountDialogState(data))

      // Assert
      const rootState = Object.assign(initialStateDefault, {
        oauth: {
          cloud: nextState
        }
      })
      expect(oauthCloudSelector(rootState)).toEqual(state)
    })
  })

  describe('setSignInDialogState', () => {
    it('should properly set the source=SignInDialogSource.BrowserSearch and isOpenSignInDialog=true', () => {
      // Arrange
      const state = {
        ...initialState,
        isOpenSignInDialog: true,
        source: OAuthSocialSource.BrowserSearch,
      }

      // Act
      const nextState = reducer(initialState, setSignInDialogState(OAuthSocialSource.BrowserSearch))

      // Assert
      const rootState = Object.assign(initialStateDefault, {
        oauth: { cloud: nextState },
      })
      expect(oauthCloudSelector(rootState)).toEqual(state)
    })
    it('should properly set the isOpenSignInDialog=false if source=null', () => {
      // Arrange
      const prevInitialState = {
        ...initialState,
        isOpenSignInDialog: true,
        source: OAuthSocialSource.BrowserSearch,
      }
      const state = {
        ...initialState,
        isOpenSignInDialog: false,
        source: null,
      }

      // Act
      const nextState = reducer(prevInitialState, setSignInDialogState(null))

      // Assert
      const rootState = Object.assign(initialStateDefault, {
        oauth: { cloud: nextState },
      })
      expect(oauthCloudSelector(rootState)).toEqual(state)
    })
  })

  describe('thunks', () => {
    describe('fetchUserInfo', () => {
      it('call both fetchUserInfo and getUserInfoSuccess when fetch is successed', async () => {
      // Arrange
        const data = { id: 123123 }
        const responsePayload = { data, status: 200 }

        apiService.get = jest.fn().mockResolvedValue(responsePayload)

        // Act
        await store.dispatch<any>(fetchUserInfo())

        // Assert
        const expectedActions = [
          getUserInfo(),
          getUserInfoSuccess(responsePayload.data),
        ]
        expect(store.getActions()).toEqual(expectedActions)
      })
      it.only('call setSelectAccountDialogState and setSignInDialogState when fetch is successed and accounts > 1', async () => {
      // Arrange
        const data = { id: 123123, accounts: [{}, {}] }
        const responsePayload = { data, status: 200 }

        apiService.get = jest.fn().mockResolvedValue(responsePayload)

        // Act
        await store.dispatch<any>(fetchUserInfo())

        // Assert
        const expectedActions = [
          getUserInfo(),
          setSelectAccountDialogState(true),
          getUserInfoSuccess(responsePayload.data),
          setSignInDialogState(null),
        ]
        expect(store.getActions()).toEqual(expectedActions)
      })

      it('call both fetchAccountInfo and getUserInfoFailure when fetch is fail', async () => {
      // Arrange
        const errorMessage = 'Could not connect to aoeu:123, please check the connection details.'
        const responsePayload = {
          response: {
            status: 500,
            data: { message: errorMessage },
          },
        }

        apiService.get = jest.fn().mockRejectedValueOnce(responsePayload)

        // Act
        await store.dispatch<any>(fetchUserInfo())

        // Assert
        const expectedActions = [
          getUserInfo(),
          addErrorNotification(responsePayload as AxiosError),
          getUserInfoFailure(responsePayload.response.data.message),
        ]
        expect(store.getActions()).toEqual(expectedActions)
      })
    })

    describe('createFreeDb', () => {
      it('call both addFreeDbSuccess and fetchInstancesAction when post is successed', async () => {
      // Arrange
        const data = { id: 123123 }
        const responsePayload = { data, status: 200 }

        apiService.post = jest.fn().mockResolvedValue(responsePayload)
        apiService.get = jest.fn().mockResolvedValue(responsePayload)

        // Act
        await store.dispatch<any>(createFreeDb())

        // Assert
        const expectedActions = [
          addFreeDb(),
          addFreeDbSuccess(responsePayload.data),
          loadInstances(),
        ]
        expect(store.getActions()).toEqual(expectedActions)
      })

      it('call both fetchAccountInfo and addFreeDbFailure when post is fail', async () => {
      // Arrange
        const errorMessage = 'Could not connect to aoeu:123, please check the connection details.'
        const responsePayload = {
          response: {
            status: 500,
            data: { message: errorMessage },
          },
        }

        apiService.post = jest.fn().mockRejectedValueOnce(responsePayload)

        // Act
        await store.dispatch<any>(createFreeDb())

        // Assert
        const expectedActions = [
          addFreeDb(),
          addErrorNotification(responsePayload as AxiosError),
          addFreeDbFailure(responsePayload.response.data.message),
        ]
        expect(store.getActions()).toEqual(expectedActions)
      })
    })

    describe('activateAccount', () => {
      it('call both getUserInfo and getUserInfoSuccess when put is successed', async () => {
      // Arrange
        const data = {
          id: 3,
          accounts: [
            { id: 3, name: 'name' },
            { id: 4, name: 'name' },
          ]
        }
        const responseAccountPayload = { data, status: 200 }

        apiService.put = jest.fn().mockResolvedValue(responseAccountPayload)

        // Act
        await store.dispatch<any>(activateAccount('123'))

        // Assert
        const expectedActions = [
          getUserInfo(),
          getUserInfoSuccess(data),
        ]
        expect(store.getActions()).toEqual(expectedActions)
      })

      it('call both getUserInfo and getUserInfoFailure when put is fail', async () => {
      // Arrange
        const errorMessage = 'Could not connect to aoeu:123, please check the connection details.'
        const responsePayload = {
          response: {
            status: 500,
            data: { message: errorMessage },
          },
        }

        apiService.put = jest.fn().mockRejectedValueOnce(responsePayload)

        // Act
        await store.dispatch<any>(activateAccount('3'))

        // Assert
        const expectedActions = [
          getUserInfo(),
          addErrorNotification(responsePayload as AxiosError),
          getUserInfoFailure(responsePayload.response.data.message),
        ]
        expect(store.getActions()).toEqual(expectedActions)
      })
    })

    describe('createFreeDbSuccess', () => {
      it('should call proper actions without error', async () => {
      // Arrange
        const onConnect = () => {}

        // Act
        await store.dispatch<any>(createFreeDbSuccess({}))

        // Assert
        const expectedActions = [
          addInfiniteNotification(INFINITE_MESSAGES.SUCCESS_CREATE_DB(onConnect)),
          setSignInDialogState(null),
          setSelectAccountDialogState(false),
        ]
        expect(clearStoreActions(store.getActions())).toEqual(clearStoreActions(expectedActions))
      })
    })
  })
})
