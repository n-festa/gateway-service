import { DEFAULT_PORT } from '../constants/config.constant';

export const configurationFactory = () => ({
  appPort: +(process.env.APP_PORT || DEFAULT_PORT),
  flagSmithKey: process.env.FLAGSMITH_SERVER_SIDE_ENVIRONMENT_KEY,
});
