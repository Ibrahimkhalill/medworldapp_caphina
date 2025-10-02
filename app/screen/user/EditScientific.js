import React from "react";
import { StatusBar } from "expo-status-bar";
import { useState, useRef, useEffect } from "react";

import {
  Image,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Platform,
  ToastAndroid,
  KeyboardAvoidingView,
  Dimensions,
  ScrollView,
} from "react-native";

import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context"; // SafeAreaView from safe-area-context

import Navbar from "../component/Navbar";
import CustomDatePicker from "../component/CustomDatePicker";
import CustomCheckbox from "../component/CheckBox";
import { useAuth } from "../authentication/Auth";
import axiosInstance from "../component/axiosInstance";
import { useFocusEffect } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
function EditScientific({ navigation, route }) {
  const [typesWorks, setTypesWorks] = useState("");
  const [isInternational, setIsInternational] = useState(false);
  const [isNational, setIsNational] = useState(false);
  const [role, setRole] = useState("");
  const [name, setName] = useState("");
  const [coAuthors, setCoAuthors] = useState("");
  const [date, setDate] = useState(new Date());
  const { token } = useAuth();
  const { params } = route; // Get parameters passed to this screen
  const { height } = Dimensions.get("window");

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
      alert(msg); // Fallback for iOS
    }
  }
  const { t } = useTranslation();

  useEffect(() => {
    if (params && params.data) {
      const scientific = params.data;
      setDate(new Date(scientific.date));
      setTypesWorks(scientific.types_works);
      setIsInternational(scientific.international);
      setIsNational(scientific.national);
      setRole(scientific.role);
      setName(scientific.name);
      setCoAuthors(scientific.co_author_names);
    }
  }, [params]);

  const handleEdit = async () => {
    if (!date || !typesWorks || !role || !name || !coAuthors) {
      notifyMessage("Please fill all required fields!");
      return;
    }

    if (!isInternational && !isNational) {
      notifyMessage("Please select at least one of International or National!");
      return;
    }

    const payload = {
      date,
      types_works: typesWorks,
      international: isInternational,
      national: isNational,
      role,
      name,
      co_author_names: coAuthors,
    };

    try {
      const response = await axiosInstance.put(
        `/scientifics/${params.data.id}/`,
        payload,
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );

      if (response.status === 200) {
        notifyMessage("Scientific data updated successfully!");
        navigation.goBack();
      } else {
        notifyMessage("Failed to update scientific data!");
      }
    } catch (error) {
      console.error("Error updating scientific data:", error);
      notifyMessage("An error occurred. Please try again.");
    }
  };

  const handleDateChange = (selectedDate) => {
    setDate(selectedDate);
  };

  return (
    <SafeAreaView style={styles.safeAreaContainer} className="px-5">
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <Navbar navigation={navigation} navigation_Name={"UserHome"} />
        <ScrollView
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          Style={{ flexGrow: 1 }}
          contentContainerStyle={{ flexGrow: 1, paddingBottom: height * 0.1 }}
          keyboardShouldPersistTaps="handled">
          <View className="flex justify-center flex-row gap-3 my-3 mb-5">
            <Text style={styles.navButtonText} className="text-xl">
              {t("edit_scientific")}{" "}
            </Text>
          </View>
          <View style={styles.container}>
            <View style={styles.inputContainerDouble}>
              <View style={styles.inputContainerFIrst}>
                <Text style={styles.labelFirst}>Date</Text>
                <CustomDatePicker
                  onDateChange={handleDateChange}
                  date={date}
                  setDate={setDate}
                />
              </View>
              <View style={styles.inputContainerFIrst}>
                <Text style={styles.labelFirst}>{t("type_of_work")}</Text>
                <TextInput
                  style={styles.inputFirst}
                  placeholder="Type of Works"
                  value={typesWorks}
                  onChangeText={setTypesWorks}
                />
              </View>
            </View>
            <View style={styles.inputContainer}>
              <View className="flex flex-row">
                <CustomCheckbox
                  label={t("international")}
                  fontSize={16}
                  onValueChange={(value) => {
                    setIsInternational(value);
                    setIsNational(false);
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
                    }}
                    value={isNational === true}
                  />
                </View>
              </View>
            </View>
            <View style={styles.inputContainerDouble}>
              <View style={styles.inputContainerFIrst}>
                <Text style={styles.labelFirst}>{t("role")}</Text>
                <View className="flex flex-row">
                  <CustomCheckbox
                    label={t("author")}
                    fontSize={16}
                    onValueChange={() => setRole("Author")}
                    value={role === "Author"}
                  />
                  <View className="ml-3">
                    <CustomCheckbox
                      label={t("coauthor")}
                      fontSize={16}
                      onValueChange={() => setRole("Co-Author")}
                      value={role === "Co-Author"}
                    />
                  </View>
                </View>
              </View>
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>{t("name")}</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  value={name}
                  onChangeText={setName}
                />
              </View>
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>{t("co_author")}</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  value={coAuthors}
                  onChangeText={setCoAuthors}
                />
              </View>
            </View>
            <TouchableOpacity style={styles.loginButton} onPress={handleEdit}>
              <Text style={styles.loginButtonText}>Update</Text>
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
    textAlignVertical: "top", // Ensures text starts at the top of the TextInput
    borderRadius: 12,
  },
  container: {
    // flex: 1,
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
    borderColor: "gray",
    paddingHorizontal: 10,
    height: 50,
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
    height: 55,
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
    fontWeight: "400",
  },
});

export default EditScientific;
