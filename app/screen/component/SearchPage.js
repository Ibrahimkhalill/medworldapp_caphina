import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
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
  const insets = useSafeAreaInsets();

  // Format date to MM/DD/YY
  const formatDate = (dateString) => {
    if (!dateString) return { formattedDate: "" };
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return { formattedDate: "" };
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    const yy = String(date.getFullYear()).slice(-2);
    const formattedDate = `${mm}/${dd}/${yy}`;
    return { formattedDate };
  };

  // Close the modal and reset search
  const closeSearchPage = () => {
    setIsVisible(false);
    setSearch("");
    setData(filterData);
    setShowDatePicker(false);
  };

  // Handle date selection from DateTimePicker
  const onDateChange = (event, selectedDate) => {
    if (Platform.OS === "android") {
      setShowDatePicker(false);
    }
    if (selectedDate) {
      const { formattedDate } = formatDate(selectedDate);
      setSearch(formattedDate);
    }
  };

  // Just update search text on typing
  const handleSearchChange = (searchValue) => {
    setSearch(searchValue);
  };

  // Filter dataset based on search text
  const applySearchFilter = () => {
    if (search.trim()) {
      const filtered = filterData.filter((item) => {
        const nameMatch = item[value]
          ?.toString()
          .toLowerCase()
          .includes(search.toLowerCase());
        const { formattedDate } = formatDate(item.date);
        const dateMatch = formattedDate.includes(search);
        return nameMatch || dateMatch;
      });
      setData(filtered);
    } else {
      setData(filterData);
    }
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isVisible}
      onRequestClose={closeSearchPage}
    >
      <View style={styles.overlay}>
        <SafeAreaView style={styles.safeAreaContainer}>
          <Animatable.View
            animation="zoomIn"
            duration={500}
            easing="ease-out"
            style={[styles.container, { top: insets.top }]}
          >
            <View style={styles.searchBarContainer}>
              <View style={styles.searchBar}>
                <TouchableOpacity
                  onPress={() => {
                    applySearchFilter();
                    setIsVisible(false);
                    setShowDatePicker(false);
                  }}
                >
                  <Ionicons name="search-outline" size={20} color="gray" />
                </TouchableOpacity>
                <TextInput
                  style={styles.input}
                  placeholder={t("search")}
                  onChangeText={handleSearchChange}
                  value={search}
                />
                <TouchableOpacity
                  onPress={() => setShowDatePicker(!showDatePicker)}
                >
                  <Ionicons name="calendar-outline" size={20} color="gray" />
                </TouchableOpacity>
                {search ? (
                  <TouchableOpacity
                    style={{ marginLeft: 3 }}
                    onPress={() => {
                      setSearch("");
                      setData(filterData);
                    }}
                  >
                    <Ionicons name="close-circle" size={23} color="gray" />
                  </TouchableOpacity>
                ) : null}
              </View>
              <View style={{ flexDirection: "row", marginLeft: 10 }}>
                <TouchableOpacity
                  style={{
                    backgroundColor: "#f3ce47",
                    paddingVertical: 5,
                    paddingHorizontal: 10,
                    borderRadius: 5,
                    marginRight: 10,
                  }}
                  onPress={() => {
                    applySearchFilter();
                    setIsVisible(false);
                    setShowDatePicker(false);
                  }}
                >
                  <Text style={{ color: "#000", fontWeight: "bold" }}>OK</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={{
                    backgroundColor: "#ccc",
                    paddingVertical: 5,
                    paddingHorizontal: 10,
                    borderRadius: 5,
                  }}
                  onPress={closeSearchPage}
                >
                  <Text style={{ color: "#000" }}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* iOS Spinner Picker Modal */}
            {Platform.OS === "ios" && (
              <Modal
                transparent
                animationType="slide"
                visible={showDatePicker}
                onRequestClose={() => setShowDatePicker(false)}
              >
                <TouchableWithoutFeedback
                  onPress={() => setShowDatePicker(false)}
                >
                  <View
                    style={{
                      flex: 1,
                      backgroundColor: "rgba(0,0,0,0.3)",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <TouchableWithoutFeedback>
                      <View
                        style={{
                          backgroundColor: "#fff",
                          borderRadius: 10,
                          padding: 10,
                          width: "80%",
                        }}
                      >
                        <DateTimePicker
                          value={new Date()}
                          mode="date"
                          display="spinner"
                          onChange={(event, date) => {
                            onDateChange(event, date);
                            if (date) setShowDatePicker(false);
                          }}
                        />
                      </View>
                    </TouchableWithoutFeedback>
                  </View>
                </TouchableWithoutFeedback>
              </Modal>
            )}

            {/* Android DateTimePicker inline (if needed) */}
            {Platform.OS === "android" && showDatePicker && (
              <DateTimePicker
                value={new Date()}
                mode="date"
                display="default"
                onChange={(event, date) => {
                  onDateChange(event, date);
                  if (event.type !== "dismissed") setShowDatePicker(false);
                }}
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
    position: "absolute",
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
    paddingRight: 10,
  },
});

export default SearchPage;
