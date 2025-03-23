import React from 'react'
import { render, screen } from 'uiSrc/utils/test-utils'

import { OAuthSocialSource, RedisDefaultModules } from 'uiSrc/slices/interfaces'
import { freeInstancesSelector } from 'uiSrc/slices/instances/instances'
import ModuleNotLoadedMinimalized from './ModuleNotLoadedMinimalized'

const moduleName = RedisDefaultModules.Search
const source = OAuthSocialSource.Tutorials

jest.mock('uiSrc/slices/instances/instances', () => ({
  ...jest.requireActual('uiSrc/slices/instances/instances'),
  freeInstancesSelector: jest.fn().mockReturnValue([{
    id: 'instanceId',
  }]),
}))

describe('ModuleNotLoadedMinimalized', () => {
  it('should render', () => {
    expect(render(<ModuleNotLoadedMinimalized moduleName={moduleName} source={source} />)).toBeTruthy()
  })

  it('should render connect to instance body when free instance is added', () => {
    (freeInstancesSelector as jest.Mock).mockReturnValue([
      {
        id: 'instanceId',
        modules: [
          {
            name: moduleName
          }
        ]
      }
    ])
    render(<ModuleNotLoadedMinimalized moduleName={moduleName} source={source} />)

    expect(screen.getByTestId('connect-free-db-btn')).toBeInTheDocument()
  })

  it('should render add free db body when free instance is not added', () => {
    (freeInstancesSelector as jest.Mock).mockReturnValue(null)

    render(<ModuleNotLoadedMinimalized moduleName={moduleName} source={source} />)

    expect(screen.getByTestId('tutorials-get-started-link')).toBeInTheDocument()
    expect(screen.getByTestId('tutorials-docker-link')).toBeInTheDocument()
  })
})
