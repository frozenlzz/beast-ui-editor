import routerArr from './config/router.config';
import theme from './config/theme';
import AntdDayjsWebpackPlugin from 'antd-dayjs-webpack-plugin';
// ref: https://umijs.org/config/
export default {
  treeShaking: true,
  //extends: ['eslint:recommended'],
  plugins: [
    // ref: https://umijs.org/plugin/umi-plugin-react.html
    [
      'umi-plugin-react',
      {
        antd: true,
        dva: {
          hmr: true,
        },
        dynamicImport: {
          loadingComponent: './components/PageLoading/index',
          webpackChunkName: true,
          level: 3,
        },
        title: 'easyconSaas',
        // dll: true,
        routes: {
          exclude: [
            /models\//,
            /services\//,
            /model\.(t|j)sx?$/,
            /service\.(t|j)sx?$/,
            /components\//,
          ],
        },

        locale: {
          enable: true,
          default: 'zh-CN', //默认语言 zh-CN，如果 baseSeparator 设置为 _，则默认为 zh_CN
          baseNavigator: true, // 为true时，用navigator.language的值作为默认语言
          // antd: true, // 是否启用antd的<LocaleProvider />
          // baseSeparator: '-', // 语言默认分割符 -
        },
      },
    ],
  ],

  theme: theme,
  // base: '/',
  publicPath: './',
  manifest: {
    basePath: '/',
  },
  routes: routerArr,
  ignoreMomentLocale: true,
  disableRedirectHoist: true,
  history: 'hash',
  hash: true,
  targets: {
    ie: 11,
  },
  define: {
    // 'process.env.apiPrefix': 'development' === process.env.NODE_ENV ? '/api/' : '',
  },

  chainWebpack(config) {
    config.plugin('day').use(AntdDayjsWebpackPlugin)
    // Interact with entry points
    //   .entry('login')
    //   .add(require('path').resolve(__dirname, 'src/pages/User/Login.js'))

    // 设置 alias
    // config.resolve.alias.set('utils', require('path').resolve(__dirname, 'src/utils'),);

    // // 删除进度条插件
    // config.plugins.delete('progress');
  },
};

