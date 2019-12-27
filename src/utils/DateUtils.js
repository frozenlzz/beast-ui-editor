/**
 * 当前系统的 日期格式
 * @type {string}
 */
export const curDateFormat = 'YYYY-MM-DD';

/**
 * 获取支持输入的日期格式，一般用于设置 DatePicker 组件的 format 属性
 * @returns {string[]}
 */
export const getDateFormats = () => (['YYYY-MM-DD', 'YYYY/MM/DD', 'YYYYMMDD', 'YYYY-M-D', 'YYYY/M/D']);


// 根据出生年月日计算出年龄 '2019-11-20'
export const jsGetAge = function(strBirthday) {
  let returnAge;
  let strBirthdayArr = strBirthday.split('-');
  let birthYear = strBirthdayArr[0];
  let birthMonth = strBirthdayArr[1];
  let birthDay = strBirthdayArr[2];

  let d = new Date();
  let nowYear = d.getFullYear();
  let nowMonth = d.getMonth() + 1;
  let nowDay = d.getDate();

  if (nowYear === birthYear) {
    returnAge = 0; //同年 则为0岁
  } else {
    let ageDiff = nowYear - birthYear; //年之差
    if (ageDiff > 0) {
      if (nowMonth === birthMonth) {
        let dayDiff = nowDay - birthDay; //日之差
        if (dayDiff < 0) {
          returnAge = ageDiff - 1;
        } else {
          returnAge = ageDiff;
        }
      } else {
        let monthDiff = nowMonth - birthMonth; //月之差
        if (monthDiff < 0) {
          returnAge = ageDiff - 1;
        } else {
          returnAge = ageDiff;
        }
      }
    } else {
      returnAge = -1; //返回-1 表示出生日期输入错误 晚于今天
    }
  }

  return returnAge; //返回周岁年龄
};

/**
 * 触发 DataPicker 组件的 Click 事件，以弹出日期选择浮层，并获得输入焦点
 * @param e Event
 */
export const triggerDateClick = (e) => {
  if (e && e.currentTarget) {
    let isFirst = e.currentTarget.getAttribute('isfirst');

    if ('1' !== isFirst) {
      e.currentTarget.setAttribute('isfirst', '1');

      if (e.currentTarget.childNodes && e.currentTarget.childNodes[0] &&
        e.currentTarget.childNodes[0].childNodes && e.currentTarget.childNodes[0].childNodes[0]) {
        e.currentTarget.childNodes[0].childNodes[0].click();
      }
    }

  }
};

/**
 * 根据开始和结束期间，回显对应的中文
 * @param beginPeriod
 * @param endPeriod
 * @returns {string}
 */
export const previewPeriod = (beginPeriod, endPeriod) => {
  if (beginPeriod && endPeriod) {
    return (
      beginPeriod.name ?
        `${beginPeriod.name}${endPeriod.name ?
          endPeriod.name === beginPeriod.name ?
            '' :
            ' 至 ' + endPeriod.name
          :
          ' 至今'}`
        :
        endPeriod.name ?
          `${endPeriod.name} 及之前` : '全部'
    );
  } else {
    return '全部';
  }
};
