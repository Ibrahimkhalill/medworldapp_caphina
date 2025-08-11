import React from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TextInput,
  Image,
} from "react-native";
import * as Animatable from "react-native-animatable";
import SimpleLineIcon from "react-native-vector-icons/MaterialIcons";
const Navbar = ({ isVisible, setIsVisible, navigation, navigation_Name }) => {
  const closeNavbar = () => {
    setIsVisible(false);
  };

  return (
    <View className="flex flex-row items-center justify-between w-full ">
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <SimpleLineIcon name="arrow-back" size={24} color="black" />
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("UserHome")}>
        <Image
          className="w-[80px] h-[80px]" // size increased
          resizeMode="contain" // keep aspect ratio
          source={require("../../assets/MEDLOGO.png")}
        />
      </TouchableOpacity>
      <View></View>
    </View>
  );
};

export default Navbar;
