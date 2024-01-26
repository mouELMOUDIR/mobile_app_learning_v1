import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { View, Text, StyleSheet } from 'react-native';
import CategoryList from '../components/CategoryList';
import AddCategory from '../components/AddCategory';
import ObjectList from '../components/ObjectList';
import AddObject from '../components/AddObject';
import ObjectDetails from '../components/ObjectDetails';
import AddObjectInObject from '../components/AddObjectInObject';
import NoteList from '../components/NoteList';
import NoteInputModal from '../components/NoteInputModal';

const Stack = createStackNavigator();

const styles = StyleSheet.create({
    headerContainer: {
        flexDirection: 'column',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#28AC',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
    },
    hierarchyText: {
        fontSize: 14,
        color: '#fff',
        marginTop: 4,
    },
});

const AppNavigator = () => {
    return (
        <Stack.Navigator  initialRouteName="CategoryList" screenOptions={{
            headerShown: false, }}>
            <Stack.Screen
                name="CategoryList"
                component={CategoryList}
                options={{ headerShown: true, headerTitle: 'Categories' }}
            />
            <Stack.Screen
                name="AddCategory"
                component={AddCategory}
                options={{ headerShown: true, headerTitle: 'Categories' }}
            />
            <Stack.Screen
                name="ObjectList"
                component={ObjectList}
                options={{ headerShown: true, headerTitle: 'Objects' }}
            />
            <Stack.Screen
                name="AddObject"
                component={AddObject}
                options={{ headerShown: true, headerTitle: 'Objects' }}
            />
            <Stack.Screen
                name="ObjectDetails"
                component={ObjectDetails}
                options={{ headerShown: true, headerTitle: 'Objects' }}
            />
            <Stack.Screen
                name="AddObjectInObject"
                component={AddObjectInObject}
                options={{ headerShown: true, headerTitle: 'Objects' }}
            />
            <Stack.Screen
                name="NoteList"
                component={NoteList}
                options={{ headerShown: true, headerTitle: 'Notes' }}
            />
            <Stack.Screen
                name="NoteInputModal"
                component={NoteInputModal}
                options={{ headerShown: true, headerTitle: 'Note' }}
            />
        </Stack.Navigator>
    );
};

export default AppNavigator;
