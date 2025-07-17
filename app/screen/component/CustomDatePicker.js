import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import Ionicons from "react-native-vector-icons/Ionicons";
import moment from "moment";

const CustomDatePicker = ({ onDateChange, date, setDate }) => {
  const [showPicker, setShowPicker] = useState(false);

  // Ensure date is always a Date object
  const currentDate = date instanceof Date ? date : new Date();

  const handleConfirm = (_, selectedDate) => {
    if (selectedDate) {
      setDate(selectedDate);
      if (onDateChange) onDateChange(selectedDate); // Trigger onDateChange callback
    }
  };

  const closeModal = () => {
    setShowPicker(false);
  };

  const formattedDate = date ? moment(date).format("DD/MM/YYYY") : "";

  return (
    <View >
      <TouchableOpacity
        style={styles.datePickerContainer}
        onPress={() => setShowPicker(true)}
      >
        <Ionicons name="calendar" size={20} color="gray" />
        <TextInput
          style={[styles.dateTextInput, { color: date ? "#333" : "#bbb" }]}
          placeholder="dd/mm/yyyy"
          placeholderTextColor="#bbb"
          value={formattedDate}
          editable={false}
          pointerEvents="none"
          
        />
      </TouchableOpacity>

      {/* Show date picker for both Android and iOS */}
      {showPicker && (
        <>
          {Platform.OS === "android" && (
            <DateTimePicker
              value={currentDate}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
                handleConfirm(event, selectedDate);
                setShowPicker(false);
              }}
            />
          )}

          {Platform.OS === "ios" && (
            <Modal transparent={true} animationType="slide" visible={showPicker}>
              <View style={styles.modalContainer}>
                <View style={styles.iosPickerContainer}>
                  <DateTimePicker
                    value={currentDate} // Make sure this is a valid Date object
                    mode="date"
                    display="spinner"
                    onChange={handleConfirm}
                    textColor="black"
                  />
                  <TouchableOpacity
                    style={styles.closeButton}
                    onPress={closeModal}
                  >
                    <Text style={styles.closeButtonText}>Done</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          )}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  datePickerContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 55,
    width: "96%",
  },
  dateTextInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: "#333",
    
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  iosPickerContainer: {
    backgroundColor: "white",
    padding: 20,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  closeButton: {
    alignItems: "center",
    padding: 10,
    backgroundColor: "#FFDC58",
    marginTop: 10,
    borderRadius: 5,
  },
  closeButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default CustomDatePicker;
