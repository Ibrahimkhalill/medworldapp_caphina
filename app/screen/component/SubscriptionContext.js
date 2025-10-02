import React, { createContext, useContext, useEffect, useState } from "react";
import { Platform } from "react-native";
import axiosInstance from "../component/axiosInstance";
import { useAuth } from "../authentication/Auth";
import Purchases, { LOG_LEVEL } from "react-native-purchases";

const SubscriptionContext = createContext();
export const useSubscription = () => useContext(SubscriptionContext);

export const SubscriptionProvider = ({ children }) => {
  const { token } = useAuth();
  const [subscription, setSubscription] = useState({});
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [premiumPackage, setPremiumPackage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [purchaseLoading, setPurchaseLoading] = useState(false);
  const [error, setError] = useState(null);

  const [purchasesConfigured, setPurchasesConfigured] = useState(false);
  const [offeringsFetched, setOfferingsFetched] = useState(false);

  // Configure RevenueCat only once
  const configurePurchases = (userId) => {
    if (!userId || purchasesConfigured) return;
    Purchases.setLogLevel(LOG_LEVEL.VERBOSE);
    Purchases.configure({
      apiKey:
        Platform.OS === "ios"
          ? "appl_KUweuHaYGjDyNKcLhvtozkzFyHM"
          : "goog_UuVYwgSMkAxoQlunQldywvvuBMS",
      appUserID: String(userId),
    });
    setPurchasesConfigured(true);
  };

  // Fetch RevenueCat offerings only once
  const fetchOfferings = async () => {
    if (offeringsFetched) return;
    try {
      const offerings = await Purchases.getOfferings();
      if (offerings.current && offerings.current.monthly) {
        setPremiumPackage(offerings.current.monthly);
        setOfferingsFetched(true);
      }
    } catch (err) {
      console.log("Error fetching offerings:", err);
    }
  };

  // Fetch subscription and user ID from backend
  const fetchSubscription = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const response = await axiosInstance.get("/get_subscription/", {
        headers: { Authorization: `Token ${token}` },
      });

      const data = response.data?.subscription;
      setSubscription(data);
      setIsSubscribed(response.data?.subscription?.is_active ?? false);
      // Configure RevenueCat & fetch offerings
      configurePurchases(data.user);
      fetchOfferings();
    } catch (err) {
      console.log("Error fetching subscription:", err);
      setError("Failed to load subscription data.");
    } finally {
      setLoading(false);
    }
  };

  // Handle purchase
  const handlePurchase = async () => {
    if (!premiumPackage || !subscription.user) return;

    try {
      setPurchaseLoading(true);

      await Purchases.logIn(String(subscription.user));
      const purchaserInfo = await Purchases.purchasePackage(premiumPackage);
      printent("Purchase Info:", purchaserInfo);
      fetchSubscription(); // Refresh subscription status
      alert("Subscription successful! You are now a Pro user.");
      // const entitlementId = "Premium Plan";
      // const entitlements = purchaserInfo?.entitlements?.active ?? {};
      // const isPro = !!entitlements[entitlementId];

      // if (isPro) alert("Subscription successful! You are now a Pro user.");
    } catch (err) {
      console.log("Purchase error:", err);
    } finally {
      setPurchaseLoading(false);
    }
  };

  // On mount, fetch subscription
  useEffect(() => {
    if (token) fetchSubscription();
  }, [token]);

  return (
    <SubscriptionContext.Provider
      value={{
        subscription,
        loading,
        error,
        premiumPackage,
        purchaseLoading,
        handlePurchase,
        fetchSubscription,
        isSubscribed,
      }}>
      {children}
    </SubscriptionContext.Provider>
  );
};
