import { Transport } from '@nestjs/microservices';
import { DEFAULT_PORT } from '../constants/config.constant';

export const configurationFactory = () => ({
  appPort: +(process.env.APP_PORT || DEFAULT_PORT),
  flagSmithKey: process.env.FLAGSMITH_SERVER_SIDE_ENVIRONMENT_KEY || '',
  microServices: {
    restaurant: {
      transport: Transport.TCP,
      options: { port: 3014 },
    },
    authorization: {
      transport: Transport.TCP,
      options: { port: 3011 },
    },
    user: {
      transport: Transport.TCP,
      options: { port: 3018 },
    },
  },
  featureFlag: process.env.FEATURE_FLAG || '',
  throttlerConfig: {
    ttl: process.env.THROTTLE_TTL || 6000,
    limit: process.env.THROTTLE_LIMIT || 3,
    ignoredUserAgent: process.env.THROTTLE_IGNORE_USER_AGENT.split(',') || [],
  },
});
