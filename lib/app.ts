import packageInfo from '../package.json';
import env from './env';

const app = {
  version: packageInfo.version,
  name: 'OkShot.ai',
  logoUrl: '/Ed.png',
  url: env.appUrl,
};

export default app;
