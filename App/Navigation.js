import * as React from 'react';
import { Button, View } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
//screens
import LoginScreen from './Containers/Screens/LoginScreen';
import RegisterScreen from './Containers/Screens/RegisterScreen';

const Tab = createBottomTabNavigator();
//const Stack = createNativeStackNavigator();

function MyTabs() {
    return (
      <Tab.Navigator>
        <Tab.Screen name="Login" component={LoginScreen} />
        <Tab.Screen name="Register" component={RegisterScreen} />
      </Tab.Navigator>
    );
}

export default function Navigation() {
    return (
      <MyTabs />
    )
}

