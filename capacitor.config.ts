import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  plugins: {
    PushNotifications: {
      presentationOptions: ['badge', 'sound', 'alert'],
    },
  },
  appId: 'com.nabeel.taskmanager',
  appName: 'taskmanager',
  webDir: 'build',
  bundledWebRuntime: false,
};

export default config;
