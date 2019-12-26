// import { str } from '@/pages/BottleManages/tablePropsData';
import { isArray } from 'lodash';
import { Input } from 'antd';
import React from 'react';

export let strFormat = function(str) {
  let newCol = [];
  if (typeof str === 'string') {
    let myStr = str.split('\n\n');
    let aaa = myStr.map(item => {
      let obj = {};
      let arr = item.split('\n')[0];
      obj['dataIndex'] = arr.substr(0, arr.indexOf('\t'));
      obj['key'] = arr.substr(0, arr.indexOf('\t'));
      obj['title'] = item.split('\n')[1];
      newCol.push(obj);
    });
  }
  return newCol;
};
export let mockDetailObj = function(objList) {
  let detailObj = {};
  isArray(objList) ? objList : [];
  objList.map((item, index) => {
    detailObj[item.dataIndex] = index;
  });
  return detailObj;
};
export let getFormFields = function(col, data) {
  let formFields = [];
  if (isArray(col)) {
    col.map(item => {
      formFields.push({
        label: item.title,
        fieldName: item.dataIndex,
        options: {
          initialValue: data[item.dataIndex],
          rules: [
            {
              required: false,
              message: `请输入${item.title}`,
            },
          ],
        },
        comp: <Input />,
      });
    });
  }
  return formFields;
};

// 根据出生年月日计算出年龄 '2019-11-20'
export const jsGetAge = function(strBirthday) {
  let returnAge;
  let strBirthdayArr = strBirthday.split('-');
  let birthYear = strBirthdayArr[0];
  let birthMonth = strBirthdayArr[1];
  let birthDay = strBirthdayArr[2];

  d = new Date();
  let nowYear = d.getFullYear();
  let nowMonth = d.getMonth() + 1;
  let nowDay = d.getDate();

  if (nowYear == birthYear) {
    returnAge = 0; //同年 则为0岁
  } else {
    let ageDiff = nowYear - birthYear; //年之差
    if (ageDiff > 0) {
      if (nowMonth == birthMonth) {
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
