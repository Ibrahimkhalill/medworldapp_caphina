import React, { useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
  Platform,
  ActivityIndicator,
  Linking,
} from "react-native";
import { Ionicons } from "react-native-vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import Navbar from "../component/Navbar";
import { useSubscription } from "../component/SubscriptionContext";

const { height } = Dimensions.get("window");
const scrollViewHeight = height * 0.8;

const Subscriptions = ({ navigation }) => {
  const { t } = useTranslation();
  const {
    premiumPackage,
    handlePurchase,
    purchaseLoading,
    loading,
    fetchSubscription,
    isSubscribed,
  } = useSubscription();

  useEffect(() => {
    fetchSubscription();
  }, []);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="black" />
      </View>
    );
  }

  const priceString = premiumPackage?.product.priceString || "$2.99/month";

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={{paddingLeft:12}}>

      <Navbar navigation_Name={t("user_home")} navigation={navigation} />
      </View>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={{ marginTop: 30 }}>
          <View style={[styles.shadow, styles.card]}>
            <View style={styles.titleContainer}>
              <Text style={styles.planTitle}>{t("premium_plan")}</Text>
            </View>

            {/* Features List */}
            <View style={styles.featuresContainer}>
              <View style={styles.row}>
                <Ionicons name="checkbox" size={20} color="#FFDC58" />
                <Text style={styles.featureText}>{t("free_trial")}</Text>
              </View>
              <View style={styles.row}>
                <Ionicons name="checkbox" size={20} color="#FFDC58" />
                <Text style={styles.featureText}>{t("access_all_features")}</Text>
              </View>
              <View style={styles.row}>
                <Ionicons name="checkbox" size={20} color="#FFDC58" />
                <Text style={styles.featureText}>
                  {t("advanced_progress_monitoring")}
                </Text>
              </View>
              <View style={styles.row}>
                <Ionicons name="checkbox" size={20} color="#FFDC58" />
                <Text style={styles.featureText}>{t("notification_histology")}</Text>
              </View>
              <View style={styles.row}>
                <Ionicons name="checkbox" size={20} color="#FFDC58" />
                <Text style={styles.featureText}>{t("exportable_reports")}</Text>
              </View>
            </View>

            {/* Price info (always visible) */}
            <Text style={styles.priceInfo}>
              {t("price_info", { price: priceString })}
            </Text>

            {/* Subscribe button */}
            <TouchableOpacity
              onPress={handlePurchase}
              style={[
                styles.sentButton,
                isSubscribed && { backgroundColor: "#AAAAAA" },
              ]}
              disabled={purchaseLoading || isSubscribed}
            >
              {purchaseLoading ? (
                <ActivityIndicator size="small" color="#000" />
              ) : (
                <Text style={styles.sentButtonText}>
                  {isSubscribed
                    ? t("subscribeds")
                    : t("subscribe_button", { price: priceString })}
                </Text>
              )}
            </TouchableOpacity>

            {/* Apple Required Legal Section */}
            <View style={styles.subscriptionDetails}>
                {Platform.OS === 'ios' ? (
            <>
              <Text style={styles.detailsText}>{t("subscription_terms_1")}</Text>
              <Text style={styles.detailsText}>{t("subscription_terms_2")}</Text>
              <Text style={styles.detailsText}>{t("subscription_terms_3")}</Text>
              <View style={styles.linkRow}>
                <Text
                  style={styles.linkText}
                  onPress={() => navigation.navigate("PrivacyPolicy")}
                >
                  {t("privacy_policy")}
                </Text>
                <Text style={{ color: "black" }}> | </Text>
                <Text
                  style={styles.linkText}
                  onPress={() =>
                    Linking.openURL(
                      "https://www.apple.com/legal/internet-services/itunes/dev/stdeula/"
                    )
                  }
                >
                  {t("terms_of_use")}
                </Text>
              </View>
            </>
          ) : (
            <>
              <Text style={styles.detailsText}>{t("subscription_terms_android_1")}</Text>
              <Text style={styles.detailsText}>{t("subscription_terms_android_2")}</Text>
              <Text style={styles.detailsText}>{t("subscription_terms_android_3")}</Text>
              <View style={styles.linkRow}>
                <Text
                  style={styles.linkText}
                  onPress={() => navigation.navigate("PrivacyPolicy")}
                >
                  {t("privacy_policy")}
                </Text>
                <Text style={{ color: "black" }}> | </Text>
                <Text
                  style={styles.linkText}
                  onPress={() =>
                    Linking.openURL(
                      "https://support.google.com/googleplay/answer/2476088"
                    )
                  }
                >
                  {t("terms_of_use")}
                </Text>
              </View>
            </>
          )}
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "white",
  },
  container: {
    flexGrow: 1,
    backgroundColor: "white",
    height: scrollViewHeight,
    paddingHorizontal: 20,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  card: {
    borderWidth: 1,
    borderColor: "#FCE488",
    borderRadius: 5,
    backgroundColor: "white",
    padding: 15,
  },
  shadow: {
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  titleContainer: {
    alignItems: "center",
    marginVertical: 10,
  },
  planTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "black",
    borderBottomWidth: 1,
    borderColor: "#FCE488",
    paddingBottom: 5,
    width: 185,
    textAlign: "center",
  },
  featuresContainer: {
    marginVertical: 15,
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    marginBottom: 10,
  },
  featureText: {
    fontSize: 16,
    color: "black",
  },
  priceInfo: {
    fontSize: 13,
    color: "gray",
    marginVertical: 5,
    textAlign: "center",
  },
  sentButton: {
    width: "100%",
    height: 50,
    backgroundColor: "#FFDC58",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 30,
    marginVertical: 10,
  },
  sentButtonText: {
    fontSize: 17,
    fontWeight: "600",
    color: "black",
  },
  subscriptionDetails: {
    marginTop: 10,
  },
  detailsText: {
    fontSize: 12,
    color: "gray",
    marginBottom: 4,
    textAlign: "center",
  },
  linkRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 8,
  },
  linkText: {
    color: "#007AFF",
    textDecorationLine: "underline",
    fontSize: 12,
  },
});

export default Subscriptions;
