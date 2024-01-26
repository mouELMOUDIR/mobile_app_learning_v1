import React from "react";
import { View, StyleSheet, Text } from 'react-native';

const Note = ({ item }) => {
    const { title, Content } = item;
    return (
        <View style={styles.container}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.Content}>{Content}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        margin: 5,
        borderRadius: 8,
        backgroundColor: '#fff',
        width: '45%', // Adjust as per your layout needs
        minHeight: 100, // Adjust as per your layout needs
    },
    title: {
        fontWeight: 'bold',
        fontSize: 16,
        marginBottom: 5,
    },
    Content: {
        fontSize: 14,
    },
});

export default Note;
