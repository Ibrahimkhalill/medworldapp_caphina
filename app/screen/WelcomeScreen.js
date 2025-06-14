import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Image, StyleSheet, Text, View, Platform } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

function WelcomeScreen({ navigation }) {
	useFocusEffect(
		React.useCallback(() => {
			// Automatically navigate to the UserHome page after 3 seconds
			const timer = setTimeout(() => {
				navigation.navigate('UserHome');
			}, 3000);

			// Cleanup timeout to avoid memory leaks
			return () => clearTimeout(timer);
		}, [])
	);

	return (
		<View
			style={styles.container}
			className="bg-white flex justify-center items-center h-full">
			<View className="flex items-center justify-evenly h-full w-full">
				<Image
					className="w-[270px] h-[214px]"
					source={require('../assets/MEDLOGO.png')}
				/>
				<Text className="text-black font-medium text-[30px] mt-2 w-[70%] text-center">
					Welcome to your platform!
				</Text>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
	},
});

export default WelcomeScreen;
