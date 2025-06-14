import React from "react";
import { StatusBar } from "expo-status-bar";

import {
  Image,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Platform,
} from "react-native";

function UserDashboard({ navigation }) {
  return (
    <View
      style={styles.container}
      className="bg-background  flex-1 justify-center items-center"
    >
      <View>
        <TouchableOpacity
          onPress={() => navigation.navigate("my_customer")}
          className=" p-4  shadow-lg rounded-lg flex items-center justify-center"
        >
          <Image
            className="w-[100px] h-[100px]"
            source={require("../../assets/customer.png")}
          />
          <Text className="text-black text-lg font-medium mt-2">
            My Customer
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate("new_quotation")}
          className=" p-4 shadow-lg rounded-lg flex items-center justify-center"
        >
          <Image
            className="w-[100px] h-[100px]"
            source={require("../../assets/payment.png")}
          />
          <Text className="text-black font-medium text-lg mt-2">
            New Quotation
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate("add_customer")}
          className=" p-4 shadow-lg rounded-lg flex items-center justify-center"
        >
          <Image
            className="w-[100px] h-[100px]"
            source={require("../../assets/user.png")}
          />
          <Text className="text-black font-medium text-lg mt-2">
            New Customer
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  shadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
});

export default UserDashboard;
