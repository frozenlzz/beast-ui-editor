/**
 * 不是真实的 webpack 配置，仅为兼容 webstorm 和 intellij idea 代码跳转
 * ref: https://github.com/umijs/umi/issues/1109#issuecomment-423380125
 */
const commonRoot = require('path').resolve(__dirname, '../../web-common/src');
module.exports = {
  resolve: {
    alias: {
      '@': require('path').resolve(__dirname, 'src'),
      '/common': commonRoot,
      '/src': require('path').resolve(__dirname, 'src')
    }
  }
};
