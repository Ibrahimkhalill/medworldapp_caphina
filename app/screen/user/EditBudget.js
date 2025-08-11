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
  Dimensions,
} from "react-native";
import Navbar from "../component/Navbar";
import CustomDatePicker from "../component/CustomDatePicker";
import { useAuth } from "../authentication/Auth";
import axiosInstance from "../component/axiosInstance";
import { useTranslation } from "react-i18next";

function EditBudget({ navigation, route }) {
  const { height } = Dimensions.get("window");

  const [date, setDate] = useState(new Date());
  const [category, setCategory] = useState("");
  const [name, setName] = useState("");
  const [location, setLocation] = useState(""); // <-- added location state
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

  const { params } = route; // passed budget data

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

  const { t } = useTranslation();

  // Prefill data when screen loads
  useEffect(() => {
    if (params && params.budget) {
      const budget = params.budget;
      setDate(new Date(budget.date));
      setCategory(budget.category);
      setName(budget.name);
      setLocation(budget.location || ""); // <-- prefill location
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
    setTotalFee((regFee + travFee + accomExp).toFixed(2));
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
      newErrors.date = t("date_required") || "Date is required";
      hasError = true;
    }
    if (!category) {
      newErrors.category = t("category_required") || "Category is required";
      hasError = true;
    }
    if (!name) {
      newErrors.name = t("name_required") || "Name is required";
      hasError = true;
    }
    if (!registrationFee) {
      newErrors.registrationFee =
        t("registration_fee_required") || "Registration fee is required";
      hasError = true;
    }
    if (!travelFee) {
      newErrors.travelFee =
        t("travel_fee_required") || "Travel fee is required";
      hasError = true;
    }
    if (!accommodationExpense) {
      newErrors.accommodationExpense =
        t("accommodation_expense_required") ||
        "Accommodation expense is required";
      hasError = true;
    }

    setErrors(newErrors);
    if (hasError) return;

    const payload = {
      date,
      category,
      name,
      location, // <-- include location (optional)
      registration_fee: registrationFee,
      travel_fee: travelFee,
      accommodation_expense: accommodationExpense,
      total_fee: totalFee,
    };

    try {
      const response = await axiosInstance.put(
        `/budgets/${params.budget.id}/`,
        payload,
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );

      if (response.status === 200) {
        notifyMessage(
          t("budget_updated_success") || "Budget updated successfully!"
        );
        navigation.goBack();
      } else {
        notifyMessage(t("budget_update_failed") || "Failed to update budget.");
      }
    } catch (error) {
      console.error("Error updating budget:", error);
      notifyMessage(
        t("error_generic") || "An error occurred. Please try again."
      );
    }
  };

  const handleDateChange = (selectedDate) => {
    setDate(selectedDate);
    setErrors({ ...errors, date: "" });
  };

  return (
    <SafeAreaView style={styles.safeAreaContainer} className="px-5">
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <Navbar navigation={navigation} navigation_Name={"UserHome"} />
        <ScrollView
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1, paddingBottom: height * 0.1 }}
          keyboardShouldPersistTaps="handled">
          <View className="flex justify-center flex-row gap-3 my-3 mb-5">
            <Text style={styles.navButtonText}>{t("edit_budget")}</Text>
          </View>

          <View style={styles.container}>
            {/* Date and Category */}
            <View style={styles.inputContainerDouble}>
              <View style={styles.inputContainerFIrst}>
                <Text style={styles.labelFirst}>{t("date")}</Text>
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
                <Text style={styles.labelFirst}>{t("category")}</Text>
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
              <Text style={styles.label}>{t("name")}</Text>
              <View
                style={[
                  styles.inputWrapper,
                  errors.name ? styles.inputErrorBorder : null,
                ]}>
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

            {/* Location (optional) */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>{t("location") || "Location"}</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  placeholder={t("enter_location") || "Enter location"}
                  value={location}
                  onChangeText={(text) => setLocation(text)}
                />
              </View>
            </View>

            {/* Fees */}
            <View style={{ marginVertical: 20 }}>
              <View style={styles.inputRowContainer}>
                <Text style={styles.Rowlabel}>{t("registration_fee")}:</Text>
                <View style={{ flex: 1 }}>
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
                <Text style={styles.Rowlabel}>{t("travel_fee")}:</Text>
                <View style={{ flex: 1 }}>
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
                <Text style={styles.Rowlabel}>
                  {t("accommodation_expense")}:
                </Text>
                <View style={{ flex: 1 }}>
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
                <Text style={styles.Rowlabel}>{t("total_fee")}:</Text>
                <View style={{ flex: 1 }}>
                  <TextInput
                    style={styles.RowInput}
                    value={totalFee}
                    editable={false}
                  />
                </View>
              </View>
            </View>

            {/* Update Button */}
            <TouchableOpacity style={styles.loginButton} onPress={handleUpdate}>
              <Text style={styles.loginButtonText}>{t("update")}</Text>
            </TouchableOpacity>
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
    paddingHorizontal: 5,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingBottom: 10,
  },
  inputContainer: {
    width: "100%",
    marginBottom: 15,
  },
  inputRowContainer: {
    width: "100%",
    marginBottom: 15,
    flexDirection: "row",
    alignItems: "center",
  },
  RowInput: {
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
  inputFirst: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 12,
    borderColor: "gray",
    paddingHorizontal: 10,
    height: 54,
    width: "95%",
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#333",
    paddingLeft: 10,
  },
  loginButton: {
    height: 39,
    backgroundColor: "#FFDC58",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    marginTop: 30,
    width: 119,
  },
  loginButtonText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#000000",
  },
  navButtonText: {
    fontWeight: "400",
    fontSize: 20,
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
