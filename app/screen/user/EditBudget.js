import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ToastAndroid,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import Navbar from "../component/Navbar";
import CustomDatePicker from "../component/CustomDatePicker";
import { useAuth } from "../authentication/Auth";
import axiosInstance from "../component/axiosInstance";

function EditBudget({ navigation, route }) {
  const [date, setDate] = useState(new Date());
  const [category, setCategory] = useState("");
  const [name, setName] = useState("");
  const [registrationFee, setRegistrationFee] = useState("");
  const [travelFee, setTravelFee] = useState("");
  const [accommodationExpense, setAccommodationExpense] = useState("");
  const [totalFee, setTotalFee] = useState("");
  const { token } = useAuth();
  const [errors, setErrors] = useState({
    date: "",
    category: "",
    name: "",
    registrationFee: "",
    travelFee: "",
    accommodationExpense: "",
  });

  const { params } = route; // Retrieve passed parameters for budget data

  // Notify message utility
  function notifyMessage(msg) {
    if (Platform.OS === "android") {
      ToastAndroid.showWithGravityAndOffset(
        msg,
        ToastAndroid.SHORT,
        ToastAndroid.TOP,
        25,
        160
      );
    } else {
      alert(msg);
    }
  }
  console.log("params.budget", params.budget);

  // Prefill data when navigating to this screen
  useEffect(() => {
    if (params && params.budget) {
      const budget = params.budget;
      setDate(new Date(budget.date));
      setCategory(budget.category);
      setName(budget.name);
      setRegistrationFee(String(budget.registration_fee || ""));
      setTravelFee(String(budget.travel_fee || ""));
      setAccommodationExpense(String(budget.accommodation_expense || ""));
      setTotalFee(String(budget.total_fee || ""));
    }
  }, [params]);

  // Real-time calculation of total fee
  useEffect(() => {
    const regFee = parseFloat(registrationFee) || 0;
    const travFee = parseFloat(travelFee) || 0;
    const accomExp = parseFloat(accommodationExpense) || 0;
    setTotalFee((regFee + travFee + accomExp).toFixed(2)); // Keep total to 2 decimal places
  }, [registrationFee, travelFee, accommodationExpense]);

  // Handle form submission
  const handleUpdate = async () => {
    let hasError = false;
    const newErrors = {
      date: "",
      category: "",
      name: "",
      registrationFee: "",
      travelFee: "",
      accommodationExpense: "",
    };

    if (!date) {
      newErrors.date = "Date is required";
      hasError = true;
    }
    if (!category) {
      newErrors.category = "Category is required";
      hasError = true;
    }
    if (!name) {
      newErrors.name = "Name is required";
      hasError = true;
    }
    if (!registrationFee) {
      newErrors.registrationFee = "Registration fee is required";
      hasError = true;
    }
    if (!travelFee) {
      newErrors.travelFee = "Travel fee is required";
      hasError = true;
    }
    if (!accommodationExpense) {
      newErrors.accommodationExpense = "Accommodation expense is required";
      hasError = true;
    }

    setErrors(newErrors);

    if (hasError) return;

    const payload = {
      date,
      category,
      name,
      registration_fee: registrationFee,
      travel_fee: travelFee,
      accommodation_expense: accommodationExpense,
      total_fee: totalFee,
    };

    try {
      const response = await axiosInstance.put(
        `/budgets/${params.budget.id}/`, // Use PUT method to update the budget
        payload,
        {
          headers: {
            Authorization: `Token ${token}`, // Include token for authorization
          },
        }
      );

      if (response.status === 200) {
        notifyMessage("Budget updated successfully!");
        navigation.goBack(); // Navigate back to the previous screen
      } else {
        notifyMessage("Failed to update budget.");
      }
    } catch (error) {
      console.error("Error updating budget:", error);
      notifyMessage("An error occurred. Please try again.");
    }
  };

  // Handle Date Change
  const handleDateChange = (selectedDate) => {
    setDate(selectedDate);
    setErrors({ ...errors, date: "" }); // Clear error when value changes
  };

  return (
    <SafeAreaView style={styles.safeAreaContainer}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          Style={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          className="px-5"
        >
          <Navbar navigation={navigation} navigation_Name={"UserHome"} />
          <View className="flex flex-row gap-3 my-3 mb-5">
            <TouchableOpacity
              className="py-1"
              onPress={() => navigation.navigate("ScientificDcoument")}
            >
              <Text style={styles.navButtonText}>Scientific</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="py-1"
              onPress={() => navigation.navigate("SurgergeryDcoument")}
            >
              <Text style={styles.navButtonText}>Surgeries</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="py-1"
              onPress={() => navigation.navigate("CoursesDocument")}
            >
              <Text style={styles.navButtonText}>Courses</Text>
            </TouchableOpacity>
            <TouchableOpacity className="border-b-4 border-[#FFDC58] py-1">
              <Text style={styles.navButtonText}>Budget</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.container}>
            {/* Date and Category */}
            <View style={styles.inputContainerDouble}>
              <View style={styles.inputContainerFIrst}>
                <Text style={styles.labelFirst}>Date</Text>
                <CustomDatePicker
                  onDateChange={handleDateChange}
                  date={date}
                  setDate={setDate}
                />
                {errors.date ? (
                  <Text style={styles.errorText}>{errors.date}</Text>
                ) : null}
              </View>
              <View style={styles.inputContainerFIrst}>
                <Text style={styles.labelFirst}>Category</Text>
                <TextInput
                  style={[
                    styles.inputFirst,
                    errors.category ? styles.inputErrorBorder : null,
                  ]}
                  placeholder="Congress"
                  value={category}
                  onChangeText={(text) => {
                    setCategory(text);
                    setErrors({ ...errors, category: "" });
                  }}
                />
                {errors.category ? (
                  <Text style={styles.errorText}>{errors.category}</Text>
                ) : null}
              </View>
            </View>

            {/* Name */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Name</Text>
              <View
                style={[
                  styles.inputWrapper,
                  errors.name ? styles.inputErrorBorder : null,
                ]}
              >
                <TextInput
                  style={styles.input}
                  placeholder="Enter name"
                  value={name}
                  onChangeText={(text) => {
                    setName(text);
                    setErrors({ ...errors, name: "" });
                  }}
                />
              </View>
              {errors.name ? (
                <Text style={styles.errorText}>{errors.name}</Text>
              ) : null}
            </View>

            {/* Fees */}
            <View className="my-5">
              <View style={styles.inputRowContainer}>
                <Text style={styles.Rowlabel}>Registration fee:</Text>
                <View className="flex items-start flex-col w-[50%]">
                  <TextInput
                    style={[
                      styles.RowInput,
                      errors.registrationFee ? styles.inputErrorBorder : null,
                    ]}
                    placeholder=""
                    value={registrationFee}
                    keyboardType="numeric"
                    onChangeText={(text) => {
                      setRegistrationFee(text);
                      setErrors({ ...errors, registrationFee: "" });
                    }}
                  />
                  {errors.registrationFee ? (
                    <Text style={styles.errorText}>
                      {errors.registrationFee}
                    </Text>
                  ) : null}
                </View>
              </View>
              <View style={styles.inputRowContainer}>
                <Text style={styles.Rowlabel}>Travel fee:</Text>
                <View className="flex items-start flex-col w-[50%]">
                  <TextInput
                    style={[
                      styles.RowInput,
                      errors.travelFee ? styles.inputErrorBorder : null,
                    ]}
                    placeholder=""
                    value={travelFee}
                    keyboardType="numeric"
                    onChangeText={(text) => {
                      setTravelFee(text);
                      setErrors({ ...errors, travelFee: "" });
                    }}
                  />
                  {errors.travelFee ? (
                    <Text style={styles.errorText}>{errors.travelFee}</Text>
                  ) : null}
                </View>
              </View>
              <View style={styles.inputRowContainer}>
                <Text style={styles.Rowlabel}>Accommodation expenses:</Text>
                <View className="flex items-start flex-col w-[50%]">
                  <TextInput
                    style={[
                      styles.RowInput,
                      errors.accommodationExpense
                        ? styles.inputErrorBorder
                        : null,
                    ]}
                    placeholder=""
                    value={accommodationExpense}
                    keyboardType="numeric"
                    onChangeText={(text) => {
                      setAccommodationExpense(text);
                      setErrors({ ...errors, accommodationExpense: "" });
                    }}
                  />
                  {errors.accommodationExpense ? (
                    <Text style={styles.errorText}>
                      {errors.accommodationExpense}
                    </Text>
                  ) : null}
                </View>
              </View>
              <View style={styles.inputRowContainer}>
                <Text style={styles.Rowlabel}>Total Fee:</Text>
                <View className="flex items-start flex-col w-[50%]">
                  <TextInput style={styles.RowInput} value={totalFee} />
                </View>
              </View>
            </View>
            <TouchableOpacity style={styles.loginButton} onPress={handleUpdate}>
              <Text style={styles.loginButtonText}>Update</Text>
            </TouchableOpacity>

            {/* Update Button */}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  safeAreaContainer: {
    flexGrow: 1,
    paddingBottom: 10,
    paddingTop: 40,
    backgroundColor: "white",
  },
  textArea: {
    height: 80, // Adjust height as needed
    borderColor: "gray",
    borderWidth: 1,
    padding: 10,
    textAlignVertical: "top", // Ensures text starts at the top of the TextInput
    borderRadius: 12,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",

    paddingBottom: 10,
  },
  imageContainer: {
    marginBottom: 30,
  },
  image: {
    width: 100, // width of the image
    height: 80, // height of the image
  },
  Profileimage: {
    width: 120, // width of the image
    height: 120, // height of the image
    borderRadius: 60, // half of width or height for circular shape
    overflow: "hidden", // ensures content stays within the circle
  },

  inputContainer: {
    width: "100%",
    marginBottom: 15,
  },
  inputRowContainer: {
    width: "100%",
    marginBottom: 15,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  RowInput: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 12,
    borderColor: "gray",
    paddingHorizontal: 10,
    height: 50,
    width: "100%",
  },
  inputContainerFIrst: {
    width: "50%",
    marginBottom: 15,
  },
  inputContainerDouble: {
    width: "100%",

    flexDirection: "row",

    gap: 6,
  },
  label: {
    fontSize: 16,
    fontWeight: "400",
    color: "#000000",
    marginBottom: 5,
  },
  Rowlabel: {
    fontSize: 16,
    fontWeight: "400",
    color: "#000000",
    marginBottom: 5,
    width: "50%",
  },
  labelFirst: {
    fontSize: 16,
    fontWeight: "400",
    color: "#000000",
    marginBottom: 6,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 12,
    borderColor: "gray",
    paddingHorizontal: 10,
    height: 50,
  },
  inputWrapperDouble: {
    flexDirection: "column",

    height: 56,
    width: "40%",
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#333",
    paddingLeft: 10,
  },
  inputFirst: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 12,
    borderColor: "gray",
    paddingHorizontal: 10,
    height: 50,
    width: "95%",
  },
  loginButton: {
    height: 39,
    backgroundColor: "#FFDC58", // Button color
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    marginTop: 30,
    width: 119,
  },
  loginButtonText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#00000",
  },
  alreadySignInContainer: {
    marginTop: 15,
    flexDirection: "row",
    alignItems: "center",
  },
  alreadySignInText: {
    fontSize: 14,
    color: "#777",
  },
  link: {
    fontSize: 14,
    color: "#FFDC58",
    marginLeft: 5,
    textDecorationLine: "underline",
  },
  forgotPasswordContainer: {
    width: "100%",
    marginBottom: 20,
  },
  forgotPasswordText: {
    fontSize: 14,
    color: "#E91111",
    textAlign: "right",
  },
  icon: {
    width: 12.5,
    height: 11.5,
  },
  navButtonText: {
    fontWeight: "500",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: 4,
  },
  inputErrorBorder: {
    borderColor: "red",
    borderWidth: 1,
  },
});

export default EditBudget;
