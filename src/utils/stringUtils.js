import isEmpty  from 'lodash-es/isEmpty';

export const formatCheckErr = function(errMsg, paramObj) {
  let reMsg = errMsg;

  if ('string' === typeof errMsg && !isEmpty(paramObj)) {

    for (const k in paramObj) {

      if (paramObj.hasOwnProperty(k)) {
        const val = paramObj[k];
        reMsg = reMsg.replace(eval(`/\{${k}\}/g`), val);
      }
    }
  }
  return reMsg;
};
