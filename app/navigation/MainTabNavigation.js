// navigation/MainTabNavigation.js
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import NavigationBar from './BottomTabNavigator';
import UserHome from '../screen/user/UserHome';
import SurgeryDocument from '../screen/user/SurgeryDocument';
import Settings from '../screen/component/Settings';
import Profile from '../screen/user/Profile';

const Tab = createBottomTabNavigator();

export default function MainTabNavigation() {
    return (
        <Tab.Navigator
            initialRouteName="UserHome"
            screenOptions={{ headerShown: false }}
            tabBar={(props) => <NavigationBar {...props} />}
        >
            <Tab.Screen name="UserHome" component={UserHome} />
            <Tab.Screen name="SurgergeryDcoument" component={SurgeryDocument} />
            <Tab.Screen name="Settings" component={Settings} />
            <Tab.Screen name="Profile" component={Profile} />

        </Tab.Navigator>
    );
}
