import 'react-native-gesture-handler';
import React from 'react';
import { View } from 'react-native';
import { enableScreens } from 'react-native-screens';
import RootContainer from './App/RootContainer'
import { NavigationContainer, createNavigationContainerRef } from '@react-navigation/native';
import { navigationRef, isReadyRef } from './App/RootNavigation';
import { AuthContext, AuthProvider } from './App/AuthContext';
import UpdateChecker from './App/Components/UpdateChecker'; 

enableScreens();
const App: () => React.ReactNode = () => {
  
  return (
    <AuthProvider>
      <NavigationContainer ref={navigationRef} >
        <View style={{ flex: 1 }}>
          <UpdateChecker />
          <RootContainer />
        </View>
      </NavigationContainer> 
    </AuthProvider>
    
  );
};

export default App;