import XLSX from "xlsx";
import { Alert } from "react-native";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";

const exportDataToExcel = async (excel_data, title) => {
  // Function to format the date to 'MM/DD/YY' (to match SearchPage and EditScientific)
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date)) return dateString;
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    const yy = String(date.getFullYear()).slice(-2);
    return `${mm}/${dd}/${yy}`;
  };

  // Function to format values (boolean to Yes/No, date formatting, handle objects)
  const formatValue = (value, key) => {
    if (key === "date") {
      return formatDate(value); // Handle date fields
    }
    if (typeof value === "boolean") {
      return value ? "Yes" : "No"; // Convert true/false to Yes/No
    }
    if (key === "user" && typeof value === "object") {
      return value.username || ""; // Extract username from user object
    }
    return value || ""; // Return value or empty string if null/undefined
  };

  // Preprocess data to format booleans, dates, and objects
  const formattedData = excel_data.map((row) => {
    const formattedRow = {};
    Object.keys(row).forEach((key) => {
      formattedRow[key] = formatValue(row[key], key);
    });
    return formattedRow;
  });

  // Create a worksheet from formatted data
  const worksheet = XLSX.utils.json_to_sheet(formattedData);

  // Create a workbook
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

  // Write the Excel file as a base64 string
  const excelFile = XLSX.write(workbook, {
    type: "base64",
    bookType: "xlsx",
  });

  // Define file path with sanitized title
  const safeTitle = title.replace(/[^a-zA-Z0-9]/g, "_");
  const fileUri = `${FileSystem.documentDirectory}${safeTitle}.xlsx`;

  // Save and share the file
  try {
    await FileSystem.writeAsStringAsync(fileUri, excelFile, {
      encoding: FileSystem.EncodingType.Base64,
    });
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(fileUri);
    } else {
      Alert.alert("Exported", "File saved successfully!", [{ text: "OK" }]);
    }
  } catch (error) {
    console.error("Error saving or sharing Excel file:", error);
    Alert.alert(
      "Error",
      "Failed to save or share the file. Please try again.",
      [{ text: "OK" }]
    );
  }
};

export default exportDataToExcel;
