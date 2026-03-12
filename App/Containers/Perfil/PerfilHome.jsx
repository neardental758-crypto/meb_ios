import  React,{ useState, useEffect, useContext } from 'react';
import { 
  Text,
  View,
  Pressable,
  StyleSheet,
  Image,
  Dimensions,
  Modal,
  TextInput,
  Alert,
  ScrollView
} from 'react-native';
import Fonts from '../../Themes/Fonts';
import { 
    getPuntos, 
    getProductos, 
    getLogros, 
    getLogrosProgreso, 
    saveProgresoDesafio,
    changeProgresoEstadoDesafio,
    changeEstadoDesafio,
    get_user_mysql
} 
from '../../actions/actionPerfil';
import { edit__Profile, reset__Profile, edit_photo_profile } from '../../actions/actions'
import { misViajes, viewEstacion } from '../../actions/actions3g'
import { connect, useDispatch } from 'react-redux';
import Colors from '../../Themes/Colors';
import Images from '../../Themes/Images';
import * as RootNavigation from '../../RootNavigation';
import { AuthContext } from '../../AuthContext';
import ModalPhotoDocument from '../../Components/ModalPhotoDocument';
import Overlay from 'react-native-modal-overlay';
import { v4 as uuidv4 } from 'uuid';
import RNPickerSelect from '@nejlyg/react-native-picker-select';
import { horizontalScale, moderateScale, verticalScale } from '../../Themes/Metrics';
import Geolocation from 'react-native-geolocation-service';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { Env } from "../../../keys";
const mapRef = React.createRef();
const keyMap = Env.key_map_google

function PerfilHome(props) {
    const { isLogin, token, infoUser, logout } = useContext( AuthContext )
    const dispatch = useDispatch();
    const goBack = () => { RootNavigation.navigate('Home') }
    const areas = [
        { label: 'Administración', value: 'Administración' },
        { label: 'Atención al cliente', value: 'Atención al cliente' },
        { label: 'Compras', value: 'Compras' },
        { label: 'Finanzas', value: 'Finanzas' },
        { label: 'Mercadeo', value: 'Mercadeo' },
        { label: 'Oficina', value: 'Oficina' },
        { label: 'Operaciones', value: 'Operaciones' },
        { label: 'Recursos humanos', value: 'Recursos humanos' },
        { label: 'Ventas', value: 'Ventas' },
      ];
    const [ area , setArea ] = useState('');
    const [viajesCarpooling, setViajesCarpooling] = useState(0);
    const [puntos, setPuntos] = useState(0);
    const [totalPuntos, setPuntosTotal] = useState(0);
    const [modalEditInfo, setModalEditInfo ] = useState(false)
    const ir_misViajes = () => {RootNavigation.navigate('MisViajes') }
    const ir_configuracion = () => {RootNavigation.navigate('ConfiguracionPerfil') }
    //const ir_referidos = () => {RootNavigation.navigate('Referidos') }
    const [nivel, setNivel] = useState(0);
    const maxNivel = 3;
    const [ state , setState ] = useState({
        fecha: new Date(),
    })
    const [ logoDoc, setLogoDoc] = useState('');

    const validarUserCorreo = async () => {
        const correo = infoUser.DataUser.email;
        await setLogoDoc(infoUser.DataUser.documents);
    }

    useEffect(() => {
        if (infoUser) {
          validarUserCorreo();
        }
    },[infoUser])    

    const goRecompensas = () => {
        RootNavigation.navigate('Recompensas') 
    }

    useEffect(() => {
        if (puntos >= 100) {
            if (nivel < maxNivel) {
                setNivel(prevNivel => prevNivel + 1);
                setPuntos(prevPuntos => prevPuntos - 100); // Restamos 100 puntos para el siguiente nivel
            } else {
                setPuntos(100); // Asegura que no pasemos de 100 puntos si estamos en el nivel máximo
            }
        }
    }, [puntos]);

    useEffect(() => {
        if (props.dataCarpooling.promedioCargado) {
          setCalificacion(props.dataCarpooling.calificacionPromedioUser);
        }
    },[props.dataCarpooling.promedioCargado])

    useEffect(() => {
        if (props.dataCarpooling.tripEndCargada) {
            setViajesCarpooling(props.dataCarpooling.tripEnd);
        }
    },[props.dataCarpooling.tripEndCargada])

    useEffect(() => {
        if (props.dataRent.viajes3Gcargados) {
            console.log('prestamos 3g', props.dataRent.viajesTotal3G);
            console.log('prestamos VP', props.dataRent.viajesTotalVP);
            console.log('prestamos 5G', props.dataRent.viajesTotal5G);
            console.log('prestamos carpooling', props.dataRent.viajesTotalCarpooling);
        }
    },[props.dataRent.viajes3Gcargados])

    useEffect(() => {
        if (props.dataRent.viajes5Gcargados) {
            console.log('viajes de 5g totales en home perfil', props.dataRent.viajesTotal5G)
        }
    },[props.dataRent.viajes5Gcargados])

    useEffect(() => {
        if (props.dataRent.viajesCarpoolingcargados) {
            console.log('viajes de 5g totales en home perfil', props.dataRent.viajesTotalCarpooling)
        }
    },[props.dataRent.viajesCarpoolingcargados])

    useEffect(() => {
        if (props.dataUser.porfile_update_ok) {
            console.log('los datos fueron actualizados');
            dispatch(reset__Profile());
            logout();
        }
    },[props.dataUser.porfile_update_ok])

    useEffect(() => {
        dispatch(getPuntos());
        dispatch(misViajes());
        //dispatch(getDesafios('ACTIVO'));
        console.log('la empresa es::::::', props.perfil.dataempresa[0].emp_nombre)
        dispatch(getLogros(props.perfil.dataempresa[0].emp_nombre));
        dispatch(getProductos());
        dispatch(getLogrosProgreso());
        //dispatch(getDesafiosProgreso());
        dispatch(get_user_mysql());
    },[])

    useEffect(() => {
        if (props.perfil.cargado_user_mysql) {
            console.log('La data del reductor perfil user mysql es:', props.perfil.data_user_mysql);
            console.log('La data del reductor perfil user mysql empresa:', props.perfil.data_user_mysql.usu_empresa);
            setNewCiudad(props.perfil.data_user_mysql.usu_ciudad);
            dispatch(viewEstacion(props.perfil.data_user_mysql.usu_empresa));
        }
    },[props.perfil.cargado_user_mysql])
    
    useEffect(() => {
        console.log('props.perfil.puntosCargados', props.perfil.puntosCargados)
        if (props.perfil.puntosCargados) {
            setPuntos(props.perfil.puntos)
            setPuntosTotal(props.perfil.puntos)
        }
    },[props.perfil.puntosCargados])
    useEffect(() => {
        console.log('props.perfil.productosCargados', props.perfil.productosCargados)
        if (props.perfil.productosCargados) {
            console.log(props.perfil)
        }
    },[props.perfil.productosCargados])

    const modalActivo = (valor) => {
        setModalEditInfo(valor)
    }

    const [ newEmail, setNewEmail ] = useState(String(infoUser.DataUser.email))
    const [ newPhone, setNewPhone ] = useState(String(infoUser.DataUser.phoneNumber))
    const [ newName, setNewName ] = useState(String(infoUser.DataUser.name))
    const [ newFirstLastname, setNewFirstLastname ] = useState(String(infoUser.DataUser.firstLastname))
    const [ newCiudad, setNewCiudad ] = useState('')
    const [ modalFoto, setModalFoto ] = useState(false);
    const [ coordenadasCasa, setCoordenadasCasa ] = useState('');
    const [ coordenadasTrabajo, setCoordenadasTrabajo ] = useState('');
    const [ viewLocationMap, setViewLocationMap ] = useState('');
    const [ newEstacion, setNewEstacion ] = useState('');
    const [ newDirCasa, setNewDireCasa ] = useState('');
    
    const closeModal = () => {
        setModalFoto(false)
    };

    const abrirModal = () => {
        setModalFoto(true)
    }

    const saveImg = () => {
        console.log('Guardando imagen de perfil', props.documentUser.assets);
        dispatch(edit_photo_profile());
    }

    const update_profile = async () => {
        const newProfile = {
            'email': newEmail,
            'phone': newPhone,
            'name': newName,
            'area': area === '' ? infoUser.DataUser.workStatus : area,
            'firstLastname': newFirstLastname,
            'dirCasa': newDirCasa === '' ? props.perfil.data_user_mysql.usu_dir_casa : newDirCasa,
            'coorCasa': coordenadasCasa === '' ? props.perfil.data_user_mysql.coorCasa : coordenadasCasa,
            'dirTrabajo': newEstacion === '' ? props.perfil.data_user_mysql.usu_dir_trabajo : newEstacion,
            'coorTrabajo': coordenadasTrabajo === '' ? props.perfil.data_user_mysql.coorTrabajo : coordenadasTrabajo,
            'ciudad': newCiudad === '' ? infoUser.DataUser.usu_ciudad : newCiudad,
        }
        console.log('nuevo perfil', newProfile);
        dispatch(edit__Profile(newProfile));
    }

    const handlePlaceSelect = (data, details) => {
        if (details && details.geometry && details.geometry.location) {
          const { lat, lng } = details.geometry.location;
          const latitude = parseFloat(lat);
          const longitude = parseFloat(lng);
    
          if (!isNaN(latitude) && !isNaN(longitude)) {
            setCoordenadasCasa({
              lat : latitude,
              lng : longitude,
            })
            setViewLocationMap({
              latitude: latitude,
              longitude: longitude,
              latitudeDelta: 0.0421,
              longitudeDelta: 0.0421,
            });
    
            if (mapRef.current) {
              mapRef.current.animateToRegion({
                latitude: latitude,
                longitude: longitude,
                latitudeDelta: 0.0421,
                longitudeDelta: 0.0421,
              }, 1000);
            }
            const placeName = details.name || data.description;
            setState(prevState => ({
              ...prevState,
              dirCasa: placeName
            }));
          } else {
            Alert.alert("Error", "Invalid latitude or longitude");
          }
        } else {
          Alert.alert("Error", "Invalid details or location");
        }
    };

    const new_estacion = async (value) => {
        console.log('ver estacion nueva data', value)
        console.log('ver estacion nueva nombre', value.est_estacion)
        setNewEstacion(value.est_estacion);
        setCoordenadasTrabajo(
            { lat: value.est_latitud, lng: value.est_longitud }
        );
    }

    const modalInfoEdit = () => {
    return (
        
        <Modal transparent={true} animationType="slide">
            <View style={estilosModal.contenedorModal}>
                <View style={estilosModal.modalBox}>     
                
                {/* Título */}
                <View style={estilosModal.header}>
                    <Text style={estilosModal.titulo}>Actualiza tus datos personales</Text>
                </View>

                {/* Inputs */}
                <View style={estilosModal.body}>
                    <TextInput
                    placeholder='Nombres'
                    autoCompleteType={'text'}
                    style={estilosModal.input}
                    placeholderTextColor={Colors.$texto}
                    value={newName}
                    onChangeText={setNewName}
                    />

                    <TextInput
                    placeholder='Apellidos'
                    autoCompleteType={'text'}
                    style={estilosModal.input}
                    placeholderTextColor={Colors.$texto}
                    value={newFirstLastname}
                    onChangeText={setNewFirstLastname}
                    />

                    <TextInput
                    placeholder='Correo'
                    autoCompleteType={'email'}
                    style={estilosModal.input}
                    keyboardType={'email-address'}
                    placeholderTextColor={Colors.$texto}
                    value={newEmail}
                    onChangeText={setNewEmail}
                    />

                    <TextInput
                    placeholder='Teléfono'
                    autoCompleteType={'tel'}
                    style={estilosModal.input}
                    keyboardType={'phone-pad'}
                    placeholderTextColor={Colors.$texto}
                    value={newPhone}
                    onChangeText={setNewPhone}
                    />
                </View>

                {/* Área de trabajo */}
                <Text style={estilosModal.subtitulo}>
                    Areá de trabajo: {String(infoUser.DataUser.workStatus || '')}
                </Text>

                <RNPickerSelect
                    style={pickerSelectStyles}
                    placeholder={{label: 'Cambia tu área de trabajo' }}
                    useNativeAndroidPickerStyle={false}
                    value={infoUser.DataUser.workStatus}
                    onValueChange={(value) => setArea(value)}
                    items={areas.map(data => ({ label: String(data.value), value: String(data.value) }))}
                    Icon={() => (
                    <Image source={Images.iconPickerYellow} style={estilosModal.iconPicker} />
                    )}
                />

                {/* Botón confirmar */}
                <View style={estilosModal.footer}>
                    <Pressable 
                    onPress={() => { 
                        update_profile();
                        modalActivo(false);
                    }} 
                    style={estilosModal.btnConfirmar}
                    >                
                    <Text style={estilosModal.textBtn}>Confirmar</Text>               
                    </Pressable>
                </View>

                {/* Botón cerrar */}
                <Pressable  
                    onPress={() => modalActivo(false)}
                    style={estilosModal.btnCerrar}
                >
                    <Image style={estilosModal.iconCerrar} resizeMode='contain' source={Images.x_icon}/>
                </Pressable> 

                </View>  
            </View>           
        </Modal>
        
    )
    }
    
return (
    <View style={estilos.contenedor}>
        {(modalEditInfo) ? modalInfoEdit() : <></>} 
        <View style={estilos.cajaCabeza}>
            <Pressable  
                onPress={() => { goBack() }}
                style={ estilos.btnAtras }>
                <View>
                <Image source={Images.menu_icon} style={[estilos.iconMenu]}/> 
                </View>
            </Pressable>
        </View>

        <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>

        <View style={ estilos.logoBox }>
            <View style={ estilos.cajaA}>

            <View style={{width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                <Text style={ estilos.texto1}>
                    {infoUser.DataUser.name} {/*infoUser.DataUser.firstLastname*/}
                </Text>
                <Pressable
                    onPress={() => setModalEditInfo(true)}
                >
                    <Image
                        style={{width: 30, height: 30}}
                        source={ Images.e_icon}
                    />
                </Pressable>
            </View>    
            
            {/*<Estrellas calificacion={calificacion}/>*/}
            <Text style= {{fontFamily: Fonts.$poppinsregular}}>
                {Number(
                    viajesCarpooling + 
                    props.dataRent.viajesTotal3G + 
                    props.dataRent.viajesTotalVP + 
                    props.dataRent.viajesTotal5G +
                    props.dataRent.viajesTotalCarpooling
            )} viajes</Text>
            <Text  style={{ fontSize: 14, color: Colors.$texto50, fontFamily: Fonts.$poppinsregular}}>{infoUser.DataUser.email}</Text>
            <Text  style={{ fontSize: 14, color: Colors.$texto50, fontFamily: Fonts.$poppinsregular}}>{infoUser.DataUser.phoneNumber}</Text>
            </View>

            <View style={ estilos.cajaB}>
                {
                    logoDoc !== '' ?
                    <View style={{ 
                        flexDirection: 'column', 
                        alignItems: 'center', 
                        justifyContent: 'center'

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
                                        style={ estilos.logo } />
                                    <Pressable 
                                        onPress={() => { saveImg() }} 
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
                                        }}>Confirmar</Text>
                                    </Pressable>
                                </View>
                            </View>
                            :
                            <>
                                <Image
                                style={ estilos.logo }
                                source={{ uri: logoDoc }}
                                />
                                <Pressable
                                    onPress={ () => abrirModal() }
                                >
                                    <Text style={{ fontSize: 16, color: Colors.$texto50, fontFamily: Fonts.$poppinsregular, marginTop: 10}}>Editar</Text>
                                </Pressable>

                                <Overlay
                                    containerStyle={estilos.overlay}
                                    visible={modalFoto}  
                                    childrenWrapperStyle={estilos.modalsContainer}
                                    onClose={closeModal}
                                    closeOnTouchOutside>
                                    <ModalPhotoDocument onClosePress={closeModal} />
                                </Overlay> 
                            </>
                        }
                    </View>
                    :
                    <></>
                }
            </View> 
        </View>

        {/* Puntos */}

        {
          props.perfil.puntosCargados ? 
          <View style={estilos.containerProgress}>
            <View style={estilos.cardPuntos}>
                <View style={{
                  flexDirection: 'row',
                  width: "100%",
                  alignItems: 'center',
                  justifyContent: 'space-around',
                  marginBottom: 10
                }}>
                  <Image source={Images.cycle_Icon} style={estilos.iconPuntos} />
                  <Image source={Images.patin_Icon} style={estilos.iconPuntos} />
                  <Image source={Images.vpEMoto} style={estilos.iconPuntos} />
                  <Image source={Images.vpECar} style={estilos.iconPuntos} />
                  <Image source={Images.vpEbike} style={estilos.iconPuntos} />
                </View>
                <View style={{
                  width: 100,
                  height: 100,
                  backgroundColor: Colors.$primario,
                  borderRadius: 50,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                  <Text style={estilos.puntos}>{totalPuntos}</Text>
                </View>
                
                <Text style={estilos.textoPuntosTitulo}>Mis puntos acumulados</Text>
            </View>
          </View>
          :
          <></>
        }

        {/* Opciones */}
        <View style={estilos.cardOpciones}>
            <Pressable style={estilos.opcion} onPress={ir_misViajes}>
            <View style={estilos.row}>
                <Image source={Images.iconoviajes} style={estilos.opcionIcon} />
                <Text style={estilos.opcionTexto}>Mis viajes</Text>
            </View>
            <Image source={Images.flecha_icon} style={estilos.flecha} />
            </Pressable>

            <Pressable style={estilos.opcion} onPress={ir_configuracion}>
            <View style={estilos.row}>
                <Image source={Images.iconoConfiguracion} style={estilos.opcionIcon} />
                <Text style={estilos.opcionTexto}>Configuración</Text>
            </View>
            <Image source={Images.flecha_icon} style={estilos.flecha} />
            </Pressable>

            {/*<Pressable style={estilos.opcion} onPress={ir_referidos}>
            <View style={estilos.row}>
                <Image source={Images.iconoConfiguracion} style={estilos.opcionIcon} />
                <Text style={estilos.opcionTexto}>Código Referidos</Text>
            </View>
            <Image source={Images.flecha_icon} style={estilos.flecha} />
            </Pressable>*/}

            {props.perfil.dataempresa[0]._recompensas === 'ACTIVO' && (
            <Pressable style={estilos.opcion} onPress={goRecompensas}>
                <View style={estilos.row}>
                <Image source={Images.diamante} style={estilos.opcionIcon} />
                <Text style={estilos.opcionTexto}>Recompensas</Text>
                </View>
                <Image source={Images.flecha_icon} style={estilos.flecha} />
            </Pressable>
            )}

            <Pressable style={estilos.opcion} onPress={() => RootNavigation.navigate('SupportPerfil')}>
            <View style={estilos.row}>
                <Image source={Images.iconoSoporte} style={estilos.opcionIcon} />
                <Text style={estilos.opcionTexto}>Soporte</Text>
            </View>
            <Image source={Images.flecha_icon} style={estilos.flecha} />
            </Pressable>
        </View>

        </ScrollView>
    </View>
)

}

const estilosModal = StyleSheet.create({
  contenedorModal: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(52, 52, 52, 0.9)",
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height
  },
  modalBox: {
    flexDirection: 'column', 
    backgroundColor: Colors.$blanco, 
    justifyContent: "center", 
    alignItems: "center", 
    width: Dimensions.get('window').width * .9, 
    height: Dimensions.get('window').height * .7,
    position: "relative",
    borderColor: Colors.$adicional,
    borderWidth: 1.5,
    borderRadius: 25,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 10,
    marginTop: -20
  },
  header: {
    alignItems: "center",
    marginBottom: 10,
    width: "60%",
  },
  titulo: { 
    textAlign: "center",
    color: Colors.$cuarto,
    fontSize: 22, 
    fontFamily: Fonts.$poppinsregular
  },
  body: {
    width: "100%",
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.$texto,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginBottom: 12,
    fontFamily: Fonts.$poppinsregular,
    fontSize: 16,
    color: Colors.$texto,
    backgroundColor: Colors.$blanco,
  },
  subtitulo: { 
    textAlign: "center",
    color: Colors.$cuarto,
    fontSize: 18, 
    fontFamily: Fonts.$poppinsregular,
    marginVertical: 10,
  },
  iconPicker: {
    top: 12,
    right: 40,
    height: 20, 
    width: 20, 
    resizeMode: 'contain', 
    tintColor: Colors.$texto,
  },
  footer: {
    marginTop: 20,
    alignItems: 'center',
    width: "100%",
  },
  btnConfirmar: {
    backgroundColor: Colors.$primario,
    paddingVertical: 12,
    paddingHorizontal: 35,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 6,
  },
  textBtn: {
    color: Colors.$blanco,
    fontSize: 16,
    fontFamily: Fonts.$poppinsregular,
  },
  btnCerrar: { 
    position: 'absolute', 
    top: 10, 
    left: 10,
  },
  iconCerrar: {
    width: 40,
    height: 40,
  }
});

const estilos = StyleSheet.create({
    //estilos modal
    cajaDireccion: {
        flexDirection : 'column', 
        marginTop : 20, 
        width : '90%', 
        height: 'auto',
        zIndex: 100
    },
    textTitle:{
        fontWeight:'600'
    },
    CajaHorCenter:{
      flexDirection: 'row',
      alignItems:'right',
      marginTop:5,
    },
    CajaHorCenter2:{
      flexDirection: 'row',
      alignItems:'right',
      marginLeft:50,
      marginTop:5,
    },
    CajaHorCenter3:{
      flexDirection: 'row',
      alignItems:'right',
      marginLeft:78,
      marginTop:5,
    },
    CajaHorCenter4:{
      flexDirection: 'row',
      alignItems:'right',
      marginLeft:85,
      marginTop:5,
    },
    
    btnConfirmar:{
      alignItems: "center",
      justifyContent: "center",
      backgroundColor : Colors.$primario,
      borderRadius : 20,
      padding: 5,
      width:200
    },
    textSolicitar:{
      fontFamily: Fonts.$poppinsregular,
      textAlign: "center", 
      fontSize: 16, 
      paddingTop: 'auto', 
      paddingBottom: 'auto', 
      color: 'white',
      alignSelf: "center",
    },
    btnCheckOK: {
      width: 20,
      height: 20,
      borderWidth : 3,
      borderColor : Colors.$texto,
      borderRadius : 100,
      backgroundColor: Colors.$adicional,
      marginRight: 5,
    },
    btnCheck: {
      width: 20,
      height: 20,
      borderWidth : 3,
      borderColor : Colors.$texto,
      borderRadius : 100,
      marginRight: 5,
    },
    loginInput: {
        marginBottom: 20,
        padding: 4,
        paddingLeft: 20,
        width: Dimensions.get('window').width*.80,
        color: Colors.$texto,
        fontFamily: Fonts.$poppinsregular,
        fontSize: 14,
        backgroundColor: Colors.$secundario20,
        borderRadius: 5
    },
    cajaHor: {
        width: Dimensions.get('window').width*.8,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center' 
    },
    contenedor: {
        flex: 1,
        flexDirection: 'column',
        alignItems: "center",
        justifyContent: "start",
        backgroundColor: Colors.$blanco
    },
    icono: {
        width: 25,
        height: 25,
        marginRight: 10
    },
    cajaCabeza: {
        backgroundColor: Colors.$primario,
        justifyContent: 'space-around',
        alignItems: 'center', 
        borderRadius: 1,
        width: Dimensions.get('window').width,
        position: 'absolute',
        top: 20
    },
    btnAtras:{
        position: 'absolute',
        top: 10, 
        left: 10,
        width: 50,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 25,
        zIndex: 999
    },
    iconMenu: {
        width: 50,
        height: 50,
    },
    logoBox: {
        width: Dimensions.get('window').width,
        flexDirection : 'row', 
        alignItems: 'center', 
        justifyContent : 'center', 
        marginTop: 80,
        marginBottom: 10,
    },
    cajaA: {
        width: Dimensions.get('window').width*.5,
        alignItems: 'flex-start', 
        justifyContent: 'center',
    },
    cajaB: {
        width: Dimensions.get('window').width*.3,
        alignItems: 'flex-end', 
        justifyContent: 'center',
    },
    cajaC: {
      flex: 1,
      flexDirection: 'row',
      backgroundColor: 'orange',
    },
    texto1: {
      fontSize: 22,
      color: Colors.$texto,
      fontFamily: Fonts.$poppinsmedium
    },
    texto2: {
      width: 200,
      fontSize: 16,
      color: Colors.$texto,
      fontFamily: Fonts.$poppinslight
    },
    botonItem: {
      backgroundColor: Colors.$blanco,
      width: "100%",
      textAlign: "center",
      justifyContent: "center",
      padding: 10,
      flexDirection: 'row'
    },
    textBoton: {
      flex: 1,
      fontSize: 18,
      color: Colors.$texto,
      paddingTop: 5,
      paddingLeft: 10,
      fontFamily: Fonts.$poppinsregular
    },
    LineaVer: {
      width: 5,
      height: 40,
      backgroundColor: Colors.$texto
    },
    LineaHorizontal: {
      width: "80%",
      height: 5,
      backgroundColor: Colors.$texto,
      marginTop: 10,
      marginBottom: 30,
    },
    logo: {
      width: 100,
      height: 100,
      borderRadius: 50
    },
    contenedorModal: {
        flex: 1,
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
        justifyContent: "space-between",
        alignItems: "flex-start",
        backgroundColor: "rgba(52, 52, 52, 0.9)", 
        padding: 20,
        zIndex: 1000
    },

    header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: Colors.$blanco,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitulo: {
    fontSize: 20,
    fontFamily: Fonts.$poppinsmedium,
    color: Colors.$texto,
  },

  cardPerfil: {
    backgroundColor: Colors.$blanco,
    margin: 15,
    padding: 15,
    borderRadius: 12,
    elevation: 2,
  },
  rowPerfil: { flexDirection: 'row', alignItems: 'center' },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#eee',
  },
  nombre: {
    fontSize: 18,
    fontFamily: Fonts.$poppinsmedium,
    color: Colors.$texto,
  },
  subTexto: {
    fontSize: 14,
    color: Colors.$texto50,
    fontFamily: Fonts.$poppinsregular,
    marginTop: 2,
  },
  editIcon: { width: 24, height: 24, tintColor: Colors.$primario },

  cardPuntos: {
    backgroundColor: Colors.$secundario20,
    marginHorizontal: 15,
    marginBottom: 20,
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  iconPuntos: { width: 50, height: 50, marginBottom: 10 },
  textoPuntosTitulo: {
    fontSize: 16,
    fontFamily: Fonts.$poppinsregular,
    marginBottom: 5,
  },
  puntos: {
    fontSize: 40,
    fontFamily: Fonts.$poppinsmedium,
    color: Colors.$blanco,
    paddingTop: 6
  },

  cardOpciones: {
    backgroundColor: Colors.$blanco,
    marginHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 12,
    elevation: 2,
  },
  opcion: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  opcionTexto: {
    fontSize: 16,
    fontFamily: Fonts.$poppinsregular,
    marginLeft: 10,
    color: Colors.$texto,
  },
  opcionIcon: { width: 24, height: 24, tintColor: Colors.$primario },
  flecha: { width: 18, height: 18, tintColor: Colors.$texto50 },
  row: { flexDirection: 'row', alignItems: 'center' },
})

const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
      fontSize: moderateScale(18),
      borderBottomWidth: 2,
      backgroundColor: "transparent",
      paddingLeft: 15,
      marginLeft: 20,
      marginRight: 20,
      marginBottom: 10,
      borderColor: Colors.$secundario,
      borderRadius: 5,
      marginTop: 15,
      color: Colors.$secundario,
      height: 40,
      width: Dimensions.get('window').width*.8,
    },
    placeholder: {
      color: Colors.$texto,
    },
    inputAndroid: {
      fontSize: moderateScale(16),
      paddingLeft: moderateScale(10),
      marginLeft: moderateScale(25),
      marginRight: moderateScale(25),
      paddingVertical: 15,
      borderColor: Colors.$secundario20,
      borderWidth: .8,
      borderRadius: moderateScale(5),
      marginBottom: moderateScale(20),
      marginTop: moderateScale(2),
      paddingBottom: moderateScale(5),
      paddingTop: moderateScale(5),
      width: Dimensions.get('window').width*.8,
      color: 'black',
      paddingHorizontal: moderateScale(20),
      backgroundColor: Colors.$secundario20
    },
    textBoton1: {
      fontSize: moderateScale(16),
      color: Colors.$texto,
      fontFamily: Fonts.$poppinsregular,
    },
    shadowContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      width: horizontalScale(80), // Tamaño del contenedor de la sombra
      height: verticalScale(80), // Tamaño del contenedor de la sombra
      borderRadius: horizontalScale(40), // La mitad del tamaño para un círculo
      backgroundColor: 'transparent',
      shadowColor: 'black',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.3, // Ajusta la opacidad según sea necesario
      shadowRadius: 10, // Ajusta el tamaño del difuminado de la sombra
    },
  });

function mapStateToProps(state) {
  return {
    dataUser: state.userReducer,
    dataRent: state.reducer3G,
    perfil: state.reducerPerfil,
    dataCarpooling: state.reducerCarpooling,
    documentUser: state.userReducer.documentUser,
    stations : state.userReducer.stationsFromOrganization,
  }
}
export default connect(mapStateToProps)(PerfilHome);
