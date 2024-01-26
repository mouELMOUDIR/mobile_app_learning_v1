import React, { useState,useEffect } from "react";
import { View, StyleSheet, Modal, TextInput, StatusBar, TouchableWithoutFeedback, Keyboard } from 'react-native';
import colors from '../misc/colors';
import RoundIconBtn from "./RoundIconBtn";

const NoteInputModal = ({ visible, onClose, onSubmit, noteData }) => {
    const [title, setTitle] = useState(noteData ? noteData.title : '');
    const [Content, setContent] = useState(noteData ? noteData.Content : '');

    useEffect(() => {
        setTitle(noteData ? noteData.title : '');
        setContent(noteData ? noteData.Content : '');
    }, [noteData]);

    const handleModalClose = () => {
        Keyboard.dismiss();
        onClose();
    };

    const handleSubmit = async () => {
        if (!title.trim() && !Content.trim()) return onClose();
        await onSubmit(title, Content);
        setTitle('');
        setContent(''); 
        onClose();
    };

    return (
        <Modal visible={visible} animationType="fade">
            <View style={styles.container}>
                <TextInput
                    value={title}
                    onChangeText={(text) => setTitle(text)}
                    placeholder="Title"
                    style={[styles.input, styles.title]}
                />

                <TextInput
                    value={Content}
                    multiline
                    placeholder="Note"
                    style={[styles.input, styles.Content]}
                    onChangeText={(text) => setContent(text)}
                />
                <View style={styles.btnContainer}>
                    <RoundIconBtn
                        size={15}
                        antIconName='check'
                        onPress={handleSubmit}
                    />
                    <RoundIconBtn
                        size={15}
                        style={{ marginLeft: 15 }}
                        antIconName='close'
                        onPress={handleModalClose}
                    />
                </View>
            </View>
            <TouchableWithoutFeedback onPress={handleModalClose}>
                <View style={[styles.modalBG, StyleSheet.absoluteFillObject]} />
            </TouchableWithoutFeedback>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
        paddingTop: 15,
    },
    input: {
        borderBottomWidth: 2,
        borderBottomColor: 'black',
        fontSize: 20,
        color: colors.DARK
    },
    title: {
        height: 40,
        marginBottom: 15,
        fontWeight: 'bold',
        color: 'black'
    },
    Content: {
        height: 500,
        color: 'black'
    },
    modalBG: {
        flex: 1,
        zIndex: -1,
    },
    btnContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        paddingVertical: 15
    }
});

export default NoteInputModal;