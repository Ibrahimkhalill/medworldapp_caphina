import React, { useState } from 'react';
import {
	View,
	Text,
	TouchableOpacity,
	StyleSheet,
	ScrollView,
	Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next'; // Import i18next hook for translations
import Navbar from '../component/Navbar'; // Assuming Navbar component is available

const { height } = Dimensions.get('window'); // Get screen height

const TermsAndCondition = ({ navigation }) => {
	const { t } = useTranslation(); // Destructure to get translation function

	return (
		<SafeAreaView style={styles.safeArea}>
			<Navbar navigation_Name={'settings'} navigation={navigation} />

			<ScrollView
				contentContainerStyle={{ flexGrow: 1 }}
				showsVerticalScrollIndicator={false}>
				<View style={styles.contentContainer}>
					{/* Title */}
					<Text style={styles.title}>{t('termsAndConditionsTitle')}</Text>
					<View style={styles.termsContainer}>
						{/* Terms and Conditions Content */}
						<Text style={styles.effectiveDate}>{t('effectiveDate')}</Text>

						<Text style={styles.header}>{t('definitions')}</Text>
						<Text style={styles.text}>{t('definitionsContent')}</Text>

						<Text style={styles.header}>{t('generalInformation')}</Text>
						<Text style={styles.text}>{t('generalInformationContent')}</Text>

						<Text style={styles.header}>{t('acceptanceOfTerms')}</Text>
						<Text style={styles.text}>{t('acceptanceOfTermsContent')}</Text>

						<Text style={styles.header}>{t('licenseAndUse')}</Text>
						<Text style={styles.text}>{t('licenseAndUseContent')}</Text>

						<Text style={styles.header}>{t('subscriptionAndPayment')}</Text>
						<Text style={styles.text}>
							{t('subscriptionAndPaymentContent')}
						</Text>

						<Text style={styles.header}>{t('dataOwnershipPrivacy')}</Text>
						<Text style={styles.text}>{t('dataOwnershipPrivacyContent')}</Text>

						<Text style={styles.header}>{t('userResponsibility')}</Text>
						<Text style={styles.text}>{t('userResponsibilityContent')}</Text>

						<Text style={styles.header}>{t('intellectualProperty')}</Text>
						<Text style={styles.text}>{t('intellectualPropertyContent')}</Text>

						<Text style={styles.header}>{t('disclaimer')}</Text>
						<Text style={styles.text}>{t('disclaimerContent')}</Text>

						<Text style={styles.header}>{t('thirdPartyContent')}</Text>
						<Text style={styles.text}>{t('thirdPartyContentContent')}</Text>

						<Text style={styles.header}>{t('limitationOfLiability')}</Text>
						<Text style={styles.text}>{t('limitationOfLiabilityContent')}</Text>

						<Text style={styles.header}>{t('suspensionTermination')}</Text>
						<Text style={styles.text}>{t('suspensionTerminationContent')}</Text>

						<Text style={styles.header}>{t('modificationsService')}</Text>
						<Text style={styles.text}>{t('modificationsServiceContent')}</Text>

						<Text style={styles.header}>{t('regionalCompliance')}</Text>
						<Text style={styles.text}>{t('regionalComplianceContent')}</Text>

						<Text style={styles.header}>{t('contactInformation')}</Text>
						<Text style={styles.text}>{t('contactInformationContent')}</Text>

						<Text style={styles.header}>{t('finalProvisions')}</Text>
						<Text style={styles.text}>{t('finalProvisionsContent')}</Text>

						<Text style={styles.text}>{t('acknowledgmentContent')}</Text>
					</View>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	safeArea: {
		flexGrow: 1,
		backgroundColor: 'white',
		padding: 10,
	},
	languageSelectionContainer: {
		flexDirection: 'row',
		justifyContent: 'space-evenly',
		marginVertical: 10,
	},
	languageButton: {
		fontSize: 16,
		color: '#007BFF',
		fontWeight: 'bold',
	},
	contentContainer: {
		flexGrow: 1,
		justifyContent: 'center',
		alignItems: 'center',
		paddingBottom: 30,
	},
	title: {
		fontSize: 24,
		fontWeight: 'bold',
		marginBottom: 20,
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
		fontSize: 15,
		fontWeight: 'bold',

		marginVertical: 10,
	},
	text: {
		fontSize: 14,
		lineHeight: 24,
		color: 'black',
		marginVertical: 5,
	},
});

export default TermsAndCondition;
