import routerArr from './config/router.config';
import theme from './config/theme';
import commonConfig from '../web-common/.umirc';

const config = commonConfig(__dirname);
config.routes = routerArr;
config.theme = theme;
module.exports = config;
