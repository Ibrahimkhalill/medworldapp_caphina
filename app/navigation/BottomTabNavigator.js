import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

export default function NavigationBar({ state, descriptors, navigation }) {
  const insets = useSafeAreaInsets();

  const tabs = [
    { name: 'UserHome', icon: <FontAwesome6 name="house" size={20} /> },
    { name: 'SurgergeryDcoument', icon: <FontAwesome name="file-text-o" size={22} /> },
    { name: 'Settings', icon: <AntDesign name="setting" size={25} /> },
    { name: 'Profile', icon: <FontAwesome6 name="circle-user" size={23} /> },
  ];

  return (
    <View
      style={[
        styles.navBar,

      ]}
    >
      {tabs.map((tab, index) => {
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: state.routes[index].key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(tab.name);
          }
        };

        const iconWithColor = React.cloneElement(tab.icon, {
          color: isFocused ? '#000' : '#555',
        });

        return (
          <TouchableOpacity key={tab.name} onPress={onPress} style={styles.navItem}>
            {iconWithColor}
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
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingVertical: 10,
  },
});
