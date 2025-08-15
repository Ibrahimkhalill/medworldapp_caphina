import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Modal,
    FlatList,
    StyleSheet,
} from 'react-native';

const genderOptions = [
    { label: 'Female', value: 'Female' },
    { label: 'Male', value: 'Male' },
    { label: 'Rather not say', value: 'Rather not say' },
];

const CustomDropdown = ({ selectedValue, onValueChange, disabled = false }) => {
    const [visible, setVisible] = useState(false);

    const selectedLabel = genderOptions.find(opt => opt.value === selectedValue)?.label;

    const handleSelect = (item) => {
        onValueChange(item.value); // Update parent state
        setVisible(false); // Close dropdown
    };

    return (
        <View>
            {/* Dropdown button */}
            <TouchableOpacity
                style={[styles.dropdown, { backgroundColor: disabled ? '' : '#fff' }]}
                onPress={() => !disabled && setVisible(true)}
                activeOpacity={0.7}
            >
                <Text style={{ color: selectedLabel ? '#000' : '#999' }}>
                    {selectedLabel || 'Select Gender'}
                </Text>
            </TouchableOpacity>

            {/* Modal with options */}
            <Modal visible={visible} transparent animationType="slide">
                <TouchableOpacity
                    style={styles.modalOverlay}
                    onPress={() => setVisible(false)}
                    activeOpacity={1}
                >
                    <View style={styles.modalContent}>
                        <FlatList
                            data={genderOptions}
                            keyExtractor={(item) => item.value}
                            renderItem={({ item }) => {
                                const isSelected = item.value === selectedValue;
                                return (
                                    <TouchableOpacity
                                        style={[
                                            styles.option,
                                            isSelected && styles.selectedOption, // highlight selected item
                                        ]}
                                        onPress={() => handleSelect(item)}
                                    >
                                        <Text style={{ color: isSelected ? '#fff' : '#000' }}>
                                            {item.label}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            }}
                        />
                    </View>
                </TouchableOpacity>
            </Modal>
        </View>
    );
};

export default CustomDropdown;

const styles = StyleSheet.create({
    dropdown: {
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 5,
        borderRadius: 12,
        borderColor: "#D1D5DB",
        paddingHorizontal: 10,
        paddingVertical: 19,
        marginVertical: 8,
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.4)',
    },
    modalContent: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 15,
        maxHeight: 250,
    },
    option: {
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderBottomWidth: 1,
        borderColor: '#eee',
    },
    option: {
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderBottomWidth: 1,
        borderColor: '#eee',
        borderRadius: 10,
    },

    selectedOption: {
        backgroundColor: '#d6c80eff', // You can use your theme color
    },
});
