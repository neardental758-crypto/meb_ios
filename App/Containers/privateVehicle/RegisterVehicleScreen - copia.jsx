import React, { useState, useEffect, useContext } from 'react';
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
    ScrollView,
    Pressable
} from 'react-native';
import { 
    getType_vp,
    register_vp,
} from '../../actions/actions3g';
import { Content } from 'native-base';
import Images from '../../Themes/Images';
import {Dimensions} from 'react-native';
import Colors from '../../Themes/Colors';
import Fonts from '../../Themes/Fonts';
import { connect } from 'react-redux';
import { useDispatch } from 'react-redux';
import RNPickerSelect from  '@nejlyg/react-native-picker-select';
import { horizontalScale, moderateScale, verticalScale } from '../../Themes/Metrics';
import estilos from './styles/estilos.style';
import estilosRegister from './styles/register.style';
import * as RootNavigation from '../../RootNavigation';
import { AuthContext } from '../../AuthContext';
import { v4 as uuidv4 } from 'uuid';

function RegisterVehicleScreen(props){

    const { infoUser } = useContext( AuthContext );
    const dispatch = useDispatch();

    const [ state , setState ] = useState({
        user: '',
        vehiculoSelect: '',
        marca: '',
        modelo: '',
        cilindraje: '',
        serial: '',
        color: '',
        registerOk: false,
        isOpenBackgroundInfoModal: false
    });

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
                                justifySelf: 'center', width: 260,
                                height: 80,
                            }} source={Images.logoHome} />

                            <Text style={{ 
                                textAlign: "center", 
                                color: Colors.$secundario,
                                fontSize: 22, 
                                fontWeight: "700", 
                                marginTop: 20 }}
                            >Vehículo guardado correctamente</Text>
                            
                            
                            
                            <View style={{
                                marginTop: 40,
                                flexDirection: 'row',
                                justifyContent: 'space-between'
                            }}>
                                <View style={{ marginRight: 8 }}>
                                    <Button
                                        title="ACEPTAR"
                                        color={Colors.$primario}
                                        onPress={() => { displayBackgroundInfoModal(false), home()}}
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

    const verState = () => { 
        console.log('EL STATE ACT::::: ', state )
        console.log('time::::: ', new Date().getTime() )
    }

    const verState2 = () => { 
        console.log('EL STATE ACT::::: ', props) 
    }
    
    const goBack = () => {
        RootNavigation.navigate('VehiculoParticular');
    }
    const home = () => {
        RootNavigation.navigate('VehiculoParticular');
    }

    const getTypeVP = async() => {
        //await props.getType_vp();
        await dispatch(getType_vp());
    }

    const registerVP = async() => {
        
        let hoy = new Date(); //con conexion a mysql
        const data = {
            "vus_id": uuidv4(),
            "vus_usuario": infoUser.DataUser.idNumber,
            "vus_tipo": state.vehiculoSelect,
            "vus_marca": state.marca,
            "vus_modelo": state.modelo,
            "vus_cilindraje": (state.cilindraje !== '') ? state.cilindraje : 'NO APLICA',
            "vus_color": state.color,
            "vus_serial": state.serial,
            "vus_fecha_registro": hoy.toJSON(),
            "vus_estado": "ACTIVA"
        }
        //await props.register_vp(data);
        await dispatch(register_vp(data))
        displayBackgroundInfoModal(true)
    }

    const save_ok = () => {
        Alert.alert("Tu vehículo se regsitró exitosamente",":)",
            [{ text: "OK", onPress: () => {
                props.navigationProp.navigate('MyVehiclesScreen');
            }}]
        );
    }

    useEffect(() => {
        getTypeVP();
    },[])

   
    return (
        
        <View  style={estilos.generales}>
            {(state.isOpenBackgroundInfoModal) ? openBackgroundInfoModal() : <></>}
            <View style={styles.cajaCabeza}>
                <Pressable  
                    onPress={() => { goBack() }}
                    style={ styles.btnAtras }>
                    <View>
                    <Image source={Images.menu_icon} style={[styles.iconMenu]}/> 
                    </View>
                </Pressable>
                <View style={ styles.cajaTitle}>
                    <Text style={styles.title}>Registra tu vehículo</Text>
                    <Text style={styles.subtitle}>Elige el tipo de vehículo que vas a registrar.</Text>
                </View>               
            </View>
            <SafeAreaView style={estilos.safeArea}>
            <ScrollView>
                <View style={estilos.contenedor}>
                <View style={{
                    width: Dimensions.get('window').width,
                    backgroundColor: 'violet',
                    alignItems: 'center'
                }}>
                {
                    (props.dataRent.tipoVPCargadas === true) ? //estado inicial true
                    <>
                        {/*<RNPickerSelect
                            style={pickerSelectStyles}
                            placeholder={{ label: 'Tipo vehículo particular', value: '' }}
                            useNativeAndroidPickerStyle={false}
                            value={ state.vehiculoSelect}
                            onValueChange={
                                (value) => { 
                                    setState({ 
                                        ...state, 
                                        vehiculoSelect: value,
                                        marca: '',
                                        modelo: '',
                                        cilindraje: '',
                                        serial: '',
                                        color: '',
                                    })
                                }
                            }
                            items={props.dataRent.tiposVP.data.map((data) =>
                                ({ label: data.tip_nombre, value: data.tip_nombre }))
                            }

                            Icon={() => {
                                return (
                                <Image source={Images.iconPickerWhite} style={{ top: 25, right: 50, height: 25, width: 25, resizeMode: 'contain' }} />
                                );
                            }}
                        />*/}
                        <>
                        {
                        props.dataRent.tiposVP.data.map((data) =>
                        <Pressable
                            key={data.tip_id}  
                            onPress={() => { vehicleSelect(data)}}
                            style={styles.btnVehiculos}>
                            <View style={styles.cajaTextVehiuclos}>
                                <Image source={Images.peaton_Icon} style={[styles.iconBici, {tintColor : 'black'}]}/> 
                                <View style={{ 
                                        width: '50%',
                                        height: '100%',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}>
                                    <Text style={styles.textVehiculo}>{data.tip_nombre}</Text>
                                </View>         
                            </View>
                        </Pressable> 
                        )}
                        </>
                                                
                    </>
                    :
                    <></>
                }                    
                </View>
                {/**Cambio de img carro*/}
                <>
                {
                    (state.vehiculoSelect === 'Carro') ? 
                    <View style={estilos.formularioVP}>
                        <View style={estilos.contentImg2}>
                            <Image 
                                style={estilos.ziseImg2} 
                                source={Images.vehicleP_carro} />    
                        </View> 
                    </View>
                    :
                    <></>
                }
                </>
                {/**Cambio de img bicicleta*/}
                <>
                {
                    (state.vehiculoSelect === 'Bicicleta') ? 
                    <View style={estilos.formularioVP}>
                        <View style={estilos.contentImg2}>
                            <Image 
                                style={estilos.ziseImg2} 
                                source={Images.vehicleP_bici} />    
                        </View> 
                    </View>
                    :
                    <></>
                }
                </>
                {/**Cambio de img scooter*/}
                <>
                {
                    (state.vehiculoSelect === 'Scooter') ? 
                    <View style={estilos.formularioVP}>
                        <View style={estilos.contentImg2}>
                            <Image 
                                style={estilos.ziseImg2} 
                                source={Images.vehicleP_patineta} />    
                        </View> 
                    </View>
                    :
                    <></>
                }
                </>
                {/**Cambio de img Moto*/}
                <>
                {
                    (state.vehiculoSelect === 'Moto') ? 
                    <View style={estilos.formularioVP}>
                        <View style={estilos.contentImg2}>
                            <Image 
                                style={estilos.ziseImg2} 
                                source={Images.vehicleP_moto} />    
                        </View> 
                    </View>
                    :
                    <></>
                }
                </>

                {/**Cambio de img ebike*/}
                <>
                {
                    (state.vehiculoSelect === 'Ebike') ? 
                    <View style={estilos.formularioVP}>
                        <View style={estilos.contentImg2}>
                            <Image 
                                style={estilos.ziseImg2} 
                                source={Images.vehicleP_ebike} />    
                        </View> 
                    </View>
                    :
                    <></>
                }
                </>


                <>
                {
                    (state.vehiculoSelect !== '') ? 
                    <View style={estilosRegister.formularioVP}>
                        <View style={estilosRegister.divInput}>
                            <TextInput
                                style={[estilosRegister.input]}
                                value={state.marca}
                                placeholder="Marca"
                                placeholderTextColor="black"
                                onChangeText={objectName => setState({ ...state, marca: objectName })}
                            />
                        </View>

                        <View style={estilosRegister.divInput}>
                            <TextInput
                                style={[estilosRegister.input]}
                                value={state.modelo}
                                placeholder="Modelo"
                                placeholderTextColor="black"
                                onChangeText={objectName => setState({ ...state, modelo: objectName })}
                            />
                        </View>

                        <View style={estilosRegister.divInput}>
                            <TextInput
                                style={[estilosRegister.input]}
                                value={state.color}
                                placeholder="Color"
                                placeholderTextColor="black"
                                onChangeText={objectName => setState({ ...state, color: objectName })}
                            />
                        </View>
                        
                        {
                            (state.vehiculoSelect === 'Carro' || state.vehiculoSelect === 'Moto') ?
                            <View style={estilosRegister.divInput}>
                                <TextInput
                                    style={[estilosRegister.input]}
                                    value={state.cilindraje}
                                    placeholder="Cilindraje"
                                    placeholderTextColor="black"
                                    onChangeText={objectName => setState({ ...state, cilindraje: objectName })}
                                />
                            </View>
                            :
                            <></>
                        }
                        
                        <View style={estilosRegister.divInput}>
                            <TextInput
                                style={[estilosRegister.input]}
                                value={state.serial}
                                placeholder= { state.vehiculoSelect === 'Carro' || state.vehiculoSelect === 'Moto' ? 'Placa' : 'Serial'}
                                placeholderTextColor="black"
                                onChangeText={objectName => setState({ ...state, serial: objectName })}
                            />
                        </View>

                        
                        
                    </View>
                    :
                    <></>
                }
                </>

                <>
                {
                    (state.registerOk === true) ?
                    save_ok()
                    :
                    <Text></Text>
                }
                </>
                {
                    (state.vehiculoSelect === 'Bicicleta' || state.vehiculoSelect === 'Scooter'|| state.vehiculoSelect === 'Ebike') ? 
                    
                        (state.marca !== '' && state.modelo !== '' && state.serial !== '' && state.color !== '') ? 
                        <TouchableOpacity  onPress={() => { registerVP() }} style={estilos.btnCenter}>
                            <View style={estilos.btnSaveOK}>
                                <Text style={estilos.btnSaveColor}>Guardar {state.vehiculoSelect}</Text>
                            </View>
                        </TouchableOpacity>:
                        <TouchableOpacity  onPress={() => { console.log('faltan campos') }} style={estilos.btnCenter}>
                            <View style={estilos.btnSave}>
                                <Text style={estilos.btnSaveColor2}>Campos Vacios</Text>
                            </View>
                        </TouchableOpacity>
                    
                    : 
                        
                        (state.vehiculoSelect !== '') ? 
                        <>
                        {(state.marca !== '' && state.modelo !== '' && state.cilindraje !== '' && state.serial !== '' && state.color !== '') ? 
                        <TouchableOpacity  onPress={() => { registerVP() }} style={estilos.btnCenter}>
                            <View style={estilos.btnSaveOK}>
                                <Text style={estilos.btnSaveColor}>Guardar {state.vehiculoSelect}</Text>
                            </View>
                        </TouchableOpacity>:
                        <TouchableOpacity  onPress={() => { console.log('faltan campos') }} style={estilos.btnCenter}>
                            <View style={estilos.btnSave}>
                                <Text style={estilos.btnSaveColor2}>Campos Vacios</Text>
                            </View>
                        </TouchableOpacity>}
                        </>:<></>
                        
                }
                </View>
            </ScrollView>
            </SafeAreaView>
        </View>
    );
    
}

const styles = StyleSheet.create({
    cajaCabeza: {
        backgroundColor: Colors.$blanco,
        justifyContent: 'center',
        alignItems: 'center',
        height: 160,
        width: Dimensions.get('window').width,
        position: 'relative',
        zIndex: 100,
        paddingTop: 60
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
    },
    subtitle: {
        fontFamily: Fonts.$poppinsregular,
        fontSize: 18,
        textAlign: 'left',
        color: Colors.$texto,
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
    btnVehiculos: {
        width: Dimensions.get('window').width*.9,
        height: 60,
        backgroundColor: Colors.$blanco,
        margin: 10,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 40,
        shadowColor: Colors.$texto,
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 4.29,
        shadowRadius: 4.65,
        elevation: 7,
    },
    cajaTextVehiuclos: {
        width: "100%",
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        borderRadius: 40,
    },
    iconBici: {
        width: 60,
        height: 60,
    },
    textVehiculo: {
        fontSize: 16,
        color: Colors.$texto,
        textAlign: 'center',
        fontFamily: Fonts.$poppinsregular
    },
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
      borderColor: Colors.$primario,
      borderWidth: 2,
      borderRadius: 25,
      marginTop: 15,
      color: 'black',
      height: 40,
      marginBottom: 30,
    },
    inputAndroid: {
      marginLeft: 20,
      marginRight: 20,
      borderColor: Colors.$texto,
      borderWidth: 2,
      borderRadius: 25,
      marginBottom: 30,
      marginTop: 30,
      fontSize: 16,
      paddingHorizontal: 1,
      borderBottomWidth: 1,
      marginTop: 10,
      paddingLeft: 0,
      color: Colors.$blanco,
      backgroundColor: Colors.$texto,
      width: Dimensions.get('window').width*.9,
      height: 50,
      textAlign: 'center',
    },
    placeholder: {
        color: Colors.$blanco,
        fontSize: 20,
    },
    registerTitleContainer:{
      color: '#ffffff',
    },
    accountTitle:{
      marginBottom: 1,
    },
});

function mapStateToProps(state) {
    return {
        dataUser: state.userReducer,
        dataRent: state.reducer3G,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        getType_vp: () => dispatch(getType_vp()),
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(RegisterVehicleScreen);