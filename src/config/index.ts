const { store } = require( '../redux/store');

const config = {
  common: require('./common.json'),
  dev: require('./dev.json'),
  staging: require('./staging.json'),
  production: require('./production.json'),
};

const getConfig = (): any => {
  let appOptions = store.getState().appOptions;
  return {
    ...appOptions,
    ...config.common,
    ...config[appOptions.environment],
  };
}

export default getConfig;