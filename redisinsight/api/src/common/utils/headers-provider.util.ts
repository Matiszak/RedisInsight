import { lookup } from 'mime-types'

export function setContentTypeHeaders(res, path, stat) {
    let contentType = lookup(path);
    if(contentType) {
      console.log("Setting content type of '" + path + "' to '" + contentType + "'");
      res.type(contentType);
    }
    else {
      console.log("Skipping setting content type of '" + path + " because it wasn't recognized.");
    }
  };