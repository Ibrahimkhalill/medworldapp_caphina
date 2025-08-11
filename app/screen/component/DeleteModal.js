import React from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import * as Animatable from "react-native-animatable";
import { useAuth } from "../authentication/Auth";
import axiosInstance from "./axiosInstance";
import { useTranslation } from "react-i18next";

const DeleteModal = ({ isVisible, setIsVisible, navigation }) => {
  const { t } = useTranslation();

  const closeDeleteModal = () => {
    setIsVisible(false);
  };

  const { token, logout } = useAuth();

  const handleDelete = async () => {
    try {
      const response = await axiosInstance.delete(
        `/delete_user_and_related_data/`,
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );

      if (response.status === 200) {
        Alert.alert(t("success"), t("account_deleted_successfully"));
        logout();
        navigation.navigate("UserLogin");
      }
    } catch (error) {
      console.error("Error deleting account:", error);
      Alert.alert(t("error"), t("could_not_delete_account"));
    }
  };

  return (
    <View className="justify-center items-center">
      <Modal
        animationType="fade"
        transparent={true}
        visible={isVisible}
        onRequestClose={closeDeleteModal}>
        <View className="flex-1 justify-center items-center bg-black/50">
          <Animatable.View
            animation="zoomIn"
            duration={500}
            easing="ease-out"
            style={styles.container}>
            <Text style={styles.header}>{t("delete")}</Text>
            <View style={{ marginTop: 20 }}>
              <Text style={styles.second_text}>
                {t("delete_confirmation_line1")}
              </Text>
              <Text style={styles.second_text}>
                {t("delete_confirmation_line2")}
              </Text>
            </View>

            <TouchableOpacity
              onPress={handleDelete}
              style={styles.button_first}>
              <Text
                style={{ fontSize: 16, textAlign: "center", color: "#fff" }}>
                {t("delete_button")}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={closeDeleteModal}
              style={styles.button_second}>
              <Text
                style={{ fontSize: 16, textAlign: "center", color: "#000" }}>
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
    backgroundColor: "white",
    width: "90%",
    height: 260,
    padding: 20,
    borderRadius: 8,
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
    alignItems: "center",
    justifyContent: "center",
    marginTop: 15,
    borderRadius: 20,
  },
  button_second: {
    backgroundColor: "#fff",
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 15,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#FFDC58",
  },
});

export default DeleteModal;
