import express from 'express';
import admin from 'firebase-admin';
import cors from 'cors';
import serviceAccount from './server/serviceAccount.json' assert { type: 'json' };

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
const db = admin.firestore();
const app = express();
app.use(
  cors({
    origin: 'http://localhost:5173',
  }),
);
app.use(express.json());

app.post('/send-notification', async (req, res) => {
  const { userId, taskId, taskTitle } = req.body;

  try {
    const userDoc = await db.collection('users').doc(userId).get();
    if (!userDoc.exists) {
      return res.status(404).json({ message: 'User not found' });
    }
    const { pushToken } = userDoc.data();
    if (!pushToken) {
      return res.status(404).json({ message: 'User has no push token' });
    }
    const message = {
      notification: {
        title: 'New Task Assigned',
        body: 'You have been assigned a new task.',
      },
      token: pushToken,
    };
    await admin.messaging().send(message);
    res.status(200).send('Notification sent successfully');
  } catch (error) {
    console.error('Error sending notification:', error);
    res.status(500).send('Error sending notification');
  }
});
const Port = 3000;
app.listen(Port, () => {
  console.log('Listening on port ', Port);
});
