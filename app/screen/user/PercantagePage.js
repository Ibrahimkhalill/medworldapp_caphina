import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  StatusBar,
  Image,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import AntDesign from "react-native-vector-icons/AntDesign";
import { SafeAreaView } from "react-native-safe-area-context";
import axiosInstance from "../component/axiosInstance"; // Axios instance for API calls
import { useAuth } from "../authentication/Auth";
import { useTranslation } from "react-i18next";
import SearchPage from "../component/SearchPage";
import NotificationButton from "../component/NotificationButton";
import NoFoundData from "../component/NoFoundData";

function PercantagePage({ navigation }) {
  const [percentageData, setPercentageData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { token } = useAuth();
  const [data, setData] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  const { t } = useTranslation();

  const fetchPercentageData = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get(`/percentage-surgery/`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      }); // Adjust the endpoint
      setData(response.data);
      setPercentageData(response.data);
    } catch (error) {
      console.error("Error fetching percentage data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPercentageData();
  }, []);

  const handleDelete = async (id) => {
    try {
      const response = await axiosInstance.delete(
        `/percentage-surgery/${id}/`,
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );
      console.log(response);

      if (response.status === 200) {
        Alert.alert("Success", "Data deleted successfully.");
        fetchPercentageData(); // Refresh the Budget list after deletion
      }
    } catch (error) {
      console.error("Error deleting data:", error);
      Alert.alert("Error", "Could not delete data. Please try again later.");
    }
  };
  const confirmDelete = (item) => {
    Alert.alert(
      "Confirm Deletion",
      `Are you sure you want to delete the Budget "${item.surgery_name}"?`,
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

  return (
    <SafeAreaView style={styles.safeArea} className="px-5">
      <View className="mt-1 flex">
        <View className="flex items-center justify-between flex-row w-full">
          <Image
            className="w-[64px] h-[54px]"
            source={require("../../assets/MEDLOGO.png")}
          />
          <View className="flex flex-row  items-center">
            <TouchableOpacity onPress={() => setIsVisible(true)}>
              <Ionicons name="search-outline" size={25} color="black" />
            </TouchableOpacity>
            <View className="ml-4">
              <NotificationButton navigation={navigation} />
            </View>
          </View>
        </View>
        <View className="flex flex-row items-center my-4">
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
          <Text className="text-[24px] font-bold ml-6">{t("percentage")}</Text>
        </View>
      </View>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        {isLoading ? (
          <Text style={styles.loadingText}>Loading...</Text>
        ) : data.length > 0 ? (
          data.map((item, index) => (
            <View
              key={index}
              className="flex flex-row items-center justify-between border-b border-[#AEAEAE] pb-2 my-2"
            >
              <TouchableOpacity className="flex flex-row gap-3 items-start">
                <Ionicons name="folder" size={40} color="#FFDC58" />
                <View className="flex gap-1">
                  <Text className="text-[14px]">{item.surgery_name}</Text>

                  <View style={styles.progressContainer}>
                    <View style={styles.progressBackground}>
                      <View
                        style={[
                          styles.progressBar,
                          {
                            width: `${
                              (item.completed_surgeries / item.total_surgery) *
                              100
                            }%`,
                          },
                        ]}
                      />
                    </View>
                    <Text style={styles.progressText}>
                      {item.completed_surgeries}/{item.total_surgery}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                className="flex flex-row gap-3 items-start"
                onPress={() => confirmDelete(item)}
              >
                <AntDesign name="delete" size={20} color="#E91111" />
              </TouchableOpacity>
            </View>
          ))
        ) : (
          <View className="flex items-center justify-center h-[50vh]">
            <NoFoundData />
          </View>
        )}
        <SearchPage
          isVisible={isVisible}
          setIsVisible={setIsVisible}
          filterData={percentageData}
          data={data}
          setData={setData}
          value={"surgery_name"}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flexGrow: 1,
    paddingBottom: 10,
    backgroundColor: "white",
  },
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
    width: 200,
  },
  progressBackground: {
    width: "50%",
    height: 6,
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
  progressText: {
    fontSize: 12,
    color: "#333",
    fontWeight: "bold",
  },
  loadingText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "#888",
  },
});

export default PercantagePage;
