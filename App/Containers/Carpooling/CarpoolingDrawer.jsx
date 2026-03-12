import React, { useEffect, useState } from 'react';
import { View, Text, Pressable, Image, StyleSheet, Modal, Dimensions } from 'react-native';
import Images from '../../Themes/Images';
import Colors from '../../Themes/Colors';
import { connect, useDispatch } from 'react-redux';
import { change_carpooling_drawer } from '../../actions/actionCarpooling';
import LottieView from 'lottie-react-native';

const DrawerComponent = (props) => {
  const dispatch = useDispatch();
  const [selectedTab, setSelectedTab] = useState(props.stateDrawer);
  const [ loadedTrips, setLoadedTrips ] = useState(false);

  const handlePress = (tabName) => {
    setSelectedTab(tabName);
      switch (tabName) {
        case 'Compartir':
          dispatch(change_carpooling_drawer(tabName));
          props.navigation.navigate('CarpoolingAddTrip');
          break;
        case 'Unirme':
          dispatch(change_carpooling_drawer(tabName));
          props.navigation.navigate('CarpoolingTripRider');
          break;
        case 'Itinerario':
          dispatch(change_carpooling_drawer(tabName));
          props.navigation.navigate('CarpoolingDriverTrips');
          break;
        case 'Historial':
          dispatch(change_carpooling_drawer(tabName));
          props.navigation.navigate('CarpoolingSolicitudesRider');
          break;
        case 'Soporte':
          dispatch(change_carpooling_drawer(tabName));
          props.navigation.navigate('CarpoolingSupport');
          break;
        default:
          break;
      }
  };

  useEffect(() => {
    setSelectedTab(props.stateDrawer);
    setLoadedTrips(false);
  }, [props.stateDrawer]);

  if(loadedTrips){
    return (
    <Modal transparent={true}>
        <View style={{ backgroundColor: Colors.$blanco, flexDirection: "column", flex: 1 }}>
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <LottieView
              source={require('../../Resources/Lotties/loading_carpooling.json')} autoPlay loop
              style={{
                width: Dimensions.get('window').width,
                height: Dimensions.get('window').height,
                backgroundColor: Colors.$blanco
              }}
            />
            </View>
        </View>
    </Modal>
    )
  }else{
  return (
      <View style={styles.tabBar}>
        <Pressable 
          onPress={() => handlePress('Compartir')} 
          style={({ pressed }) => [
            styles.tabItem,
            selectedTab === 'Compartir' && styles.selectedTab,  // Estilo cuando el tab está seleccionado
            pressed && styles.pressedTab  // Efecto de presionado
          ]}
        >
          <View style={styles.tabContent}>
            <Image
              source={Images.compartirDrawer}
              style={[
                styles.icon,
                selectedTab === 'Compartir' && { tintColor: Colors.$primario }
              ]}
            />
            <Text style={[
              styles.tabText,
              selectedTab === 'Compartir' && { color: Colors.$primario, fontSize: 14 }
            ]}>
              Compartir
            </Text>
          </View>
        </Pressable>
        <Pressable 
          onPress={() => handlePress('Unirme')} 
          style={({ pressed }) => [
            styles.tabItem,
            selectedTab === 'Unirme' && styles.selectedTab,  // Estilo cuando el tab está seleccionado
            pressed && styles.pressedTab  // Efecto de presionado
          ]}
        >
          <View style={styles.tabContent}>
            <Image
              source={Images.unirmeDrawer}
              style={[
                styles.icon,
                selectedTab === 'Unirme' && { tintColor: Colors.$primario }  // Color del ícono cuando está seleccionado
              ]}
            />
            <Text style={[
              styles.tabText,
              selectedTab === 'Unirme' && { color: Colors.$primario, fontSize: 14 }  // Color del texto cuando está seleccionado
            ]}>
              Unirme
            </Text>
          </View>
        </Pressable>
        <Pressable 
          onPress={() => handlePress('Itinerario')} 
          style={({ pressed }) => [
            styles.tabItem,
            selectedTab === 'Itinerario' && styles.selectedTab,  // Estilo cuando el tab está seleccionado
            pressed && styles.pressedTab  // Efecto de presionado
          ]}
        >
          <View style={styles.tabContent}>
            <Image
              source={Images.itinerarioDrawer}
              style={[
                styles.icon,
                selectedTab === 'Itinerario' && { tintColor: Colors.$primario }
              ]}
            />
            <Text style={[
              styles.tabText,
              selectedTab === 'Itinerario' && { color: Colors.$primario, fontSize: 14 }
            ]}>
              Itinerario
            </Text>
          </View>
        </Pressable>

        <Pressable 
          onPress={() => handlePress('Historial')} 
          style={({ pressed }) => [
            styles.tabItem,
            selectedTab === 'Historial' && styles.selectedTab,  // Estilo cuando el tab está seleccionado
            pressed && styles.pressedTab  // Efecto de presionado
          ]}
        >
          <View style={styles.tabContent}>
            <Image
              source={Images.historialDrawer}
              style={[
                styles.icon,
                selectedTab === 'Historial' && { tintColor: Colors.$primario }
              ]}
            />
            <Text style={[
              styles.tabText,
              selectedTab === 'Historial' && { color: Colors.$primario, fontSize: 14 }
            ]}>
              Historial
            </Text>
          </View>
        </Pressable>

        <Pressable 
          onPress={() => handlePress('Soporte')} 
          style={({ pressed }) => [
            styles.tabItem,
            selectedTab === 'Soporte' && styles.selectedTab, 
            pressed && styles.pressedTab
          ]}
        >
          <View style={styles.tabContent}>
            <Image
              source={Images.soporteDrawer}
              style={[
                styles.icon,
                selectedTab === 'Soporte' && { tintColor: Colors.$primario }
              ]}
            />
            <Text style={[
              styles.tabText,
              selectedTab === 'Soporte' && { color: Colors.$primario, fontSize: 14 }
            ]}>
              Soporte
            </Text>
          </View>
        </Pressable>
      </View>
  )}
};

// Estilos
const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    zIndex: 5,
    height: '100%',
  },
  tabItem: {
    alignItems: 'center',
    paddingVertical: 5,
  },
  tabContent: {
    alignItems: 'center',
  },
  icon: {
    width: 26,
    height: 26,
  },
  tabText: {
    color: 'black',
    fontSize: 12,
    marginTop: 5,
  },
  selectedTab: {
    backgroundColor: Colors.$secundario, 
    borderRadius: 5,
    padding : 10,
  },
  pressedTab: {
    backgroundColor: Colors.$secundario, 
    borderRadius: 5,
    padding : 10,
  },
  gif: {
    width: Dimensions.get('window').width*.8,
    height: 250,
  },
});

function mapStateToProps(state) {
  return {
    stateDrawer : state.reducerCarpooling.carpoolingDrawer,
  }
}

export default connect(mapStateToProps)(DrawerComponent);
