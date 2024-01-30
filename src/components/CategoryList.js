import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, FlatList, StyleSheet, Modal, Animated , StatusBar} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';


const SampleData = [
    // new CategoryModel("1", "House", "https://imgs.search.brave.com/NhxG3cdCLJCZWSb7p4WZ6Aq0Me_bYdd3nD5pPH2yT1o/rs:fit:500:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvMTI3/MjEyODUzMC9waG90/by9ob21lLXdpdGgt/Ymx1ZS1zaWRpbmct/YW5kLXN0b25lLWZh/JUMzJUE3YWRlLW9u/LWJhc2Utb2YtaG9t/ZS5qcGc_cz02MTJ4/NjEyJnc9MCZrPTIw/JmM9Mm52LTkzY3Fh/a0dDdlZRMUNNYXZ4/X28xNEhTQnJ1Q0R3/S2R2M0xsaDVFaz0"),
];

const CategoryList = () => {
    const navigation = useNavigation();
    const [categories, setCategories] = useState(SampleData);
    const [message, setMessage] = useState('');

    useEffect(() => {
        // Fetch categories from the server when the component mounts
        fetch('http://192.168.0.157:3000/getCategories')
            .then(response => response.json())
            .then(data => setCategories(data))
            .catch(error => console.error('Error fetching categories:', error));
    }, []);

    const handleAddCategory = () => {
        // Navigate to the AddCategory component
        navigation.navigate('AddCategory', {
            onCategoryAdd: handleCategoryAdd,
        });
    };

    const fetchCategories = async () => {
        try {
            const response = await fetch('http://192.168.0.157:3000/getCategories');
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching categories:', error);
            return [];
        }
    };

    const handleCategoryAdd = useCallback(async (newCategory) => {
        try {
            // Make a POST request to add the category to the server
            const response = await fetch('http://192.168.0.157:3000/addCategory', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: newCategory.name,
                    imageURL: newCategory.imageURL,
                }),
            });

            if (!response.ok) {
                throw new Error('Network request failed');
            }

            const result = await response.json();

            // Check if the server response includes a success message
            if (result.message && result.message.includes('Category added successfully')) {
                // Fetch the updated list of categories from the server
                const updatedCategories = await fetchCategories();

                // Update state with the new list of categories
                setCategories(updatedCategories);
                console.log(result.message); // Log the success message
            } else {
                console.error('Invalid server response:', result);
            }
        } catch (error) {
            console.error('Error making the API request:', error.message);
        }
    }, []);

    const handleDeleteCategory = useCallback(async (categoryId) => {
        try {
            // Check if the category has associated objects
            const checkResponse = await fetch(`http://192.168.0.157:3000/checkCategoryObjects/${categoryId}`);
            const { objectCount } = await checkResponse.json();

            if (objectCount > 0) {
                setMessage('Category has associated objects. Delete objects first.');
                return;
            }

            // Proceed to delete the category
            const deleteResponse = await fetch(`http://192.168.0.157:3000/deleteCategory/${categoryId}`, {
                method: 'DELETE',
            });

            const data = await deleteResponse.json();
            console.log(data.message);

            // Remove the deleted category from the state
            setCategories((prevCategories) =>
                prevCategories.filter((category) => category.id !== categoryId)
            );
            // Clear the message after successful deletion
            setMessage('');
        } catch (error) {
            console.error('Error deleting category:', error);
        }
    }, []);

    const handleNote = (category) => {
        navigation.navigate('NoteList',{category});
        console.log(category.id);
    };

    const handleObjectsPress = (category) => {
        // Navigate to the ObjectList component with the selected category
        navigation.navigate('ObjectList', { category }, { categoryName: category.name });
        console.log(category.id);
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={styles.categoryItem}
            onPress={() => handleObjectsPress(item)}
        >
            <Image source={{ uri: item.imageURL }} style={styles.categoryImage} />
            <Text style={styles.categoryName}>{item.name}</Text>
            <TouchableOpacity
                onPress={() => handleNote(item)} // Pass the item to handleNote
                style={styles.noteButton}
            >
                <Feather name="file-text" size={24} color="black" />
                {/* Adjust the name, size, and color as needed */}
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => handleDeleteCategory(item.id)}
            >
                <Feather name="trash-2" size={24} color="red" />
                {/* Adjust the name, size, and color as needed */}
            </TouchableOpacity>
        </TouchableOpacity>
    );

    return (
        <>
            <StatusBar barStyle='dark-content' backgroundColor='#28AC' />
        <View style={{ flex: 1 }} backgroundColor='#28AC'>
            <FlatList
                data={categories}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderItem}
                contentContainerStyle={styles.listContainer}
            />
            <TouchableOpacity
                onPress={handleAddCategory}
                style={styles.addButton}
            >
                <Text style={styles.addButtonText}>ADD CATEGORY</Text>
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
        </>
    );
};

const styles = StyleSheet.create({
    listContainer: {
        padding: 16,
    },
    categoryItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        backgroundColor: '#F8F8F8', // AliceBlue background color
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
        borderWidth: 2, // Add border width
    },
    categoryImage: {
        width: 60,
        height: 60,
        borderRadius: 30,
        marginRight: 16,
    },
    categoryName: {
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
    noteButton:{

    }
});

export default CategoryList;
