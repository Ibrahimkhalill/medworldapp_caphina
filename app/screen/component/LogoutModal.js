import React from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TextInput,
  StyleSheet,
} from "react-native";
import * as Animatable from "react-native-animatable";
import { useAuth } from "../authentication/Auth";
import { useTranslation } from "react-i18next";
const LogoutModal = ({ isVisible, setIsVisible, navigation }) => {
  const { t } = useTranslation();

  const closeLogoutModal = () => {
    setIsVisible(false);
  };

  const { logout, token } = useAuth();

  const handleLogout = () => {
    logout();
    if (!token) {
      navigation.navigate("UserLogin");
    }
  };

  return (
    <View className=" justify-center items-center ">
      {/* LogoutModal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={isVisible}
        onRequestClose={closeLogoutModal}>
        <View className="flex-1 justify-center items-center bg-black/50">
          {/* Animated LogoutModal */}
          <Animatable.View
            animation="zoomIn"
            duration={500} // Animation duration (milliseconds)
            easing="ease-out" // Optional easing
            style={styles.container}>
            <Text style={styles.header}>{t("logout")}</Text>
            <View style={{ marginTop: 20 }}>
              <Text style={styles.second_text}>{t("logout_confirmation")}</Text>
            </View>

            <TouchableOpacity
              onPress={handleLogout}
              style={styles.button_first}>
              <Text
                style={{ fontSize: 16, textAlign: "center", color: "#ffff" }}>
                {t("logout_button")}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={closeLogoutModal}
              style={styles.button_second}>
              <Text
                style={{ fontSize: 16, textAlign: "center", color: "#00000" }}>
                {t("cancel_button")}
              </Text>
            </TouchableOpacity>
          </Animatable.View>
        </View>
      </Modal>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    backgroundColor: "white", // bg-white
    width: "90%", // w-[90%]
    height: 260, // h-[200px]
    padding: 20, // p-5 (padding 5 usually equals 20px)
    borderRadius: 8, // rounded-lg (large border radius)
  },
  header: {
    fontSize: 20,
    textAlign: "center",
  },
  second_text: {
    fontSize: 14,
    textAlign: "center",
  },
  button_first: {
    backgroundColor: "#FF3B30",
    height: 48,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 15,
    borderRadius: 20,
  },
  button_second: {
    backgroundColor: "#ffff",
    height: 48,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 15,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#FFDC58",
  },
});
export default LogoutModal;
