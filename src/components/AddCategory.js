import React, { useState } from 'react';
import { View, TextInput, Button, Image } from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import CategoryModel from '../models/CategoryModel';

const AddCategory = ({ navigation, route }) => {
    const [categoryName, setCategoryName] = useState('');
    const [imageURL, setImageURL] = useState('');

    const handlePickImage = () => {
        // Launch the image library to pick an image
        launchImageLibrary({ mediaType: 'photo' }, response => {
            if (!response.didCancel) {
                // Image picked successfully, update imageURL state
                setImageURL(response.uri);
            }
        });
    };

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
        <View>
            <TextInput
                placeholder="Category Name"
                value={categoryName}
                onChangeText={setCategoryName}
            />
            <Button title="Pick Image" onPress={handlePickImage} />
            {imageURL !== '' && <Image source={{ uri: imageURL }} style={{ width: 200, height: 200 }} />}
            <Button title="Add Category" onPress={handleAddCategory} />
        </View>
    );
};

export default AddCategory;
