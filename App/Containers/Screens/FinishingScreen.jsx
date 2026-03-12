
import React from 'react';
import {
  Image, View, Text,
  ImageBackground,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import Fonts from '../../Themes/Fonts';
import Images from '../../Themes/Images';
import styles from './Styles/FinishingScreen.style';
import { appActions } from '../../actions/actions';
import { connect } from 'react-redux';
import Colors from '../../Themes/Colors';
import * as RootNavigation from '../../RootNavigation';

function FinishingScreen(props){

  const navigateVerificationsScreent = () => {
    RootNavigation.navigate('VerificationsScreent');
  }
    return (
      <>
        <ImageBackground source={Images.grayBackground} style={styles.settingBackground}>
          <SafeAreaView style={{ flex: 1, backgroundColor: 'rgba(255, 255, 255, 0.5)', margin: 30 }}>
            <View style={{ backgroundColor: 'rgba(255, 255, 255, 0.5)' }}>
              <View style={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', alignItems: 'center', justifyContent: 'center', marginVertical: 40 }}>
                <Text style={{
                  fontSize: 25, fontFamily: Fonts.$poppinsregular,
                  fontWeight: 'normal', color: '#a4a4a4'
                }}>Finalizando viaje</Text>
                <View style={{ height: 3, width: 150, backgroundColor: Colors.$primario, alignSelf: 'center', borderRadius: 10 }} />
                <Text style={styles.textCenter}>Asegurate de completar los siguientes pasos para finalizar tu viaje.</Text>
                <Image style={{ width: 180, height: 180, marginVertical: 20 }} source={Images.finishing2} />
                <Text style={styles.textCenter}>Asegura la bicicleta a la guaya de seguridad en nuestro punto de entrega.</Text>
                <View style={{ width: 320, height: 60, alignSelf: 'center' }}>
                  <TouchableOpacity onPress={() => { navigateVerificationsScreent() }} style={styles.btnFinishing}>
                    <Text style={styles.btnTextFiniahing}>Continuar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </SafeAreaView>
        </ImageBackground>
      </>
    );
  }
function mapStateToProps(state) {
  return {
  }
}
function mapDispatchtoProps(dispatch) {
  return {
    getCurrentLocation: () => dispatch(appActions.getCurrentLocation())
  }
}
export default connect(
  mapStateToProps,
  mapDispatchtoProps
)(FinishingScreen);
