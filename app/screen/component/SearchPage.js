import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
	View,
	Text,
	Modal,
	TouchableOpacity,
	TextInput,
	StyleSheet,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import {
	SafeAreaView,
	useSafeAreaInsets,
} from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';

const SearchPage = ({
	isVisible,
	setIsVisible,
	data,
	setData,
	filterData,
	value,
}) => {
	const [search, setSearch] = useState('');
	const { t } = useTranslation();
	const insets = useSafeAreaInsets(); // Get SafeArea insets

	// Close the modal and reset search
	const closeSearchPage = () => {
		setIsVisible(false);
		setSearch('');
		setData(filterData); // Reset to the original dataset
	};

	// Filter the dataset dynamically based on search input
	const handleSearch = (searchValue) => {
		setSearch(searchValue);
		if (searchValue.trim()) {
			const filtered = filterData.filter((item) =>
				item[value]?.toLowerCase().includes(searchValue.toLowerCase())
			);
			setData(filtered);
		} else {
			setData(filterData); // Reset to the original dataset if input is cleared
		}
	};

	return (
		<Modal
			animationType="fade"
			transparent={true}
			visible={isVisible}
			onRequestClose={closeSearchPage}>
			<View style={styles.overlay}>
				<SafeAreaView style={styles.safeAreaContainer}>
					<Animatable.View
						animation="zoomIn"
						duration={500}
						easing="ease-out"
						style={[styles.container, { top: insets.top }]} // Offset by top inset
					>
						<View style={styles.searchBarContainer}>
							<View style={styles.searchBar}>
								<Ionicons name="search-outline" size={23} color="black" />
								<TextInput
									style={styles.input}
									placeholder={t('search')}
									onChangeText={handleSearch}
									value={search}
								/>
								{search && (
									<TouchableOpacity
										onPress={() => {
											setSearch('');
											setData(filterData); // Reset dataset
										}}>
										<Ionicons name="close-circle" size={23} color="black" />
									</TouchableOpacity>
								)}
							</View>
							<TouchableOpacity
								style={styles.cancelButton}
								onPress={closeSearchPage}>
								<Text style={styles.cancelText}>{t('cancel')}</Text>
							</TouchableOpacity>
						</View>
					</Animatable.View>
				</SafeAreaView>
			</View>
		</Modal>
	);
};

const styles = StyleSheet.create({
	overlay: {
		flex: 1,
		backgroundColor: 'rgba(0, 0, 0, 0.5)',
	},
	safeAreaContainer: {
		flex: 1,
		width: '100%',
	},
	container: {
		backgroundColor: 'white',
		width: '100%',
		padding: 20,
		position: 'absolute', // Position absolutely to stick to the top
		left: 0,
		right: 0,
	},
	searchBarContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		width: '100%',
	},
	searchBar: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: '#f5f5f5',
		borderRadius: 8,
		paddingHorizontal: 10,
		flex: 1,
		height: 50,
	},
	input: {
		flex: 1,
		fontSize: 16,
		paddingLeft: 10,
	},
	cancelButton: {
		marginLeft: 15,
	},
	cancelText: {
		color: '#f3ce47',
		fontSize: 14,
		fontWeight: '600',
	},
});

export default SearchPage;
