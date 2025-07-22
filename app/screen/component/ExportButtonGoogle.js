// components/ExportButtonGoogle.js
import React from "react";
import { TouchableOpacity, Text, Alert } from "react-native";
import * as Linking from "expo-linking";
import axiosInstance from "../component/axiosInstance";

const ExportButtonGoogle = ({ data, title }) => {
  const handleExport = async () => {
    try {
      const response = await axiosInstance.post(
        "/export/surgery_to_google_sheets",
        {
          excel_data: data,
          title,
        }
      );
      const { status, message, sheets_url } = response.data;
      if (status === "success") {
        Alert.alert("Success", message, [
          {
            text: "Open Google Sheets",
            onPress: () => Linking.openURL(sheets_url),
          },
          { text: "OK" },
        ]);
      } else {
        Alert.alert("Error", message);
      }
    } catch (error) {
      console.error("Error exporting to Google Sheets:", error);
      Alert.alert(
        "Error",
        "Failed to export to Google Sheets. Please try again."
      );
    }
  };

  return (
    <TouchableOpacity className=" py-3 w-full" onPress={handleExport}>
      <Text style={{ fontSize: 16 }}>Export to Google Sheets</Text>
    </TouchableOpacity>
  );
};

export default ExportButtonGoogle;
