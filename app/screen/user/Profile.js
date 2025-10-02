import React, { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
  Text,
  View,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
  Alert,
  StyleSheet,
  Image,
  ScrollView,
  Pressable,
  KeyboardAvoidingView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";
import axiosInstance from "../component/axiosInstance";
import { useTranslation } from "react-i18next";
import * as ImagePicker from "expo-image-picker";
import { useSubscription } from "../component/SubscriptionContext";
import { Picker } from "@react-native-picker/picker";
import RNPickerSelect from "react-native-picker-select";
import CustomDropdown from "../component/CustomDropdown";

function Profile({ navigation }) {
  const { t } = useTranslation();
  const [userData, setUserData] = useState([]);
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [phone_number, setPhone_number] = useState("");
  const [profile_picture, setProfilePicture] = useState("");
  const [residencyDuration, setResidencyDuration] = useState("");
  const [residencyYear, setResidencyYear] = useState("");
  const [gender, setGender] = useState("");
  const [address, setAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);
  const [imageUri, setImageUri] = useState(null);
  const [isEdit, setIsEdit] = useState(false);
  const { subscription, isSubscribed, fetchSubscription } = useSubscription();
  const insets = useSafeAreaInsets();

  const notifyMessage = (msg) => {
    if (Platform.OS === "android") {
      ToastAndroid.showWithGravityAndOffset(
        msg,
        ToastAndroid.SHORT,
        ToastAndroid.TOP,
        25,
        160
      );
    } else {
      Alert.alert("Warning!", msg);
    }
  };

  useEffect(() => {
    fetchProfileData();
    fetchSubscription();
  }, []);

  const fetchProfileData = async () => {
    setIsLoading(true);
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        notifyMessage(t("error_not_authenticated"));
        return;
      }

      const response = await axiosInstance.get(`/user_profile/`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });

      if (response.status === 200) {
        const data = response.data;
        console.log(data);
        setEmail(data.email);
        setAddress(data.address);
        setResidencyDuration(data.residencyDuration);
        setResidencyYear(data.residencyYear);
        setPhone_number(data.phone_number || "");
        setGender(data.gender);
        setUserName(data.username);
        setSpecialty(data.specialty);
        setProfilePicture(data.profile_picture);
        setUserData(data);
      }
    } catch (error) {
      notifyMessage(t("error_fetching_profile"));
    } finally {
      setIsLoading(false);
    }
  };

  const pickImage = async () => {
    setIsEdit(true);
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert(t("permission_required"), t("permission_message"));
      return;
    }

    let pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!pickerResult.canceled) {
      setImageUri(pickerResult.assets[0].uri);
    }
  };

  const updatedProfileData = async () => {
    setIsSubmitLoading(true);
    const formData = new FormData();
    console.log("f", imageUri);

    if (imageUri) {
      console.log("ft", imageUri);
      formData.append("profile_picture", {
        uri: imageUri,
        name: `photo_${Date.now()}.jpg`,
        type: "image/jpeg",
      });
    }

    formData.append("email", email);
    formData.append("address", address);
    formData.append("residencyDuration", residencyDuration);
    formData.append("residencyYear", residencyYear);
    formData.append("phone_number", phone_number);
    formData.append("gender", gender);
    formData.append("username", userName);
    formData.append("specialty", specialty);
    console.log("formData", formData);

    const token = await AsyncStorage.getItem("token");

    try {
      const response = await axiosInstance.put("/user_profile/", formData, {
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("formData re", response);
      if (response.status === 200) {
        Alert.alert(t("profile_updated"));
        fetchProfileData();
        setIsEdit(false);
      } else {
        Alert.alert(t("upload_failed"));
      }
    } catch (error) {
      console.error(error);
      Alert.alert(t("error_upload"));
    } finally {
      setIsSubmitLoading(false);
    }
  };

  const handleCheck = () => {
    if (subscription.free_trial && !isSubscribed) {
      if (subscription.free_trial_end && !isSubscribed) {
        updatedProfileData();
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
      updatedProfileData();
    } else {
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

  const handleNavigate = () => {
    navigation.navigate("Subscriptions");
  };

  return (
    <SafeAreaView style={styles.safeAreaContainer} className="px-5">
      <StatusBar style="dark" backgroundColor="white" />
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : ""}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          style={{ flexGrow: 1 }}>
          <View style={styles.container}>
            {/* Logo Image */}
            <View style={styles.logoImageContainer}>
              <TouchableOpacity onPress={() => navigation.navigate("UserHome")}>
                <Image
                  className="w-[100px] h-[100px]" // size increased
                  resizeMode="contain" // keep aspect ratio
                  source={require("../../assets/MEDLOGO.png")}
                />
              </TouchableOpacity>
            </View>

            {/* Username Input */}
            <View style={styles.inputContainer}>
              <Text style={{ fontSize: 24, fontWeight: "700" }}>
                {t("personal_information")}
              </Text>
              <View className="flex flex-row items-center justify-between mt-6">
                <View style={styles.imageContainer}>
                  {/* Profile Image */}
                  <Pressable onPress={pickImage}>
                    {imageUri || profile_picture ? (
                      <Image
                        source={
                          imageUri
                            ? { uri: imageUri }
                            : {
                                uri: `https://admin.medworld.online${profile_picture}`,
                              }
                        }
                        style={styles.Profileimage}
                      />
                    ) : (
                      <Image
                        source={require("../../assets/profile-icon.png")}
                        style={styles.Profileimage}
                      />
                    )}
                    <FontAwesome
                      name="edit"
                      size={25}
                      color="#25292e"
                      style={styles.editIcon}
                    />
                  </Pressable>
                </View>
                <View className="flex items-center gap-3">
                  <Text className="text-[24px] font-bold">
                    {userData.username}
                  </Text>
                  <TouchableOpacity
                    onPress={() => handleNavigate()}
                    className="bg-[#FCE488] w-[166px] h-[37px] rounded-[400px] flex items-center justify-center flex-row">
                    {isSubscribed && (
                      <Image
                        source={require("../../assets/premium.png")}
                        style={styles.icon}
                      />
                    )}
                    <Text className="text-[14px] font-[600] ml-2">
                      {isSubscribed ? "Premium account" : "Free Account"}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>{t("Name")}</Text>
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={styles.input}
                    editable={isEdit}
                    value={userName}
                    onChangeText={setUserName}
                    placeholderTextColor={"#B5B5B5"}
                  />
                </View>
              </View>
              <Text style={styles.label}>{t("email")}</Text>
              <View style={styles.inputWrapper}>
                <MaterialCommunityIcons
                  name="email"
                  size={20}
                  color="#B5B5B5"
                />
                <TextInput
                  style={styles.input}
                  editable={isEdit}
                  placeholder={t("placeholder_email")}
                  value={email}
                  placeholderTextColor={"#B5B5B5"}
                />
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>{t("specialty")}</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  editable={isEdit}
                  placeholder={t("placeholder_speciality")}
                  value={specialty}
                  placeholderTextColor={"#B5B5B5"}
                  onChangeText={setSpecialty}
                />
              </View>
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>{t("residency_duration")}</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  editable={isEdit}
                  placeholder={t("placeholder_speciality")}
                  value={residencyDuration}
                  onChangeText={setResidencyDuration}
                  maxLength={2}
                  keyboardType="numeric"
                  placeholderTextColor={"#B5B5B5"}
                />
              </View>
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>{t("residency_year")}</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  editable={isEdit}
                  placeholder={t("placeholder_speciality")}
                  value={residencyYear}
                  onChangeText={setResidencyYear}
                  maxLength={2}
                  keyboardType="numeric"
                  placeholderTextColor={"#B5B5B5"}
                />
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>{t("phone_number")}</Text>
              <View style={styles.inputWrapper}>
                <MaterialCommunityIcons
                  name="phone-outline"
                  size={20}
                  color="#B5B5B5"
                />
                <TextInput
                  style={styles.input}
                  editable={isEdit}
                  placeholder={t("placeholder_phone_number")}
                  value={phone_number}
                  onChangeText={setPhone_number}
                  keyboardType="numeric"
                  placeholderTextColor={"#B5B5B5"}
                />
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>{t("address")}</Text>
              <View style={styles.inputWrapper}>
                <SimpleLineIcons
                  name="location-pin"
                  size={20}
                  color="#B5B5B5"
                />
                <TextInput
                  style={styles.input}
                  editable={isEdit}
                  placeholder={t("placeholder_address")}
                  value={address}
                  onChangeText={setAddress}
                  placeholderTextColor={"#B5B5B5"}
                />
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>{t("gender")}</Text>
              <View style={[, { paddingHorizontal: 0 }]}>
                <CustomDropdown
                  selectedValue={gender}
                  onValueChange={setGender}
                  disabled={!isEdit}
                />
              </View>
            </View>
            {isEdit ? (
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}>
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={handleCheck}
                  disabled={isSubmitLoading}>
                  <Text style={styles.loginButtonText}>{t("update")}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.editButton,
                    { backgroundColor: "#ccc", marginLeft: 4 },
                  ]}
                  onPress={() => {
                    setIsEdit(false);
                    setImageUri("");
                  }}>
                  <Text style={styles.loginButtonText}>{t("cancel")}</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                style={styles.loginButton}
                onPress={() => setIsEdit(true)}>
                <Text style={styles.loginButtonText}>{t("Edit Profile")}</Text>
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Overlay Loading Indicator for Profile Update */}
      {isSubmitLoading && (
        <View style={styles.overlay}>
          <ActivityIndicator size="large" color="#000" />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeAreaContainer: {
    flexGrow: 1,
    paddingBottom: 10,
    backgroundColor: "white",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  editIcon: {
    position: "absolute",
    bottom: 0,
    right: 10,
    borderRadius: 15,
    padding: 5,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingBottom: 90,
  },
  imageContainer: {
    marginBottom: 30,
    borderWidth: 1,
    borderRadius: "50%",
    borderColor: "#ddd",
  },
  logoImageContainer: {
    marginBottom: 30,
  },
  image: {
    width: 100,
    height: 80,
  },
  Profileimage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    overflow: "hidden",
  },
  inputContainer: {
    width: "100%",
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    color: "#CBCBCB",
    marginBottom: 5,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 12,
    borderColor: "#D1D5DB",
    paddingHorizontal: 10,
    height: 56,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#333",
    paddingLeft: 10,
  },
  loginButton: {
    width: "100%",
    height: 50,
    backgroundColor: "#FFDC58",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 30,
    marginTop: 5,
  },
  genderButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 5,
  },

  genderButton: {
    flex: 1,
    marginHorizontal: 4,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 12,
    alignItems: "center",
    backgroundColor: "white",
  },

  genderButtonSelected: {
    backgroundColor: "#FFDC58",
    borderColor: "#FFDC58",
  },

  genderButtonText: {
    color: "#333",
    fontSize: 16,
    fontWeight: "500",
  },

  genderButtonTextSelected: {
    color: "#000",
    fontWeight: "700",
  },
  editButton: {
    width: "48%",
    height: 50,
    backgroundColor: "#FFDC58",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 30,
    marginTop: 5,
  },
  loginButtonText: {
    fontSize: 16,
    fontWeight: "400",
    color: "#000",
  },
  icon: {
    width: 12.5,
    height: 11.5,
  },
  // New styles for the overlay loading indicator
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent black overlay
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000, // Ensure it appears above other content
  },
});

export default Profile;
