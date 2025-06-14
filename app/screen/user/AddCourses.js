import React from "react";
import { StatusBar } from "expo-status-bar";
import { useState, useRef, useEffect } from "react";

import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  Dimensions,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Platform,
  ToastAndroid,
  KeyboardAvoidingView,
  Alert,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context"; // SafeAreaView from safe-area-context

import Navbar from "../component/Navbar";
import CustomDatePicker from "../component/CustomDatePicker";
import axiosInstance from "../component/axiosInstance";
import { useAuth } from "../authentication/Auth";
import { useTranslation } from "react-i18next";
import { useFocusEffect } from "@react-navigation/native";

function AddCourses({ navigation }) {
  const [date, setDate] = useState(new Date());
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { token } = useAuth();
  const [errors, setErrors] = useState({ date: "", name: "" });
  const { t } = useTranslation();
  const { height } = Dimensions.get("window");
  const scrollViewHeight = height * 0.55; // 90% of the screen height
  // Notify message utility
  function notifyMessage(msg) {
    if (Platform.OS === "android") {
      ToastAndroid.showWithGravityAndOffset(
        msg,
        ToastAndroid.SHORT,
        ToastAndroid.TOP,
        25,
        160
      );
    } else {
      Alert.alert(msg);
    }
  }

  // Handle Add Course
  const handleAdd = async () => {
    let hasError = false;
    let newErrors = { date: "", name: "" };

    if (!date) {
      newErrors.date = "Date is required";
      hasError = true;
    }
    if (!name) {
      newErrors.name = "Name is required";
      hasError = true;
    }

    setErrors(newErrors);

    if (hasError) {
      return;
    }

    const payload = {
      date,
      name,
    };

    setIsLoading(true);

    try {
      const response = await axiosInstance.post("/courses/", payload, {
        headers: {
          Authorization: `Token ${token}`, // Include token for authorization
        },
      });

      if (response.status === 201) {
        notifyMessage(t("course_added_success"));
        clearForm();
        navigation.navigate("CoursesDocument");
      } else {
        notifyMessage(t("error_adding_course"));
      }
    } catch (error) {
      console.error("Error adding course:", error);
      notifyMessage(t("error_generic"));
    } finally {
      setIsLoading(false);
    }
  };

  // Clear form after submission
  const clearForm = () => {
    setDate(new Date());
    setName("");
    setErrors({ date: "", name: "" });
  };

  // Handle Date Change
  const handleDateChange = (selectedDate) => {
    setDate(selectedDate);
    setErrors({ ...errors, date: "" }); // Clear error when value changes
  };
  useFocusEffect(
    React.useCallback(() => {
      clearForm();
    }, [])
  );
  return (
    <SafeAreaView style={styles.safeAreaContainer} className="px-5">
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <Navbar navigation={navigation} navigation_Name={"UserHome"} />
        <View className="flex flex-row gap-3 my-3 mb-5">
          <TouchableOpacity
            style={styles.navButton}
            onPress={() => navigation.navigate("AddScientific")}
          >
            <Text style={styles.navButtonText}>{t("scientific")}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.navButton}
            onPress={() => navigation.navigate("AddSurgeries")}
          >
            <Text style={styles.navButtonText}>{t("surgeries")}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.navButton, styles.activeNavButton]}
            onPress={() => navigation.navigate("AddCourses")}
            className="border-b-4 border-[#FFDC58] pb-1"
          >
            <Text style={styles.navButtonText}>{t("courses")}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.navButton}
            onPress={() => navigation.navigate("AddBudget")}
          >
            <Text style={styles.navButtonText}>{t("budget")}</Text>
          </TouchableOpacity>
        </View>
        <ScrollView
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          Style={{ flexGrow: 1, height: scrollViewHeight }}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.container}>
            {/* Date Input */}
            <View style={styles.inputContainerDouble}>
              <View style={styles.inputContainerFIrst}>
                <Text style={styles.label}>{t("date")}</Text>
                <CustomDatePicker
                  onDateChange={handleDateChange}
                  date={date}
                  setDate={setDate}
                />
                {errors.date ? (
                  <Text style={styles.errorText}>{errors.date}</Text>
                ) : null}
              </View>
            </View>

            {/* Name Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>{t("name")}</Text>

              <View
                style={[
                  styles.inputWrapper,
                  errors.name ? styles.inputErrorBorder : null, // Apply red border if error exists
                ]}
              >
                <TextInput
                  style={styles.input}
                  placeholder={t("enter_course_name")}
                  value={name}
                  onChangeText={(text) => {
                    setName(text);
                    setErrors({ ...errors, name: "" }); // Clear error when value changes
                  }}
                />
              </View>
              {errors.name ? (
                <Text style={styles.errorText}>{errors.name}</Text>
              ) : null}
            </View>
          </View>
          <View className="flex items-center justify-center mb-10">
            <TouchableOpacity style={styles.loginButton} onPress={handleAdd}>
              <Text style={styles.loginButtonText}>
                {isLoading ? t("saving") : t("save")}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeAreaContainer: {
    flexGrow: 1,
    paddingBottom: 10,
    backgroundColor: "white",
  },

  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",

    paddingBottom: 10,
  },
  imageContainer: {
    marginBottom: 30,
  },
  image: {
    width: 100, // width of the image
    height: 80, // height of the image
  },
  Profileimage: {
    width: 120, // width of the image
    height: 120, // height of the image
    borderRadius: 60, // half of width or height for circular shape
    overflow: "hidden", // ensures content stays within the circle
  },

  inputContainer: {
    width: "100%",
    marginBottom: 15,
  },
  inputContainerFIrst: {
    width: "50%",
    marginBottom: 15,
  },
  inputContainerDouble: {
    width: "100%",

    flexDirection: "row",

    gap: 6,
  },
  label: {
    fontSize: 16,
    fontWeight: "400",
    color: "#000000",
    marginBottom: 5,
  },
  labelFirst: {
    fontSize: 16,
    fontWeight: "400",
    color: "#000000",
    marginBottom: 6,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 12,
    borderColor: "black",
    paddingHorizontal: 10,
    height: 56,
  },
  inputWrapperDouble: {
    flexDirection: "column",

    height: 56,
    width: "40%",
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#333",
    paddingLeft: 10,
  },
  inputFirst: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 12,
    borderColor: "gray",
    paddingHorizontal: 10,
    height: 50,
    width: "95%",
  },
  loginButton: {
    height: 39,
    backgroundColor: "#FFDC58", // Button color
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    marginTop: 40,
    width: 119,
  },
  loginButtonText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#00000",
  },
  alreadySignInContainer: {
    marginTop: 15,
    flexDirection: "row",
    alignItems: "center",
  },
  alreadySignInText: {
    fontSize: 14,
    color: "#777",
  },
  link: {
    fontSize: 14,
    color: "#FFDC58",
    marginLeft: 5,
    textDecorationLine: "underline",
  },
  forgotPasswordContainer: {
    width: "100%",
    marginBottom: 20,
  },
  forgotPasswordText: {
    fontSize: 14,
    color: "#E91111",
    textAlign: "right",
  },
  icon: {
    width: 12.5,
    height: 11.5,
  },
  navButtonText: {
    fontWeight: "500",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: 4,
  },
  inputErrorBorder: {
    borderColor: "red", // Red border color for error
    borderWidth: 1, // Slightly thicker border for visibility
  },
});

export default AddCourses;
