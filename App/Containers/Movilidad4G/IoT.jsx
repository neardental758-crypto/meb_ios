import React, { useEffect, useState } from 'react';
import { 
  Text,
  View,
  Pressable,
  StyleSheet,
  Image,
  Dimensions,
  ScrollView
} from 'react-native';
import { connect, useDispatch } from 'react-redux';
import Colors from '../../Themes/Colors';
import Images from '../../Themes/Images';
import Fonts from '../../Themes/Fonts';
import * as RootNavigation from '../../RootNavigation';
import Bluetooth from './BluetoothClassic';
//import Bluetooth from './BluetoothClassicComponent';
//import Bluetooth from './BLEManager';

function IoT(props) {
  const [mac, setMac ] = useState('00:22:05:00:27:64');
  const [macCargado, setMacCargado ] = useState(true);
  const dispatch = useDispatch();
  const goBack = () => { RootNavigation.navigate('Home4G') }

  useEffect(() => {
    //dispatch(save_token_msn()); //para guardar token msn -- descomentar
  }, [])

  return (
    <View style={styles.container}>
      <View style={styles.cajaCabeza}>
        <Pressable  
          onPress={() => { goBack() }}
          style={styles.btnAtras}>
          <View>
            <Image source={Images.menu_icon} style={styles.iconMenu}/> 
          </View>
        </Pressable>
        
        <Text style={styles.titulo}>Conexión BLE</Text>
      </View> 

      <View style={{marginTop: 80, flex: 1}}>
        
        <Bluetooth mac={mac} macCargado={macCargado}/>
        
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%', 
    justifyContent: 'center'
  },
  cajaCabeza: {
    backgroundColor: Colors.$blanco,
    justifyContent: 'space-between',
    alignItems: 'center', 
    borderRadius: 1,
    width: Dimensions.get('window').width,
    height: 80,
    position: 'absolute',
    top: 0,
    flexDirection: 'row',
  },
  btnAtras: {
    position: 'absolute',
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 25,
    left: 15,
    zIndex: 10,
  },
  iconMenu: {
    width: 50,
    height: 50,
  },
  titulo: {
    fontFamily: Fonts.$poppinsmedium, 
    fontSize: 22, 
    color: Colors.$texto,
    alignItems: 'center',
    textAlign: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  cajaInfo: {
    width: Dimensions.get('window').width,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: Colors.$blanco,
    padding: 10,
  },
  cajaEstados: {
    width: Dimensions.get('window').width,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: Colors.$blanco,
    height: 40,
    marginTop: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  texto1: {
    fontSize: 16,
    color: Colors.$texto,
  },
  circulo: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'green',
    marginRight: 5,
  },
  cajaVehiculos: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  bntVehiculo: {
    width: 80,
    height: 80,
    backgroundColor: '#f60',
    borderRadius: 10,
    margin: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textVehiculo: {
    fontSize: 24,
    color: 'white',
  },  
  cajaScroll: {
    paddingVertical: 20,
  },    
});

function mapStateToProps(state) {
  return {
    dataUser: state.userReducer,
    dataRent: state.reducer3G,
  }
}

export default connect(mapStateToProps)(IoT);