import React, { useEffect, useState } from 'react';

import * as Notifications from 'expo-notifications';
import {
	Text,
	View,
	Platform,
	TouchableOpacity,
	StyleSheet,
} from 'react-native';
import SimpleLineIcon from 'react-native-vector-icons/MaterialIcons';
import { useAuth } from '../authentication/Auth';
import axiosInstance from '../component/axiosInstance';
import useNotificationService from './notification/NotificationService';
import { useFocusEffect } from '@react-navigation/native';

function NotificationButton({ navigation }) {
	const { token } = useAuth();
	console.log('Notification Token:', token);

	const [notificationCount, setNotificationsCount] = useState(null);
	const { expoPushToken, notification } = useNotificationService();

	useEffect(() => {
		// Set up notification listener
		const notificationListener = Notifications.addNotificationReceivedListener(
			() => {
				console.log('Push notification received');
				fetchAndPlayNewNotifications(); // Call the API when a notification is received
			}
		);

		// Cleanup listener on unmount
		return () => {
			if (notificationListener) {
				Notifications.removeNotificationSubscription(notificationListener);
			}
		};
	}, [expoPushToken]);

	useEffect(() => {
		// Listener for when the notification is clicked
		const subscription = Notifications.addNotificationResponseReceivedListener(
			(response) => {
				navigation.navigate('Notification');
			}
		);

		// Cleanup listener on unmount
		return () => subscription.remove();
	}, [navigation]);

	async function fetchAndPlayNewNotifications() {
		try {
			const unreadResponse = await axiosInstance.get(
				'/notifications/unread-count/',
				{
					headers: {
						Authorization: `Token ${token}`,
					},
				}
			);
			setNotificationsCount(unreadResponse.data.unread_count);
			const response = await axiosInstance.get('/notifications/', {
				headers: {
					Authorization: `Token ${token}`,
				},
			});
		} catch (error) {
			console.error('Error fetching notifications', error);
		}
	}

	useFocusEffect(
		React.useCallback(() => {
			if (token) {
				fetchAndPlayNewNotifications(); // Fetch notifications when the token is available
			}
		}, [token])
	);
	console.log('Notification Count:', notificationCount);
	return (
		<TouchableOpacity
			onPress={() => navigation.navigate('Notification')}
			style={styles.iconContainer}>
			<SimpleLineIcon name="notifications-none" size={27} color="black" />
			{notificationCount > 0 && (
				<View style={styles.badge}>
					<Text style={styles.badgeText}>{notificationCount}</Text>
				</View>
			)}
		</TouchableOpacity>
	);
}

const styles = StyleSheet.create({
	partialBackground: {
		height: 170,
		width: '100%',
		alignSelf: 'center',
		borderRadius: 15,
		overflow: 'hidden',
	},
	safeArea: {
		flexGrow: 1,
		paddingBottom: 10,
		backgroundColor: 'white',
	},
	container: {
		flexDirection: 'row',
		alignItems: 'center',
		marginTop: 10,
	},
	progressBackground: {
		width: '70%',
		height: 10,
		backgroundColor: '#e0e0e0',
		borderRadius: 10,
		overflow: 'hidden',
		marginRight: 10,
	},
	iconContainer: {
		position: 'relative',
		marginRight: 6,
	},
	badge: {
		position: 'absolute',
		top: -2,
		right: -3,
		backgroundColor: 'red',
		borderRadius: 15,
		width: 15,
		height: 15,
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
	},
	badgeText: {
		color: 'white',
		fontSize: 10,
		fontWeight: 'bold',
	},
	progressBar: {
		height: '100%',
		backgroundColor: '#FCE488',
		borderRadius: 10,
	},
	percentageText: {
		fontSize: 14,
		color: '#333',
		fontWeight: 'bold',
	},
	shadow: {
		...Platform.select({
			ios: {
				shadowColor: '#000',
				shadowOffset: { width: 0, height: 4 },
				shadowOpacity: 0.3,
				shadowRadius: 6,
			},
			android: {
				elevation: 4,
			},
		}),
		margin: 5,
		padding: 10,
		backgroundColor: 'white',
		borderRadius: 5,
	},
	circle: {
		width: 205,
		height: 204,
		borderRadius: 100, // Keeps the outer circle rounded
		backgroundColor: '#ffff',
		justifyContent: 'center',
		alignItems: 'center',
		position: 'relative', // For absolute positioning of quadrants
	},
	quadrant: {
		position: 'absolute',
		width: '49%', // Reduced size to allow 3px gap
		height: '49%', // Reduced size to allow 3px gap
		justifyContent: 'center',
		alignItems: 'center',
	},
	topLeft: {
		top: 0,
		left: 0,

		backgroundColor: '#FFDC584D',
		borderTopLeftRadius: 100, // Top-left quadrant rounded
	},
	topRight: {
		top: 0,
		right: 0,
		backgroundColor: '#FFDC58',
		borderTopRightRadius: 100,
	},
	bottomLeft: {
		bottom: 0,
		left: 0,
		backgroundColor: '#FFDC5880',
		borderBottomLeftRadius: 100, // Bottom-left quadrant rounded
	},
	bottomRight: {
		bottom: 0,
		right: 0,
		backgroundColor: '#FFDC58B2',
		borderBottomRightRadius: 100, // Bottom-right quadrant rounded
	},
	text: {
		fontSize: 11,
		color: 'black',
		fontWeight: 'bold',
	},

	buttonText: {
		fontSize: 14,
		color: 'black',
		fontWeight: 'bold',
	},
	gap: {
		position: 'absolute',
		top: '25%', // Positioning the gap
		left: '25%', // Positioning the gap
		width: '50%', // Filling the center
		height: '50%', // Filling the center
		borderRadius: 50, // Keeps the gap circular
	},
});

export default NotificationButton;
