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
  },
  awsS3: {
    region: process.env.AWS_REGION || 'ap-southeast-2',
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
    cloudfrontDistributionDomain:
      process.env.AWS_CLOUDFRONT_DISTRIBUTION_DOMAIN ||
      'https://d2h6tnle5tppss.cloudfront.net',
  },
});
