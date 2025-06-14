import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
	const [isLoggedIn, setLoggedIn] = useState(false);
	const [token, setToken] = useState(null);

	const checkAuthentication = async () => {
		try {
			const storedUsername = await AsyncStorage.getItem('username');
			const storedToken = await AsyncStorage.getItem('token');
			console.log('checkAuthentication:', storedUsername, storedToken);
			if (storedUsername && storedToken) {
				setLoggedIn(true);
				setToken(storedToken);
			} else {
				setLoggedIn(false);
				setToken(null);
			}
		} catch (error) {
			console.error('Error reading from AsyncStorage:', error);
		}
	};

	useEffect(() => {
		checkAuthentication();
	}, []);

	const login = async (username, token) => {
		try {
			await AsyncStorage.setItem('username', username);
			await AsyncStorage.setItem('token', token);
			await AsyncStorage.setItem('notificationSound', JSON.stringify(true));
			setLoggedIn(true);
			setToken(token);
		} catch (error) {
			console.error('Error saving to AsyncStorage:', error);
		}
	};

	const logout = async () => {
		try {
			await AsyncStorage.removeItem('username');
			await AsyncStorage.removeItem('token');
			setLoggedIn(false);
			setToken(null);
		} catch (error) {
			console.error('Error clearing AsyncStorage:', error);
		}
	};

	return (
		<AuthContext.Provider
			value={{ isLoggedIn, token, login, logout, setLoggedIn, setToken }}>
			{children}
		</AuthContext.Provider>
	);
};

const useAuth = () => useContext(AuthContext);

export { AuthProvider, useAuth };
