import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function NoInternetScreen({ onRetry }) {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>No Internet Connection</Text>
            <Text style={styles.subtitle}>
                Please check your internet connection and try again.
            </Text>
            <TouchableOpacity style={styles.button} onPress={onRetry}>
                <Text style={styles.buttonText}>Retry</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        marginBottom: 20,
        textAlign: 'center',
    },
    button: {
        backgroundColor: '#FFDC58',
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 25,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000',
    },
});
