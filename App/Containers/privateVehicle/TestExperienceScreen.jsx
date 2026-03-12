import {
    Image,
    ImageBackground,
    SafeAreaView,
    Text,
    TouchableOpacity,
    View,
    StyleSheet,
    Alert,
    TextInput,
    Modal, 
    Button,
    ScrollView
} from 'react-native';
import { 
    reiniciarQR
} from '../../actions/actions3g';
import { Content } from 'native-base';
import Images from '../../Themes/Images';
import React, { useState, useEffect, useContext } from 'react';
import { connect } from 'react-redux';
import { useDispatch } from 'react-redux';
import RNPickerSelect from '@nejlyg/react-native-picker-select';
import { navigationNewTicket, supportRequest } from '../../actions/actions';
import Colors from '../../Themes/Colors';
import estilos from './styles/testExperience.style';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as RootNavigation from '../../RootNavigation';
import { AuthContext } from '../../AuthContext';

function TestExperienceScreen(props){

    const { infoUser, endTtripVP } = useContext( AuthContext );
    const dispatch = useDispatch();

    const [ state , setState ] = useState({
        user: '1111',
        beneficios: '',
        isOpenBackgroundInfoModal: false
    });

    const [ cal1, setCal1 ] = useState(false);
    const [ cal2, setCal2 ] = useState(false);
    const [ cal3, setCal3 ] = useState(false);
    const [ cal4, setCal4 ] = useState(false);
    const [ cal5, setCal5 ] = useState(false);
    const [ calificacion, setCalificacion ] = useState('');

    const verState = () => { 
        console.log('EL STATE ACT::::: ', state )
    }

    const verState2 = () => { 
        console.log('EL STATE ACT::::: ', props) 
        console.log('MY VEHICLES::::: ', props.dataRent.myVehiclesVP) 
    }
    
    const home = () => {
        RootNavigation.navigate('Home');
    }

    const displayBackgroundInfoModal = (value) => {
        setState({ ...state, isOpenBackgroundInfoModal: value })
      }
    
      const openBackgroundInfoModal = () => {
          return (
              <View style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: 22,
                  height: 20,
              }}>
                  <Modal transparent={true} animationType="slide">
                      <View style={{ backgroundColor: "rgba(52, 52, 52, 0.9)", flexDirection: "column", flex: 1 }}>
                          <View style={{ flex: 3, borderRadius: 6, marginVertical: 130, marginHorizontal: 50, backgroundColor: Colors.$primario, justifyContent: "center", alignItems: "center", paddingHorizontal: 25 }}>
                              <Image style={{
                                  width: 200,
                                  height: 100,
                              }} source={Images.logoHome} />
    
                              <Text style={{ 
                                textAlign: "center", 
                                color: Colors.$cuarto,
                                fontSize: 22, 
                                fontWeight: "700", 
                                marginTop: 20 }}
                              >Viaje finalizado con éxito 💪🏁</Text>

                              <View style={{
                                  marginTop: 40,
                                  flexDirection: 'row',
                                  justifyContent: 'space-between'
                              }}>
                                  <View style={{ marginRight: 8 }}>
                                      <Button
                                          title="ACEPTAR"
                                          color={Colors.$texto}
                                          onPress={() => { 
                                            displayBackgroundInfoModal(false) 
                                            enviar()
                                        }}
                                      />
                                  </View>
                              </View>
                          </View>
    
                          
    
                      </View>
                  </Modal>
              </View>
          )
          //Abrir el modal de backgrund info
    }

    const next = () => {
        props.navigationProp.navigate('StartTripScreen');
        console.log('continuar');
    }

    const enviar = () => {
        dispatch(reiniciarQR());
        endTtripVP()
        home();
    }

    const cambiarEstado = (valor) => {
        console.log(valor)
        setCal1(false);
        setCal2(false);
        setCal3(false);
        setCal4(false);
        setCal5(false);
        switch (valor) {
          case '1':
            setCal1(true);
            setCalificacion('1');
            break;
          case '2':
            setCal1(true);
            setCal2(true);
            setCalificacion('2');
            break;
          case '3':
            setCal1(true);
            setCal2(true);
            setCal3(true);
            setCalificacion('3');
            break;
          case '4':
            setCal1(true);
            setCal2(true);
            setCal3(true);
            setCal4(true);
            setCalificacion('4');
            break;
          case '5':
            setCal1(true);
            setCal2(true);
            setCal3(true);
            setCal4(true);
            setCal5(true);
            setCalificacion('5');
            break;
          default:
            break;
        }
    }

    const reiniciarCronometroStorageVP = () => {
        try {
            console.log('Se reinicio el cronometro')
            AsyncStorage.removeItem('cronometroVP')
        } catch (error) {
            console.log(error);
        }
    }


    useEffect(() => {
        reiniciarCronometroStorageVP()
    },[])

   
    return (
        
        <ImageBackground source={''} style={estilos.generales}>
            {(state.isOpenBackgroundInfoModal) ? openBackgroundInfoModal() : <></>}
            <SafeAreaView>
                <ScrollView>
                    <View style={estilos.contenedor}>
                        <View style={estilos.contentTop}>
                            
                            <View style={estilos.contentTitle}>
                                <Text style={estilos.title}>Califica tú experiencia</Text>
                                <View style={estilos.subRaya} />
                            </View> 
                        </View>
                    </View>

                    <View style={estilos.contenerod2}>
                        <View style={estilos.cajaLogo}>
                            <Image source={Images.vptest} style={estilos.imgtest}/>
                        </View>

                        <View style={estilos.cajaStarts}>
                            <TouchableOpacity 
                                onPress={() => { cambiarEstado('1') }} 
                                style={estilos.btnStart}>
                                <Image source={ cal1 ? Images.vpcal1 : Images.vpcal2} />
                            </TouchableOpacity>
                            <TouchableOpacity 
                                onPress={() => { cambiarEstado('2') }} 
                                style={estilos.btnStart}>
                                <Image source={ cal2 ? Images.vpcal1 : Images.vpcal2} />
                            </TouchableOpacity>
                            <TouchableOpacity 
                                onPress={() => { cambiarEstado('3') }} 
                                style={estilos.btnStart}>
                                <Image source={ cal3 ? Images.vpcal1 : Images.vpcal2} />
                            </TouchableOpacity>
                            <TouchableOpacity 
                                onPress={() => { cambiarEstado('4') }} 
                                style={estilos.btnStart}>
                                <Image source={ cal4 ? Images.vpcal1 : Images.vpcal2} />
                            </TouchableOpacity>
                            <TouchableOpacity 
                                onPress={() => { cambiarEstado('5') }} 
                                style={estilos.btnStart}>
                                <Image source={ cal5 ? Images.vpcal1 : Images.vpcal2} />
                            </TouchableOpacity>
                        </View>

                        <View style={estilos.cajaInput}> 
                            <TextInput
                                multiline={true}
                                numberOfLines={10}
                                placeholder='Escribe una reseña'
                                placeholderTextColor={'#878787'}
                                style={ estilos.inputBeneficios }
                                onChangeText={text => setState({ ...state,  beneficios: text })}
                                underlineColorAndroid="transparent"
                            />
                        </View>

                        <TouchableOpacity  
                            onPress={() => { displayBackgroundInfoModal(true) }} 
                            style={estilos.btnCenter}>
                                <View style={estilos.buttonNext}>
                                    <Text style={estilos.btnSaveColor}>Finalizar</Text>
                                </View>
                        </TouchableOpacity>
                    </View>
                    
                </ScrollView>
            </SafeAreaView>
        </ImageBackground>
    );
    
}

function mapStateToProps(state) {
    return {
        dataUser: state.userReducer,
        dataRent: state.reducer3G,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        reiniciarQR: () =>dispatch(reiniciarQR()),
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(TestExperienceScreen);