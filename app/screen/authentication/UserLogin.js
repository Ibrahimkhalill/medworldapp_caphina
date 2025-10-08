import React, { useState } from 'react';
import {
	Text,
	View,
	TextInput,
	TouchableOpacity,
	Platform,
	ActivityIndicator,
	StyleSheet,
	Image,
	ScrollView,
	KeyboardAvoidingView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import axiosInstance from '../component/axiosInstance';
import { useAuth } from './Auth';
import ErrorModal from '../component/ErrorModal';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
export default function UserLogin({ navigation }) {
	const [userName, setUserName] = useState('');
	const [password, setPassword] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [passwordVisible, setPasswordVisible] = useState(false);
	const [errorVisible, setErrorVisible] = useState(false);
	const [error, setError] = useState('');
	const { login } = useAuth();
	const [errors, setErrors] = useState({ userName: '', password: '' });

	const validateEmail = (email) => {
		const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return regex.test(email);
	};

	const handleUserNameChange = (text) => {
		setUserName(text);
		if (!text) {
			setErrors((prev) => ({ ...prev, userName: 'Email cannot be empty' }));
		} else if (!validateEmail(text)) {
			setErrors((prev) => ({
				...prev,
				userName: 'Please enter a valid email address',
			}));
		} else {
			setErrors((prev) => ({ ...prev, userName: '' }));
		}
	};

	const handlePasswordChange = (text) => {
		setPassword(text);
		if (!text) {
			setErrors((prev) => ({ ...prev, password: 'Password cannot be empty' }));
		} else {
			setErrors((prev) => ({ ...prev, password: '' }));
		}
	};

	const handleUserLogin = async () => {
		let valid = true;
		const formErrors = { userName: '', password: '' };

		if (!userName) {
			formErrors.userName = 'Email cannot be empty';
			valid = false;
		} else if (!validateEmail(userName)) {
			formErrors.userName = 'Please enter a valid email address';
			valid = false;
		}
		if (!password) {
			formErrors.password = 'Password cannot be empty';
			valid = false;
		}
		setErrors(formErrors);
		if (!valid) return;

		setIsLoading(true);
		try {
			const response = await axiosInstance.post('/login/', {
				email: userName,
				password,
			});
			console.log('Login response:', response.data);
			if (response.status === 200) {
				await login(userName, response.data.token);
				// Debug: Check stored values
				const storedUsername = await AsyncStorage.getItem('username');
				const storedToken = await AsyncStorage.getItem('token');
				console.log('After login:', storedUsername, storedToken);
				navigation.navigate('UserHome');
			}
		} catch (err) {
			console.log('Login error:', err);
			let msg = 'Something went wrong. Please try again.';

			if (err.message === 'Request timed out') {
				msg = 'Login timed out. Please check your internet connection.';
			} else if (err.response?.data?.error) {
				msg = err.response.data.error;
			} else if (err.message === 'Network Error') {
				msg = 'Network error. Please check your internet and try again.';
			}
			setError(msg);
			setErrorVisible(true);
		} finally {
			setIsLoading(false);
		}
	};
	return (
		<SafeAreaView style={styles.safeArea}>
			<KeyboardAvoidingView
				style={styles.flex}
				behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
				keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}>
				<ScrollView
					contentContainerStyle={styles.container}
					keyboardShouldPersistTaps="handled">
					<View style={styles.imageContainer}>
						<Image
							source={require('../../assets/MEDLOGO.png')}
							style={styles.image}
						/>
					</View>

					{/* Email Input */}
					<View style={styles.inputContainer}>
						<Text style={styles.label}>Email</Text>
						<View
							style={[
								styles.inputWrapper,
								errors.userName && styles.errorBorder,
							]}>
							<MaterialCommunityIcons
								name="email-outline"
								size={20}
								color="#B5B5B5"
							/>
							<TextInput
								style={styles.input}
								placeholder="Enter Email"
								placeholderTextColor="#888888"
								keyboardType="email-address"
								autoCapitalize="none"
								value={userName}
								onChangeText={handleUserNameChange}
							/>
						</View>
						{errors.userName ? (
							<Text style={styles.errorText}>{errors.userName}</Text>
						) : null}
					</View>

					{/* Password Input */}
					<View style={styles.inputContainer}>
						<Text style={styles.label}>Password</Text>
						<View
							style={[
								styles.inputWrapper,
								errors.password && styles.errorBorder,
							]}>
							<Icon name="lock-closed-outline" size={20} color="#B5B5B5" />
							<TextInput
								style={styles.input}
								placeholder="Enter Password"
								placeholderTextColor="#888888"
								secureTextEntry={!passwordVisible}
								autoCapitalize="none"
								value={password}
								onChangeText={handlePasswordChange}
							/>
							<TouchableOpacity onPress={() => setPasswordVisible((v) => !v)}>
								<Icon
									name={passwordVisible ? 'eye' : 'eye-off'}
									size={20}
									color="#B5B5B5"
								/>
							</TouchableOpacity>
						</View>
						{errors.password ? (
							<Text style={styles.errorText}>{errors.password}</Text>
						) : null}
					</View>

					<TouchableOpacity
						style={{ alignSelf: 'flex-end' }}
						onPress={() => navigation.navigate('ForgetPassword')}>
						<Text style={styles.forgotPasswordText}>Forgot Password?</Text>
					</TouchableOpacity>

					{/* Login Button */}
					<TouchableOpacity
						style={[styles.loginButton, isLoading && styles.disabledButton]}
						onPress={handleUserLogin}
						disabled={isLoading}>
						{isLoading ? (
							<ActivityIndicator color="#000" />
						) : (
							<Text style={styles.loginButtonText}>Login</Text>
						)}
					</TouchableOpacity>

					{/* Signup Link */}
					<View style={styles.signUpContainer}>
						<Text style={styles.signUpText}>Don’t have an account?</Text>
						<TouchableOpacity onPress={() => navigation.navigate('UserSignup')}>
							<Text style={styles.signUpLink}> Sign up</Text>
						</TouchableOpacity>
					</View>

					{/* Error Modal */}
					<ErrorModal
						message={error}
						isVisible={errorVisible}
						onClose={() => setErrorVisible(false)}
					/>
				</ScrollView>
			</KeyboardAvoidingView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	flex: { flex: 1 },
	safeArea: { flex: 1, backgroundColor: '#fff' },
	container: {
		flexGrow: 1,
		justifyContent: 'center',
		alignItems: 'center',
		padding: 20,
	},
	imageContainer: { marginBottom: 30 },
	image: { width: 165, height: 140, resizeMode: 'contain' },
	inputContainer: { width: '100%', marginBottom: 15 },
	label: { fontSize: 16, fontWeight: '500', color: '#CBCBCB', marginBottom: 5 },
	inputWrapper: {
		flexDirection: 'row',
		alignItems: 'center',
		borderWidth: 1,
		borderColor: '#D1D5DB',
		borderRadius: 12,
		paddingHorizontal: 10,
		height: 56,
	},
	input: { flex: 1, marginLeft: 8, fontSize: 16, color: '#333' },
	errorBorder: { borderColor: '#E91111' },
	errorText: { fontSize: 12, color: '#E91111', marginTop: 5 },
	forgotPasswordText: {
		width: '100%',
		color: '#E91111',
		marginBottom: 20,
	},
	loginButton: {
		width: '100%',
		height: 50,
		backgroundColor: '#FFDC58',
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius: 30,
		marginBottom: 15,
	},
	disabledButton: { opacity: 0.6 },
	loginButtonText: { fontSize: 20, fontWeight: 'bold', color: '#000' },
	signUpContainer: { flexDirection: 'row', alignItems: 'center' },
	signUpText: { fontSize: 14, color: '#777' },
	signUpLink: {
		fontSize: 14,
		color: '#FFDC58',
		textDecorationLine: 'underline',
	},
});
