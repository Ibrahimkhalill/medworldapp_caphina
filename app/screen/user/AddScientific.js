import React from "react";
import { StatusBar } from "expo-status-bar";
import { useState, useEffect } from "react";
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ToastAndroid,
  Dimensions,
  ScrollView,
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import Navbar from "../component/Navbar";
import CustomDatePicker from "../component/CustomDatePicker";
import CustomCheckbox from "../component/CheckBox";
import { useAuth } from "../authentication/Auth";
import axiosInstance from "../component/axiosInstance";
import { useFocusEffect } from "@react-navigation/native";
import { useTranslation } from "react-i18next";

function AddScientific({ navigation }) {
  const { t } = useTranslation(); // Translation hook
  const [isLoading, setIsLoading] = useState(false);
  const [tpyesWorks, setTypesWorks] = useState("");
  const [isInternational, setIsInternational] = useState(false);
  const [isNational, setIsNational] = useState(false);
  const [role, setRole] = useState("");
  const [name, setName] = useState("");
  const [coAuthors, setCoAuthors] = useState("");
  const [date, setDate] = useState(new Date());
  const [errors, setErrors] = useState({});
  const { height } = Dimensions.get("window");
  const { token } = useAuth();

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

  const clearForm = () => {
    setDate(new Date());
    setTypesWorks("");
    setIsInternational(false);
    setIsNational(false);
    setRole("");
    setName("");
    setCoAuthors("");
    setErrors({});
  };

  useFocusEffect(
    React.useCallback(() => {
      clearForm();
    }, [])
  );

  const validateFields = () => {
    const newErrors = {};

    if (!date) {
      newErrors.date = t("date_required");
    }

    if (!tpyesWorks) {
      newErrors.tpyesWorks = t("type_of_work_required");
    }

    if (!role) {
      newErrors.role = t("role_required");
    }

    if (!name) {
      newErrors.name = t("name_required");
    }

    if (!coAuthors) {
      newErrors.coAuthors = t("co_authors_required");
    }

    if (!isInternational && !isNational) {
      newErrors.internationalNational = t("select_international_or_national");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAdd = async () => {
    if (!validateFields()) {
      return;
    }

    const payload = {
      date,
      types_works: tpyesWorks,
      international: isInternational,
      national: isNational,
      role,
      name,
      co_author_names: coAuthors,
    };

    try {
      const response = await axiosInstance.post("/scientifics/", payload, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });

      if (response.status === 201) {
        notifyMessage(t("scientific_added"));
        clearForm();
        navigation.navigate("ScientificDcoument");
      } else {
        notifyMessage(t("scientific_add_failed"));
      }
    } catch (error) {
      console.error("Error adding scientific data:", error);
      notifyMessage(t("error_occurred"));
    }
  };

  const handleDateChange = (selectedDate) => {
    setDate(selectedDate);
    setErrors((prevErrors) => ({ ...prevErrors, date: "" }));
  };

  return (
    <SafeAreaView style={styles.safeAreaContainer} className="px-5">
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <Navbar navigation={navigation} navigation_Name={"UserHome"} />
        <View className="flex flex-row gap-3 my-3 mb-5">
          <TouchableOpacity
            className="py-1 border-b-4 border-[#FFDC58]"
            onPress={() => navigation.navigate("AddScientific")}>
            <Text style={styles.navButtonText}>{t("scientific")}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="py-1"
            onPress={() => navigation.navigate("AddSurgeries")}>
            <Text style={styles.navButtonText}>{t("surgeries")}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="py-1"
            onPress={() => navigation.navigate("AddCourses")}>
            <Text style={styles.navButtonText}>{t("courses")}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="py-1"
            onPress={() => navigation.navigate("AddBudget")}>
            <Text style={styles.navButtonText}>{t("budget")}</Text>
          </TouchableOpacity>
        </View>
        <ScrollView
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          Style={{ flexGrow: 1, height: height }}
          keyboardShouldPersistTaps="handled">
          <View style={styles.container}>
            <View
              style={[
                styles.inputContainerDouble,
                errors.date && styles.errorBorder,
              ]}>
              <View style={styles.inputContainerFIrst}>
                <Text style={styles.labelFirst}>{t("date")}</Text>
                <CustomDatePicker
                  onDateChange={handleDateChange}
                  date={date}
                  setDate={setDate}
                />
                {errors.date && (
                  <Text style={styles.errorText}>{errors.date}</Text>
                )}
              </View>
              <View style={[styles.inputContainerFIrst]}>
                <Text style={styles.labelFirst}>{t("type_of_work")}</Text>
                <TextInput
                  style={[
                    styles.inputFirst,
                    errors.tpyesWorks && styles.errorBorder,
                  ]}
                  value={tpyesWorks}
                  onChangeText={(text) => {
                    setTypesWorks(text);
                    setErrors((prevErrors) => ({
                      ...prevErrors,
                      tpyesWorks: "",
                    }));
                  }}
                />
                {errors.tpyesWorks && (
                  <Text style={styles.errorText}>{errors.tpyesWorks}</Text>
                )}
              </View>
            </View>
            <View style={[styles.inputContainer]}>
              <View className="flex flex-row">
                <CustomCheckbox
                  label={t("international")}
                  fontSize={16}
                  onValueChange={(value) => {
                    setIsInternational(value);
                    setIsNational(false);
                    setErrors((prevErrors) => ({
                      ...prevErrors,
                      internationalNational: "",
                    }));
                  }}
                  value={isInternational === true}
                />
                <View className="ml-3">
                  <CustomCheckbox
                    label={t("national")}
                    fontSize={16}
                    onValueChange={(value) => {
                      setIsNational(value);
                      setIsInternational(false);
                      setErrors((prevErrors) => ({
                        ...prevErrors,
                        internationalNational: "",
                      }));
                    }}
                    value={isNational === true}
                  />
                </View>
              </View>
              {errors.internationalNational && (
                <Text style={styles.errorText}>
                  {errors.internationalNational}
                </Text>
              )}
            </View>
            <View style={[styles.inputContainerDouble]}>
              <View style={styles.inputContainerFIrst}>
                <Text style={styles.labelFirst}>{t("role")}</Text>
                <View className="flex flex-row">
                  <CustomCheckbox
                    label={t("author")}
                    fontSize={16}
                    onValueChange={() => {
                      setRole("Author");
                      setErrors((prevErrors) => ({ ...prevErrors, role: "" }));
                    }}
                    value={role === "Author"}
                  />
                  <View className="ml-3">
                    <CustomCheckbox
                      label={t("coauthor")}
                      fontSize={16}
                      onValueChange={() => {
                        setRole("Co-Author");
                        setErrors((prevErrors) => ({
                          ...prevErrors,
                          role: "",
                        }));
                      }}
                      value={role === "Co-Author"}
                    />
                  </View>
                </View>
                {errors.role && (
                  <Text style={styles.errorText}>{errors.role}</Text>
                )}
              </View>
            </View>

            <View style={[styles.inputContainer]}>
              <Text style={styles.label}>{t("name")}</Text>
              <View
                style={[
                  styles.inputWrapper,
                  errors.name && styles.errorBorder,
                ]}>
                <TextInput
                  style={styles.input}
                  // placeholder={t("name_placeholder")}
                  value={name}
                  onChangeText={(text) => {
                    setName(text);
                    setErrors((prevErrors) => ({ ...prevErrors, name: "" }));
                  }}
                />
              </View>
              {errors.name && (
                <Text style={styles.errorText}>{errors.name}</Text>
              )}
            </View>

            <View style={[styles.inputContainer]}>
              <Text style={styles.label}>{t("co_author")}</Text>
              <View
                style={[
                  styles.inputWrapper,
                  errors.coAuthors && styles.errorBorder,
                ]}>
                <TextInput
                  style={styles.input}

                  value={coAuthors}
                  onChangeText={(text) => {
                    setCoAuthors(text);
                    setErrors((prevErrors) => ({
                      ...prevErrors,
                      coAuthors: "",
                    }));
                  }}
                />
              </View>
              {errors.coAuthors && (
                <Text style={styles.errorText}>{errors.coAuthors}</Text>
              )}
            </View>

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

    borderWidth: 1,
    padding: 10,
    textAlignVertical: "top", // Ensures text starts at the top of the TextInput
    borderRadius: 12,
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: 4,
  },
  errorBorder: {
    borderWidth: 1,
    borderColor: "red",
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
    paddingHorizontal: 10,
    height: 55,
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
    paddingHorizontal: 10,
    height: 56,
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
});

export default AddScientific;
