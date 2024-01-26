import React, { useState } from 'react';
import { View, TextInput, Button,StyleSheet } from 'react-native';
import ObjectModel from '../models/ObjectModel';

const AddObject = ({ navigation, route }) => {
    const { parentObject, categoryID } = route.params;
    const [objectName, setObjectName] = useState('');
    const [imageUri, setImageUri] = useState('');
    const [audioUri, setAudioUri] = useState('');

    const handleAddObject = () => {
        // Validate input
        if (!objectName.trim()) {
            alert('Please enter an object name');
            return;
        }

        // Retrieve the category ID from the route params
        const categoryId = categoryID;



        // Create a new object object with the CategoryID
        const newObject = new ObjectModel(
            Math.random().toString(),
            objectName,
            categoryId,
            imageUri,
            audioUri,
            parentObject?.id,


        );

        // Call the onObjectAdd function passed through route params
        route.params.onObjectAdd(newObject);
        console.log('Received category:', parentObject);
        console.log('Extracted categoryId:', categoryId);

        // Navigate back to ObjectList
        navigation.goBack();
    };

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="Object Name"
                value={objectName}
                onChangeText={setObjectName}
            />
            <TextInput
                style={styles.input}
                placeholder="Object Image URL"
                value={imageUri}
                onChangeText={setImageUri}
            />
            {/* Add a TextInput for AudioUri if applicable */}
            <TextInput
                style={styles.input}
                placeholder="Object Audio URL"
                value={audioUri}
                onChangeText={setAudioUri}
            />
            <Button 
                title="Add Object"
                onPress={handleAddObject}
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

export default AddObject;
