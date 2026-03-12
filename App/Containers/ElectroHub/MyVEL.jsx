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
    Animated,
    Modal,
    TextInput
} from 'react-native';
import React, { useState, useEffect, useContext, useRef } from 'react';
import { 
    getVehicles,
    deleteFoto,
} from '../../actions/actions3g';
import { 
    save_vel
} from '../../actions/actionParqueadero';
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
import { async } from 'validate.js';
import { LocationTrackingComponent } from './LocationTrackingComponent';
import ModalPhotoDocument from '../../Components/ModalPhotoDocument';
import Overlay from 'react-native-modal-overlay';

function MyVEL(props){

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
        img: '',
        registerOk: false,
    });
    const [vehSelect, setVehSelect] = useState('');
    const [modalUpdate, setModalUpdate] = useState(false);
    const [modalFoto, setModalFoto] = useState(false);

    const closeModal = () => {
        setModalFoto(false)
    };

    const abrirModal = () => {
        setModalFoto(true)
    }
    
    const home = () => {RootNavigation.navigate('Home_electrohub')}
    const register = () => {RootNavigation.navigate('RegisterVEL')}

    const viewVehicles = async(dato) => {dispatch(getVehicles(dato))}

    const vehicleSelect = async(id) => {
        console.log('Cambiando VEL', id);
        await setVehSelect(id)
        await dispatch(save_vel(id));
        //await RootNavigation.navigate('Home_electrohub')
    }

    const sinImagen = (tipo) => {
        switch (tipo) {
            case 'e-Scooter':
            return Images.vpBicicleta;
            case 'e-Moto':
            return Images.vpBicicleta;
            case 'e-Bike':
            return Images.vpBicicleta;
            default:
            return Images.vpBicicleta;
        }        
    }

    const openModalUpdate = () => {
        return (
        <View style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
        }}>
            <Modal transparent={true} animationType="slide">
                <View style={{ backgroundColor: Colors.$texto80, flexDirection: "column", flex: 1 }}>
                    <View style={styles_qr.modalStyle}>
                        
                        <View style={{
                            justifyContent: "center", 
                            alignItems: "center", 
                            width: 120,
                            height: 120,                                
                        }}>
                            {
                                props.documentUser.assets && props.documentUser.assets.length > 0
                                ?
                                <View style={{
                                    flexDirection: 'colomn',
                                    alignItems: 'center',
                                    justifyContent: 'space-around',
                                    
                                }}>
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
                                            width: 80,
                                            height: 80,
                                            borderRadius: 60,
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            backgroundColor: Colors.$texto20,
                                        }}
                                    >
                                        <Image source={{ uri: state.img }} style={{ width: 100, height: 100 }}/> 
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
                                
                                {/*
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
                                */}
                                
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
                        </View>                               
    
                        <Pressable 
                            onPress={() => { 
                                setModalUpdate(false)
                            }} 
                            style={{    
                            textAlign: "center",
                            padding  : 10,
                            margin : 20,
                            backgroundColor : Colors.$primario,
                            borderRadius : 50}}> 
                            <Text style={{width: 200, color: 'white', fontFamily: Fonts.$poppinsregular, textAlign: 'center', fontSize: 18}}>Actualizar</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>
        </View>
        )
    }

    useEffect(() => {
        viewVehicles(infoUser.DataUser.idNumber);
        dispatch(deleteFoto());
    },[])

    useEffect(() => {
        if (props.dataParqueo.ultimo_vehiculo === vehSelect) {
            console.log('se guardo el vehiculo en tyc, vamos para home')
            RootNavigation.navigate('Home_electrohub')
        }
    },[props.dataParqueo.ultimo_vehiculo])

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

    useFocusEffect( 
        React.useCallback(() => {
            viewVehicles(infoUser.DataUser.idNumber);
            dispatch(deleteFoto());
        }, [])
    );

    return (
    <View style={{backgroundColor: Colors.$parqueo_color_secundario}}>
        {modalUpdate ? openModalUpdate() : <></>}
        <View style={estilos.contenedor}>
            <View style={styles.cajaCabeza}>
              <Pressable  
                    onPress={() => { home() }}
                    style={ styles.btnAtras }>
                    <View>
                    <Image source={Images.IconoAtrasParqueo} style={[styles.iconMenu]}/> 
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
                        (data.vus_tipo === 'e-Bike' || data.vus_tipo === 'e-Scooter' || data.vus_tipo === 'e-Moto') ? 
                        <Pressable 
                            key={data.vus_id}
                            onPress={() => vehicleSelect(data.vus_id)} 
                            style={[estilos.btnVehiculos, {position: 'relative'}]}>
                            <View style={[estilos.cajaTextVehiuclos2]}>
                                {
                                    data.vus_img === 'sin_img' ? 
                                    <Image source={sinImagen(data.vus_tipo)} style={[styles.iconVehiculos]}/> 
                                    : 
                                    //<Image source={Images.vpBicicleta} style={[styles.iconVehiculos]}/> 
                                    <Image source={{ uri: data.vus_img }} style={[styles.iconVehiculos]}/> 
                                }
                    
                                <View style={{ 
                                    width: '60%',
                                    height: '90%',
                                    flexDirection: 'column',
                                    alignItems: 'flex-start',
                                    justifyContent: 'start'
                                }}>
                                <Text style={[estilos.textVehiculo, {fontSize: 20}]}>{data.vus_tipo}</Text> 
                                <Text style={{
                                    width: '100%',
                                    height: 3,
                                    backgroundColor: Colors.$parqueo_color_texto
                                }}></Text> 
                                <Text style={estilos.textVehiculo2}>{data.vus_serial}</Text>  
                                </View>
                                {/*<Pressable
                                    onPress={() => {
                                        setState({
                                            ...state,
                                            marca: data.vus_marca,
                                            modelo: data.vus_modelo,
                                            cilindraje: '',
                                            serial: data.vus_serial,
                                            color: data.vus_color,
                                            img: data.vus_img
                                        })
                                        setModalUpdate(true)
                                    }}
                                    style={{
                                        position: 'absolute',
                                        bottom: 0,
                                        right: 0,
                                        backgroundColor: Colors.$secundario,
                                        padding: 8,
                                        borderRadius: 30,
                                    }}
                                >
                                    <Image source={ Images.edit_Icon } style={{width: 30, height: 30}}/> 
                                </Pressable>*/}
                                
                            </View>
                        </Pressable>
                        :
                        <></>
                    )
                    }                 
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
                    backgroundColor : Colors.$parqueo_color_primario,
                    borderRadius : 50}}> 
                    <Text style={[estilos.textButton, {width : 250, color : 'white', fontFamily: Fonts.$poppinsregular}]}>Registrar vehículo</Text>
                </Pressable>
            </View>
        </View>
    </View>
    );
    
}

const styles_qr = StyleSheet.create({
    centerText: {
      flex: 1,
      fontSize: 18,
      padding: 32,
      color: '#777',
      fontFamily: Fonts.$poppinsregular
    },
    centeredView: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      marginTop: 22
    },
    textBold: {
      color: '#000',
      fontFamily: Fonts.$poppinsregular
    },
    buttonText: {
      fontSize: 13,
      color: '#fff',
      textAlign: "center",
      fontFamily: Fonts.$poppinsregular
    },
    buttonTouchable: {
      flex: 0.3,
      padding: 14,
      backgroundColor: Colors.$primario,
      borderRadius: 30,
      justifyContent: "center",
    },
    buttonTouchable2: {
      padding: 14,
      paddingHorizontal: 20,
      backgroundColor: "#fff",
      borderRadius: 30,
      justifyContent: "center",
    },
    buttonText2: {
      fontSize: 18,
      color: '#000',
      textAlign: "center",
      fontFamily: Fonts.$poppinsregular
    },
    fixToText: {
      paddingTop: 30,
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    topContainer: {
      marginHorizontal: 10,
      flexDirection: "row",
      zIndex: 1000
    },
    buttonBack: {
      flex: 0.15,
      padding: 10,
      backgroundColor: Colors.$primario,
      borderRadius: 30,
      fontFamily: Fonts.$poppinsregular
    },
    buttonQr: {
      flex: 0.3,
      padding: 15,
      backgroundColor: Colors.$primario,
      borderRadius: 30,
      marginTop: 30,
      justifyContent: 'center',
      fontFamily: Fonts.$poppinsregular
    },
    buttonQr2: {
      flex: 0.3,
      padding: 15,
      backgroundColor: "#fff",
      borderRadius: 30,
      marginTop: 30,
      justifyContent: 'center',
      fontFamily: Fonts.$poppinsregular
    },
    modalStyle: {
      borderRadius: 20, 
      marginVertical: 100, 
      marginHorizontal: 25, 
      justifyContent: "center", 
      alignItems: "center", paddingHorizontal: 25, position: "relative", backgroundColor: Colors.$blanco, padding: 10, height: 550
    },
    buttonClose: {
      flex: 1,
      width: 50,
      height: 50,
      alignItems: "center",
      justifyContent: "center",
      position: "absolute",
      borderRadius: 25,
      right: 10,
      top: 10,
      zIndex: 100,
      backgroundColor: Colors.$secundario
    },
    mainContainer: {
      flex: 1,
    },
    infoView: {
      flex: 2,
      justifyContent: 'center',
      alignItems: 'center',
      width: Dimensions.get('window').width,
    },
    camera: {
      flex: 0,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'transparent',
      height: Dimensions.get('window').width,
      width: Dimensions.get('window').width,
    },
  
    rectangleContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'transparent',
    },
    rectangle: {
      height: Dimensions.get('window').width*.8,
      width: Dimensions.get('window').width*.8,
      borderColor: Colors.$primario,
      backgroundColor: 'transparent',
      borderRadius: 15,
      borderWidth: 5
    },
    textRectangle: {
      flex: 1,
      height: 50,
      color: Colors.$Texto,
      fontSize: 20,
      marginHorizontal: 10,
      textAlign: "center",
      fontFamily: Fonts.$poppinsregular
    }
  });

const styles = StyleSheet.create({
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
    cajaCabeza: {
        backgroundColor: Colors.$negro,
        justifyContent: 'flex-end',
        alignItems: 'flex-start',
        height: 150,
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
        color: Colors.$parqueo_color_texto,
        width: '100%',
        marginLeft: 50,
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
        top: 30, 
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
        width: 80,
        height: 80,
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
        dataRent: state.reducer3G,
        dataParqueo: state.reducerParqueadero,
        documentUser: state.userReducer.documentUser,
    }
}

export default connect(mapStateToProps)(MyVEL);