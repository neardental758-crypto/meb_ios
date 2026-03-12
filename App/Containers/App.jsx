import React, { useEffect } from 'react';
import RootContainer from '../RootContainer';
import { StatusBar, View, Platform, Linking, AppState, Modal, Text, ActivityIndicator } from 'react-native';
import { Root } from 'native-base';
import RNExitApp from 'react-native-exit-app';
import { getItem } from '../Services/storage.service';
import Colors from '../Themes/Colors';
import Fonts from '../Themes/Fonts';
import EStyleSheet from 'react-native-extended-stylesheet';
import { connect } from 'react-redux';
import { appInit, locationChange, routeToPickDevice, setAppConnectionStatus } from '../actions/actions'
import {verifyCameraPermissions} from "../actions/rideActions";

EStyleSheet.build(Object.assign(Colors, Fonts));

function App (props) {
  
  const getQueryParameter = (query, parameter) => {
    return (query.split(parameter + '=')[1].split('&')[0]);
  }
  useEffect(() => {
    console.log('probando handlees :::::::::::::::::::::::')
    props.verifyCameraPermissions();
    deepLink();
    AppState.addEventListener('change', handleAppStateChange);
    props.appInit(navigation);
    StatusBar.setBarStyle('light-content');
    if (Platform.OS == 'android')
    StatusBar.setBackgroundColor('#333333');
    return () => {
      AppState.removeEventListener('change', handleAppStateChange);
    }
  })

  const onRoutingChange = (action) => {
    props.locationChange(action);
    StatusBar.setBarStyle('light-content');
    if (Platform.OS == 'android')
      StatusBar.setBackgroundColor('#333333');
  }

  const deepLink = async () => {
    Linking.getInitialURL().then(async (url) => {
    });
  }

  const handleAppStateChange = async (nextAppState) => {
    if (nextAppState === 'inactive' || nextAppState === 'background') {
      let needToClose = await getItem("closeAppNeeded");
      if (needToClose == "needToClose") {
        RNExitApp.exitApp();
      }
    }
  };
    return (
      <Root>
        <Modal visible={!props.internetConnection} transparent={true}>
          <View style={{position: 'absolute', backgroundColor: Colors.$blanco, height: '100%', width: '100%', justifyContent: 'center', alignItems: 'center', alignContent: 'center',padding: '7%',flex: 1,flexDirection: 'column',}}>
            <View style={{ flex: 0.3 }}></View>
            <View style={{ flex: 0.3 }}>
              <Text style={{ paddingBottom: 30, fontSize: 16, textAlign: "center", color: Colors.$gray }}>Tu conexión de internet es inestable. Estamos intentando reconectarte.</Text>
              <View style={{ height: 40 }}>
                <ActivityIndicator></ActivityIndicator>
              </View>
            </View>
            <View style={{ flex: 0.3 }}></View>
          </View>
        </Modal>
        <View style={{ flex: 1 }}>
          <RootContainer ref={nav => navigation = nav} onNavigationStateChange={(action) => onRoutingChange(action)} />
        </View>
      </Root>
    );
  }

function mapStateToProps(state) {
  return {
    internetConnection: state.othersReducer.internetConnection
  };
}

function mapDispatchToProps(dispatch) {
  return {
    appInit: (navigation) => dispatch(appInit(navigation)),
    locationChange: (action) => dispatch(locationChange(action)),
    routeToPickDevice: (code, type) => dispatch(routeToPickDevice(code, type)),
    setAppConnectionStatus: (status) => dispatch(setAppConnectionStatus(status)),
    verifyCameraPermissions: () => dispatch(verifyCameraPermissions())
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
