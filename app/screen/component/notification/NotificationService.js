import { useState, useEffect, useRef } from "react";
import { Platform } from "react-native";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import axiosInstance from "../axiosInstance";
import { useAuth } from "../../authentication/Auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

const getNotificationPreference = async () => {
  try {
    const preference = await AsyncStorage.getItem("notificationSound");
    console.log("Notification Preference:", preference);
    return preference === "true"; // Ensure it's a boolean
  } catch (error) {
    console.error("Error getting notification preference:", error);
    return false; // Default to notifications disabled if there's an error
  }
};

export default function useNotificationService() {
  const [expoPushToken, setExpoPushToken] = useState(null);
  const [notification, setNotification] = useState(null);
  const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(false); // State for notification preference
  const notificationListener = useRef();
  const responseListener = useRef();
  const { token } = useAuth();

  // Fetch notification preference on mount
  useEffect(() => {
    const setupNotifications = async () => {
      const preference = await getNotificationPreference();
      setIsNotificationsEnabled(preference); // Update state with the value
    };

    setupNotifications();
  }, []); // Empty dependency array to run only once

  useEffect(() => {
    if (!isNotificationsEnabled) {
      console.log("Notifications are disabled. Skipping push registration.");
      return;
    }

    console.log("Notifications enabled. Proceeding with push registration.");
    console.log("Auth Token:", token);

    // Register for push notifications and send the token to the backend
    registerForPushNotificationsAsync(token)
      .then((token) => setExpoPushToken(token))
      .catch((error) =>
        console.log("Error registering for notifications:", error.message)
      );

    // Listener for incoming notifications
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });

    // Listener for responses to notifications
    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log("Notification response:", response);
      });

    // Cleanup listeners
    return () => {
      if (notificationListener.current) {
        Notifications.removeNotificationSubscription(
          notificationListener.current
        );
      }
      if (responseListener.current) {
        Notifications.removeNotificationSubscription(responseListener.current);
      }
    };
  }, [isNotificationsEnabled, token]); // Dependencies include isNotificationsEnabled

  return { expoPushToken, notification };
}

async function registerForPushNotificationsAsync(authToken) {
  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      throw new Error("Permission not granted for push notifications.");
    }

    const projectId =
      Constants?.expoConfig?.extra?.eas?.projectId ??
      Constants?.easConfig?.projectId;

    if (!projectId) {
      throw new Error("Project ID not found.");
    }

    const token = (await Notifications.getExpoPushTokenAsync({ projectId }))
      .data;
    console.log("Expo Push Token:", token);

    // Send token to the backend
    await sendTokenToBackend(token, authToken);

    return token;
  } else {
    throw new Error("Must use a physical device for push notifications.");
  }
}

async function sendTokenToBackend(pushToken, authToken) {
  if (!pushToken && !authToken) {
    return;
  }
  try {
    const response = await axiosInstance.post(
      "/save-expo-token/",
      {
        expo_token: pushToken,
      },
      {
        headers: {
          Authorization: `Token ${authToken}`, // Authenticated request
        },
      }
    );

    if (response.status === 200) {
      console.log("Token successfully sent to backend!");
    } else {
      console.log("Failed to send token to backend:", response.data);
    }
  } catch (error) {
    if (error.response) {
      console.log("Backend error:", error.response.data);
    } else {
      console.log("Error sending token to backend:", error.message);
    }
  }
}
