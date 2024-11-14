import express from "express";
import admin from "firebase-admin";
import cors from "cors";
import serviceAccount from "./server/serviceAccount.json" assert { type: "json" };

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
// });
admin.initializeApp();
const app = express();
app.use(
  cors({
    origin: "http://localhost:5173",
  }),
);
app.use(express.json());

app.post("/sendNotification", async (req, res) => {
  const { assignedUsers, taskData } = req.body;

  if (!assignedUsers || !taskData) {
    return res.status(400).send("Missing data");
  }

  try {
    for (const userId of assignedUsers) {
      const userDocRef = admin.firestore().doc(`users/${userId}`);
      const userDoc = await userDocRef.get();

      if (userDoc.exists) {
        const userData = userDoc.data();
        const fcmToken = userData?.fcmToken;

        if (fcmToken) {
          const payload = {
            notification: {
              title: "New Task Assigned",
              body: `You have been assigned a new task: ${taskData.title}`,
            },
            token: fcmToken,
          };

          try {
            await admin.messaging().send(payload);
            console.log(`Notification sent to ${userId}`);
          } catch (error) {
            console.error(`Error sending notification to ${userId}:`, error);
          }
        }
      }
    }

    res.status(200).send("Push notifications sent successfully");
  } catch (error) {
    console.error("Error sending notifications:", error);
    res.status(500).send("Error sending notifications");
  }
});

const Port = 3000;
app.listen(Port, () => {
  console.log("Listening on port ", Port);
});
