import React, { createContext, useContext, useEffect, useState } from "react";
import axiosInstance from "../component/axiosInstance";
import { useAuth } from "../authentication/Auth";

// Create Context
const SubscriptionContext = createContext();

export const useSubscription = () => useContext(SubscriptionContext);

export const SubscriptionProvider = ({ children }) => {
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = useAuth(); // Get authentication token from your Auth context

  // Fetch subscription details
  const fetchSubscription = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get("/get_subscription/", {
        headers: {
          Authorization: `Token ${token}`, // Add token for authentication
        },
      });
      setSubscription(response.data.subscription);
    } catch (err) {
      console.error("Error fetching subscription:", err);
      setError("Failed to load subscription data.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch subscription on component mount
  useEffect(() => {
    if (token) {
      fetchSubscription();
    }
  }, [token]);

  return (
    <SubscriptionContext.Provider
      value={{ subscription, loading, error, fetchSubscription }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
};
