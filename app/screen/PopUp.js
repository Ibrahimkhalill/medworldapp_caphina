import React from "react";
import { View, Text, Modal, TouchableOpacity } from "react-native";
import * as Animatable from "react-native-animatable";

const PopUp = ({ isVisible, setIsVisible, navigation }) => {
  const closePopup = () => {
    setIsVisible(false);
  };

  return (
    <View className="flex-1 justify-center items-center bg-gray-100">
      {/* Popup */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={isVisible}
        onRequestClose={closePopup}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          {/* Animated Popup */}
          <Animatable.View
            animation="zoomIn"
            duration={500} // Animation duration (milliseconds)
            easing="ease-out" // Optional easing
            className="bg-white w-4/5 p-5 rounded-lg"
          >
            <Text className="text-[20px] font-bold text-gray-800 text-center">
              Password Changed!
            </Text>
            <Text className="text-sm text-gray-600 mt-2 text-center">
              Return to the login page to enter your account with your new
              password.
            </Text>
            <TouchableOpacity
              onPress={()=>navigation.navigate("UserLogin")}
              className="bg-[#FFDC58] mt-4 p-3 rounded-[30px]"
            >
              <Text className="text-black text-[20px] text-center">
                Back To Login
              </Text>
            </TouchableOpacity>
          </Animatable.View>
        </View>
      </Modal>
    </View>
  );
};

export default PopUp;
