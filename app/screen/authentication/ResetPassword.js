import React, { useState } from "react";
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  ScrollView,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import FeatherIcon from "react-native-vector-icons/Feather";
import axiosInstance from "../component/axiosInstance";
import PopUp from "../PopUp";
import { SafeAreaView } from "react-native-safe-area-context";

function ResetPassWord({ route, navigation }) {
  const { email } = route.params || {};
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [errors, setErrors] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const validatePassword = (password) => {
    const regex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
  };

  const handlePasswordChange = (text) => {
    setNewPassword(text);

    if (text === "") {
      setErrors((prev) => ({
        ...prev,
        newPassword: "Password cannot be empty",
      }));
    } else if (!validatePassword(text)) {
      setErrors((prev) => ({
        ...prev,
        newPassword:
          "Password must be at least 8 characters, include letters, digits, and special characters",
      }));
    } else {
      setErrors((prev) => ({ ...prev, newPassword: "" }));
    }
  };

  const handleConfirmPasswordChange = (text) => {
    setConfirmPassword(text);

    if (text === "") {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: "Confirm Password cannot be empty",
      }));
    } else if (text !== newPassword) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: "Passwords do not match",
      }));
    } else {
      setErrors((prev) => ({ ...prev, confirmPassword: "" }));
    }
  };
  const handleResetPassword = async () => {
    // Validate if fields are empty
    if (!newPassword) {
      setErrors((prev) => ({
        ...prev,
        newPassword: "Password cannot be empty",
      }));
    }
    if (!confirmPassword) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: "Confirm Password cannot be empty",
      }));
    }

    // Prevent submission if any error exists
    if (
      errors.newPassword ||
      errors.confirmPassword ||
      !newPassword ||
      !confirmPassword
    ) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await axiosInstance.post("/password-reset/", {
        email: email,
        newpassword: newPassword,
      });
      // Simulate successful password reset
      if (response.status === 200) {
        setIsVisible(true);
      }
    } catch (error) {
      alert("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, backgroundColor: "#fff" }} showsVerticalScrollIndicator={false}>
        <View className="flex-1 py-5 h-screen items-center bg-white w-full px-5">
          <View className="flex flex-row items-center justify-between w-full">
            <TouchableOpacity onPress={() => navigation.navigate("UserLogin")}>
              <Icon name="arrow-back" size={24} color="gray" />
            </TouchableOpacity>
            <Image
              className="w-[116px] h-[92px] mx-auto"
              source={require("../../assets/MEDLOGO.png")}
            />
          </View>
          <View className="my-24 rounded-lg w-full">
            <View className="py-3">
              <Text className="text-[24px] font-bold">Reset Password</Text>
              <Text className="text-[14px]">Enter a new password below.</Text>
            </View>
            <Text className="text-[16px] text-[#000000] mt-6">New Password</Text>
            <View className="relative flex-row items-center border border-gray-300 rounded-[16px] h-[52px] mt-2">
              <FeatherIcon name="lock" size={20} color="gray" className="ml-3" />
              <TextInput
                className="flex-1 p-2 text-gray-600 text-[16px]"
                placeholderTextColor="#888888"
                placeholder="Enter password"
                onChangeText={handlePasswordChange}
                value={newPassword}
                secureTextEntry={!isPasswordVisible}
              />
              <TouchableOpacity
                onPress={togglePasswordVisibility}
                className="absolute right-2 top-3"
              >
                <Icon
                  name={isPasswordVisible ? "eye" : "eye-off"}
                  size={20}
                  color="gray"
                />
              </TouchableOpacity>
            </View>
            {errors.newPassword ? (
              <Text className="text-red-500 text-[12px] mt-1">
                {errors.newPassword}
              </Text>
            ) : null}

            <Text className="text-[16px] text-[#000000] mt-6">
              Confirm Password
            </Text>
            <View className="relative flex-row items-center border border-gray-300 rounded-[16px] h-[52px] mt-2">
              <FeatherIcon name="lock" size={20} color="gray" className="ml-3" />
              <TextInput
                className="flex-1 p-2 text-gray-600 text-[16px]"
                placeholderTextColor="#888888"
                placeholder="Confirm password"
                onChangeText={handleConfirmPasswordChange}
                value={confirmPassword}
                secureTextEntry={!isPasswordVisible}
              />
            </View>
            {errors.confirmPassword ? (
              <Text className="text-red-500 text-[12px] mt-1">
                {errors.confirmPassword}
              </Text>
            ) : null}

            <TouchableOpacity
              onPress={handleResetPassword}
              className="mt-6 bg-yellow-400 p-3 rounded-3xl"
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="#0000ff" />
              ) : (
                <Text className="text-center text-[#000000] text-[19px]">
                  Reset Password
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
        <PopUp
          setIsVisible={setIsVisible}
          isVisible={isVisible}
          navigation={navigation}
        />
      </ScrollView>

    </SafeAreaView>
  );
}

export default ResetPassWord;
