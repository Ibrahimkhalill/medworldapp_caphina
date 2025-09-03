import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
} from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

const CustomDropdown = ({ selectedValue, onValueChange, disabled = false }) => {
  const [visible, setVisible] = useState(false);
  const { t } = useTranslation();

  // Define options inside the component so `t` works correctly
  const genderOptions = [
    { label: t("female"), value: "Female" },
    { label: t("male"), value: "Male" },
    { label: t("rather_not_say"), value: "Rather not say" },
  ];

  const selectedLabel = genderOptions.find(
    (opt) => opt.value === selectedValue
  )?.label;

  const handleSelect = (item) => {
    onValueChange(item.value);
    setVisible(false);
  };

  return (
    <View>
      {/* Dropdown button */}
      <TouchableOpacity
        style={[
          styles.dropdown,
          { backgroundColor: disabled ? "transparent" : "#fff" },
        ]}
        onPress={() => !disabled && setVisible(true)}
        activeOpacity={0.7}>
        <MaterialCommunityIcons
          name="gender-male-female-variant"
          size={24}
          color="#999"
        />
        <Text style={{ color: selectedLabel ? "#000" : "#999", fontSize: 16 }}>
          {selectedLabel || t("select_gender")}
        </Text>
      </TouchableOpacity>

      {/* Modal with options */}
      <Modal visible={visible} transparent animationType="slide">
        <TouchableOpacity
          style={styles.modalOverlay}
          onPress={() => setVisible(false)}
          activeOpacity={1}>
          <View style={styles.modalContent}>
            <FlatList
              data={genderOptions}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => {
                const isSelected = item.value === selectedValue;
                return (
                  <TouchableOpacity
                    style={[styles.option, isSelected && styles.selectedOption]}
                    onPress={() => handleSelect(item)}>
                    <Text style={{ color: isSelected ? "#fff" : "#000" }}>
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default CustomDropdown;

const styles = StyleSheet.create({
  dropdown: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 19,
    marginVertical: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  modalContent: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 15,
    maxHeight: 250,
  },
  option: {
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderColor: "#eee",
    borderRadius: 10,
  },
  selectedOption: {
    backgroundColor: "#d6c80eff", // theme color
  },
});
