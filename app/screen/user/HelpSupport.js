import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  Dimensions,
  Alert,
  ActivityIndicator,
} from "react-native";
import { MaterialCommunityIcons } from "react-native-vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

import Navbar from "../component/Navbar";
import HelpModal from "../component/HelpModal";
import axiosInstance from "../component/axiosInstance";
import { useAuth } from "../authentication/Auth";

const { height } = Dimensions.get("window");
const scrollViewHeight = height * 0.8;

const HelpSupport = ({ navigation }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const { token } = useAuth();

  const handleSendEmail = async () => {
    // Email format validation using regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email) {
      Alert.alert("Warning", "Email is required");
      return;
    }

    if (!emailRegex.test(email)) {
      Alert.alert("Warning", "Please enter a valid email address");
      return;
    }

    if (!message) {
      Alert.alert("Warning", "Message is required");
      return;
    }

    const payload = { email, message };
    setIsLoading(true);

    try {
      const response = await axiosInstance.post(
        "/send-support-email/",
        payload,
        {
          headers: {
            Authorization: `Token ${token}`, // Ensure token is passed correctly
          },
        }
      );

      if (response.status === 200) {
        setIsVisible(true);
        setEmail("");
        setMessage("");
      }
    } catch (error) {
      console.error("Error sending email:", error);
      Alert.alert("Error", "Failed to send your message. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} className="px-5">
      <Navbar navigation_Name={"settings"} navigation={navigation} />
      <ScrollView contentContainerStyle={styles.container}>
        <View style={{ marginTop: 10 }}>
          <Text style={styles.title}>Help & Support</Text>

          {/* Email Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Your email</Text>
            <View style={styles.inputWrapper}>
              <MaterialCommunityIcons
                name="email-outline"
                size={20}
                color="#B5B5B5"
              />
              <TextInput
                style={styles.input}
                placeholder="Enter Email"
                value={email}
                onChangeText={setEmail} // Fixed
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </View>

          {/* Message Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={styles.textArea}
              multiline
              placeholder="Describe your issue..."
              value={message}
              onChangeText={setMessage} // Fixed
            />
          </View>
        </View>
      </ScrollView>

      {/* Submit Button */}
      <TouchableOpacity
        style={styles.sentButton}
        onPress={handleSendEmail}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.sentButtonText}>Send</Text>
        )}
      </TouchableOpacity>

      {/* Success Modal */}
      <HelpModal setIsVisible={setIsVisible} isVisible={isVisible} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "white",
    
  },
  container: {
    flexGrow: 1,

    paddingBottom: 80, // Space for button
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "black",
  },
  inputContainer: {
    marginTop: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    marginBottom: 5,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 12,
    borderColor: "#ccc",
    paddingHorizontal: 10,
    height: 50,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#333",
    paddingLeft: 10,
  },
  textArea: {
    height: 150,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 12,
    padding: 10,
    textAlignVertical: "top",
    fontSize: 16,
  },
  sentButton: {
    position: "absolute",
    bottom: 30,
    left: 20,
    right: 20,
    backgroundColor: "#FFDC58",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 30,
  },
  sentButtonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "white",
  },
    errorBorder: {
    borderColor: "red",
  },
});

export default HelpSupport;
