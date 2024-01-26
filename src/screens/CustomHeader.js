import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const CustomHeader = ({ title }) => {
    return (
        <View style={styles.headerContainer}>
            <Text style={styles.headerTitle}>{title}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        backgroundColor: '#28AC', // Customize header background color
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff', // Customize header text color
    },
});

export default CustomHeader;