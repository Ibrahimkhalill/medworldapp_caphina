import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableWithoutFeedback,
} from "react-native";
import * as Animatable from "react-native-animatable";
import CustomCheckbox from "./CheckBox";
import YesSurgeryModal from "./YesSurgeryModal";
import { useTranslation } from "react-i18next";
import { SafeAreaView } from "react-native-safe-area-context";

const SurgeriesModal = ({
  isVisible,
  setIsVisible,
  navigation,
  existingSurgeryNames,
}) => {
  const { t } = useTranslation();
  const [YesSurgeryModalVisible, setYesSurgeryModalVisible] = useState(false);

  const closeSurgeriesModal = () => {
    setIsVisible(false);
  };

  const handleCheckboxChange = (isChecked) => {
    if (isChecked) {
      closeSurgeriesModal();
      setYesSurgeryModalVisible(true);
    }
  };

  const handleCheckboxChangeNo = (isChecked) => {
    if (isChecked) {
      closeSurgeriesModal();
      navigation.navigate("AddSurgeries");
    }
  };

  return (
    <View style={styles.wrapper}>
      {/* SurgeriesModal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={isVisible}
        onRequestClose={closeSurgeriesModal}
      >
        <TouchableWithoutFeedback onPress={closeSurgeriesModal}>
          <View style={styles.overlay}>
            <TouchableWithoutFeedback>
              <Animatable.View
                animation="zoomIn"
                duration={500} // Animation duration (milliseconds)
                easing="ease-out" // Optional easing
                style={styles.container}
              >
                <Text style={styles.header}>{t("is_it_new_surgery")}</Text>

                <View style={styles.checkboxWrapper}>
                  <CustomCheckbox
                    label={t("yes")}
                    onValueChange={handleCheckboxChange}
                    fontSize={20}
                  />
                  <View style={styles.checkboxSpacing}>
                    <CustomCheckbox
                      label={t("no")}
                      onValueChange={handleCheckboxChangeNo}
                      fontSize={20}
                    />
                  </View>
                </View>
              </Animatable.View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* Yes Surgery Modal */}
      <YesSurgeryModal
        isVisible={YesSurgeryModalVisible}
        setIsVisible={setYesSurgeryModalVisible}
        navigation={navigation}
        existingSurgeryNames={existingSurgeryNames}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
    justifyContent: "center",
    alignItems: "center",
  },
  safeArea: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  container: {
    backgroundColor: "white", // bg-white
    width: "90%", // w-[90%]
    height: 148, // h-[200px]
    padding: 20, // p-5 (padding 5 usually equals 20px)
    borderRadius: 8, // rounded-lg (large border radius)
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    fontSize: 24,
    textAlign: "center",
    fontWeight: "400",
    lineHeight: 28,
  },
  checkboxWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 15,
  },
  checkboxSpacing: {
    marginLeft: 15,
  },
  wrapper: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default SurgeriesModal;
