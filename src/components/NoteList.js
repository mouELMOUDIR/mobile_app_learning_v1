import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import SearchBar from './Searchbar';
import RoundIconBtn from './RoundIconBtn';
import NoteInputModal from './NoteInputModal';
import { AntDesign } from '@expo/vector-icons'; // Import the AntDesign icons

const NoteList = ({ route, navigation }) => {
    const { category } = route.params;
    const [notes, setNotes] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedNote, setSelectedNote] = useState(null);
    const [filteredNotes, setFilteredNotes] = useState([]);

    useEffect(() => {
        fetchNotes();
    }, [category.id]);

    useEffect(() => {
        setFilteredNotes(notes);
    }, [notes]);

    const fetchNotes = async () => {
        try {
            const response = await fetch(`http://192.168.0.157:3000/getNotesByCategoryID/${category.id}`);
            const data = await response.json();
            if (Array.isArray(data)) {
                setNotes(data);
            } else {
                console.error('Invalid server response format:', data);
            }
        } catch (error) {
            console.error('Error fetching objects:', error);
        }
    };

    const handleOnSubmit = async (title, Content) => {
        try {
            if (selectedNote) {
                // Update existing note
                const response = await fetch(`http://192.168.0.157:3000/updateNote/${selectedNote.NoteID}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        Content: Content,
                        title: title,
                    }),
                });

                if (!response.ok) {
                    throw new Error('Error updating note');
                }
            } else {
                const response = await fetch('http://192.168.0.157:3000/addNote', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        Content: Content,
                        CategoryID: category.id,
                        title: title,
                    }),
                });

                if (!response.ok) {
                    throw new Error('Error adding note');
                }
            }
            fetchNotes(); // Refresh the list of notes after adding or updating a note
            setModalVisible(false); // Close modal after submit
        } catch (error) {
            console.error('Error adding/updating note:', error);
        }
    };

    const handleItemPress = (item) => {
        setSelectedNote(item);
        setModalVisible(true);
    };

    const handleCloseModal = () => {
        setSelectedNote(null);
        setModalVisible(false);
    };

    const handleDeleteNote = async (noteId) => {
        try {
            const response = await fetch(`http://192.168.0.157:3000/deleteNote/${noteId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Error deleting note');
            }

            fetchNotes(); // Refresh the list of notes after deletion
        } catch (error) {
            console.error('Error deleting note:', error);
        }
    };

    const handleSearch = (text) => {
        if (notes && notes.length > 0) {
            const filtered = notes.filter(note => {
                return note.title.toLowerCase().includes(text.toLowerCase());
            });
            setFilteredNotes(filtered);
        }
    };

    const renderItem = ({ item }) => {
        return (
            <View style={styles.noteItem}>
                <TouchableOpacity onPress={() => handleItemPress(item)}>
                    <Text style={styles.noteTitle}>{item.title}</Text>
                    <Text>{item.content}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDeleteNote(item.NoteID)}>
                    <AntDesign name="delete" size={24} color="black" />
                </TouchableOpacity>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <SearchBar containerStyle={{ marginVertical: 15 }} onSearch={handleSearch} />
            <FlatList
                data={filteredNotes}
                renderItem={renderItem}
                keyExtractor={(item, index) => item.id ? item.id.toString() : index.toString()}
            />
            <RoundIconBtn
                onPress={() => setModalVisible(true)}
                antIconName='plus'
                style={styles.addBtn}
            />
            <NoteInputModal
                visible={modalVisible}
                onClose={handleCloseModal}
                onSubmit={handleOnSubmit}
                noteData={selectedNote}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 10,
        flex: 1,
    },
    addBtn: {
        position: 'absolute',
        right: 15,
        bottom: 50,
    },
    noteItem: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        marginVertical: 5,
        borderRadius: 8,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    noteTitle: {
        fontWeight: 'bold',
        marginBottom: 5,
    },
});

export default NoteList;
