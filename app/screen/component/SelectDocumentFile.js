import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ScrollView,
} from "react-native";
import SimpleLineIcon from "react-native-vector-icons/MaterialIcons";
import Ionicons from "react-native-vector-icons/Ionicons";
import Feather from "react-native-vector-icons/Feather";
import AntDesign from "react-native-vector-icons/AntDesign";
import CustomCheckbox from "./CheckBox";
const SelectDocumentFile = () => {
  const [folders, setFolders] = useState([
    { id: "1", name: "Folder 1", isSelected: false },
    { id: "2", name: "Folder 2", isSelected: false },
    { id: "3", name: "Folder 3", isSelected: false },
    { id: "4", name: "Folder 4", isSelected: false },
  ]);

  const [isMultiSelectEnabled, setIsMultiSelectEnabled] = useState(false);

  // Toggle single folder selection
  const toggleSelection = (id) => {
    setFolders((prevFolders) =>
      prevFolders.map((folder) =>
        folder.id === id
          ? { ...folder, isSelected: !folder.isSelected }
          : folder
      )
    );
  };

  // Select all folders
  const selectAllFolders = () => {
    setFolders((prevFolders) =>
      prevFolders.map((folder) => ({ ...folder, isSelected: true }))
    );
  };

  // Handle long press to enable multi-select mode
  const handleLongPress = () => {
    setIsMultiSelectEnabled(true);
    selectAllFolders();
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.folderItem, item.isSelected && styles.selectedFolder]}
      onPress={() => toggleSelection(item.id)}
      onLongPress={handleLongPress}
    >
      <Text style={styles.folderText}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView
      className="my-2 h-[60vh]"
      contentContainerStyle={{ flexGrow: 1 }}
      showsVerticalScrollIndicator={false}
    >
      <View className="flex flex-row items-center">
        <CustomCheckbox bordercolor={"#FFDC58"} width={20} height={20} />
        <Text>Select All</Text>
      </View>
      <View className="flex flex-row items-center justify-between border-b border-[#AEAEAE] pb-2 my-2">
        <View className="flex flex-row">
          <CustomCheckbox bordercolor={"#FFDC58"} width={20} height={20} />
          <TouchableOpacity className="flex flex-row gap-3 items-center">
            <Ionicons name="folder" size={40} color="#FFDC58" />
            <View className="flex ">
              <Text>Name</Text>
              <View className="flex flex-row items-center gap-2 ">
                <Text>11/08/24</Text>
                <Text>(Fri)</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        <TouchableOpacity className="flex flex-row gap-3 items-center">
          <AntDesign name="delete" size={20} color="#E91111" />
        </TouchableOpacity>
      </View>
      <View className="flex flex-row items-center justify-between border-b border-[#AEAEAE] pb-2 my-2">
        <View className="flex flex-row">
          <CustomCheckbox bordercolor={"#FFDC58"} width={20} height={20} />
          <TouchableOpacity className="flex flex-row gap-3 items-center">
            <Ionicons name="folder" size={40} color="#FFDC58" />
            <View className="flex ">
              <Text>Name</Text>
              <View className="flex flex-row items-center gap-2 ">
                <Text>11/08/24</Text>
                <Text>(Fri)</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        <TouchableOpacity className="flex flex-row gap-3 items-center">
          <AntDesign name="delete" size={20} color="#E91111" />
        </TouchableOpacity>
      </View>
      <View className="flex flex-row items-center justify-between border-b border-[#AEAEAE] pb-2 my-2">
        <View className="flex flex-row">
          <CustomCheckbox bordercolor={"#FFDC58"} width={20} height={20} />
          <TouchableOpacity className="flex flex-row gap-3 items-center">
            <Ionicons name="folder" size={40} color="#FFDC58" />
            <View className="flex ">
              <Text>Name</Text>
              <View className="flex flex-row items-center gap-2 ">
                <Text>11/08/24</Text>
                <Text>(Fri)</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        <TouchableOpacity className="flex flex-row gap-3 items-center">
          <AntDesign name="delete" size={20} color="#E91111" />
        </TouchableOpacity>
      </View>
      <View className="flex flex-row items-center justify-between border-b border-[#AEAEAE] pb-2 my-2">
        <View className="flex flex-row">
          <CustomCheckbox bordercolor={"#FFDC58"} width={20} height={20} />
          <TouchableOpacity className="flex flex-row gap-3 items-center">
            <Ionicons name="folder" size={40} color="#FFDC58" />
            <View className="flex ">
              <Text>Name</Text>
              <View className="flex flex-row items-center gap-2 ">
                <Text>11/08/24</Text>
                <Text>(Fri)</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        <TouchableOpacity className="flex flex-row gap-3 items-center">
          <AntDesign name="delete" size={20} color="#E91111" />
        </TouchableOpacity>
      </View>
      
     
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 20,
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
});

export default SelectDocumentFile;
