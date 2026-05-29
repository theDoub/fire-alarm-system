/**
 * services/fcmService.ts
 * Firebase Cloud Messaging integration.
 * - Requests permission on Android/iOS
 * - Gets the FCM token and registers it with the backend
 * - Sets up foreground & background message handlers
 *
 * Install: npx expo install @react-native-firebase/app @react-native-firebase/messaging
 */

// import messaging from '@react-native-firebase/messaging';
// import client from '@/api/client';

export const fcmService = {
  /**
   * Request push notification permission and register FCM token with backend.
   * Call once after login from AuthContext.
   */
  async registerDevice(): Promise<void> {
    // const authStatus = await messaging().requestPermission();
    // const enabled =
    //   authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    //   authStatus === messaging.AuthorizationStatus.PROVISIONAL;
    // if (!enabled) return;

    // const fcmToken = await messaging().getToken();
    // await client.post('/auth/fcm-token', { token: fcmToken });
    console.log('[FCM] registerDevice — TODO: uncomment after @react-native-firebase/messaging is installed');
  },

  /**
   * Foreground message handler — route HIGH severity to AlertContext.pushActiveAlert()
   * Wire this up in AlertContext.tsx useEffect.
   */
  onForegroundMessage(callback: (data: Record<string, string>) => void): () => void {
    // return messaging().onMessage(async (remoteMessage) => {
    //   if (remoteMessage.data) callback(remoteMessage.data as Record<string, string>);
    // });
    console.log('[FCM] onForegroundMessage — TODO: uncomment after firebase setup');
    return () => {};
  },

  /**
   * Background / quit state handler — registered in index.js (outside React tree)
   */
  setBackgroundHandler(): void {
    // messaging().setBackgroundMessageHandler(async (remoteMessage) => {
    //   console.log('[FCM] Background message:', remoteMessage);
    // });
    console.log('[FCM] setBackgroundHandler — TODO: register in root index.js');
  },
};
