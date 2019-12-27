import { findIndex, isString } from 'lodash';

const imgTypeArr = ['jpg', 'jpeg', 'png', 'gif', 'bmp'];

export const isImgByExt = (ext) => {
  let isOk = false;
  if (isString(ext) && '' !== ext) {
    let extStr = ext.toLowerCase();

    if((-1 !== extStr.search(/image/i))) {
      isOk = true
    } else {
      isOk = -1 !== findIndex(imgTypeArr, (v) => (-1 !== v.indexOf(extStr) || -1 !== extStr.indexOf(v)))
    }
  }
  // console.log('isOk', ext, isOk);
  return isOk;
};
