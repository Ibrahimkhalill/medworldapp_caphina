import React, { useState, useRef, useEffect } from "react";
import {
  Text,
  View,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
} from "react-native";
import SimpleLineIcon from "react-native-vector-icons/SimpleLineIcons";
import axiosInstance from "../component/axiosInstance";
import { useFocusEffect } from "@react-navigation/native";
import * as Clipboard from "expo-clipboard";

function ForgetPasswordOtp({ route, navigation }) {
  const { email } = route.params || {};
  const [ForgetPasswordOtpFields, setForgetPasswordOtpFields] = useState([
    "",
    "",
    "",
    "",
  ]);
  const [isOtpFilled, setIsOtpFilled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(120);
  const inputRefs = useRef([]);

  useEffect(() => {
    if (timeLeft === 0) return;

    const timerId = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timerId);
  }, [timeLeft]);

  const notifyMessage = (msg) => {
    if (Platform.OS === "android") {
      ToastAndroid.showWithGravityAndOffset(
        msg,
        ToastAndroid.SHORT,
        ToastAndroid.TOP,
        25,
        160
      );
    } else {
      Alert.alert("Warning!", msg);
    }
  };

  const handleVerifyForgetPasswordOtp = async () => {
    if (ForgetPasswordOtpFields.some((field) => field === "")) {
      notifyMessage("Please enter all OTP fields.");
      return;
    }
    if (timeLeft === 0) {
      notifyMessage("OTP time is experid. Please resend OTP!");
      setForgetPasswordOtpFields(["", "", "", ""]);
      if (inputRefs.current[0]) {
        inputRefs.current[0].focus();
      }
      return;
    }

    const ForgetPasswordOtp = ForgetPasswordOtpFields.join("");
    setIsLoading(true);

    try {
      const response = await axiosInstance.post(`/verify-otp/`, {
        otp: ForgetPasswordOtp,
        email: email,
      });
      if (response.status === 200) {
        navigation.navigate("ResetPassword", {
          email: email,
        });

      } else {
        notifyMessage("Invalid Otp, please try again.");
      }
    } catch (error) {
      if (error.response) {
        // If the server returned a response (e.g., 400 status)
        const errorMessage = error.response.data.error || "Invalid request"; // Adjust based on your API structure
        console.log("Server error:", error.response);

        // Display the error message in a toast or alert
        notifyMessage(errorMessage); // Replace with your UI feedback mechanism
        setForgetPasswordOtpFields(["", "", "", ""]);
        if (inputRefs.current[0]) {
          inputRefs.current[0].focus();
        }
        // Optionally set it in state to display in the UI
      } else {
        // Handle other types of errors (e.g., network issues)
        console.log("Error without response:", error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpChange = (value, index) => {
    const updatedOtpFields = [...ForgetPasswordOtpFields];
    console.log(value);

    if (value.length > 1) {
      // Handle paste (multi-character input)
      const pastedValues = value.slice(0, updatedOtpFields.length).split(""); // Split pasted input
      pastedValues.forEach((char, idx) => {
        if (index + idx < updatedOtpFields.length) {
          updatedOtpFields[index + idx] = char;
        }
      });
      setForgetPasswordOtpFields(updatedOtpFields);

      // Move focus to the last filled field
      const lastIndex = index + pastedValues.length - 1;
      if (lastIndex < inputRefs.current.length) {
        inputRefs.current[lastIndex]?.focus();
      } else {
        inputRefs.current[inputRefs.current.length - 1]?.blur(); // Blur last field
      }
    } else {
      // Handle single-character input
      updatedOtpFields[index] = value;
      setForgetPasswordOtpFields(updatedOtpFields);

      if (value && index < inputRefs.current.length - 1) {
        inputRefs.current[index + 1]?.focus(); // Move focus to the next field
      }
    }
  };

  const handleResendForgetPasswordOtp = async () => {
    setForgetPasswordOtpFields(["", "", "", ""]);
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
    try {
      const response = await axiosInstance.post(`/password-reset-otp/`, {
        email: email,
      });

      if (response.status === 200) {
        setTimeLeft(120);
        notifyMessage("Otp has been resent.");
      }
    } catch (error) {
      console.log("error", error);
    }
  };
  useEffect(() => {
    // Focus on the first input field when the component mounts
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      if (inputRefs.current[0]) {
        inputRefs.current[0].focus();
      }
      setForgetPasswordOtpFields(["", "", "", ""]);
    }, [])
  );

  const [lastClipboardContent, setLastClipboardContent] = useState("");

  useEffect(() => {
    const checkClipboard = async () => {
      const clipboardContent = await Clipboard.getStringAsync();
      if (
        clipboardContent !== lastClipboardContent &&
        /^\d{4}$/.test(clipboardContent)
      ) {
        const otpArray = clipboardContent.split("");
        setForgetPasswordOtpFields(otpArray);
        setLastClipboardContent(clipboardContent); // নতুন কন্টেন্ট সেভ করুন
        await Clipboard.setStringAsync("");
        const lastInputIndex = inputRefs.current.length - 1;
        inputRefs.current[lastInputIndex]?.focus();
      }
    };
    const interval = setInterval(() => {
      checkClipboard();
    }, 1000);

    return () => clearInterval(interval); // Cleanup interval
  }, [lastClipboardContent]);

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View className="py-16 items-center bg-white w-full px-5 h-full">
        <View className="flex flex-row items-center justify-between w-full">
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <SimpleLineIcon name="arrow-left" size={18} color="gray" />
          </TouchableOpacity>

          <Image
            className="w-[116px] h-[92px] mx-auto"
            source={require("../../assets/MEDLOGO.png")}
          />
        </View>

        <View className="my-40 rounded-lg w-full flex items-center">
          <View className="py-3">
            <Text className="text-[14px]">OTP has been sent to your Email</Text>
          </View>
          <View className="flex-row items-center justify-center gap-2 mt-2">
            {ForgetPasswordOtpFields.map((field, index) => (
              <TextInput
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                className="px-4 py-1 bg-[#FFDC58B2] rounded-[5px] w-[50px] h-[50px] text-[30px] text-center"
                keyboardType="numeric"
                onChangeText={(value) => handleOtpChange(value, index)}
                value={field}
                onKeyPress={({ nativeEvent }) => {
                  if (
                    nativeEvent.key === "Backspace" &&
                    ForgetPasswordOtpFields[index] === "" &&
                    index > 0
                  ) {
                    const updatedOtp = [...ForgetPasswordOtpFields];
                    updatedOtp[index - 1] = ""; // Clear previous input
                    setForgetPasswordOtpFields(updatedOtp);
                    inputRefs.current[index - 1]?.focus();
                  }
                }}
              />
            ))}
          </View>

          <TouchableOpacity
            onPress={handleVerifyForgetPasswordOtp}
            className="w-[152px] h-[52px] bg-yellow-400 mt-5 rounded-3xl flex items-center justify-center"
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#0000ff" />
            ) : (
              <Text className="text-center text-[#000000] text-[18px]">
                Verify OTP
              </Text>
            )}
          </TouchableOpacity>

          <View className="mt-3 flex-row items-center">
            <Text className="text-[14px] text-gray-600">
              {`${String(Math.floor(timeLeft / 60)).padStart(2, "0")}:${String(
                timeLeft % 60
              ).padStart(2, "0")}`}
            </Text>
            <TouchableOpacity
              onPress={handleResendForgetPasswordOtp}
              disabled={timeLeft > 0}
            >
              <Text
                className={`text-[#43506C] ml-1 font-medium ${timeLeft > 0 ? "opacity-50" : ""
                  }`}
              >
                Resend OTP
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

export default ForgetPasswordOtp;
