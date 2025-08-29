import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
  Switch,
  ToastAndroid,
} from "react-native";
import {
  MaterialIcons,
  FontAwesome,
  Ionicons,
  AntDesign,
  MaterialCommunityIcons,
} from "react-native-vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

import Navbar from "../component/Navbar";
import CustomSelector from "../component/CustomSelector";
import DeleteModal from "./DeleteModal";
import { useAuth } from "../authentication/Auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTranslation } from "react-i18next";
import LogoutModal from "./LogoutModal";
import UserLogin from "../authentication/UserLogin";

const { height } = Dimensions.get("window"); // Get screen height

const Settings = ({ navigation }) => {
  const [isEnabled, setIsEnabled] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [Language, setLanguage] = useState("English");
  const [openDropdown, setOpenDropdown] = useState(null);
  const [isDelete, setIsdelete] = useState(false);
  const handleToggle = (dropdown) => {
    setOpenDropdown(openDropdown === dropdown ? null : dropdown);
  };
  const { t, i18n } = useTranslation(); // Initialize translation hooks

  // Load preference from AsyncStorage
  useEffect(() => {
    const loadPreference = async () => {
      try {
        const savedPreference = await AsyncStorage.getItem("notificationSound");
        if (savedPreference !== null) {
          setIsEnabled(JSON.parse(savedPreference));
        }
      } catch (error) {
        console.error("Error loading notification sound preference:", error);
      }
    };
    loadPreference();
  }, []);

  // Save preference to AsyncStorage
  const toggleSound = async (value) => {
    try {
      setIsEnabled(value);
      await AsyncStorage.setItem("notificationSound", JSON.stringify(value));
      ToastAndroid.show(
        `Notification sound ${value ? "enabled" : "disabled"}`,
        ToastAndroid.SHORT
      );
    } catch (error) {
      console.error("Error saving notification sound preference:", error);
    }
  };

  // const toggleSwitch = () => setIsEnabled((previousState) => !previousState);

  useEffect(() => {
    const loadLanguagePreference = async () => {
      try {
        const savedLanguage = await AsyncStorage.getItem("appLanguage");
        if (savedLanguage) {
          setLanguage(savedLanguage === "en" ? "English" : "Portuguese");
          i18n.changeLanguage(savedLanguage);
        }
      } catch (error) {
        console.error("Error loading language preference:", error);
      }
    };
    loadLanguagePreference();
  }, []);

  const changeLanguage = async (language) => {
    const languageCode = language === "English" ? "en" : "pt";
    setLanguage(language);
    i18n.changeLanguage(languageCode); // Switch language
    await AsyncStorage.setItem("appLanguage", languageCode); // Save language preference
    ToastAndroid.show(`Language changed to ${language}`, ToastAndroid.SHORT);
  };

  return (
    <SafeAreaView style={styles.safeArea} className="px-5">
      <Navbar navigation={navigation} navigation_Name={"UserHome"} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.container,
          { flexGrow: 1, paddingBottom: height * 0.2 },
        ]}>
        <View>
          <View>
            <Text style={styles.LebelText}>{t("settings")}</Text>
            <View className="mt-3">
              <Text style={styles.smallText}>{t("account")}</Text>

              {/* Manage Subscription */}

              {/* Delete Account */}
              <TouchableOpacity
                onPress={() => setIsdelete(true)}
                style={styles.option}>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                  }}>
                  <AntDesign name="delete" size={21} color="black" />
                  <Text style={styles.optionText}>{t("delete_account")}</Text>
                </View>
                <MaterialIcons
                  name="arrow-forward-ios"
                  size={20}
                  color="black"
                />
              </TouchableOpacity>

              {/* Terms and Condition */}
              <TouchableOpacity
                style={styles.option}
                onPress={() => navigation.navigate("TermsAndCondition")}>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                  }}>
                  <FontAwesome name="file-text-o" size={20} color="black" />
                  <Text style={styles.optionText}>{t("terms_condition")}</Text>
                </View>

                <MaterialIcons
                  name="arrow-forward-ios"
                  size={20}
                  color="black"
                />
              </TouchableOpacity>

              {/* Privacy Policy */}
              <TouchableOpacity
                style={styles.option}
                onPress={() => navigation.navigate("PrivacyPolicy")}>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                  }}>
                  <Ionicons
                    name="shield-checkmark-outline"
                    size={21}
                    color="black"
                  />
                  <Text style={styles.optionText}>{t("privacy_policy")}</Text>
                </View>

                <MaterialIcons
                  name="arrow-forward-ios"
                  size={20}
                  color="black"
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.option}
                onPress={() => {
                  setDeleteModalVisible(true);
                }}>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                  }}>
                  <MaterialIcons name="logout" size={21} color="black" />
                  <Text style={styles.optionText}>{t("logout")}</Text>
                </View>
                <MaterialIcons
                  name="arrow-forward-ios"
                  size={20}
                  color="black"
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Account Management */}
          <View>
            <Text style={styles.smallText}>{t("help")}</Text>
            <TouchableOpacity
              style={styles.option}
              onPress={() => navigation.navigate("HelpSupport")}>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                }}>
                <MaterialCommunityIcons
                  name="email-outline"
                  size={21}
                  color="black"
                />
                <Text style={styles.optionText}>{t("email_support")}</Text>
              </View>

              <MaterialIcons name="arrow-forward-ios" size={20} color="black" />
            </TouchableOpacity>
            {/* Manage Subscription */}
          </View>

          <View>
            <Text style={styles.smallText}>{t("notification")}</Text>
            <View style={styles.option}>
              <View style={styles.optionLeft}>
                <Ionicons name="notifications-outline" size={21} color="black" />
                <Text
                  style={styles.optionText}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {t("writting_reminder")}
                </Text>
              </View>

              <Switch
                trackColor={{ false: "#767577", true: "#FFDC58B2" }}
                thumbColor={isEnabled ? "#f5dd4b" : "#f4f3f4"}
                onValueChange={toggleSound}
                value={isEnabled}
                style={styles.switch}
              />
            </View>
            {/* Manage Subscription */}
          </View>

          <View>
            <Text style={styles.lagnauge}>{t("language")}</Text>

            <View style={styles.option}>
              <CustomSelector
                label={Language}
                options={["English", "Portuguese"]}
                selectedValue={Language}
                onSelect={changeLanguage}
                isOpen={openDropdown === "Language"}
                onToggle={(isOpen) => handleToggle(isOpen ? "Language" : null)}
              />
            </View>

            {/* Manage Subscription */}
          </View>
        </View>
      </ScrollView>

      <DeleteModal
        setIsVisible={setIsdelete}
        isVisible={isDelete}
        navigation={navigation}
      />
      <LogoutModal
        isVisible={deleteModalVisible}
        setIsVisible={setDeleteModalVisible}
        navigation={navigation}
      />
    </SafeAreaView >
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "white",
  },
  safeArea: {
    flexGrow: 1,
    paddingBottom: 10,
    backgroundColor: "white",
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    justifyContent: "space-between",
    paddingLeft: 10,
  },
  optionText: {
    marginLeft: 12,
    fontSize: 17,
    color: "black",
  },
  LebelText: {
    fontSize: 23,
    color: "black",
    lineHeight: 22,
    fontWeight: "700",
  },
  smallText: {
    fontSize: 20,
    color: "black",
    lineHeight: 22,
    marginTop: 22,
  },
  lagnauge: {
    fontSize: 20,
    color: "black",
    lineHeight: 20,
  },
  optionLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1, // <-- allow text to shrink inside available space
  },
  optionText: {
    marginLeft: 8,
    fontSize: 16,
    flexShrink: 1, // <-- text will shrink instead of overflow
  },
});

export default Settings;
