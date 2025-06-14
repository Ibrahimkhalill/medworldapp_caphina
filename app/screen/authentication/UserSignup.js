import React, { useEffect, useState, useRef } from 'react';
import {
	Text,
	View,
	TextInput,
	ToastAndroid,
	TouchableOpacity,
	Platform,
	ActivityIndicator,
	StyleSheet,
	Image,
	ScrollView,
	Alert,
	KeyboardAvoidingView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { SafeAreaView } from 'react-native-safe-area-context';
import axiosInstance from '../component/axiosInstance';

const passwordCriteria = [
	{ label: 'At least 8 characters.', check: (pw) => pw.length >= 8 },
	{
		label: 'Contains at least one letter.',
		check: (pw) => /[A-Za-z]/.test(pw),
	},
	{ label: 'Contains at least one digit.', check: (pw) => /\d/.test(pw) },
	{
		label: 'Contains at least one special character.',
		check: (pw) => /[@$!%*?&]/.test(pw),
	},
];

const PasswordCriteria = ({ password }) => (
	<View style={styles.criteriaContainer}>
		{passwordCriteria.map((c, i) => {
			const valid = c.check(password);
			return (
				<View key={i} style={styles.criteriaItem}>
					<Icon
						name={valid ? 'checkmark-circle' : 'close-circle'}
						size={16}
						color={valid ? 'green' : 'red'}
						style={{ marginRight: 5 }}
					/>
					<Text style={{ color: valid ? 'green' : 'red' }}>{c.label}</Text>
				</View>
			);
		})}
	</View>
);

export default function UserSignup({ navigation }) {
	const [formData, setFormData] = useState({
		userName: '',
		specialty: '',
		residencyDuration: '',
		residencyYear: '',
		email: '',
		password: '',
		confirmPassword: '',
	});
	const [errors, setErrors] = useState({});
	const [emailExistError, setEmailExistError] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [passwordVisible, setPasswordVisible] = useState(false);
	const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
	const debounceRef = useRef(null);
	const scrollRef = useRef(null);

	const notify = (msg) => {
		if (Platform.OS === 'android') {
			ToastAndroid.showWithGravity(msg, ToastAndroid.SHORT, ToastAndroid.TOP);
		} else {
			Alert.alert('Warning', msg);
		}
	};

	const validateEmail = (email) =>
		/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[A-Za-z]{2,}$/.test(email);

	const validatePassword = (pw) =>
		/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/.test(pw);

	const checkEmailAvailability = (email) => {
		clearTimeout(debounceRef.current);
		debounceRef.current = setTimeout(async () => {
			if (!validateEmail(email)) {
				setEmailExistError('');
				return;
			}
			try {
				const { data } = await axiosInstance.post('/check-email/', { email });
				setEmailExistError(
					data.exists ? 'This email is already registered.' : ''
				);
			} catch {
				setErrors((e) => ({ ...e, email: 'Could not verify email.' }));
			}
		}, 500);
	};

	const handleTextChange = (field, value) => {
		setFormData((f) => ({ ...f, [field]: value }));
		setErrors((e) => ({ ...e, [field]: '' }));
		if (field === 'email') {
			if (validateEmail(value)) {
				setErrors((e) => ({ ...e, email: '' }));
				checkEmailAvailability(value);
			} else {
				setErrors((e) => ({ ...e, email: 'Enter a valid email.' }));
				setEmailExistError('');
			}
		}
		if (field === 'password' && !validatePassword(value)) {
			setErrors((e) => ({
				...e,
				password:
					'Password must be 8+ chars, include a letter, a number & a special char.',
			}));
		}
		if (field === 'confirmPassword' && value !== formData.password) {
			setErrors((e) => ({ ...e, confirmPassword: 'Passwords do not match.' }));
		}
	};

	const handleSignup = async () => {
		const newErrors = {};
		Object.entries(formData).forEach(([k, v]) => {
			if (!v.trim())
				newErrors[k] = `${k
					.replace(/([A-Z])/g, ' $1')
					.replace(/^./, (s) => s.toUpperCase())} is required.`;
		});
		if (formData.email && !validateEmail(formData.email))
			newErrors.email = 'Invalid email.';
		if (formData.password && !validatePassword(formData.password))
			newErrors.password =
				'Password must be 8+ chars, include a letter, number & special char.';
		if (formData.password !== formData.confirmPassword)
			newErrors.confirmPassword = 'Passwords do not match.';

		setErrors(newErrors);
		if (Object.keys(newErrors).length > 0 || errors.email || emailExistError) {
			return;
		}

		setIsLoading(true);
		try {
			const resp = await axiosInstance.post('/send-otp/', {
				email: formData.email,
			});
			if (resp.status === 200) {
				navigation.navigate('OTP', { formData });
			}
		} catch (err) {
			const msg =
				err.response?.data?.error || 'Network/server error. Try again.';
			notify(msg);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		const unsubBlur = navigation.addListener('blur', () => {
			setFormData({
				userName: '',
				specialty: '',
				residencyDuration: '',
				residencyYear: '',
				email: '',
				password: '',
				confirmPassword: '',
			});
			setErrors({});
			setEmailExistError('');
		});
		const unsubFocus = navigation.addListener('focus', () => {
			scrollRef.current?.scrollTo({ y: 0, animated: true });
		});
		return () => {
			unsubBlur();
			unsubFocus();
		};
	}, [navigation]);

	return (
		<SafeAreaView style={styles.safeArea}>
			<KeyboardAvoidingView
				style={{ flex: 1 }}
				behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
				<ScrollView
					ref={scrollRef}
					contentContainerStyle={{ flexGrow: 1 }}
					keyboardShouldPersistTaps="handled">
					<View style={styles.container}>
						<View style={styles.logoWrap}>
							<Image
								source={require('../../assets/MEDLOGO.png')}
								style={styles.logo}
							/>
						</View>
						<Text style={styles.title}>Create an Account</Text>
						<Text style={styles.subtitle}>
							Sign up now to get started on your journey.
						</Text>

						{/* Username */}
						<View style={styles.inputGroup}>
							<Text style={styles.label}>Username</Text>
							<View
								style={[
									styles.inputWrap,
									errors.userName && styles.errorBorder,
								]}>
								<Icon name="person-outline" size={20} color="#888" />
								<TextInput
									style={styles.input}
									placeholder="Enter Name"
									placeholderTextColor="#888"
									value={formData.userName}
									onChangeText={(v) => handleTextChange('userName', v)}
								/>
							</View>
							{errors.userName && (
								<Text style={styles.errorText}>{errors.userName}</Text>
							)}
						</View>

						{/* Specialty */}
						<View style={styles.inputGroup}>
							<Text style={styles.label}>Specialty</Text>
							<View
								style={[
									styles.inputWrap,
									errors.specialty && styles.errorBorder,
								]}>
								<TextInput
									style={styles.input}
									placeholder="Enter Specialty"
									placeholderTextColor="#888"
									value={formData.specialty}
									onChangeText={(v) => handleTextChange('specialty', v)}
								/>
							</View>
							{errors.specialty && (
								<Text style={styles.errorText}>{errors.specialty}</Text>
							)}
						</View>

						{/* Residency */}
						<View style={styles.doubleRow}>
							<View style={styles.halfInput}>
								<Text style={styles.label}>Residency Duration</Text>
								<View
									style={[
										styles.inputWrap,
										errors.residencyDuration && styles.errorBorder,
									]}>
									<TextInput
										style={styles.input}
										placeholder="Years"
										placeholderTextColor="#888"
										keyboardType="numeric"
										maxLength={1}
										value={formData.residencyDuration}
										onChangeText={(v) =>
											handleTextChange('residencyDuration', v)
										}
									/>
								</View>
								{errors.residencyDuration && (
									<Text style={styles.errorText}>
										{errors.residencyDuration}
									</Text>
								)}
							</View>
							<View style={styles.halfInput}>
								<Text style={styles.label}>Year of Residency</Text>
								<View
									style={[
										styles.inputWrap,
										errors.residencyYear && styles.errorBorder,
									]}>
									<TextInput
										style={styles.input}
										placeholder="Current Year"
										placeholderTextColor="#888"
										keyboardType="numeric"
										maxLength={2}
										value={formData.residencyYear}
										onChangeText={(v) => handleTextChange('residencyYear', v)}
									/>
								</View>
								{errors.residencyYear && (
									<Text style={styles.errorText}>{errors.residencyYear}</Text>
								)}
							</View>
						</View>

						{/* Email */}
						<View style={styles.inputGroup}>
							<Text style={styles.label}>Email</Text>
							<View
								style={[
									styles.inputWrap,
									(errors.email || emailExistError) && styles.errorBorder,
								]}>
								<MaterialCommunityIcons
									name="email-outline"
									size={20}
									color="#888"
								/>
								<TextInput
									style={styles.input}
									placeholder="Enter Email"
									placeholderTextColor="#888"
									autoCapitalize="none"
									keyboardType="email-address"
									value={formData.email}
									onChangeText={(v) => handleTextChange('email', v)}
								/>
							</View>
							{(errors.email || emailExistError) && (
								<Text style={styles.errorText}>
									{errors.email || emailExistError}
								</Text>
							)}
						</View>

						{/* Password */}
						<View style={styles.inputGroup}>
							<Text style={styles.label}>Password</Text>
							<View
								style={[
									styles.inputWrap,
									errors.password && styles.errorBorder,
								]}>
								<Icon name="lock-closed-outline" size={20} color="#888" />
								<TextInput
									style={styles.input}
									placeholder="Enter Password"
									placeholderTextColor="#888"
									secureTextEntry={!passwordVisible}
									autoCapitalize="none"
									value={formData.password}
									onChangeText={(v) => handleTextChange('password', v)}
								/>
								<TouchableOpacity onPress={() => setPasswordVisible((v) => !v)}>
									<Icon
										name={passwordVisible ? 'eye' : 'eye-off'}
										size={20}
										color="#888"
									/>
								</TouchableOpacity>
							</View>
							{formData.password.length > 0 && (
								<PasswordCriteria password={formData.password} />
							)}
						</View>

						{/* Confirm Password */}
						<View style={styles.inputGroup}>
							<Text style={styles.label}>Confirm Password</Text>
							<View
								style={[
									styles.inputWrap,
									errors.confirmPassword && styles.errorBorder,
								]}>
								<Icon name="lock-closed-outline" size={20} color="#888" />
								<TextInput
									style={styles.input}
									placeholder="Confirm Password"
									placeholderTextColor="#888"
									secureTextEntry={!confirmPasswordVisible}
									autoCapitalize="none"
									value={formData.confirmPassword}
									onChangeText={(v) => handleTextChange('confirmPassword', v)}
								/>
								<TouchableOpacity
									onPress={() => setConfirmPasswordVisible((v) => !v)}>
									<Icon
										name={confirmPasswordVisible ? 'eye' : 'eye-off'}
										size={20}
										color="#888"
									/>
								</TouchableOpacity>
							</View>
							{errors.confirmPassword && (
								<Text style={styles.errorText}>{errors.confirmPassword}</Text>
							)}
						</View>

						{/* Sign Up */}
						<TouchableOpacity
							style={styles.button}
							onPress={handleSignup}
							disabled={isLoading}>
							{isLoading ? (
								<ActivityIndicator color="#000" />
							) : (
								<Text style={styles.buttonText}>Sign Up</Text>
							)}
						</TouchableOpacity>

						<View style={styles.footer}>
							<Text style={styles.footerText}>Already have an account?</Text>
							<TouchableOpacity
								onPress={() => navigation.navigate('UserLogin')}>
								<Text style={styles.footerLink}> Log In</Text>
							</TouchableOpacity>
						</View>
					</View>
				</ScrollView>
			</KeyboardAvoidingView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	safeArea: { flex: 1, backgroundColor: '#fff' },
	container: {
		flex: 1,
		padding: 20,
		backgroundColor: '#fff',
	},
	logoWrap: {
		alignItems: 'center',
		marginBottom: 30,
	},
	logo: { width: 100, height: 80, resizeMode: 'contain' },
	title: { fontSize: 24, fontWeight: '700', marginBottom: 4 },
	subtitle: { marginBottom: 20, color: '#555' },
	inputGroup: { marginBottom: 15 },
	label: { marginBottom: 5, fontSize: 16, color: '#555' },
	inputWrap: {
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
	errorText: { color: 'red', marginTop: 5, fontSize: 12 },
	doubleRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginBottom: 15,
	},
	halfInput: { width: '48%' },
	button: {
		backgroundColor: '#FFDC58',
		height: 50,
		borderRadius: 30,
		justifyContent: 'center',
		alignItems: 'center',
		marginTop: 10,
	},
	buttonText: { fontSize: 20, fontWeight: 'bold', color: '#000' },
	footer: {
		flexDirection: 'row',
		justifyContent: 'center',
		marginTop: 15,
	},
	footerText: { color: '#777' },
	footerLink: {
		color: '#FFDC58',
		marginLeft: 4,
		textDecorationLine: 'underline',
	},
	criteriaContainer: { marginTop: 10, paddingLeft: 10 },
	criteriaItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
});
