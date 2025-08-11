import React from "react";
import { StatusBar } from "expo-status-bar";
import { useState, useRef, useEffect } from "react";

import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  Image,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Platform,
  ToastAndroid,
  ActivityIndicator,
  Dimensions,
  ScrollView,
  KeyboardAvoidingView,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";

import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

import Navbar from "../component/Navbar";
import CustomDatePicker from "../component/CustomDatePicker";
import { useAuth } from "../authentication/Auth";
import axiosInstance from "../component/axiosInstance";
import { useTranslation } from "react-i18next";

function AddBudget({ navigation }) {
  const [date, setDate] = useState(new Date());
  const [category, setCategory] = useState("");
  const [name, setName] = useState("");
  const [registrationFee, setRegistrationFee] = useState("");
  const [travelFee, setTravelFee] = useState("");
  const [accommodationExpense, setAccommodationExpense] = useState("");
  const [totalFee, setTotalFee] = useState("");
  const [location, setLocation] = useState(""); // <-- Location state added
  const { token } = useAuth();
  const { t } = useTranslation();
  const { height } = Dimensions.get("window");
  const scrollViewHeight = height * 0.55; // 55% of the screen height

  const [errors, setErrors] = useState({
    date: "",
    category: "",
    name: "",
    registrationFee: "",
    travelFee: "",
    accommodationExpense: "",
    location: "", // <-- error for location
  });

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
      alert(msg);
    }
  }

  // Real-time calculation of total fee
  useEffect(() => {
    const regFee = parseFloat(registrationFee) || 0;
    const travFee = parseFloat(travelFee) || 0;
    const accomExp = parseFloat(accommodationExpense) || 0;
    setTotalFee((regFee + travFee + accomExp).toFixed(2)); // Keep total to 2 decimal places
  }, [registrationFee, travelFee, accommodationExpense]);

  // Handle form submission
  const handleAdd = async () => {
    let hasError = false;
    const newErrors = {
      date: "",
      category: "",
      name: "",
      registrationFee: "",
      travelFee: "",
      accommodationExpense: "",
      location: "",
    };

    if (!date) {
      newErrors.date = "Date is required";
      hasError = true;
    }
    if (!category) {
      newErrors.category = "Category is required";
      hasError = true;
    }
    if (!name) {
      newErrors.name = "Name is required";
      hasError = true;
    }
    if (!registrationFee) {
      newErrors.registrationFee = "Registration fee is required";
      hasError = true;
    }
    if (!travelFee) {
      newErrors.travelFee = "Travel fee is required";
      hasError = true;
    }
    if (!accommodationExpense) {
      newErrors.accommodationExpense = "Accommodation expense is required";
      hasError = true;
    }

    setErrors(newErrors);

    if (hasError) return;

    const payload = {
      date,
      category,
      name,
      registration_fee: registrationFee,
      travel_fee: travelFee,
      accommodation_expense: accommodationExpense,
      total_fee: totalFee,
      location, // <-- included location here
    };

    try {
      const response = await axiosInstance.post("/budgets/", payload, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });

      if (response.status === 201) {
        notifyMessage(t("budget_added_success"));
        clearForm();
        navigation.navigate("BudgetDcoument");
      } else {
        notifyMessage(t("error_adding_budget"));
      }
    } catch (error) {
      console.error("Error adding budget:", error);
      notifyMessage(t("error_generic"));
    }
  };

  // Clear form after submission
  const clearForm = () => {
    setDate(new Date());
    setCategory("");
    setName("");
    setRegistrationFee("");
    setTravelFee("");
    setAccommodationExpense("");
    setLocation(""); // <-- clear location on form reset
    setErrors({});
  };

  useFocusEffect(
    React.useCallback(() => {
      clearForm();
    }, [])
  );

  // Handle Date Change
  const handleDateChange = (selectedDate) => {
    setDate(selectedDate);
    setErrors({ ...errors, date: "" }); // Clear error when value changes
  };

  return (
    <SafeAreaView style={styles.safeAreaContainer} className="px-5">
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <Navbar navigation={navigation} navigation_Name={"UserHome"} />
        <View className="flex flex-row gap-3 my-3 mb-5">
          <TouchableOpacity
            style={styles.navButton}
            onPress={() => navigation.navigate("AddScientific")}>
            <Text style={styles.navButtonText}>{t("scientific")}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.navButton}
            onPress={() => navigation.navigate("AddSurgeries")}>
            <Text style={styles.navButtonText}>{t("surgeries")}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.navButton, styles.activeNavButton]}
            onPress={() => navigation.navigate("AddCourses")}>
            <Text style={styles.navButtonText}>{t("courses")}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.navButton}
            onPress={() => navigation.navigate("AddBudget")}
            className="border-b-4 border-[#FFDC58] pb-1">
            <Text style={styles.navButtonText}>{t("budget")}</Text>
          </TouchableOpacity>
        </View>
        <ScrollView
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          Style={{ flexGrow: 1 }}
          contentContainerStyle={{ paddingBottom: 70 }}
          keyboardShouldPersistTaps="handled">
          <View style={styles.container}>
            {/* Date and Category */}
            <View style={styles.inputContainerDouble}>
              <View style={styles.inputContainerFIrst}>
                <Text style={styles.labelFirst}>{t("date")}</Text>
                <CustomDatePicker
                  onDateChange={handleDateChange}
                  date={date}
                  setDate={setDate}
                />
                {errors.date ? (
                  <Text style={styles.errorText}>{errors.date}</Text>
                ) : null}
              </View>
              <View style={styles.inputContainerFIrst}>
                <Text style={styles.labelFirst}>{t("category")}</Text>
                <TextInput
                  style={[
                    styles.inputFirst,
                    errors.category ? styles.inputErrorBorder : null,
                  ]}
                  placeholder={t("enter_category")}
                  value={category}
                  onChangeText={(text) => {
                    setCategory(text);
                    setErrors({ ...errors, category: "" });
                  }}
                />
                {errors.category ? (
                  <Text style={styles.errorText}>{errors.category}</Text>
                ) : null}
              </View>
            </View>

            {/* Name */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>{t("name")}</Text>
              <View
                style={[
                  styles.inputWrapper,
                  errors.name ? styles.inputErrorBorder : null,
                ]}>
                <TextInput
                  style={styles.input}
                  placeholder={t("enter_name")}
                  value={name}
                  onChangeText={(text) => {
                    setName(text);
                    setErrors({ ...errors, name: "" });
                  }}
                />
              </View>
              {errors.name ? (
                <Text style={styles.errorText}>{errors.name}</Text>
              ) : null}
            </View>

            {/* Location */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>{t("location") || "Localização"}</Text>
              <View
                style={[
                  styles.inputWrapper,
                  errors.location ? styles.inputErrorBorder : null,
                ]}>
                <TextInput
                  style={styles.input}
                  placeholder={t("enter_location") || "Digite a Localização"}
                  value={location}
                  onChangeText={(text) => {
                    setLocation(text);
                    setErrors({ ...errors, location: "" });
                  }}
                />
              </View>
              {errors.location ? (
                <Text style={styles.errorText}>{errors.location}</Text>
              ) : null}
            </View>

            {/* Fees */}
            <View className="my-5">
              <View style={styles.inputRowContainer}>
                <Text style={styles.Rowlabel}>{t("registration_fee")}:</Text>
                <View className="flex items-start flex-col w-[50%]">
                  <TextInput
                    style={[
                      styles.RowInput,
                      errors.registrationFee ? styles.inputErrorBorder : null,
                    ]}
                    placeholder=""
                    value={registrationFee}
                    keyboardType="numeric"
                    onChangeText={(text) => {
                      setRegistrationFee(text);
                      setErrors({ ...errors, registrationFee: "" });
                    }}
                  />
                  {errors.registrationFee ? (
                    <Text style={styles.errorText}>
                      {errors.registrationFee}
                    </Text>
                  ) : null}
                </View>
              </View>
              <View style={styles.inputRowContainer}>
                <Text style={styles.Rowlabel}>{t("travel_fee")}:</Text>
                <View className="flex items-start flex-col w-[50%]">
                  <TextInput
                    style={[
                      styles.RowInput,
                      errors.travelFee ? styles.inputErrorBorder : null,
                    ]}
                    placeholder=""
                    value={travelFee}
                    keyboardType="numeric"
                    onChangeText={(text) => {
                      setTravelFee(text);
                      setErrors({ ...errors, travelFee: "" });
                    }}
                  />
                  {errors.travelFee ? (
                    <Text style={styles.errorText}>{errors.travelFee}</Text>
                  ) : null}
                </View>
              </View>
              <View style={styles.inputRowContainer}>
                <Text style={styles.Rowlabel}>
                  {t("accommodation_expense")}:
                </Text>
                <View className="flex items-start flex-col w-[50%]">
                  <TextInput
                    style={[
                      styles.RowInput,
                      errors.accommodationExpense
                        ? styles.inputErrorBorder
                        : null,
                    ]}
                    placeholder=""
                    value={accommodationExpense}
                    keyboardType="numeric"
                    onChangeText={(text) => {
                      setAccommodationExpense(text);
                      setErrors({ ...errors, accommodationExpense: "" });
                    }}
                  />
                  {errors.accommodationExpense ? (
                    <Text style={styles.errorText}>
                      {errors.accommodationExpense}
                    </Text>
                  ) : null}
                </View>
              </View>
              <View style={styles.inputRowContainer}>
                <Text style={styles.Rowlabel}>{t("total_fee")}:</Text>
                <View className="flex items-start flex-col w-[50%]">
                  <TextInput style={styles.RowInput} value={totalFee} />
                </View>
              </View>
            </View>

            {/* Save Button */}
            <TouchableOpacity style={styles.loginButton} onPress={handleAdd}>
              <Text style={styles.loginButtonText}>{t("save")}</Text>
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
  textArea: {
    height: 80, // Adjust height as needed
    borderColor: "gray",
    borderWidth: 1,
    padding: 10,
    textAlignVertical: "top",
    borderRadius: 12,
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
    width: 100,
    height: 80,
  },
  Profileimage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    overflow: "hidden",
  },
  inputContainer: {
    width: "100%",
    marginBottom: 15,
  },
  inputRowContainer: {
    width: "100%",
    marginBottom: 15,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  RowInput: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 12,
    borderColor: "black",
    paddingHorizontal: 10,
    height: 56,
    width: "100%",
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
  Rowlabel: {
    fontSize: 16,
    fontWeight: "400",
    color: "#000000",
    marginBottom: 5,
    width: "50%",
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
    borderColor: "black",
    paddingHorizontal: 10,
    height: 56,
    width: "95%",
  },
  loginButton: {
    height: 39,
    backgroundColor: "#FFDC58",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    marginTop: 10,
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
    borderColor: "red",
    borderWidth: 1,
  },
});

export default AddBudget;
