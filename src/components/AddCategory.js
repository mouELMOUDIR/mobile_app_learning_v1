import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';
import CategoryModel from '../models/CategoryModel';

const AddCategory = ({ navigation, route }) => {
    const [categoryName, setCategoryName] = useState('');
    const [imageURL, setImageURL] = useState('');

    const handleAddCategory = () => {
        // Validate input
        if (!categoryName.trim()) {
            alert('Please enter a category name');
            return;
        }

        // Create a new category object
        const newCategory = new CategoryModel(
            Math.random().toString(),
            categoryName,
            imageURL,
        );

        // Call the onCategoryAdd function passed through route params
        route.params.onCategoryAdd(newCategory);

        // Navigate back to CategoryList
        navigation.goBack();
    };

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="Category Name"
                value={categoryName}
                onChangeText={setCategoryName}
            />
            <TextInput
                style={styles.input}
                placeholder="Category Image URL"
                value={imageURL}
                onChangeText={setImageURL}
            />
            <Button
                title="Add Category"
                onPress={handleAddCategory}
                style={styles.button}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    input: {
        height: 40,
        borderColor: 'black',
        borderWidth: 5,
        marginBottom: 30,
        padding: 10,
        width: '80%',
    },
    button: {
        width: '80%',
        marginTop: 10,
    },
});
export default AddCategory;
