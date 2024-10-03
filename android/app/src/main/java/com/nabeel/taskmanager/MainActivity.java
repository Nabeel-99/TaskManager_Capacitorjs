package com.nabeel.taskmanager;

import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.os.Build;
import android.os.Bundle;
import android.Manifest;
import androidx.appcompat.app.AppCompatActivity;
import com.getcapacitor.BridgeActivity;
import com.google.firebase.auth.FirebaseAuth;

public class MainActivity extends BridgeActivity {

    private FirebaseAuth auth;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        auth = FirebaseAuth.getInstance(); // Initialize Firebase Auth

        // Check if the user is logged in before creating a notification channel
        if (isUserLoggedIn()) {
            createNotificationChannel();
            requestNotificationPermission();
        }
    }

    // Create notification channel for Android 8.0 and higher
    private void createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            String channelId = "default_notification_channel_id";
            CharSequence name = "Default Channel";
            String description = "Channel for default notifications";
            int importance = NotificationManager.IMPORTANCE_DEFAULT;

            NotificationChannel channel = new NotificationChannel(channelId, name, importance);
            channel.setDescription(description);

            NotificationManager notificationManager = getSystemService(NotificationManager.class);
            if (notificationManager != null) {
                notificationManager.createNotificationChannel(channel);
            }
        }
    }

    // Request notification permission for Android 13 and higher
    private void requestNotificationPermission() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            requestPermissions(new String[]{Manifest.permission.POST_NOTIFICATIONS}, 1);
        }
    }

    // Check if the user is logged in using Firebase Auth
    private boolean isUserLoggedIn() {
        return auth.getCurrentUser() != null; // Returns true if the user is logged in
    }
}