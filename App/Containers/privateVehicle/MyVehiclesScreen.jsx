import {
    Image,
    ImageBackground,
    SafeAreaView,
    Text,
    TouchableOpacity,
    View,
    StyleSheet,
    ScrollView,
    Pressable,
    Dimensions,
    Animated
} from 'react-native';
import React, { useState, useEffect, useContext, useRef } from 'react';
import { 
    getVehicles,
    saveVehicleSelect,
    verifyTripActive,
    verifyTripActiveCache,
    deleteFoto,
} from '../../actions/actions3g';
import { Content } from 'native-base';
import Images from '../../Themes/Images';
import { connect } from 'react-redux';
import { useDispatch } from 'react-redux';
import estilos from './styles/myVehicles.style';
import Colors from '../../Themes/Colors';
import Fonts from '../../Themes/Fonts';
import { useFocusEffect } from '@react-navigation/native';
import { horizontalScale, moderateScale, verticalScale } from '../../Themes/Metrics';
import * as RootNavigation from '../../RootNavigation';
import { AuthContext } from '../../AuthContext';
//import BackgroundService from 'react-native-background-actions';
import { async } from 'validate.js';
import { LocationTrackingComponent } from './LocationTrackingComponent';

function MyVehicleScreen(props){

    const { infoUser } = useContext( AuthContext );
    const dispatch = useDispatch();

    const [ state , setState ] = useState({
        user: '',
        idVehiculo: '',
        transporte: '',
        myVehicle: false,
    });

    const [transPublico, setTransPublico] = useState(false);//valor ini false
    const [isChecked, setIsChecked] = useState('');
    const [publicSelect, setPublicSelect] = useState('');
    
    const home = () => {
        RootNavigation.navigate('Home');
    }

    const register = () => {
        RootNavigation.navigate('RegisterVehicleScreen');
        console.log('mis vehiculos');
    }

    const next = () => {
        setState({ 
            user: '',
            idVehiculo: '',
            transporte: '',
            myVehicle: false,
        })
        RootNavigation.navigate('ValidarQrScreen');
    }

    const next2 = () => {
        RootNavigation.navigate('StartTripScreen');
    }

    const modalTransPublico = (valor) => {
        setTransPublico(valor);
    }    

    const caminata = () => {
        RootNavigation.navigate('TransPublicScreen');
    } 

    const viewVehicles = async(dato) => {
        dispatch(getVehicles(dato));
    }

    const vehicleSelect = async(id) => {
        dispatch(saveVehicleSelect(id));
    }

    const verificarViajeActivo = (user) => {
        dispatch(verifyTripActiveCache())
    }

    /*const segundoPlano = async () => {
        console.log('entrando en funcion de segundo de plano');

        const sleep = (time) => new Promise((resolve) => setTimeout(() => resolve(), time));

        // You can do anything in your task such as network requests, timers and so on,
        // as long as it doesn't touch UI. Once your task completes (i.e. the promise is resolved),
        // React Native will go into "paused" mode (unless there are other tasks running,
        // or there is a foreground app).
        const veryIntensiveTask = async (taskDataArguments) => {
            // Example of an infinite loop task
            console.log('entrado en funcion de seg plsno a veryIntensive Task');
            const { delay } = taskDataArguments;
            await new Promise( async (resolve) => {
                for (let i = 0; BackgroundService.isRunning(); i++) {
                    console.log(i);
                    await sleep(delay);
                }
            });
        };

        const options = {
            taskName: 'Example',
            taskTitle: 'ExampleTask title',
            taskDesc: 'ExampleTask description',
            taskIcon: {
                name: 'ic_launcher',
                type: 'mipmap',
            },
            color: '#ff00ff',
            linkingURI: 'yourSchemeHere://chat/jane', // See Deep Linking for more info
            parameters: {
                delay: 5000,
            },
        };
        await BackgroundService.start(veryIntensiveTask, options);
        //await BackgroundService.updateNotification({taskDesc: 'New ExampleTask description'}); // Only Android, iOS will ignore this call
        // iOS will also run everything here in the background until .stop() is called
        //await BackgroundService.stop();
    }*/

    

    const irAviaje = (medio) => {
        //dispatch(saveVehicleSelect(medio));
        setIsChecked(medio)
        if (medio === 'avion') {
            RootNavigation.navigate('AvionScreen');
        }else {
            RootNavigation.navigate('StartTripScreen');
        }
    }

    useEffect(() => {
        //refreshToken();
        viewVehicles(infoUser.DataUser.idNumber);
        //verificarViajeActivo(infoUser.DataUser.idNumber);
        dispatch(deleteFoto());
    },[])

    useFocusEffect( 
        React.useCallback(() => {
            viewVehicles(infoUser.DataUser.idNumber);
            //verificarViajeActivo(infoUser.DataUser.idNumber);
            dispatch(deleteFoto());
        }, [])
      );

    useEffect(() => {
        if (props.dataRent.myVehiclesVPCargados) {
            console.log('los vehiculos', props.dataRent.myVehiclesVP);
        }
    },[props.dataRent.myVehiclesVPCargados])

    useEffect(() => {
        if (props.dataRent.newVPregistrado === true) {
            console.log('se registro un nuevo vehiculo');
            viewVehicles(infoUser.DataUser.idNumber);
        }
    },[props.dataRent.newVPregistrado === true])

    const sinImagen = (tipo) => {
        switch (tipo) {
            case 'Bicicleta':
            return Images.vpBicicleta;
            case 'Carro':
            return Images.vpBicicleta;
            case 'Scooter':
            return Images.vpBicicleta;
            case 'Moto':
            return Images.vpBicicleta;
            case 'Ebike':
            return Images.vpBicicleta;
            default:
            return Images.vpBicicleta;
        }        
    }

    return (
    <View style={{backgroundColor: 'white'}}>
    
    {
        (props.dataRent.tripActiveOK === true) ?
        next2()
        :
        <View style={estilos.contenedor}>

            <View style={styles.cajaCabeza}>
              <Pressable  
                    onPress={() => { home() }}
                    style={ styles.btnAtras }>
                    <View>
                    <Image source={Images.iconoatras} style={[styles.iconMenu]}/> 
                    </View>
                </Pressable>
                <Text style={styles.title}>Mis Vehículos</Text>
            </View>      
            
            <ScrollView>
                <View style={estilos.boxPrincipalItems}>
                {props.dataRent.myVehiclesVPCargados === true ? 
                <>  
                    
                    {
                    props.dataRent.myVehiclesVP.data.map((data) => 
                        <Pressable 
                            key={data.vus_id}
                            onPress={() => { 
                                vehicleSelect(data.vus_id)
                                setState({ 
                                    ...state, 
                                    idVehiculo : data.vus_tipo + '-' + data.vus_marca + '-' + data.vus_serial
                                })
                            }} 
                            style={estilos.btnVehiculos}>
                            <View style={estilos.cajaTextVehiuclos2}>
                                {
                                    data.vus_img === 'sin_img' ? 
                                    <Image source={sinImagen(data.vus_tipo)} style={[styles.iconVehiculos]}/> 
                                    : 
                                    //<Image source={Images.vpBicicleta} style={[styles.iconVehiculos]}/> 
                                    <Image source={{ uri: data.vus_img }} style={[styles.iconVehiculos]}/> 
                                }
                    
                                <View style={{ 
                                    width: '50%',
                                    height: '90%',
                                    flexDirection: 'column',
                                    alignItems: 'flex-start',
                                    justifyContent: 'start'
                                }}>
                                  <Text style={[estilos.textVehiculo, {fontSize: 20}]}>{data.vus_tipo}</Text> 
                                  <Text style={{
                                    width: '100%',
                                    height: 3,
                                    backgroundColor: Colors.$texto
                                  }}></Text> 
                                  <Text style={estilos.textVehiculo2}>{data.vus_serial}</Text>  
                                </View>
                                
                                
                            </View>
                        </Pressable>
                    )
                    }
                    
                    <Pressable  
                        onPress={() => modalTransPublico(true)}
                        style={estilos.btnVehiculos}>
                        <View style={estilos.cajaTextVehiuclos2}>
                            <Image source={Images.transpublico} style={[styles.iconVehiculos]}/> 
                            <View style={{ 
                                    width: '50%',
                                    height: '90%',
                                    flexDirection: 'column',
                                    alignItems: 'flex-start',
                                    justifyContent: 'start'
                                }}>
                                  <Text style={[estilos.textVehiculo, {fontSize: 20}]}>Trasporte Público</Text>
                                  <Text style={{
                                    width: '100%',
                                    height: 3,
                                    backgroundColor: Colors.$texto
                                  }}></Text> 
                                  <Text style={estilos.textVehiculo2}>Selecciona aquí</Text>  
                                </View>         
                        </View>
                    </Pressable>                    
                </>
                :
                <></>
                }
                </View>
            </ScrollView> 
            
            <View style={estilos.boxBtns}>   
                <Pressable onPress={() => register() } 
                    style={{    
                    textAlign: "center",
                    padding  : 10,
                    margin : 20,
                    backgroundColor : Colors.$primario,
                    borderRadius : 50}}> 
                    <Text style={[estilos.textButton, {width : 250, color : 'white', fontFamily: Fonts.$poppinsregular}]}>Registrar vehículo</Text>
                </Pressable>

               {/*<LocationTrackingComponent />*/}

            </View>  

            {
                transPublico ? 
                <Animated.View style={{
                    width: Dimensions.get('window').width,
                    height: Dimensions.get('window').height,
                    backgroundColor: Colors.$texto50,
                    position: 'absolute',
                    Top: 0,
                    zIndex: 100,
                    
                }}>
                    <View style={{
                        width: Dimensions.get('window').width,
                        height: Dimensions.get('window').height*.8,
                        backgroundColor: Colors.$blanco,
                        position: 'absolute',
                        bottom: 0,
                        zIndex: 110,
                        shadowColor: Colors.$texto,
                        shadowOffset: {
                            width: 0,
                            height: 3,
                        },
                        shadowOpacity: 4.29,
                        shadowRadius: 4.65,
                        elevation: 7,
                        borderRadius: 30,
                        justifyContent: 'center',
                    }}>
                        
                        <View style={styles.cajaCabeza2}>
                            <Pressable  
                                onPress={() => { modalTransPublico(false) }}
                                style={ styles.btnAtras }>
                                <View>
                                <Image source={Images.iconoatras} style={[styles.iconMenu]}/> 
                                </View>
                            </Pressable>
                            <View style={ styles.cajaTitle}>
                            <Text style={[styles.title, {width: '100%'}]}>Transporte Público</Text>
                            <Text style={styles.subtitle}>
                            Indícanos el medio de transporte en el que te vas a movilizar.
                            </Text>
                            </View>
                        </View> 
                        <View style={{
                            flexWrap: 'wrap',
                            alignItems: 'center',
                            justifyContent: 'space-around',
                            flexDirection: 'row',
                            marginTop: 50
                        }}> 
                            <View style={estilos.cajaiconos}>
                                <Pressable 
                                    onPress={() => { setIsChecked('avion')}} 
                                    style={ isChecked === 'avion' ? estilos.btnVehiculos2Select : estilos.btnVehiculos2 }>
                                    <View style={estilos.cajaTextVehiuclos}>
                                        <Image source={Images.vpAvion} 
                                        style={styles.iconBici}/>
                                    </View>
                                </Pressable>
                                <Text style={estilos.textVehiculo}>Avión</Text> 
                            </View>

                            <View style={estilos.cajaiconos}>
                                <Pressable 
                                    onPress={() => { setIsChecked('taxi')}} 
                                    style={ isChecked === 'taxi' ? estilos.btnVehiculos2Select : estilos.btnVehiculos2 }>
                                    <View style={estilos.cajaTextVehiuclos}>
                                        <Image source={Images.vpTaxi} 
                                        style={styles.iconBici}/>
                                    </View>
                                </Pressable> 
                                <Text style={estilos.textVehiculo}>Taxi</Text> 
                            </View>
                            
                            <View style={estilos.cajaiconos}>
                                <Pressable 
                                    onPress={() => { setIsChecked('bus')}} 
                                    style={ isChecked === 'bus' ? estilos.btnVehiculos2Select : estilos.btnVehiculos2 }>
                                    <View style={estilos.cajaTextVehiuclos}>
                                        <Image source={Images.vpBus} 
                                        style={styles.iconBici}/>
                                    </View>
                                </Pressable>
                                <Text style={estilos.textVehiculo}>Bus</Text> 
                            </View>

                            <View style={estilos.cajaiconos}>
                                <Pressable 
                                    onPress={() => { setIsChecked('metro')}} 
                                    style={ isChecked === 'metro' ? estilos.btnVehiculos2Select : estilos.btnVehiculos2 }>
                                    <View style={estilos.cajaTextVehiuclos}>
                                        <Image source={Images.vpMetro} 
                                        style={styles.iconBici}/>
                                    </View>
                                </Pressable>
                                <Text style={estilos.textVehiculo}>Metro</Text>
                            </View>

                            <View style={estilos.cajaiconos}>
                                <Pressable 
                                    onPress={() => { setIsChecked('tren')}} 
                                    style={ isChecked === 'tren' ? estilos.btnVehiculos2Select : estilos.btnVehiculos2 }>
                                    <View style={estilos.cajaTextVehiuclos}>
                                        <Image source={Images.vpTren} 
                                        style={styles.iconBici}/>  
                                    </View>
                                </Pressable>
                                <Text style={estilos.textVehiculo}>Tren</Text> 
                            </View>

                            <View style={estilos.cajaiconos}>
                                <Pressable 
                                    onPress={() => { setIsChecked('peaton')}} 
                                    style={ isChecked === 'peaton' ? estilos.btnVehiculos2Select : estilos.btnVehiculos2 }>
                                    <View style={estilos.cajaTextVehiuclos}>
                                        <Image source={Images.vpPeaton} 
                                        style={styles.iconBici}/>
                                    </View>
                                </Pressable>
                                <Text style={estilos.textVehiculo}>Peatón</Text> 
                            </View>
                        </View>

                        {
                            isChecked !== '' ?
                            <View style={estilos.boxBtns}>   
                                <Pressable onPress={() => vehicleSelect(isChecked) } 
                                    style={{    
                                    textAlign: "center",
                                    padding  : 5,
                                    margin : 20,
                                    backgroundColor : Colors.$primario,
                                    borderRadius : 50}}> 
                                        <Text style={[estilos.textButton, {width : 250, color : 'white', fontFamily: Fonts.$poppinsregular}]}>Iniciar Viaje</Text>
                                </Pressable>
                            </View>
                            :
                            <></>
                        }
                          
                        
                    </View>

                </Animated.View>
                :
                <></>
            }       

        </View>
    }
        
    
    </View>
    );
    
}

const styles = StyleSheet.create({
    cajaCabeza: {
        backgroundColor: Colors.$blanco,
        justifyContent: 'flex-end',
        alignItems: 'flex-start',
        height: 120,
        width: Dimensions.get('window').width,
        position: 'relative',
        zIndex: 100
    },
    iconBici: {
        width: 50,
        height: 50
    },
    cajaCabeza2: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 150,
        width: Dimensions.get('window').width,
        position: 'absolute',
        top: 10,
        zIndex: 100
    },
    cajaTitle: {
        width: Dimensions.get('window').width*.8,
        position: 'absolute',
        bottom: 0,
        left: 30,
    },
    title: {
        fontFamily: Fonts.$poppinsmedium,
        fontSize: 24,
        textAlign: 'left',
        color: Colors.$texto,
        backgroundColor: Colors.$blanco,
        width: '60%',
        marginLeft: 30
    },
    subtitle: {
        fontFamily: Fonts.$poppinsregular,
        fontSize: 16,
        textAlign: 'left',
        color: Colors.$texto,
        marginLeft: 30
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
        width: 50,
        height: 50,
    },
    cajaTextVehiuclosDisponible: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: 80,
        height: 80,
        borderRadius: 10,
        backgroundColor: Colors.$disponible
    },
    cajaTextVehiuclosReservada: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: 80,
        height: 80,
        borderRadius: 10,
        backgroundColor: Colors.$reservada
    },
    cajaTextVehiuclosPrestada: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: 80,
        height: 80,
        borderRadius: 10,
        backgroundColor: Colors.$prestada
    },
    cajaTextVehiuclosInactiva: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: 80,
        height: 80,
        borderRadius: 10,
        backgroundColor: Colors.$inactiva
    },
    cajaTextVehiuclosTaller: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: 80,
        height: 80,
        borderRadius: 10,
        backgroundColor: Colors.$taller
    },
    cajaTextVehiuclosSinEstado: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: 80,
        height: 80,
        borderRadius: 10,
        backgroundColor: 'white'
    },
    iconVehiculos: {
        width: 100,
        height: 100,
        borderRadius: 50
    }
})

const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
      fontSize: 13,
      paddingVertical: 8,
      borderBottomWidth: 1,
      backgroundColor: "transparent",
      paddingLeft: 15,
      marginLeft: 20,
      marginRight: 20,
      borderColor: '#8ac43f',
      borderWidth: 2,
      borderRadius: 25,
      marginTop: 15,
      color: '#878787',
      height: 40,
      marginBottom: 30,
    },
    inputAndroid: {
      marginLeft: 20,
      marginRight: 20,
      borderColor: '#CCCCCC',
      borderWidth: 2,
      borderRadius: 25,
      marginBottom: 30,
      fontSize: 20,
      paddingHorizontal: 10,
      borderBottomWidth: 1,
      marginTop: 10,
      paddingBottom: 10,
      color: '#878787',
      backgroundColor: "#CCCCCC",
      height: 50,
    },
    registerTitleContainer:{
      color: '#f60',
    },
    accountTitle:{
      marginBottom: 1,
    },
});

function mapStateToProps(state) {
    return {
        dataUser: state.userReducer,
        //navigationProp: state.globalReducer.nav._navigation,
        dataRent: state.reducer3G,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        //getVehicles: (dato) => dispatch(getVehicles(dato)),
        //saveVehicleSelect: (dato) => dispatch(saveVehicleSelect(dato)),
        //verifyTripActive: (user) => dispatch(verifyTripActive(user)),
        //deleteFoto: () => dispatch(deleteFoto())
    }
}

export default connect(mapStateToProps)(MyVehicleScreen);