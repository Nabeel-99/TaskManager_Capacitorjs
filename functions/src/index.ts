import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp();

export const sendPushNotifications = functions.firestore.onDocumentCreated(
  "tasks/{taskId}",
  async (e) => {
    const taskData = e.data?.data();
    if (!taskData) {
      console.log("No tasks data found");
      return;
    }
    const { assignedUsers } = taskData;
    for (const userId of assignedUsers) {
      const userDocRef = admin.firestore().doc(`users/${userId}`);
      const userDoc = await userDocRef.get();

      if (userDoc.exists) {
        const userData = userDoc.data();
        const fcmToken = userData?.fcmToken;
        if (fcmToken) {
          const payload = {
            notification: {
              title: "New Message",
              body: "You have a new assigned task",
            },
            token: fcmToken,
          };
          try {
            await admin.messaging().send(payload);
            console.log("Notification sent successfully");
          } catch (error) {
            console.log("Error sending notification", error);
          }
        }
      }
    }
  },
);
