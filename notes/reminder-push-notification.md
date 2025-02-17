# **🚀 Implementing a Reminder Notification System**

This guide will cover:

1. **Sending Scheduled Notifications** using `node-cron` or `node-schedule`  
2. **Real-time Push Notifications** with **Firebase Cloud Messaging (FCM)**  

---

## **🔹 1. Scheduling Notifications Using `node-schedule`**

We'll use `node-schedule` to trigger notifications based on the `dateTime` field in the **Reminder model**.

### **🔧 Install Dependencies**

```sh
npm install node-schedule nodemailer dotenv
```

We use:

- **`node-schedule`** to schedule tasks
- **`nodemailer`** for email notifications (optional)
- **`dotenv`** to manage environment variables

### **📌 Updated Reminder Model (Mongoose)**

```js
import mongoose from "mongoose";

const ReminderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    dateTime: {
      type: Date,
      required: true,
    },
    repeat: {
      type: String,
      enum: ["none", "daily", "weekly", "monthly", "yearly"],
      default: "none",
    },
    status: {
      type: String,
      enum: ["pending", "completed", "missed"],
      default: "pending",
    },
    notificationSent: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Reminder", ReminderSchema);
```

---

### **📌 Scheduling Reminders with `node-schedule`**

Create a utility function to **schedule reminders when they are created or updated**.

#### **📌 `reminderScheduler.js` (Scheduler Utility)**

```js
import schedule from "node-schedule";
import Reminder from "../models/Reminder.js";
import sendNotification from "./sendNotification.js"; // Custom function for notifications

const scheduleReminder = (reminder) => {
  const job = schedule.scheduleJob(reminder._id.toString(), new Date(reminder.dateTime), async () => {
    console.log(`🔔 Sending Reminder: ${reminder.title}`);

    // Send notification
    await sendNotification(reminder);

    // Mark as sent
    await Reminder.findByIdAndUpdate(reminder._id, { notificationSent: true });
  });
};

// Re-schedule all pending reminders on server start
const scheduleAllReminders = async () => {
  const reminders = await Reminder.find({ status: "pending", notificationSent: false });

  reminders.forEach((reminder) => {
    scheduleReminder(reminder);
  });
};

export { scheduleReminder, scheduleAllReminders };
```

---

### **📌 Sending Notifications**

We'll use **nodemailer** for email notifications and **FCM** for push notifications.

#### **📌 `sendNotification.js`**

```js
import nodemailer from "nodemailer";
import admin from "firebase-admin";
import dotenv from "dotenv";

dotenv.config();

// 🔹 Configure Nodemailer
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// 🔹 Configure Firebase Admin SDK
import serviceAccount from "../firebaseServiceAccountKey.json"; // Replace with your FCM JSON key

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const sendNotification = async (reminder) => {
  try {
    const user = await reminder.populate("user"); // Get user details
    const email = user.email;
    const title = reminder.title;
    const description = reminder.description;

    // 🔹 Send Email Notification
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: `Reminder: ${title}`,
      text: description,
    });

    console.log("📩 Email sent successfully");

    // 🔹 Send Push Notification via Firebase FCM
    if (user.fcmToken) {
      const message = {
        notification: {
          title: `Reminder: ${title}`,
          body: description,
        },
        token: user.fcmToken,
      };

      await admin.messaging().send(message);
      console.log("📲 Push notification sent successfully");
    }
  } catch (error) {
    console.error("🚨 Error sending notification:", error);
  }
};

export default sendNotification;
```

---

### **📌 Handling Reminder Creation**

Whenever a new reminder is created, we **schedule** it immediately.

#### **📌 `reminderController.js`**

```js
import Reminder from "../models/Reminder.js";
import { scheduleReminder } from "../utils/reminderScheduler.js";

const createReminder = async (req, res) => {
  try {
    const { title, description, dateTime, repeat } = req.body;

    const newReminder = new Reminder({
      user: req.user._id,
      title,
      description,
      dateTime,
      repeat,
    });

    await newReminder.save();

    // Schedule the reminder
    scheduleReminder(newReminder);

    res.status(201).json({ message: "Reminder created", reminder: newReminder });
  } catch (error) {
    res.status(500).json({ error: "Error creating reminder" });
  }
};

export default createReminder;
```

---

### **📌 Auto-Start Reminders on Server Restart**

When the server restarts, all pending reminders should be **reloaded and scheduled**.

#### **📌 In `server.js` or `index.js`**

```js
import { scheduleAllReminders } from "./utils/reminderScheduler.js";

// 🔹 Schedule all reminders on server start
scheduleAllReminders();
```

---

## **📌 2. Sending Real-time Push Notifications via Firebase FCM**

### **🔧 Step 1: Setup Firebase Project**

1. Go to **Firebase Console** → **Create a Project**  
2. Navigate to **Project Settings** → **Service Accounts**  
3. Generate a new JSON **Private Key** for Firebase Admin SDK  
4. Save it in your project as `firebaseServiceAccountKey.json`

### **🔧 Step 2: Update User Model to Store FCM Token**

Modify the **User model** to store the FCM token.

```js
const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  fcmToken: String, // 🔹 Store user's device FCM token
});
```

### **🔧 Step 3: Update User's FCM Token on Login**

Modify the authentication controller to update the **fcmToken**.

```js
const updateFcmToken = async (req, res) => {
  try {
    const { fcmToken } = req.body;
    const user = await User.findByIdAndUpdate(req.user._id, { fcmToken }, { new: true });

    res.json({ message: "FCM Token updated", user });
  } catch (error) {
    res.status(500).json({ error: "Error updating FCM Token" });
  }
};
```

---

## **🎯 Final Steps**

✅ **Reminders auto-schedule on creation & server restart**  
✅ **Scheduled jobs trigger notifications at the right time**  
✅ **Firebase push notifications work for mobile users**  

This implementation ensures **real-time reminders via FCM & scheduled alerts via `node-schedule`**. 🚀  

## 🚀 **Integrating Reminder Notifications in a React Native Expo App**  

We'll integrate the backend reminder system with **Firebase Cloud Messaging (FCM)** in a React Native **Expo** app for push notifications.

---

## **📌 1. Setup Firebase in React Native Expo**

### **🔧 Step 1: Create a Firebase Project**

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. **Create a new project**  
3. **Add an Android app**:
   - **Package Name**: Use your app’s bundle ID (e.g., `com.yourapp.name`)
   - **Register the app**
   - **Download the `google-services.json` file** but **DO NOT ADD IT** (Expo uses another approach)
4. **Add an iOS app** (if needed):
   - **Bundle ID** should match your Expo app’s iOS bundle ID
   - **Skip steps related to `GoogleService-Info.plist`** for now

---

### **🔧 Step 2: Install Dependencies**

Run this command in your **Expo project root**:

```sh
npx expo install expo-notifications firebase react-native-async-storage/async-storage
```

- **`expo-notifications`** → Handles push notifications  
- **`firebase`** → Firebase SDK for FCM  
- **`@react-native-async-storage/async-storage`** → Store FCM tokens locally  

---

### **📌 2. Configure Firebase for Expo**

#### **🔧 Step 1: Setup Firebase SDK**

Create a `firebaseConfig.js` file in your Expo project:

```js
import { initializeApp } from "firebase/app";
import { getReactNativePersistence, initializeAuth } from "firebase/auth";
import { getMessaging, getToken } from "firebase/messaging";
import AsyncStorage from "@react-native-async-storage/async-storage";

// 🔹 Firebase Configuration (Replace with your values)
const firebaseConfig = {
  apiKey: "YOUR_FIREBASE_API_KEY",
  authDomain: "your-app.firebaseapp.com",
  projectId: "your-app-id",
  storageBucket: "your-app-id.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID",
};

const app = initializeApp(firebaseConfig);

// 🔹 Initialize Firebase Authentication with AsyncStorage
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

// 🔹 Initialize Messaging (For Push Notifications)
const messaging = getMessaging(app);

export { app, auth, messaging };
```

---

### **📌 3. Request Push Notification Permissions**

Modify `App.js` to **ask for notification permissions**:

#### **📌 `App.js`**

```js
import { useEffect } from "react";
import { View, Text, Button } from "react-native";
import * as Notifications from "expo-notifications";
import { messaging } from "./firebaseConfig"; // Import Firebase messaging
import { getToken } from "firebase/messaging";
import AsyncStorage from "@react-native-async-storage/async-storage";

// 🔹 Request Notification Permissions
const requestPushNotificationPermissions = async () => {
  const { status } = await Notifications.getPermissionsAsync();
  if (status !== "granted") {
    const { status: newStatus } = await Notifications.requestPermissionsAsync();
    if (newStatus !== "granted") {
      console.log("🚨 Notification permissions denied");
      return;
    }
  }

  console.log("✅ Notification permissions granted");
};

// 🔹 Get FCM Token
const getFCMToken = async () => {
  try {
    const token = await getToken(messaging, { vapidKey: "YOUR_VAPID_KEY" }); // Only for web push notifications
    if (token) {
      console.log("📲 FCM Token:", token);
      await AsyncStorage.setItem("fcmToken", token);
    } else {
      console.log("⚠️ No FCM token received");
    }
  } catch (error) {
    console.error("🚨 Error getting FCM token:", error);
  }
};

// 🔹 Handle Incoming Notifications
const handleNotification = (notification) => {
  console.log("🔔 Received Notification:", notification);
};

export default function App() {
  useEffect(() => {
    requestPushNotificationPermissions();
    getFCMToken();

    // Listen for incoming notifications
    const subscription = Notifications.addNotificationReceivedListener(handleNotification);

    return () => subscription.remove();
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Expo FCM Notification Example</Text>
      <Button title="Get FCM Token" onPress={getFCMToken} />
    </View>
  );
}
```

---

## **📌 4. Send FCM Token to Backend**

Whenever a user logs in, we send the **FCM token** to the backend.

#### **📌 `authService.js`**

```js
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const API_URL = "https://your-backend.com/api";

export const updateFcmToken = async () => {
  const fcmToken = await AsyncStorage.getItem("fcmToken");
  if (!fcmToken) return;

  try {
    const response = await axios.post(`${API_URL}/users/update-fcm-token`, {
      fcmToken,
    });
    console.log("✅ FCM Token Updated:", response.data);
  } catch (error) {
    console.error("🚨 Error updating FCM token:", error);
  }
};
```

Call this function **after login** or on app startup.

---

## **📌 5. Handle Incoming Push Notifications**

Expo **does not support FCM in development mode**. You need to use the **Expo Push Token** for local testing.

### **📌 Register Expo Push Notifications**

Modify `App.js`:

```js
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";

// 🔹 Get Expo Push Token (For Local Testing)
const registerForPushNotificationsAsync = async () => {
  if (!Device.isDevice) {
    alert("Must use physical device for Push Notifications");
    return;
  }

  const { status } = await Notifications.getPermissionsAsync();
  if (status !== "granted") {
    const { status: newStatus } = await Notifications.requestPermissionsAsync();
    if (newStatus !== "granted") {
      alert("Notification permissions not granted!");
      return;
    }
  }

  const token = (await Notifications.getExpoPushTokenAsync()).data;
  console.log("Expo Push Token:", token);
  return token;
};
```

---

## **📌 6. Send Push Notifications from Backend**

In your **Node.js backend**, modify `sendNotification.js` to support Expo push notifications.

#### **📌 `sendNotification.js`**

```js
import axios from "axios";
import admin from "firebase-admin";

const sendNotification = async (reminder) => {
  const user = await reminder.populate("user");

  if (user.expoPushToken) {
    await axios.post("https://exp.host/--/api/v2/push/send", {
      to: user.expoPushToken,
      title: `Reminder: ${reminder.title}`,
      body: reminder.description,
      sound: "default",
    });
    console.log("✅ Expo Push Notification Sent");
  } else if (user.fcmToken) {
    const message = {
      notification: { title: reminder.title, body: reminder.description },
      token: user.fcmToken,
    };
    await admin.messaging().send(message);
    console.log("✅ Firebase Push Notification Sent");
  }
};

export default sendNotification;
```

---

## **🎯 Final Steps**

1. ✅ **Firebase Cloud Messaging setup in Expo**
2. ✅ **FCM Token stored and sent to backend**
3. ✅ **Push notifications received via Expo or FCM**
4. ✅ **Backend schedules reminders using `node-schedule`**

---

## **📌 What's Next?**

- Test **Expo push notifications** using `Expo Go`
- Deploy backend on **AWS/GCP/Vercel**
- Build the **Android APK** (`expo build:android`) and test **FCM notifications**

Do you need **help with deployment or debugging?** 🚀🔥
