import React, { useEffect, useState, useCallback } from "react";

import {
  Image,
  Text,
  View,
  Platform,
  TouchableOpacity,
  ImageBackground,
  StyleSheet,
  ScrollView,
  Dimensions,
  ActivityIndicator,
  Alert,
} from "react-native";

import HomeModal from "../component/HomeModal";
import { SafeAreaView } from "react-native-safe-area-context";
import SurgeriesModal from "../component/SurgeriesModal";
import { useAuth } from "../authentication/Auth";
import axiosInstance from "../component/axiosInstance";
import { useFocusEffect } from "@react-navigation/native";
import NotificationButton from "../component/NotificationButton";
import { useTranslation } from "react-i18next";
import { useSubscription } from "../component/SubscriptionContext";
import FirstInstallNotification from "../component/notification/FirstInstallNotification";

function UserHome({ navigation }) {
  const { t } = useTranslation();
  const [userData, setUserData] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  const [isItSurgeris, setIsItSurgies] = useState(false);
  const [surgeryData, setSurgeryData] = useState([]);
  const { height } = Dimensions.get("window");
  const scrollViewHeight = height * 0.9; // 90% of the screen height
  const { token } = useAuth();
  const [completeSurgeries, setCompleteSurgeries] = useState([]);
  const [incompleteSurgeries, setIncompleteSurgeries] = useState([]);
  const { subscription, fetchSubscription, isSubscribed } = useSubscription();
  const [isLoading, setIsLoading] = useState(false); // Track overall loading state

  // useFocusEffect(
  //   useCallback(() => {
  //     const fetchAllData = async () => {
  //       setIsLoading(true);
  //       try {
  //         // Fetch all data concurrently
  //         await Promise.all([
  //           fetchProfileData(),
  //           fetchPerCantageData(),
  //           fetchSurgeries(),
  //           fetchSubscription(),
  //         ]);
  //       } catch (error) {
  //         // Silently handle any errors (no notification)
  //         console.error("Error fetching data:", error);
  //       } finally {
  //         setIsLoading(false); // Stop loading regardless of success or failure
  //         setIsItSurgies(false);
  //       }
  //     };

  //     fetchAllData();
  //   }, [])
  // );

  useEffect(() => {
    const fetchAllData = async () => {
        setIsLoading(true);
        try {
          // Fetch all data concurrently
          await Promise.all([
            fetchProfileData(),
            fetchPerCantageData(),
            fetchSurgeries(),
            fetchSubscription(),
          ]);
        } catch (error) {
          // Silently handle any errors (no notification)
          console.error("Error fetching data:", error);
        } finally {
          setIsLoading(false); // Stop loading regardless of success or failure
          setIsItSurgies(false);
        }
      };

      fetchAllData();
    }, []);

  const fetchProfileData = async () => {
    try {
      const response = await axiosInstance.get(`/user_profile/`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      if (response.status === 200) {
        setUserData(response.data);
      }
    } catch (error) {
      // Silently handle error
      console.error("Error fetching profile:", error);
    }
  };

  const fetchPerCantageData = async () => {
    try {
      const response = await axiosInstance.get(`/percentage-surgery/`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      if (response.status === 200) {
        setSurgeryData(response.data);
      }
    } catch (error) {
      // Silently handle error
      console.error("Error fetching percentage data:", error);
    }
  };

  const fetchSurgeries = async () => {
    try {
      const response = await axiosInstance.get("/surgery/", {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      const { complete_surgeries, incomplete_surgeries } = response.data;
      setCompleteSurgeries(complete_surgeries);
      setIncompleteSurgeries(incomplete_surgeries);
    } catch (error) {
      // Silently handle error
      console.error("Error fetching surgeries:", error);
    }
  };

  console.log("subscription", subscription);

  const handleNavigation = (screenName) => {
    if (!subscription) {
      Alert.alert(
        "Error",
        "Unable to verify your subscription. Please try again later."
      );
      return;
    }

    if (subscription.free_trial) {
      if (subscription.free_trial_end && !isSubscribed) {
        if (screenName === "AddSurgeries") {
          setIsItSurgies(true);
          return;
        }
        navigation.navigate(screenName);
        return;
      } else {
        Alert.alert(
          "Access Denied",
          "Your free trial has expired. Please upgrade your account to access this feature."
        );
        return;
      }
    }

    if (subscription.free_trial_end && !isSubscribed) {
      Alert.alert(
        "Access Denied",
        "Your free trial has expired. Please upgrade your account to access this feature."
      );
      return;
    }

    if (isSubscribed) {
      if (screenName === "AddSurgeries") {
        setIsItSurgies(true);
        return;
      }
      navigation.navigate(screenName);
    } else {
      Alert.alert(
        "Access Denied",
        "Your subscription has expired. Please renew to access this feature."
      );
    }
  };

  // Show loading indicator while data is being fetched
  if (isLoading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="black" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} className="px-5">
      <View className="flex items-center justify-between flex-row w-full ">
        {/* Logo clickable */}
        <TouchableOpacity onPress={() => navigation.navigate("UserHome")}>
          <Image
            className="w-[80px] h-[80px]" // size increased
            resizeMode="contain" // keep aspect ratio
            source={require("../../assets/MEDLOGO.png")}
          />
        </TouchableOpacity>

        <NotificationButton navigation={navigation} />
      </View>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, paddingBottom: height * 0.2 }}
        showsVerticalScrollIndicator={false}>
        <View className="flex" style={{ marginTop: -5 }}>
          <View className="flex items-center justify-center ">
            <TouchableOpacity
              style={styles.shadow}
              className="border border-[#FFDC58] px-2 py-2 rounded-[5px] flex items-center justify-center"
              onPress={() => navigation.navigate("Subscriptions")}>
              <Text className="text-[#9f8424] text-[14px]">
                {t("get_a_plan")}
              </Text>
            </TouchableOpacity>
          </View>

          <View className="mt-5">
            <ImageBackground
              source={require("../../assets/frame.jpg")}
              style={styles.partialBackground}
              resizeMode="cover">
              <View className="p-2 flex flex-row w-full justify-between ">
                <View>
                  <Text className="text-[#000000] text-[20px]">
                    {userData.username}
                  </Text>
                  <Text className="text-[#000000] text-[12px] font-bold mt-4">
                    {t("specialty")}: {userData.specialty}
                  </Text>
                </View>
                <View className="flex items-center justify-center h-full mt-4">
                  <Text className="text-[60px] font-bold ">
                    {userData.residencyYear}/{userData.residencyDuration}
                  </Text>
                </View>
              </View>
            </ImageBackground>
          </View>

          <View className="flex flex-row mt-10">
            <View
              style={styles.shadow}
              className="w-[47%] min-h-[67px] flex justify-between">
              <Text className="text-[13px] ">{t("surgeries_inserted")}</Text>
              <Text className="text-[#FFDC58] text-[20px]">
                {completeSurgeries.length}
              </Text>
            </View>
            <View
              style={styles.shadow}
              className="w-[47%] min-h-[67px] ml-2 flex justify-between">
              <Text className="text-[13px]">{t("incomplete_surgeries")}</Text>
              <Text className="text-[#FFDC58] text-[20px]">
                {incompleteSurgeries.length}
              </Text>
            </View>
          </View>

          <View className="mt-10 mb-10 flex items-center">
            <View style={styles.circle}>
              <TouchableOpacity
                style={[styles.quadrant, styles.topLeft]}
                onPress={() => handleNavigation("AddScientific")}>
                <Text className="mt-2 ml-4" style={styles.text}>
                  {t("scientific")}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.quadrant, styles.topRight]}
                onPress={() => handleNavigation("AddSurgeries")}>
                <Text className="mt-2 mr-4" style={styles.text}>
                  {t("surgeries")}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.quadrant, styles.bottomLeft]}
                onPress={() => handleNavigation("AddCourses")}>
                <Text className="mb-2 ml-4" style={styles.text}>
                  {t("courses")}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.quadrant, styles.bottomRight]}
                onPress={() => handleNavigation("AddBudget")}>
                <Text className="mb-2 mr-6" style={styles.text}>
                  {t("budget")}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
      <HomeModal setIsVisible={setIsVisible} isVisible={isVisible} />
      <SurgeriesModal
        isVisible={isItSurgeris}
        setIsVisible={setIsItSurgies}
        navigation={navigation}
        existingSurgeryNames={surgeryData}
      />
      <FirstInstallNotification />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  partialBackground: {
    height: 170,
    width: "100%",
    alignSelf: "center",
    borderRadius: 15,
    overflow: "hidden",
  },
  safeArea: {
    flexGrow: 1,
    paddingBottom: 10,
    backgroundColor: "white",
  },
  shadow: {
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
    margin: 5,
    padding: 10,
    backgroundColor: "white",
    borderRadius: 5,
  },
  circle: {
    width: 220,
    height: 220,
    borderRadius: 120, // half of width/height
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  quadrant: {
    position: "absolute",
    width: "49%",
    height: "49%",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  topLeft: {
    top: 0,
    left: 0,
    backgroundColor: "#FFDC584D",
    borderTopLeftRadius: 100,
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
    borderBottomLeftRadius: 100,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    backgroundColor: "#FFDC58B2",
    borderBottomRightRadius: 100,
  },
  text: {
    fontSize: 12,
    color: "black",
    fontWeight: "bold",
  },
});

export default UserHome;
