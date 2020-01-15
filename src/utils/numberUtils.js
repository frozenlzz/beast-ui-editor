import { message } from 'antd';
import { isNumber, isString } from 'lodash-es';

export function fuckJsFloat(num) {
  return isNumber(num) ? Math.round(num * 100) / 100 : num;
}

/**
 * 数字金额大写转换(可以处理整数,小数,负数)
 * @param money 数字金额
 * @returns {string}
 */
export function moneyToChinese(money) {
  let locale = localStorage.getItem('umi_locale');
  if ('zh-CN' !== locale) {
    return '';
  }
  let cnNums = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖']; //汉字的数字
  let cnIntRadice = ['', '拾', '佰', '仟']; //基本单位
  let cnIntUnits = ['', '万', '亿', '兆']; //对应整数部分扩展单位
  let cnDecUnits = ['角', '分', '毫', '厘']; //对应小数部分单位
  let cnInteger = '整'; //整数金额时后面跟的字符
  let cnIntLast = '元'; //整型完以后的单位
  let maxNum = 999999999999999.9999; //最大处理的数字
  let zeroCount;
  let IntLen;
  let decLen;

  let IntegerNum; //金额整数部分
  let DecimalNum; //金额小数部分
  let ChineseStr = ''; //输出的中文金额字符串
  let parts; //分离金额后用的数组，预定义
  if (money === '') {
    return '';
  }
  money = parseFloat(money);
  if (money >= maxNum) {
    // console.warning('超出最大处理数字');
    return '超出最大处理数字';
  }
  if (money === 0) {
    ChineseStr = cnNums[0] + cnIntLast + cnInteger;
    // ChineseStr = cnNums[0] + cnIntLast;
    //document.getElementById("show").value=ChineseStr;
    return ChineseStr;
  }

  let negative = false; // 是负数
  if (0 > money) {
    negative = true;
    money = `${money}`.substr(1);
  }

  money = money.toString(); //转换为字符串
  if (money.indexOf('.') === -1) {
    IntegerNum = money;
    DecimalNum = '';
  } else {
    parts = money.split('.');
    IntegerNum = parts[0];
    DecimalNum = parts[1].substr(0, 4);
  }
  if (parseInt(IntegerNum, 10) > 0) {//获取整型部分转换
    zeroCount = 0;
    IntLen = IntegerNum.length;
    for (let i = 0; i < IntLen; i++) {
      let n = IntegerNum.substr(i, 1);
      let p = IntLen - i - 1;
      let q = p / 4;
      let m = p % 4;
      if (n === '0') {
        zeroCount++;
      } else {
        if (zeroCount > 0) {
          ChineseStr += cnNums[0];
        }
        zeroCount = 0; //归零
        ChineseStr += cnNums[parseInt(n)] + cnIntRadice[m];
      }
      if (m === 0 && zeroCount < 4) {
        ChineseStr += cnIntUnits[q];
      }
    }
    ChineseStr += cnIntLast;
    //整型部分处理完毕
  }
  if (DecimalNum !== '') {//小数部分
    decLen = DecimalNum.length;
    for (let i = 0; i < decLen; i++) {
      let n = DecimalNum.substr(i, 1);
      if (n !== '0') {
        ChineseStr += cnNums[Number(n)] + cnDecUnits[i];
      }
    }
  }
  if (ChineseStr === '') {
    ChineseStr += cnNums[0] + cnIntLast + cnInteger;
    // ChineseStr += cnNums[0] + cnIntLast;
  } else if (DecimalNum === '') {
    ChineseStr += cnInteger;
  }
  return negative ? '负' + ChineseStr : ChineseStr;
}

export function formatMoney(s, n) {
  if (null === s || 'undefined' === typeof s || '' === s || isNaN(s)) return '0.00';
  let negative = false; // 是负数
  if (0 > s) {
    negative = true;
    s = `${s}`.substr(1);
  }
  n = n > 0 && n <= 20 ? n : 2;
  s = parseFloat((s + '').replace(/[^\d\.-]/g, '')).toFixed(n) + '';
  let l = s.split('.')[0].split('').reverse(), r = s.split('.')[1];
  let t = '';
  for (let i = 0; i < l.length; i++) {
    t += l[i] + ((i + 1) % 3 === 0 && (i + 1) !== l.length ? ',' : '');
  }
  if (negative) t += '-';
  return t.split('').reverse().join('') + '.' + r;
}

export function clearNoNum(value) {
  if (isNumber(value)) {
    value = `${value}`;
  }
  //修复第一个字符是小数点 的情况.
  if (!isString(value) || (value != '' && value.substr(0, 1) == '.')) {
    value = '';
  }
  value = value.replace(/^0*(0\.|[1-9])/, '$1');//解决 粘贴不生效
  value = value.replace(/[^\d.]/g, '');  //清除“数字”和“.”以外的字符
  value = value.replace(/\.{2,}/g, '.'); //只保留第一个. 清除多余的
  value = value.replace('.', '$#$').replace(/\./g, '').replace('$#$', '.');
  value = value.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3');//只能输入两个小数
  if (value.indexOf('.') < 0 && value != '') {//以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额
    if (value.substr(0, 1) == '0' && value.length == 2) {
      value = value.substr(1, value.length);
    }
  }
  return value;
}


/**
 * 将 B 转换成 K 或者 M
 * @param size
 * @private
 */
export function byte2KOM(size) {
  let reStr;

  if (1024 * 1024 <= size) { // M
    reStr = `${(size / (1024 * 1024)).toFixed(2)}M`;
  } else if (1024 <= size) { // K
    reStr = `${(size / (1024)).toFixed(2)}K`;
  } else {
    reStr = `${size}B`;
  }

  return reStr;
}
