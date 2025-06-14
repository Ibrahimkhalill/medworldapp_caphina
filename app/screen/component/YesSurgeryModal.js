import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ToastAndroid,
  Platform,
  KeyboardAvoidingView,
  Keyboard,
  ScrollView,
  TouchableWithoutFeedback,
} from "react-native";
import * as Animatable from "react-native-animatable";
import axiosInstance from "./axiosInstance";
import { useAuth } from "../authentication/Auth";
import { useTranslation } from "react-i18next";
import { SafeAreaView } from "react-native-safe-area-context";

const YesSurgeryModal = ({
  isVisible,
  setIsVisible,
  navigation,
  existingSurgeryNames,
}) => {
  const [surgeryName, setSurgeryName] = useState("");
  const [totalSurgery, setTotalSurgery] = useState("");
  const [surgeryError, setSurgeryError] = useState("");
  const [totalError, setTotalError] = useState("");
  const { token } = useAuth();
  const { t } = useTranslation();

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
      alert(msg);
    }
  };

  const validateAndSave = async () => {
    setTotalError(""); // Clear previous errors
    setSurgeryError(""); // Clear previous errors

    // Validation
    if (!surgeryName.trim()) {
      setSurgeryError(t("surgery_name_error"));
      return;
    }
    const filter = existingSurgeryNames.find(
      (item) =>
        surgeryName.trim().toLowerCase() === item.surgery_name.toLowerCase()
    );
    if (filter) {
      setSurgeryError(t("surgery_name_exit_error"));
      return;
    }

    if (
      !totalSurgery.trim() ||
      isNaN(totalSurgery) ||
      parseInt(totalSurgery) <= 0
    ) {
      setTotalError(t("total_error"));
      return;
    }

    // Save to the server
    try {
      const payload = {
        surgery_name: surgeryName,
        total_surgery: totalSurgery,
      };
      const response = await axiosInstance.post(
        "/percentage-surgery/",
        payload,
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );

      if (response.status === 201) {
        navigation.navigate("AddSurgeries", {
          surgery_name: surgeryName,
        });
        closeYesSurgeryModal(); // Close modal
      } else {
        notifyMessage(t("error_saving_surgery"));
      }
    } catch (error) {
      console.error("Error saving surgery:", error);
      notifyMessage(t("error_occurred"));
    }
  };

  const closeYesSurgeryModal = () => {
    setIsVisible(false);
    setSurgeryName("");
    setTotalSurgery("");
    setTotalError("");
    setSurgeryError("");
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isVisible}
      onRequestClose={closeYesSurgeryModal}
    >
      <TouchableWithoutFeedback onPress={closeYesSurgeryModal}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <Animatable.View
              animation="zoomIn"
              duration={500}
              easing="ease-out"
              style={styles.container}
            >
              <Text style={styles.header}>{t("surgery_name")}</Text>
              <View style={{ width: "100%" }}>
                <TextInput
                  style={[styles.input, surgeryError && styles.errorBorder]}
                  value={surgeryName}
                  onChangeText={(text) => {
                    setSurgeryName(text);
                    setSurgeryError(""); // Clear error while typing
                  }}
                />
                {surgeryError && (
                  <Text style={styles.errorText}>{surgeryError}</Text>
                )}
              </View>
              <Text style={styles.header}>{t("how_many_surgeries")}</Text>
              <View style={{ width: "100%" }}>
                <TextInput
                  style={[styles.input, totalError && styles.errorBorder]}
                  value={totalSurgery}
                  onChangeText={(text) => {
                    setTotalSurgery(text);
                    setTotalError(""); // Clear error while typing
                  }}
                  keyboardType="numeric"
                />
                {totalError && (
                  <Text style={styles.errorText}>{totalError}</Text>
                )}
              </View>
              <TouchableOpacity
                style={styles.button_first}
                onPress={validateAndSave}
              >
                <Text style={styles.button_text}>{t("save")}</Text>
              </TouchableOpacity>
            </Animatable.View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    backgroundColor: "white",
    width: "90%",
    padding: 20,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "space-between",
  },
  header: {
    fontSize: 20,
    textAlign: "center",
    fontWeight: "400",
    lineHeight: 24,
    paddingBottom: 10,
    paddingTop: 10,
  },
  button_text: {
    fontSize: 18,
    textAlign: "center",
    fontWeight: "700",
  },
  button_first: {
    backgroundColor: "#FFDC58",
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 15,
    borderRadius: 5,
    width: 119,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    borderColor: "#D1D5DB",
    paddingHorizontal: 10,
    height: 56,
    width: "100%",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: 5,
  },
  errorBorder: {
    borderColor: "red",
  },
});

export default YesSurgeryModal;
