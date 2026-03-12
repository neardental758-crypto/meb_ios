import React, { useState, useEffect, useContext } from 'react';
import { 
  Text,
  View,
  Pressable,
  StyleSheet,
  Image,
  Dimensions,
  ImageBackground,
  Modal
} from 'react-native';
import LottieView from 'lottie-react-native';
import Fonts from '../../Themes/Fonts';
import { 
  save_token_msn,
  ask_roles
} from '../../actions/actionCarpooling';
import { 
  validateUser3g
} from '../../actions/actions3g';
import { connect, useDispatch } from 'react-redux';
import Colors from '../../Themes/Colors';
import Images from '../../Themes/Images';
import * as RootNavigation from '../../RootNavigation';
import { getItem } from '../../Services/storage.service';
import { AuthContext } from '../../AuthContext';
import { IntroduccionCarpooling } from '../../Components/carpooling/Introduction';

function CarpoolingHome(props) {

  const dispatch = useDispatch();
  const { infoUser } = useContext( AuthContext );
  const goBack = () => { RootNavigation.navigate('Home') }
  const [loadedTrips, setLoadedTrips] = useState(false);
  
  const driverTrips = () => {
    setLoadedTrips(true);
    setTimeout(() => {
      switch (props.stateDrawer) {
        case 'Unirme':
          props.navigation.navigate('CarpoolingTripRider');
          break;
        case 'Compartir':
          props.navigation.navigate('CarpoolingAddTrip');
          break;
        case 'Itinerario':
          props.navigation.navigate('CarpoolingDriverTrips');
          break;
        case 'Historial':
          props.navigation.navigate('CarpoolingSolicitudesRider');
          break;
        case 'Soporte':
          props.navigation.navigate('CarpoolingSupport');
          break;
        default:
          break;
      }
      setLoadedTrips(false);
    }, 1000);
  };

  useEffect(() => {
    dispatch(validateUser3g(infoUser.DataUser.idNumber));
  },[])

  if(loadedTrips){
    return (
      <Modal transparent={true}>
        <View style={{ backgroundColor: Colors.$secundario80, flexDirection: "column", flex: 1 }}>
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
  <ImageBackground source={Images.fondoMapa} style={{        
      flex: 1,
      width: '100%', 
      justifyContent: 'center'
      }}>
    <View style={styles.contenedor}>
      <View style={styles.cajaCabeza}>
          <Pressable  
              onPress={() => { goBack() }}
              style={ styles.btnAtras }>
              <View>
              <Image source={Images.home} style={[styles.iconMenu]}/> 
              </View>
          </Pressable>
      </View>
        <IntroduccionCarpooling />   
      <View style={styles.containerButtons}>
        {
          props.dataRent.usuarioValidoCarpooling ?
          <Pressable 
            onPress={() => { driverTrips() }} 
            style={styles.button}>
            <Text style={styles.textButton}>Ingresar</Text>
          </Pressable>
          :
          <Text style={styles.textTitle}>Usuario no habilitado</Text>
        }
        
      </View>
    </View>
  </ImageBackground>
  );
}
}
const styles = StyleSheet.create({
    contenedor: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
    },
    cajaAnimacion: {
      width: Dimensions.get('window').width,
      height: 250,
    },
    gif: {
      width: Dimensions.get('window').width,
      height: 250, 
    },
    cajaCabeza: {
      backgroundColor: Colors.$primario,
      justifyContent: 'space-around',
      alignItems: 'center', 
      borderRadius: 1,
      width: Dimensions.get('window').width,
      position: 'absolute',
      top: 0
    },
    logoGif: {
      width: 120,
      height: 120,
      zIndex: 100
    },
    textTitle: {
      marginTop: 20, 
      marginBottom: 20, 
      fontSize : 25, 
      fontFamily : Fonts.$poppinsmedium,
      
      alignSelf: "center",
      color: 'white',
    },
    btnAtras:{
        position: 'absolute',
        top: 10, 
        left: 10,
        width: 50,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 25
    },
    iconMenu: {
        width: 30,
        height: 30,
    },
    containerButtons : {
      marginTop: 15, 
      marginBottom: 15, 
      alignSelf: 'center',
    },
    
    button : { 
      width: Dimensions.get('window').width*.5,
      textAlignVertical : 'bottom',
      padding  : 8,
      backgroundColor : Colors.$primario,
      borderRadius : 50,
      shadowColor: "#000",
      shadowOffset: {
        width: 5,
        height: 5,
      },
      shadowOpacity: 1,
      shadowRadius: 5,
      elevation: 8,
    },
    
    textButton : {
      fontFamily: Fonts.$poppinsmedium, 
      fontSize: 20, 
      paddingTop: 'auto', 
      paddingBottom: 'auto', 
      color: 'white',
      color: Colors.$blanco,
      alignSelf: "center",
    },
});
function mapStateToProps(state) {
  return {
    dataUser: state.userReducer,
    didPractice : state.reducerCarpooling.userPractise,
    didTheory : state.reducerCarpooling.userTheoretical,
    activeSchedule : state.reducerCarpooling.activeSchedule,
    stateDrawer : state.reducerCarpooling.carpoolingDrawer,
    dataRent: state.reducer3G,
  }
}
export default connect(mapStateToProps)(CarpoolingHome);
