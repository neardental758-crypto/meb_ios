import React, { useState, useEffect, useContext } from 'react';
import {
    Image,
    ImageBackground,
    SafeAreaView,
    Text,
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
    reset_register_vp
} from '../../actions/actions3g';
import Overlay from 'react-native-modal-overlay';
import ModalPhotoDocument from '../../Components/ModalPhotoDocument';
import { Content } from 'native-base';
import Images from '../../Themes/Images';
import {Dimensions} from 'react-native';
import Colors from '../../Themes/Colors';
import Fonts from '../../Themes/Fonts';
import { connect } from 'react-redux';
import { useDispatch } from 'react-redux';
import RNPickerSelect from '@nejlyg/react-native-picker-select';
import { horizontalScale, moderateScale, verticalScale } from '../../Themes/Metrics';
import estilos from './styles/estilos.style';
import estilosRegister from './styles/register.style';
import * as RootNavigation from '../../RootNavigation';
import { AuthContext } from '../../AuthContext';
import { v4 as uuidv4 } from 'uuid';
import LottieView from 'lottie-react-native';

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
    });
    const [isChecked, setIsChecked] = useState('');
    const [formRegistro, setFormRegistro] = useState(false);
    const [modalFoto, setModalFoto] = useState(false);
    const [tipoSelect, setTipoSelect] = useState('');
    

    const toggleCheck = (id) => {
        setIsChecked(id);
    };

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
                        <View style={{ flex: 3, borderRadius: 6, marginVertical: 0, marginHorizontal: 0, backgroundColor: Colors.$blanco, justifyContent: "center", alignItems: "center", paddingHorizontal: 25, position: "relative" }}>
                            <View style={{
                                justifyContent: "center", 
                                alignItems: "center", 
                                width: Dimensions.get('window').width,
                                height: 'auto',     
                                position: 'absolute',
                                top: 0
                            }}>
                                <LottieView source={require('../../Resources/Lotties/bicy_confetti.json')} autoPlay loop 
                                style={{
                                width: Dimensions.get('window').width,
                                height: Dimensions.get('window').width              
                                }}/>
                            </View> 
                            <View style={{
                                justifyContent: "center", 
                                alignItems: "center", 
                                width: Dimensions.get('window').width,
                                height: 'auto',
                            }}>
                                <LottieView source={require('../../Resources/Lotties/bicy_01.json')} autoPlay loop 
                                style={{
                                width: Dimensions.get('window').width,
                                height: Dimensions.get('window').width              
                                }}/>
                            </View> 

                            <Text style={{ 
                                textAlign: "center", 
                                color: Colors.$texto,
                                fontSize: 22, 
                                marginTop: 20,
                                fontFamily: Fonts.$poppinsregular
                            }}
                            >¡Felicitaciones!</Text>     
                            <Text style={{ 
                                textAlign: "center", 
                                color: Colors.$texto,
                                fontSize: 18, 
                                marginTop: 10,
                                fontFamily: Fonts.$poppinsregular
                            }}
                            >Tu vehículo ha sido registrado exitosamente</Text>                      
                            
                            <View style={{
                                marginTop: 40,
                                flexDirection: 'row',
                                justifyContent: 'space-between'
                            }}>
                                <View style={{ marginRight: 8 }}>
                                    <Pressable 
                                        onPress={() => { 
                                            //displayBackgroundInfoModal(false)
                                            //home()
                                            reset_save_vp()

                                        }} 
                                        style={{    
                                        textAlign: "center",
                                        padding  : 10,
                                        margin : 20,
                                        backgroundColor : Colors.$primario,
                                        borderRadius : 50}}> 
                                        <Text style={[styles.textButton, {width : 200, color : 'white', fontFamily: Fonts.$poppinsregular}]}>Continuar</Text>
                                    </Pressable>
                                </View>
                            </View>
                        </View>

                        

                    </View>
                </Modal>
            </View>
        )
        //Abrir el modal de backgrund info
    }
    const [guardando, setGuardando] = useState(false);

    const reset_save_vp = async () => {
        await setState({ ...state, 
            vehiculoSelect: '',
            marca: '',
            modelo: '',
            cilindraje: '',
            serial: '',
            color: '',
            registerOk: false
        })
        await setFormRegistro(false);
        await setTipoSelect('');
        await dispatch(reset_register_vp());
        await setGuardando(false);
        await home();
    }

    const verState = () => { 
        console.log('EL STATE ACT::::: ', state )
        console.log('time::::: ', new Date().getTime() )
    }

    const verState2 = () => { 
        console.log('EL STATE ACT::::: ', props) 
    }
    
    const home = async () => {
        await setIsChecked('');
        await setTipoSelect('');
        await setFormRegistro(false);
        await RootNavigation.navigate('MyVehiclesScreen');
    }

    const getTypeVP = async() => {
        //await props.getType_vp();
        await dispatch(getType_vp());
    }

    const registerVP = async() => {
        setGuardando(true)
        let hoy = new Date(); //con conexion a mysql
        const data = {
            "vus_id": uuidv4(),
            "vus_usuario": infoUser.DataUser.idNumber,
            "vus_tipo": tipoSelect,
            "vus_marca": state.marca,
            "vus_modelo": state.modelo,
            "vus_cilindraje": (state.cilindraje !== '') ? state.cilindraje : 'NO APLICA',
            "vus_color": state.color,
            "vus_serial": state.serial,
            "vus_fecha_registro": hoy.toJSON(),
            "vus_estado": "ACTIVA"
        }
        console.log('data', data);
        await dispatch(register_vp(data))
        //displayBackgroundInfoModal(true)
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

    const closeModal = () => {
        setModalFoto(false)
    };

    const abrirModal = () => {
        setModalFoto(true)
    }

    const continuar  = () => {
        setFormRegistro(true)
    } 

    const viewImg = (tipo) => {
        switch (tipo) {
            case 'Bicicleta':
                return Images.vpbici;
            case 'Carro':
                return Images.vpCarro;
            case 'E-Scooter':
                return Images.vpScooter;
            case 'Moto':
                return Images.vpMoto;
            case 'E-Bike':
                return Images.vpEbike;
            case 'E-Moto':
                return Images.vpEMoto;
            case 'Carro Eléctrico':
                return Images.vpECar;
            case 'Otros':
                return Images.vpHelicoptero;
            default:
                return Images.vpbike;
        }
    }
   
    return (        
    <View style={styles.generales}>
        <ScrollView>
        {(props.dataRent.registerVPU_save) ? openBackgroundInfoModal() : <></>}
        <View style={styles.cajaCabeza}>
            <Pressable  
                onPress={() => { home() }}
                style={ styles.btnAtras }>
                <View>
                <Image source={Images.iconoatras} style={[styles.iconMenu]}/> 
                </View>
            </Pressable>
            <View style={ styles.cajaTitle}>
                <Text style={styles.title}>
                    {
                        formRegistro ? 'Completa el Registro de tu Transporte' : 'Registra tu Vehículo'
                    }
                    
                </Text>
                <Text style={styles.subtitle}>
                    {
                        formRegistro ? '¿Cómo se ve tu vehículo?' : 'Elige el tipo de vehículo que vas a registrar.'
                    }
                </Text>
            </View>               
        </View>

        {
            formRegistro ? //valor inicial sin !
            <View style={styles.safeArea}>

                <View style={{ 
                    width: Dimensions.get('window').width, 
                    height: Dimensions.get('window').height*.2,
                    alignItems: 'center',
                    justifyContent: 'center', 
                    marginTop: 20           
                }}>                    
                    {
                        props.documentUser.assets && props.documentUser.assets.length > 0
                        ?
                        <View style={{
                            flexDirection: 'colomn',
                            alignItems: 'center',
                            justifyContent: 'space-around',
                            
                        }}>
                            {/*<View>
                                <Text style={styles.labelInput_2}>Imágen Seleccionada</Text>
                                <Text style={[styles.labelInput_2, { fontFamily: Fonts.$poppinsregular, opacity: 0.5, maxWidth: 150, alignSelf: 'center', marginTop: 5 }]}>{props.documentUser?.assets[0]?.fileName}</Text>
                            </View>*/}

                            <View>
                                <Image source={{ uri: props.documentUser?.assets[0]?.uri }}
                                    style={{ width: 140, height: 140, marginBottom: 5, borderRadius: 70 }} />
                                <Pressable 
                                    onPress={() => { abrirModal() }} 
                                    style={{ 
                                        position: "relative",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        marginTop: 10,
                                    }}>
                                    <Text style={{
                                        color: Colors.$blanco,
                                        fontFamily: Fonts.$poppinsregular,
                                        color: Colors.$texto80
                                    }}>Editar</Text>
                                </Pressable>
                            </View>
                        </View>
                        :
                        <View style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-around',
                            width: '100%',
                            height: 200,
                        }}>
                            
                            <Pressable 
                                onPress={() => { abrirModal() }}
                                style={{ 
                                    width: 120,
                                    height: 120,
                                    borderRadius: 60,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    backgroundColor: Colors.$texto20,
                                }}
                            >
                                <Image source={Images.cameraRed} style={[styles.iconCamara]}/> 
                            </Pressable>                            
                        </View>
                    }

                    <Overlay
                        containerStyle={styles.overlay}
                        visible={modalFoto}  
                        childrenWrapperStyle={styles.modalsContainer}
                        onClose={closeModal}
                        closeOnTouchOutside>
                        <ModalPhotoDocument onClosePress={closeModal} />
                    </Overlay>

                </View> 

                <View style={styles.formularioVP}>
                        <View style={styles.divInput}>
                            <TextInput
                                style={[styles.input]}
                                value={state.marca}
                                placeholder="Marca"
                                placeholderTextColor={Colors.$texto50}
                                onChangeText={objectName => setState({ ...state, marca: objectName })}
                            />
                        </View>

                        <View style={styles.divInput}>
                            <TextInput
                                style={[styles.input]}
                                value={state.modelo}
                                placeholder="Modelo"
                                placeholderTextColor={Colors.$texto50}
                                onChangeText={objectName => setState({ ...state, modelo: objectName })}
                            />
                        </View>

                        <View style={styles.divInput}>
                            <TextInput
                                style={[styles.input]}
                                value={state.color}
                                placeholder="Color"
                                placeholderTextColor={Colors.$texto50}
                                onChangeText={objectName => setState({ ...state, color: objectName })}
                            />
                        </View>
                        
                        {
                            (tipoSelect === 'Carro' || tipoSelect === 'Moto') ?
                            <View style={styles.divInput}>
                                <TextInput
                                    style={[styles.input]}
                                    value={state.cilindraje}
                                    placeholder="Cilindraje"
                                    placeholderTextColor={Colors.$texto50}
                                    onChangeText={objectName => setState({ ...state, cilindraje: objectName })}
                                />
                            </View>
                            :
                            <></>
                        }
                        
                        <View style={styles.divInput}>
                            <TextInput
                                style={[styles.input]}
                                value={state.serial}
                                placeholder= { state.vehiculoSelect === 'Carro' || state.vehiculoSelect === 'Moto' ? 'Placa' : 'Serial'}
                                placeholderTextColor={Colors.$texto50}
                                onChangeText={objectName => setState({ ...state, serial: objectName })}
                            />
                        </View>                    
                        
                </View>

                {   
                    (state.marca !== '' && state.modelo !== '' && state.serial !== '' && state.color !== '') && (props.documentUser.assets && props.documentUser.assets.length > 0) ? 
                    <>
                    {
                        guardando ?
                        <View style={{
                            justifyContent: "center", 
                            alignItems: "center", 
                            width: 120,
                            height: 'auto',
                        }}>
                            <Text style={{
                                textAlign: "center",
                                width: 300,
                                fontSize: 18,
                                fontFamily: Fonts.$poppinsregular
                            }}>Estamos guardando tu vehículo</Text>
                            <LottieView source={require('../../Resources/Lotties/bicy_loader.json')} autoPlay loop 
                            style={{
                            width: 120,
                            height: 120             
                            }}/>
                            
                        </View> 
                        :
                        <Pressable onPress={() => registerVP() } 
                            style={{    
                            textAlign: "center",
                            padding  : 10,
                            margin : 20,
                            backgroundColor : Colors.$primario,
                            borderRadius : 50}}> 
                            <Text style={[styles.textButton, {width : 250, color : Colors.$blanco, fontFamily: Fonts.$poppinsregular}]}>Guardar</Text>
                        </Pressable>
                    }
                    </>
                    
                    :
                    <Pressable onPress={() => console.log('registrar') } 
                        style={{    
                        textAlign: "center",
                        padding  : 10,
                        margin : 20,
                        backgroundColor : Colors.$secundario,
                        borderRadius : 50}}> 
                        <Text style={[styles.textButton, {width : 250, color : Colors.$texto, fontFamily: Fonts.$poppinsregular}]}>Guardar</Text>
                    </Pressable>
                }
               
            </View>
            :
            <View style={styles.safeArea}>
                <View style={styles.contenedor}>
                    <View style={{
                        width: Dimensions.get('window').width,
                        alignItems: 'center'
                    }}>
                    {
                        (props.dataRent.tipoVPCargadas === true) ? //estado inicial true
                        <>
                            {
                            props.dataRent.tiposVP.data.map((data) =>
                            <View
                                key={data.tip_id}  
                                //onPress={() => { vehicleSelect(data)}}
                                style={styles.btnVehiculos}>
                                <View style={styles.cajaTextVehiuclos}>
                                    <Image source={viewImg(data.tip_nombre)} style={[styles.iconBici, {tintColor : Colors.$texto}]}/> 
                                    <View style={{ 
                                            width: '60%',
                                            height: '100%',
                                            flexDirection: 'column',
                                            alignItems: 'flex-start',
                                            justifyContent: 'center',
                                        }}>
                                        <Text style={styles.textVehiculo}>{data.tip_nombre}</Text>
                                    </View>   
                                    <View style={styles.CajaHorCenter}>
                                        { isChecked === data.tip_id ?
                                        <Pressable
                                        onPress={() => {
                                            toggleCheck(''),
                                            setTipoSelect('')
                                        }}
                                        style={styles.btnCheckOK}
                                        />:
                                        <Pressable
                                        onPress={() => {
                                            toggleCheck(data.tip_id),
                                            setTipoSelect(data.tip_nombre)
                                        }}
                                        style={styles.btnCheck}
                                        />
                                        }
                                    </View>      
                                </View>
                            </View> 
                            )}                                                
                        </>
                        :
                        <></>
                    }                    
                    </View>         
                </View>
            {
                isChecked !== '' && tipoSelect !== '' ?
                <View style={styles.boxBtns}>   
                    <Pressable onPress={() => continuar() } 
                        style={{    
                        textAlign: "center",
                        padding  : 10,
                        margin : 20,
                        backgroundColor : Colors.$primario,
                        borderRadius : 50}}> 
                        <Text style={[styles.textButton, {width : 250, color : Colors.$blanco, fontFamily: Fonts.$poppinsregular}]}>Continuar</Text>
                    </Pressable>
                </View>  
                :
                <View style={styles.boxBtns}>   
                    <Pressable onPress={() => console.log('continuar') } 
                        style={{    
                        textAlign: "center",
                        padding  : 10,
                        margin : 20,
                        backgroundColor : Colors.$secundario,
                        borderRadius : 50}}> 
                        <Text style={[styles.textButton, {width : 250, color : Colors.$texto, fontFamily: Fonts.$poppinsregular}]}>Continuar</Text>
                    </Pressable>
                </View>
            }        
            </View>
        }
        </ScrollView>
    </View>
    );
    
}

const styles = StyleSheet.create({
    generales: {
        flex: 1,
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
        alignItems: 'center', 
        justifyContent: 'space-between',
        backgroundColor: Colors.$blanco
    },
    contenedor:{
        flex: 1,
        paddingTop: 30,
        width: Dimensions.get('window').width,
       backgroundColor: Colors.$blanco
    },
    divInput: {
        width: 300,
        borderRadius: 30,
        marginBottom: 10,
    },
    formularioVP:{
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height*.4,
        alignItems: 'center',
        justifyContent: 'center',
    },
    input:{
        width: '100%',
        height: 'auto',
        fontSize: 18,
        fontFamily: Fonts.$poppinsregular,
        justifyContent: 'center',
        textAlign: 'start',
        paddingLeft: 30,
        borderWidth: 3,
        borderColor: Colors.$blanco,
        borderRadius: 30,
        backgroundColor : Colors.$blanco, 
        shadowColor: Colors.$texto,
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 4.29,
        shadowRadius: 4.65,
        elevation: 7,       
    },
    safeArea: {
        width: Dimensions.get('window').width,
        minHeight: Dimensions.get('window').height*.75,
        alignItems: 'center',
    },
    labelInput_2: {
        width: "100%",
        fontFamily: Fonts.$poppinsregular,
        fontSize: 20, 
        color: Colors.$texto, 
    },
    btnCheckOK: {
        width: 20,
        height: 20,
        borderWidth : 3,
        borderColor : Colors.$adicional,
        borderRadius : 100,
        backgroundColor: Colors.$adicional,
        marginRight: 5,
    },
    btnCheck: {
        width: 20,
        height: 20,
        borderWidth : 3,
        borderColor : Colors.$texto20,
        backgroundColor: Colors.$texto20,
        borderRadius : 100,
        marginRight: 5,
    },
    CajaHorCenter:{
        flexDirection: 'row',
        alignItems:'right',
        marginTop:5,
    },
    cajaCabeza: {
        backgroundColor: Colors.$blanco,
        justifyContent: 'center',
        alignItems: 'center',
        height: Dimensions.get('window').height*.2,
        width: Dimensions.get('window').width,
        position: 'relative',
        zIndex: 100,
    },
    cajaTitle: {
        width: Dimensions.get('window').width*.7,
        position: 'absolute',
        bottom: 0
    },
    title: {
        width: Dimensions.get('window').width*.8,
        fontFamily: Fonts.$poppinsmedium,
        fontSize: 22,
        textAlign: 'left',
        color: Colors.$texto,
    },
    subtitle: {
        fontFamily: Fonts.$poppinsregular,
        width: Dimensions.get('window').width*.8,
        fontSize: 16,
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
    iconCamara: {
        width: 100,
        height: 100,
        tintColor: Colors.$texto
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
            width: 1,
            height: 1,
        },
        shadowOpacity: 1.29,
        shadowRadius: 1.65,
        elevation: 2,
    },
    cajaTextVehiuclos: {
        width: "100%",
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        borderRadius: 40,
    },
    iconBici: {
        width: 40,
        height: 40,
    },
    textVehiculo: {
        fontSize: 20,
        color: Colors.$texto,
        textAlign: 'center',
        fontFamily: Fonts.$poppinsregular,
    },
    boxBtns: {
        width: Dimensions.get("window").width, 
        alignItems: "center", 
        justifyContent: "space-around", 
        flexDirection: "column",
    },
    textButton : {
        fontFamily: Fonts.$poppinsregular, 
        textAlign: "center", 
        fontSize: 18, 
        paddingTop: 'auto', 
        paddingBottom: 'auto', 
        color: 'white',
        color: Colors.$blanco,
        alignSelf: "center",
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
        documentUser: state.userReducer.documentUser,
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