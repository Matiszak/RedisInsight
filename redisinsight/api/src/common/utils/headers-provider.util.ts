import { lookup } from 'mime-types'

export function setContentTypeHeaders(res, path, stat) {
    let contentType = lookup(path);
    if(contentType) {
      res.type(contentType);
    }
  };