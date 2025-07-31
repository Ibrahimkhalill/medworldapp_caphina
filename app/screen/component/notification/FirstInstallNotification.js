import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTranslation } from "react-i18next";

export default function FirstInstallNotification() {
  const [modalVisible, setModalVisible] = useState(false);
  const { t } = useTranslation();

  // useEffect(() => {
  //   async function checkFirstLaunch() {
  //     const hasShown = await AsyncStorage.getItem(
  //       "firstInstallNotificationShown"
  //     );
  //     if (!hasShown) {
  //       setModalVisible(true);
  //       await AsyncStorage.setItem("firstInstallNotificationShown", "true");
  //     }
  //   }
  //   checkFirstLaunch();
  // }, []);

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}>
      <View style={styles.modalBackground}>
        <View style={styles.modalContainer}>
          <ScrollView>
            <Text style={styles.title}>{t("notification_title")}</Text>

            <Text style={styles.message}>{t("notification_message")}</Text>
          </ScrollView>

          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setModalVisible(false)}>
            <Text style={styles.closeButtonText}>{t("notification_ok")}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "85%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    maxHeight: "70%",
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 15,
    textAlign: "center",
  },
  message: {
    fontSize: 16,
    marginBottom: 15,
    textAlign: "justify",
  },
  portuguese: {
    fontStyle: "italic",
    color: "#444",
  },
  closeButton: {
    backgroundColor: "#FFDC58",
    borderRadius: 8,
    paddingVertical: 12,
    marginTop: 10,
  },
  closeButtonText: {
    color: "#000",
    fontWeight: "600",
    textAlign: "center",
    fontSize: 16,
  },
});
