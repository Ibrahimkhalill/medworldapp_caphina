import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import AntDesign from "react-native-vector-icons/AntDesign";
import DateDisplay from "./dateformate";
import axiosInstance from "./axiosInstance";
import { useAuth } from "../authentication/Auth";
import NoFoundData from "./NoFoundData";

const CompeleteDocument = ({
  data = [],
  fetchSurgeries,
  navigation,
  subscription,
}) => {
  const { token } = useAuth();

  const handleDelete = async (id) => {
    try {
      const response = await axiosInstance.delete(`/surgery/${id}/`, {
        headers: { Authorization: `Token ${token}` },
      });

      if (response.status === 200) {
        Alert.alert("Success", "Surgery deleted successfully.");
        fetchSurgeries();
      }
    } catch (error) {
      console.error("Error deleting surgery:", error);
      Alert.alert("Error", "Could not delete surgery. Please try again later.");
    }
  };

  const confirmDelete = (item) => {
    Alert.alert(
      "Confirm Deletion",
      `Are you sure you want to delete the surgery "${item.name_of_surgery}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => handleDelete(item.id),
        },
      ]
    );
  };

  const handleNavigation = (item) => {
    if (!subscription) {
      Alert.alert(
        "Error",
        "Unable to verify your subscription. Please try again later."
      );
      return;
    }

    if (subscription.free_trial) {
      if (subscription.free_trial) {
        navigation.navigate("EidtSurgeries", { data: item });
        return;
      }
      Alert.alert(
        "Access Denied",
        "Your free trial has expired. Please upgrade your account to access this feature."
      );
      return;
    }

    if (subscription.free_trial_end || !subscription.is_active) {
      Alert.alert(
        "Access Denied",
        "Your subscription has expired. Please renew to access this feature."
      );
      return;
    }

    navigation.navigate("EidtSurgeries", { data: item });
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ flexGrow: 1 }}
      showsVerticalScrollIndicator={false}
    >
      {data.length > 0 ? (
        data.map((item, index) => (
          <View
            className="flex flex-row items-center justify-between border-b border-[#AEAEAE] pb-2 my-2"
            key={index}
          >
            <TouchableOpacity
              className="flex flex-row gap-3 items-start"
              onPress={() => handleNavigation(item)}
            >
              <Ionicons name="folder" size={40} color="#FFDC58" />
              <View className="flex ">
                <Text className="text-[14px]">{item.name_of_surgery}</Text>
                <DateDisplay dateString={item.date} />
                <View style={styles.progressContainer}>
                  <View style={styles.progressBackground}>
                    <View
                      style={[
                        styles.progressBar,
                        { width: `${item.percentage_complete}%` },
                      ]}
                    />
                  </View>
                  <Text style={styles.progressText}>
                    {item.percentage_complete}%
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
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 2,
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  folderItem: {
    padding: 15,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: "#fff",
  },
  selectedFolder: {
    backgroundColor: "#cce5ff",
  },
  folderText: {
    fontSize: 16,
  },
  selectAllButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#007bff",
    borderRadius: 8,
    alignItems: "center",
  },
  selectAllText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
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
  percentageText: {
    fontSize: 14,
    color: "#333",
    fontWeight: "bold",
  },
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
});

export default CompeleteDocument;
