import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, FlatList, StyleSheet,Modal } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';


const ObjectDetails = ({ route, navigation }) => {
    const { parentObject } = route.params;
    const [objects, setObjects] = useState([]);
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (parentObject && parentObject.id) {
            // Fetch objects based on parentObject.id
            fetchObjects(parentObject.id);
        } else {
            console.error('Parent object or its ID is undefined');
        }
    }, [parentObject]);

    const fetchObjects = async (parentObjectID) => {
        try {
            console.log('ParentObjectID:', parentObjectID);
            const response = await fetch(`http://192.168.0.157:3000/getObjectsByParentObject/${parentObjectID}`);
            const data = await response.json();
            console.log('API Response:', data); // Log the response
            if (Array.isArray(data)) {
                setObjects(data);
                return data;
            } else {
                console.error('Invalid server response format:', data);
            }
        } catch (error) {
            console.error('Error fetching objects:', error);
        }
    };

    const handleAddChildObject = () => {
        // Navigate to the AddObjectInObject component
        navigation.navigate('AddObjectInObject', {
            parentObject: parentObject,
            categoryID: parentObject?.CategoryID, // Pass the CategoryID
            onObjectAdd: handleObjectAdd,
        });
        console.log('Navigating to AddObjectInObject with parentObject:', parentObject);
    };

    const handleObjectAdd = useCallback(async (newObject) => {
    try {
        const response = await fetch('http://192.168.0.157:3000/addObject', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                Name: newObject.Name,
                CategoryID: newObject.CategoryID,
                ImageUri: newObject.ImageUri,
                AudioUri: newObject.AudioUri,
                ParentObjectID: newObject.ParentObjectID,
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Server responded with an error:', response.status, response.statusText, errorData);
            throw new Error('Network request failed');
        }

        const result = await response.json();
        const updatedObjects = await fetchObjects(newObject.ParentObjectID);
        setObjects(updatedObjects);
        console.log('Server response:', result);
    } catch (error) {
        console.error('Error making the API request:', error.message);
    }
}, []);

    const handleDeleteObject = useCallback(async (objectId) => {
        try {
            // Check if the object has associated objects
            const checkResponse = await fetch(`http://192.168.0.157:3000/checkObjectObjects/${objectId}`);
            const { objectCount } = await checkResponse.json();

            if (objectCount > 0) {
                setMessage('Object has associated objects. Delete objects first.');
                return;
            }

            // Proceed to delete the object
            const deleteResponse = await fetch(`http://192.168.0.157:3000/deleteObject/${objectId}`, {
                method: 'DELETE',
            });

            const data = await deleteResponse.json();
            console.log(data.message);

            // Remove the deleted object from the state
            setObjects((prevObjects) =>
                prevObjects.filter((object) => object.id !== objectId)
            );
            // Clear the message after successful deletion
            setMessage('');
        } catch (error) {
            console.error('Error deleting Object:', error);
        }
    }, []);

    

    const renderObjects = (parentObject) => {
        return (
            <View key={parentObject.id}>
                <TouchableOpacity
                    style={styles.objectItem}
                    onPress={() => handleParentObjectPress(parentObject)}
                >
                    <Image source={{ uri: parentObject.ImageUri }} style={styles.objectImage} />
                    <Text style={styles.objectName}>{parentObject.Name}</Text>
                </TouchableOpacity>
                {parentObject.Children.map(renderObjects)}
            </View>
        );
    };

    const handleParentObjectPress = (parentObject) => {
        if (parentObject) {
            navigation.navigate('ObjectDetails', {
                parentObject: parentObject,
                onObjectAdd: handleObjectAdd,
            });
        } else {
            console.error('Parent object is undefined');
        }
    };

    const handleNote = useCallback(async (newCategory) => { })

    const renderItem = ({ item }) => {
        console.log('Rendering Item:', item);
        return (
            <TouchableOpacity
                style={styles.objectItem}
                onPress={() => handleParentObjectPress(item)}
            >
                <Image source={{ uri: item.ImageUri }} style={styles.objectImage} />
                <Text style={styles.objectName}>{item.Name}</Text>
                <TouchableOpacity
                    onPress={() => handleNote(item.id)}
                >
                    <Feather name="file-text" size={24} color="black" />
                    {/* Adjust the name, size, and color as needed */}
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => handleDeleteObject(item.id)}
                >
                    <Feather name="trash-2" size={24} color="red" />
                    {/* Adjust the name, size, and color as needed */}
                </TouchableOpacity>
            </TouchableOpacity>
        );
    };

    const handleCategoryPress = (category) => {
        // Assuming you have the hierarchy information available
        const hierarchy = category.hierarchy || [];
        hierarchy.push(category.name);

        navigation.navigate('ObjectList', {
            category,
            hierarchy,
        });
    };

    return (
        <View style={{ flex: 1 }}>
            <FlatList
                data={objects}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderItem}
                contentContainerStyle={styles.listContainer}
            />
            <TouchableOpacity
                onPress={handleAddChildObject}
                style={styles.addButton}
            >
                <Text style={styles.addButtonText}>ADD OBJECT</Text>
            </TouchableOpacity>
            {/* Message container */}
            <Modal
                visible={!!message}
                transparent
                animationType="slide"
                onRequestClose={() => setMessage('')}
            >
                <View style={styles.messageContainer}>
                    <Text style={styles.messageText}>{message}</Text>
                    <TouchableOpacity
                        onPress={() => setMessage('')}
                        style={styles.closeButton}
                    >
                        <Text style={styles.closeButtonText}>Close</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    listContainer: {
        padding: 16,
    },
    objectItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        backgroundColor: '#F8F8F8', // Light gray background
        padding: 16,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    objectImage: {
        width: 60,
        height: 60,
        borderRadius: 30,
        marginRight: 16,
    },
    objectName: {
        fontSize: 18,
        fontWeight: 'bold',
        flex: 1,
        color: '#333', // Dark gray text color
    },
    addButton: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        backgroundColor: '#28AC', // Green button color
        padding: 14,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    addButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    deleteButton: {
        backgroundColor: 'red',
        padding: 5,
        height: 30,
        width: 20,
        borderRadius: 8,
        marginLeft: 19,
    },
    deleteButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    // Message container styles
    messageContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
    },
    messageText: {
        color: 'white',
        fontSize: 18,
        textAlign: 'center',
        marginBottom: 20,
    },
    closeButton: {
        backgroundColor: '#28AC', // Green button color
        padding: 10,
        borderRadius: 8,
    },
    closeButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
});

export default ObjectDetails;
