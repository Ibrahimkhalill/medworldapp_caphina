import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import Navbar from '../component/Navbar';

const { height } = Dimensions.get('window');
const scrollViewHeight = height * 0.8;

const PrivacyPolicy = ({ navigation }) => {
	const { t } = useTranslation();

	return (
		<SafeAreaView style={styles.safeArea} className="px-5">
			<Navbar navigation_Name={'settings'} navigation={navigation} />
			<ScrollView
				contentContainerStyle={styles.scrollContainer}
				showsVerticalScrollIndicator={false}>
				<View style={styles.contentContainer}>
					{/* Title */}
					<Text style={styles.title}>{t('privacyPolicyTitle')}</Text>
					<View style={styles.privacyContainer}>
						{/* Effective Date */}
						<Text style={styles.effectiveDate}>{t('effectiveDate')}</Text>

						{/* Introduction */}
						<Text style={styles.text}>{t('introduction')}</Text>

						{/* Information We Collect */}
						<Text style={styles.header}>{t('informationWeCollect')}</Text>
						<Text style={styles.subHeader}>{t('personalData')}</Text>
						<Text style={styles.text}>{t('personalDataContent')}</Text>
						<Text style={styles.subHeader}>{t('usageData')}</Text>
						<Text style={styles.text}>{t('usageDataContent')}</Text>

						{/* How We Use Your Information */}
						<Text style={styles.header}>{t('howWeUseInfo')}</Text>
						<Text style={styles.text}>{t('howWeUseInfoContent')}</Text>

						{/* Data Storage and Security */}
						<Text style={styles.header}>{t('dataStorageSecurity')}</Text>
						<Text style={styles.text}>{t('dataStorageSecurityContent')}</Text>

						{/* Data Retention */}
						<Text style={styles.header}>{t('dataRetention')}</Text>
						<Text style={styles.text}>{t('dataRetentionContent')}</Text>

						{/* Third-Party Services */}
						<Text style={styles.header}>{t('thirdPartyServices')}</Text>
						<Text style={styles.text}>{t('thirdPartyServicesContent')}</Text>

						{/* International Data Transfers */}
						<Text style={styles.header}>{t('internationalDataTransfers')}</Text>
						<Text style={styles.text}>
							{t('internationalDataTransfersContent')}
						</Text>

						{/* Your Rights */}
						<Text style={styles.header}>{t('yourRights')}</Text>
						<Text style={styles.text}>{t('yourRightsContent')}</Text>

						{/* Children's Privacy */}
						<Text style={styles.header}>{t('childrensPrivacy')}</Text>
						<Text style={styles.text}>{t('childrensPrivacyContent')}</Text>

						{/* Contact Us */}
						<Text style={styles.header}>{t('contactUs')}</Text>
						<Text style={styles.text}>{t('contactUsContent')}</Text>

						{/* Changes to This Policy */}
						<Text style={styles.header}>{t('changesToPolicy')}</Text>
						<Text style={styles.text}>{t('changesToPolicyContent')}</Text>

						{/* Final Statement */}
						<Text style={styles.header}>{t('finalStatement')}</Text>
						<Text style={styles.text}>{t('finalStatementContent')}</Text>
					</View>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	safeArea: {
		flex: 1,
		backgroundColor: '#fff', // Light gray background for a modern look
	},
	scrollContainer: {
		flexGrow: 1,
		paddingBottom: 20,
	},
	contentContainer: {
		flexGrow: 1,
		justifyContent: 'center',
		alignItems: 'center',
		paddingBottom: 30,
	},
	title: {
		fontSize: 28,
		fontWeight: 'bold',
		color: '#333',
		marginVertical: 20,
		textAlign: 'center',
	},
	termsContainer: {
		marginBottom: 20,
		paddingHorizontal: 20,
	},
	header: {
		fontSize: 16,
		fontWeight: 'bold',

		marginVertical: 10,
	},
	effectiveDate: {
		fontSize: 14,
		fontWeight: 'bold',

		marginVertical: 10,
	},
	subHeader: {
		fontSize: 15,
		fontWeight: 'bold',
		color: '#333',
		marginTop: 10,
		marginBottom: 5,
	},
	text: {
		fontSize: 14,
		lineHeight: 24,
		color: '#444',
		marginVertical: 5,
	},
});

export default PrivacyPolicy;
