import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Platform,
} from "react-native";
import * as Animatable from "react-native-animatable";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import Ionicons from "react-native-vector-icons/Ionicons";
import DateTimePicker from "@react-native-community/datetimepicker";

const SearchPage = ({
  isVisible,
  setIsVisible,
  data,
  setData,
  filterData,
  value,
}) => {
  const [search, setSearch] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const { t } = useTranslation();
  const insets = useSafeAreaInsets(); // Get SafeArea insets

  // Format date to MM/DD/YY
  const formatDate = (dateString) => {
    if (!dateString) return { formattedDate: "" };
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return { formattedDate: "" }; // Handle invalid dates
    const mm = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
    const dd = String(date.getDate()).padStart(2, "0");
    const yy = String(date.getFullYear()).slice(-2); // Last 2 digits of the year
    const formattedDate = `${mm}/${dd}/${yy}`;
    return { formattedDate };
  };

  // Close the modal and reset search
  const closeSearchPage = () => {
    setIsVisible(false);
    setSearch("");
    setData(filterData); // Reset to the original dataset
  };

  // Handle date selection from DateTimePicker
  const onDateChange = (event, selectedDate) => {
    if (Platform.OS === "android") {
      setShowDatePicker(false); // Close picker on Android after selection
    }
    if (selectedDate) {
      const { formattedDate } = formatDate(selectedDate);
      setSearch(formattedDate); // Set search input to selected date
      const filtered = filterData.filter((item) => {
        const nameMatch = item[value]
          ?.toString()
          .toLowerCase()
          .includes(formattedDate.toLowerCase());
        const { formattedDate: itemFormattedDate } = formatDate(item.date);
        const dateMatch = itemFormattedDate.includes(formattedDate);
        return nameMatch || dateMatch;
      });
      setData(filtered);
    }
  };

  // Filter the dataset dynamically based on search input
  const handleSearch = (searchValue) => {
    setSearch(searchValue);
    if (searchValue.trim()) {
      const filtered = filterData.filter((item) => {
        const nameMatch = item[value]
          ?.toString()
          .toLowerCase()
          .includes(searchValue.toLowerCase());
        const { formattedDate } = formatDate(item.date);
        const dateMatch = formattedDate.includes(searchValue);
        return nameMatch || dateMatch; // Return true if either matches
      });
      setData(filtered);
    } else {
      setData(filterData); // Reset to original dataset if input is cleared
    }
  };

  console.log("SearchPage rendered with search:", filterData);

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isVisible}
      onRequestClose={closeSearchPage}>
      <View style={styles.overlay}>
        <SafeAreaView style={styles.safeAreaContainer}>
          <Animatable.View
            animation="zoomIn"
            duration={500}
            easing="ease-out"
            style={[styles.container, { top: insets.top }]} // Use SafeArea inset for top
          >
            <View style={styles.searchBarContainer}>
              <View style={styles.searchBar}>
                <Ionicons name="search-outline" size={20} color="gray" />
                <TextInput
                  style={styles.input}
                  placeholder={t("search")}
                  onChangeText={handleSearch}
                  value={search}
                />
                <TouchableOpacity onPress={() => setShowDatePicker(true)}>
                  <Ionicons name="calendar-outline" size={20} color="gray" />
                </TouchableOpacity>
                {search && (
                  <TouchableOpacity
                    style={{ marginLeft: 3 }}
                    onPress={() => {
                      setSearch("");
                      setData(filterData); // Reset dataset
                    }}>
                    <Ionicons name="close-circle" size={23} color="gray" />
                  </TouchableOpacity>
                )}
              </View>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={closeSearchPage}>
                <Text style={styles.cancelText}>{t("cancel")}</Text>
              </TouchableOpacity>
            </View>
            {showDatePicker && (
              <DateTimePicker
                value={new Date()} // Default to current date
                mode="date"
                display={Platform.OS === "ios" ? "inline" : "default"}
                onChange={onDateChange}
                maximumDate={new Date()} // Optional: Restrict to past and current dates
              />
            )}
          </Animatable.View>
        </SafeAreaView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  safeAreaContainer: {
    flex: 1,
    width: "100%",
  },
  container: {
    backgroundColor: "white",
    width: "100%",
    padding: 20,
    position: "absolute", // Position absolutely to stick to the top
    left: 0,
    right: 0,
  },
  searchBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    paddingHorizontal: 10,
    flex: 1,
    height: 50,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingLeft: 10,
    paddingRight: 10, // Add padding to prevent overlap with icons
  },
  cancelButton: {
    marginLeft: 15,
  },
  cancelText: {
    color: "#f3ce47",
    fontSize: 14,
    fontWeight: "600",
  },
});

export default SearchPage;
