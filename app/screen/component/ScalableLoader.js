import React, { useRef, useEffect } from "react";
import { View, StyleSheet, Animated, Dimensions } from "react-native";

const ShimmerCard = () => {
  const shimmerValue = useRef(new Animated.Value(0)).current; // Animation value
  const screenWidth = Dimensions.get("window").width; // Screen width for animation

  // Shimmer animation loop
  useEffect(() => {
    Animated.loop(
      Animated.timing(shimmerValue, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      })
    ).start();
  }, [shimmerValue]);

  // Interpolating shimmer movement
  const translateX = shimmerValue.interpolate({
    inputRange: [0, 1],
    outputRange: [-screenWidth, screenWidth],
  });

  return (
    <View style={styles.container}>
      {/* Card */}
      <View style={styles.card}>
        <View style={styles.skeleton} />
        <View style={styles.skeletonSmall} />
        <View style={styles.skeletonCircle} />

        {/* Shimmer effect */}
        <Animated.View
          style={[
            styles.shimmerOverlay,
            {
              transform: [{ translateX }],
            },
          ]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    width: 300,
    height: 150,
    borderRadius: 10,
    backgroundColor: "#e0e0e0",
    overflow: "hidden",
    position: "relative",
  },
  skeleton: {
    width: "80%",
    height: 20,
    backgroundColor: "#dcdcdc",
    borderRadius: 5,
    marginTop: 20,
    marginHorizontal: 10,
  },
  skeletonSmall: {
    width: "60%",
    height: 15,
    backgroundColor: "#dcdcdc",
    borderRadius: 5,
    marginTop: 10,
    marginHorizontal: 10,
  },
  skeletonCircle: {
    width: 40,
    height: 40,
    backgroundColor: "#dcdcdc",
    borderRadius: 20,
    marginTop: 10,
    marginHorizontal: 10,
  },
  shimmerOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(255, 255, 255, 0.4)",
    opacity: 0.6,
  },
});

export default ShimmerCard;
