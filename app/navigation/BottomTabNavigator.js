import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

export default function NavigationBar({ state, navigation }) {
  const insets = useSafeAreaInsets();

  const tabs = [
    { name: 'UserHome', icon: <FontAwesome6 name="house" size={20} /> },
    { name: 'SurgergeryDcoument', icon: <FontAwesome name="file-text-o" size={22} /> },
    { name: 'Settings', icon: <AntDesign name="setting" size={25} /> },
    { name: 'Profile', icon: <FontAwesome6 name="circle-user" size={23} /> },
  ];
  const getActiveRouteName = (state) => {
    if (!state || !state.routes || state.index == null) return null;

    const route = state.routes[state.index];
    if (route.state) {
      // Nested navigator
      return getActiveRouteName(route.state);
    }
    return route.name;
  };

  return (
    <View style={styles.navBar}>
      {tabs.map((tab, index) => {


        const currentRoute = getActiveRouteName(state);
        const isFocused = currentRoute === tab.name;



        const onPress = () => {
          if (!isFocused) {
            navigation.navigate(tab.name);
          }
        };

        console.log("isFocused", isFocused);



        const iconWithColor = React.cloneElement(tab.icon, {
          color: isFocused ? '#000' : 'gray',
        });

        return (
          <TouchableOpacity key={tab.name} onPress={onPress} style={styles.navItem}>
            <View style={[styles.iconContainer, isFocused && styles]}>
              {iconWithColor}
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  navBar: {
    margin: 10,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#FFDC58',
    borderRadius: 30,
    height: 60,
    position: 'absolute',
    bottom: 8,
    left: 10,
    right: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  iconContainer: {
    padding: 10,
    borderRadius: 20,
  },

});
