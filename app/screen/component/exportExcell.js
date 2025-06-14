import XLSX from "xlsx";

import { Alert } from "react-native";

import * as FileSystem from "expo-file-system";

import * as Sharing from "expo-sharing";

const exportDataToExcel = async (excel_data, title) => {
  // Sample data

  // Create a worksheet
  const worksheet = XLSX.utils.json_to_sheet(excel_data);

  // Create a workbook
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

  // Write the Excel file as a base64 string
  const excelFile = XLSX.write(workbook, {
    type: "base64",
    bookType: "xlsx",
  });

  // Define file path
  const fileUri = `${FileSystem.documentDirectory}${title}.xlsx`;

  // Save the file
  await FileSystem.writeAsStringAsync(fileUri, excelFile, {
    encoding: FileSystem.EncodingType.Base64,
  });

  // Share the file
  if (await Sharing.isAvailableAsync()) {
    await Sharing.shareAsync(fileUri);
  } else {
    Alert.alert("Exported", "File saved successfully!", [{ text: "OK" }]);
  }
};

export default exportDataToExcel;
