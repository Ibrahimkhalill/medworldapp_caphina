import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useNavigationState, useNavigation } from '@react-navigation/native';
import NavigationBar from './BottomTabNavigator';

// Recursive function to get the deepest route name
const getActiveRouteName = (state) => {
    if (!state || !state.routes || state.index == null) return null;

    const route = state.routes[state.index];
    if (route.state) {
        // Nested navigator
        return getActiveRouteName(route.state);
    }
    return route.name;
};

export default function NavigationBarWrapper() {
    const navigation = useNavigation();
    const state = useNavigationState((state) => state);

    if (!state) return null;

    const currentRoute = getActiveRouteName(state);
    console.log('Current route:', currentRoute);

    const hideOnScreens = [
        'UserLogin',
        'UserSignup',
        'OTP',
        'ForgetPassword',
        'ForgetPasswordOtp',
        'ResetPassword',
        'PrivacyPolicy',
        'TermsAndCondition',
        'HelpSupport',
    ];

    if (hideOnScreens.includes(currentRoute)) return null;

    return (
        <View style={styles.wrapper}>
            <NavigationBar navigation={navigation} state={state} />
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
    },
});
