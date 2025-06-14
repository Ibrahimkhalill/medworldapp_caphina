import React from "react";
import { View, Text, Modal, TouchableOpacity, TextInput } from "react-native";
import * as Animatable from "react-native-animatable";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
const HomeModal = ({ isVisible, setIsVisible, navigation }) => {
  const closeHomeModal = () => {
    setIsVisible(false);
  };

  return (
    <View className="flex-1 justify-center items-center ">
      {/* HomeModal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={isVisible}
        onRequestClose={closeHomeModal}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          {/* Animated HomeModal */}
          <Animatable.View
            animation="zoomIn"
            duration={500} // Animation duration (milliseconds)
            easing="ease-out" // Optional easing
            className="bg-white w-[90%] h-[296px] p-5 rounded-lg"
          >
            <TouchableOpacity onPress={closeHomeModal} className="flex items-end mb-6">
              <MaterialCommunityIcons
                name="close-circle"
                size={23}
                className="ml-3 text-[#FFDC58]"
              />
            </TouchableOpacity>
            <Text className="text-[14px] font-bold text-gray-800 ">
              How many surgeries do you want to have?{" "}
            </Text>
            <View className="mt-10">
              <TextInput className="flex p-2 text-gray-600 border h-[47px] rounded-[12px]" />
            </View>

            <TouchableOpacity
              onPress={closeHomeModal}
              className="bg-[#FFDC58] mt-10 py-1 rounded-[30px] h-[41px]"
            >
              <Text className="text-white text-[20px] text-center">Save</Text>
            </TouchableOpacity>
          </Animatable.View>
        </View>
      </Modal>
    </View>
  );
};

export default HomeModal;
