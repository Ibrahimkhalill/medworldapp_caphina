import React, { useRef, useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
  Image,
  Text,
  View,
  Platform,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ScrollView,
  Dimensions,
  ActivityIndicator,
  Pressable,
  TouchableWithoutFeedback,
} from "react-native";
import SimpleLineIcon from "react-native-vector-icons/MaterialIcons";
import Ionicons from "react-native-vector-icons/Ionicons";
import Feather from "react-native-vector-icons/Feather";

import AntDesign from "react-native-vector-icons/AntDesign";

import { SafeAreaView } from "react-native-safe-area-context";

import { useFocusEffect } from "@react-navigation/native";
import { useAuth } from "../authentication/Auth";
import axiosInstance from "../component/axiosInstance";
import DateDisplay from "../component/dateformate";
import SearchPage from "../component/SearchPage";
import { useTranslation } from "react-i18next";
import * as FileSystem from "expo-file-system";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import QuotationPDF from "../QuotationPDF";
import * as MediaLibrary from "expo-media-library";
import * as Notifications from "expo-notifications";
import { useSubscription } from "../component/SubscriptionContext";
import exportDataToExcel from "../component/exportExcell";
import NotificationButton from "../component/NotificationButton";
import NoFoundData from "../component/NoFoundData";
import DownloadModal from "../component/DownloadModal";
function BudgetDcoument({ navigation }) {
  const [isDownload, setIsDownload] = useState(false);
  const { token } = useAuth();
  const { height } = Dimensions.get("window");
  const scrollViewHeight = height * 0.55; // 90% of the screen height
  const [BudgetData, setCousesData] = useState([]);
  const [data, setData] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation();
  const componentRef = useRef();
  const { subscription, loading, error, fetchSubscription } = useSubscription();
  const [downloadModal, setDownloadModal] = useState(false);
  const handleDelete = async (id) => {
    try {
      const response = await axiosInstance.delete(`/budgets/${id}/`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      console.log(response);

      if (response.status === 200) {
        Alert.alert("Success", "Budget deleted successfully.");
        fetchBudgetData(); // Refresh the Budget list after deletion
      }
    } catch (error) {
      console.error("Error deleting Budget:", error);
      Alert.alert("Error", "Could not delete Budget. Please try again later.");
    }
  };
  const confirmDelete = (item) => {
    Alert.alert(
      "Confirm Deletion",
      `Are you sure you want to delete the Budget "${item.name}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => handleDelete(item.id), // Pass the id here
        },
      ]
    );
  };
  const fetchBudgetData = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get("/budgets/", {
        headers: {
          Authorization: `Token ${token}`, // Add token for authentication
        },
      });

      setData(response.data);
      setCousesData(response.data);
    } catch (error) {
      console.error("Error fetching surgeries:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchBudgetData();
      setDownloadModal(false);
    }, [])
  );

  const generatePdf = async () => {
    try {
      const htmlContent = componentRef.current.generateHtml();

      // Request media library permissions
      const { status: mediaStatus } =
        await MediaLibrary.requestPermissionsAsync();
      if (mediaStatus !== "granted") {
        Alert.alert(
          "Permission required",
          "Permission to access media library is required!"
        );
        return;
      }

      // Request notification permissions
      const { status: notifStatus } =
        await Notifications.requestPermissionsAsync();
      if (notifStatus !== "granted") {
        Alert.alert(
          "Permission required",
          "Permission to send notifications is required!"
        );
        return;
      }

      // Generate the PDF
      const { uri } = await Print.printToFileAsync({ html: htmlContent });
      console.log("PDF generated at:", uri);

      // Define the download location
      const downloadUri = `${FileSystem.documentDirectory}BudgetReport.pdf`;

      // Copy the generated file to the downloads folder
      await FileSystem.copyAsync({
        from: uri,
        to: downloadUri,
      });

      console.log("PDF saved to:", downloadUri);

      // Optionally share the file
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(downloadUri);
      } else {
        alert("PDF downloaded to the app's document folder.");
      }
    } catch (error) {
      console.error("Error generating or downloading PDF:", error);
    }
  };
  const genarateExcell = () => {
    const excel_data = data.map((item, index) => ({
      "Serial No": index + 1,
      Category: item.category,
      Name: item.name,
      "Registration Fee": item.registration_fee,
      "Travel Fee": item.travel_fee,
      "Accommodation Expense": item.accommodation_expense,
      total_fee: item.total_fee,
      Date: item.date.split("T")[0], // Splitting the date to only get the YYYY-MM-DD part
    }));

    const title = "Budget";
    exportDataToExcel(excel_data, title);
  };
  const fields = [
    "category",
    "name",
    "registration_fee",
    "travel_fee",
    "accommodation_expense",
    "total_fee",
    "date",
  ];

  const handleCheck = () => {
    if (subscription.free_trial) {
      if (subscription.free_trial_end) {
        // Free trial is still active
        setDownloadModal(true);
        return;
      } else {
        // Free trial has expired
        Alert.alert(
          "Access Denied",
          "Your free trial has expired. Please upgrade your account to access this feature."
        );
        return;
      }
    }

    if (subscription.free_trial_end) {
      Alert.alert(
        "Access Denied",
        "Your free trial has expired. Please upgrade your account to access this feature."
      );
      return;
    }

    // Check Subscription Status
    if (subscription.is_active) {
      // Subscription is active
      setDownloadModal(true);
    } else {
      // Subscription has expired
      Alert.alert(
        "Access Denied",
        "Your subscription has expired. Please renew to access this feature."
      );
    }
  };

  const handleNavigation = (item) => {
    if (!subscription) {
      Alert.alert(
        "Error",
        "Unable to verify your subscription. Please try again later."
      );
      return;
    }

    // Check Free Trial Status
    if (subscription.free_trial) {
      if (subscription.free_trial) {
        // Free trial is still active
        navigation.navigate("EditBudget", {
          budget: item,
        });
        return;
      } else {
        // Free trial has expired
        Alert.alert(
          "Access Denied",
          "Your free trial has expired. Please upgrade your account to access this feature."
        );
        return;
      }
    }

    if (subscription.free_trial_end) {
      // Free trial has expired
      Alert.alert(
        "Access Denied",
        "Your free trial has expired. Please upgrade your account to access this feature."
      );
      return;
    }

    // Check Subscription Status
    if (subscription.is_active) {
      // Subscription is active
      navigation.navigate("EditBudget", {
        budget: item,
      });
    } else {
      // Subscription has expired
      Alert.alert(
        "Access Denied",
        "Your subscription has expired. Please renew to access this feature."
      );
    }
  };
  if (isLoading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="black" />
      </View>
    );
  }
  return (
    <TouchableWithoutFeedback onPress={() => setDownloadModal(false)}>
      <SafeAreaView style={styles.safeArea} className="px-5">
        <View className="flex items-center justify-between flex-row w-full ">
          <TouchableOpacity onPress={() => navigation.navigate("UserHome")}>
            <Image
              className="w-[80px] h-[80px]" // size increased
              resizeMode="contain" // keep aspect ratio
              source={require("../../assets/MEDLOGO.png")}
            />
          </TouchableOpacity>
          <View className="flex flex-row  items-center">
            <TouchableOpacity onPress={() => setIsVisible(true)}>
              <Ionicons name="search-outline" size={25} color="black" />
            </TouchableOpacity>
            <View className="ml-4">
              <NotificationButton navigation={navigation} />
            </View>
          </View>
        </View>
        <Text className="text-[24px] font-bold mt-2 ">{t("document")}</Text>
        <View className="flex flex-row gap-3 my-1 ">
          <TouchableOpacity
            className=" py-1"
            onPress={() => navigation.navigate("ScientificDcoument")}>
            <Text style={styles.navButtonText}>{t("scientific")}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="  py-1"
            onPress={() => navigation.navigate("SurgergeryDcoument")}>
            <Text style={styles.navButtonText}>{t("surgeries")}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className=" py-1 "
            onPress={() => navigation.navigate("CoursesDocument")}>
            <Text style={styles.navButtonText}>{t("courses")}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="border-b-4 border-[#FFDC58] py-1"
            onPress={() => navigation.navigate("BudgetDcoument")}>
            <Text style={styles.navButtonText}>{t("budget")}</Text>
          </TouchableOpacity>
        </View>
        {data.length > 0 && (
          <View className="flex items-center flex-row justify-end">
            <TouchableOpacity onPress={() => handleCheck()}>
              <Feather name="download" size={25} color="black" />
            </TouchableOpacity>
            <QuotationPDF
              ref={componentRef}
              fields={fields}
              data={data}
              title="Budget Report"
            />
            <DownloadModal
              setDownloadModal={setDownloadModal}
              downloadModal={downloadModal}
              generatePdf={generatePdf}
              exportDataToExcel={genarateExcell}
            />
          </View>
        )}
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
          style={{ height: scrollViewHeight }}>
          <View className="mt-1 flex" onStartShouldSetResponder={() => true}>
            <Pressable onPress={() => setDownloadModal(false)}>
              {data.length > 0 ? (
                data.map((item, index) => (
                  <View
                    className="flex flex-row items-center justify-between border-b border-[#AEAEAE] pb-2 my-2"
                    key={index}>
                    <TouchableOpacity
                      className="flex flex-row gap-3 items-center"
                      onPress={() => handleNavigation(item)}>
                      <Ionicons name="folder" size={40} color="#FFDC58" />
                      <View className="flex ">
                        <Text className="text-[14px] mb-1">
                          {item.category}
                        </Text>
                        <DateDisplay dateString={item.date} />
                      </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                      className="flex flex-row gap-3 items-start"
                      onPress={() => confirmDelete(item)}>
                      <AntDesign name="delete" size={20} color="#E91111" />
                    </TouchableOpacity>
                  </View>
                ))
              ) : (
                <View className="flex items-center justify-center h-[50vh]">
                  <NoFoundData />
                </View>
              )}
            </Pressable>
          </View>
        </ScrollView>
        <SearchPage
          isVisible={isVisible}
          setIsVisible={setIsVisible}
          filterData={BudgetData}
          data={data}
          setData={setData}
          value={"category"}
        />
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  partialBackground: {
    height: 170,
    width: "100%",
    alignSelf: "center",
    borderRadius: 15,
    overflow: "hidden",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white", // Optional background color
  },
  safeArea: {
    flexGrow: 1,
    paddingBottom: 10,
    backgroundColor: "white",
  },
  navButtonText: {
    fontWeight: "700",
    fontSize: 14,
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  progressBackground: {
    width: "70%",
    height: 10,
    backgroundColor: "#e0e0e0",
    borderRadius: 10,
    overflow: "hidden",
    marginRight: 10,
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#FCE488",
    borderRadius: 10,
  },
  percentageText: {
    fontSize: 14,
    color: "#333",
    fontWeight: "bold",
  },
  shadow: {
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
      },
      android: {
        elevation: 4,
      },
    }),
    margin: 5,
    padding: 10,
    backgroundColor: "white",
    borderRadius: 5,
  },
  circle: {
    width: 205,
    height: 204,
    borderRadius: 100, // Keeps the outer circle rounded
    backgroundColor: "#ffff",
    justifyContent: "center",
    alignItems: "center",
    position: "relative", // For absolute positioning of quadrants
  },
  quadrant: {
    position: "absolute",
    width: "49%", // Reduced size to allow 3px gap
    height: "49%", // Reduced size to allow 3px gap
    justifyContent: "center",
    alignItems: "center",
  },
  topLeft: {
    top: 0,
    left: 0,

    backgroundColor: "#FFDC584D",
    borderTopLeftRadius: 100, // Top-left quadrant rounded
  },
  topRight: {
    top: 0,
    right: 0,
    backgroundColor: "#FFDC58",
    borderTopRightRadius: 100,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    backgroundColor: "#FFDC5880",
    borderBottomLeftRadius: 100, // Bottom-left quadrant rounded
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    backgroundColor: "#FFDC58B2",
    borderBottomRightRadius: 100, // Bottom-right quadrant rounded
  },
  text: {
    fontSize: 11,
    color: "black",
    fontWeight: "bold",
  },

  buttonText: {
    fontSize: 14,
    color: "black",
    fontWeight: "bold",
  },
  gap: {
    position: "absolute",
    top: "25%", // Positioning the gap
    left: "25%", // Positioning the gap
    width: "50%", // Filling the center
    height: "50%", // Filling the center
    borderRadius: 50, // Keeps the gap circular
  },
});

export default BudgetDcoument;
