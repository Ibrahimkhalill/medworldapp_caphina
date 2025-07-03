import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import SimpleLineIcon from 'react-native-vector-icons/MaterialIcons';
import {
	Text,
	View,
	TextInput,
	ToastAndroid,
	TouchableOpacity,
	Platform,
	ActivityIndicator,
	Alert,
	Image,
	StyleSheet,
} from 'react-native';
import axiosInstance from '../component/axiosInstance';
import { SafeAreaView } from 'react-native-safe-area-context';

function ForgetPassWord({ navigation }) {
	const [email, setEmail] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState('');

	function notifyMessage(msg) {
		if (Platform.OS === 'android') {
			ToastAndroid.showWithGravityAndOffset(
				msg,
				ToastAndroid.SHORT,
				ToastAndroid.TOP,
				25,
				160
			);
		} else {
			Alert.alert('Warning!', msg);
		}
	}

	const validateEmail = (email) => {
		const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Basic email format validation
		return regex.test(email);
	};

	const handleForgotPassword = async () => {
		if (email.trim() === '') {
			setError('Email field cannot be empty');
			return;
		}

		if (!validateEmail(email)) {
			setError('Please enter a valid email address');
			return;
		}

		setError(''); // Clear any previous errors
		setIsLoading(true);

		try {
			const response = await axiosInstance.post(`/password-reset-otp/`, {
				email,
			});

			if (response.status === 200) {
				notifyMessage('OTP sent successfully. Please check your email.');
				navigation.navigate('ForgetPasswordOtp', {
					email: email,

					// Add other data you want to send
				}); // Navigate to the OTP verification screen
			} else {
				notifyMessage(response.data.message || 'Failed to send OTP.');
			}
		} catch (error) {
			notifyMessage(
				(error.response?.data?.message || error.message)
			);
		} finally {
			setIsLoading(false);
		}
	};
	const handleOnchange = (onText) => {
		setEmail(onText);
		setError('');
	};

	return (
		<SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
			<View style={styles.container}>
				<View style={styles.header}>
					<TouchableOpacity onPress={() => navigation.navigate('UserLogin')}>
						<SimpleLineIcon name="arrow-back-ios" size={18} color="gray" />
					</TouchableOpacity>

					<Image
						style={styles.logo}
						source={require('../../assets/MEDLOGO.png')}
					/>
					<View></View>
				</View>

				<View style={styles.content}>
					<View style={styles.textContainer}>
						<Text style={styles.title}>Forgot Password</Text>
						<Text style={styles.subtitle}>
							Please enter your email address to reset password.
						</Text>
					</View>

					<Text style={styles.label}>Email</Text>
					<View style={styles.inputWrapper}>
						<MaterialIcon
							name="email-outline"
							size={20}
							color="gray"
							style={styles.icon}
						/>
						<TextInput
							style={styles.input}
							placeholderTextColor="#888888"
							placeholder="Enter email"
							onChangeText={handleOnchange}
							value={email}
						/>
					</View>

					{error ? <Text style={styles.errorText}>{error}</Text> : null}

					<TouchableOpacity
						onPress={handleForgotPassword}
						style={styles.submitButton}
						disabled={isLoading}>
						{isLoading ? (
							<ActivityIndicator size="small" color="#0000ff" />
						) : (
							<Text style={styles.submitButtonText}>Send OTP</Text>
						)}
					</TouchableOpacity>
				</View>
			</View>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingTop: 40,
		paddingHorizontal: 20,
		backgroundColor: '#fff',
	},
	header: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		marginBottom: 40,
	},
	logo: {
		width: 116,
		height: 92,
	},
	content: {
		flex: 1,
		marginTop: 50,
	},
	textContainer: {
		marginBottom: 30,
	},
	title: {
		fontSize: 24,
		fontWeight: 'bold',
	},
	subtitle: {
		fontSize: 14,
		color: '#555',
	},
	label: {
		fontSize: 16,
		color: '#CBCBCB',
		marginBottom: 8,
	},
	inputWrapper: {
		flexDirection: 'row',
		alignItems: 'center',
		borderWidth: 1,
		borderColor: '#D1D5DB',
		borderRadius: 8,
		paddingHorizontal: 10,
		height: 57,
		marginBottom: 10,
	},
	input: {
		flex: 1,
		fontSize: 16,
		color: '#333',
	},
	icon: {
		marginRight: 8,
	},
	errorText: {
		color: '#E91111',
		fontSize: 12,
		marginTop: -5,
		marginBottom: 10,
	},
	submitButton: {
		backgroundColor: '#FFDC58',
		padding: 15,
		borderRadius: 30,
		alignItems: 'center',
		marginTop: 20,
	},
	submitButtonText: {
		fontSize: 19,
		color: '#000',
	},
});

export default ForgetPassWord;
