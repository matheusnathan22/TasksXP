import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'TasksXP',
  webDir: 'www',
  server: {
    androidScheme: 'http',
    cleartext: true,
  },
  android: {
    allowMixedContent: true
  },
  plugins: {
    CapacitorHttp: {
    enabled: true
    },
  }
};

export default config;
