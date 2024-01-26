import React from 'react';
import { View, Text,StatusBar } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'; // Import the icon library

import AppNavigator from './src/screens/AppNavigator';
import { Colors } from 'react-native/Libraries/NewAppScreen';

const Tab = createBottomTabNavigator();

function SettingsScreen() {
  return (
    <>
      <StatusBar barStyle='dark-content' backgroundColor='#28AC' />
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} >
      <Text>Settings Screen</Text>
    </View>
    </>
  );
}

const CustomHeaderTitle = () => (
  <View style={{
    backgroundColor: '#28AC',
    padding: 10,
    borderRadius: 15, // Adjust the border radius as needed
    justifyContent: 'center',
    alignItems: 'center',

  }}>

    <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>
      SBATA LEARNING
    </Text>
  </View>
);

function ProfileScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Profile Screen</Text>
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        tabBarOptions={{
          activeTintColor: '#28AC', // Set the active tab color here
        }}
      >
        <Tab.Screen
          name="Home"
          component={AppNavigator}
          options={{
            headerTitle: () => <CustomHeaderTitle />,
            headerStyle: {
              backgroundColor: '#28AC', // Change the header background color if needed
            },
            headerTintColor: '#fff', // Change the text color of the header title
            headerTitleAlign: 'center', // Align the header title to the center
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons name="category" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons name="person" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen
          name="Settings"
          component={SettingsScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons name="settings" color={color} size={size} />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
