import { Transport } from '@nestjs/microservices';
import { DEFAULT_PORT } from '../constants/config.constant';

export const configurationFactory = () => ({
  appPort: +(process.env.APP_PORT || DEFAULT_PORT),
  flagSmithKey:
    process.env.FLAGSMITH_SERVER_SIDE_ENVIRONMENT_KEY ||
    'ser.6DZMKXpjjZ2d6MPzjCTpte',
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
});
