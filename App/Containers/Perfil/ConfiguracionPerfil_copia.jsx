import React, { useState, useContext, useEffect } from 'react';
import {
  Text,
  View,
  Pressable,
  StyleSheet,
  Image,
  Dimensions,
  TextInput,
  Alert,
  Switch
} from 'react-native';
import { connect, useDispatch } from 'react-redux';
import Colors from '../../Themes/Colors';
import Images from '../../Themes/Images';
import Fonts from '../../Themes/Fonts';
import * as RootNavigation from '../../RootNavigation';
import { AuthContext } from '../../AuthContext';
import { horizontalScale, moderateScale, verticalScale } from '../../Themes/Metrics';
import { updatePassword, reset__Profile } from '../../actions/actions';
import { ScrollView } from 'react-native-gesture-handler';
import { 
    getDataPago,
    getVehicles_carpooling,
    patch_vehiculos_carpooling,
    reset__patch_veh,
    patch_conductor_carpooling,
    reset__patch_cond
  } from '../../actions/actionCarpooling'

function ConfiguracionPerfil(props) {
    const { token, infoUser, logout } = useContext(AuthContext);
    const dispatch = useDispatch();
    const [claveActual, setClaveActual] = useState('');
    const [clave, setClave] = useState('');
    const [clave2, setClave2] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showPagos, setShowPagos] = useState(false);
    const [showLugares, setShowLugares] = useState(false);
    const [showVehiculos, setShowVehiculos] = useState(false);
    const [daviplata, setDaviplata] = useState(false);
    const [nequi, setNequi] = useState(false);
    const [marca, setMarca] = useState('');
    const [modelo, setModelo] = useState('');
    const [placa, setPlaca] = useState('');
    const [color, setColor] = useState('');

    const goBack = () => { RootNavigation.navigate('PerfilHome'); };

    useEffect(() => {
        console.log('ConfiguracionPerfil infoUser', infoUser.DataUser.password);
        console.log('ConfiguracionPerfil idNumber', infoUser.DataUser.idNumber);
        dispatch(getDataPago(infoUser.DataUser.idNumber));
        dispatch(getVehicles_carpooling());
    }, [infoUser]);

    useEffect(() => {
        if (props.dataCarpooling.dataPagoCargada && props.dataCarpooling.dataPago && Object.keys(props.dataCarpooling.dataPago).length > 0) { 
            console.log('Data de pago', props.dataCarpooling.dataPago); 
            console.log('Data de pago length', Object.keys(props.dataCarpooling.dataPago).length); 
            setDaviplata(props.dataCarpooling.dataPago.daviplata);
            setNequi(props.dataCarpooling.dataPago.nequi);  
        } else {
            console.log('No se encontraron datos de pago.');
        }
    }, [props.dataCarpooling.dataPagoCargada]);

    useEffect(() => {
        if (props.dataCarpooling.myVehiclesCPCargados) { 
            console.log('Datos Vehiculos Carpooling', props.dataCarpooling.myVehiclesCP);  
        }
    }, [props.dataCarpooling.myVehiclesCPCargados]);

    const handleChangePassword = () => {
        if (claveActual !== infoUser.DataUser.password) {
            Alert.alert("Error", "La contraseña actual no coincide con la registrada.");
            return;
        }

        if (clave.length !== 4) {
            Alert.alert("Error", "La nueva contraseña debe tener 4 caracteres.");
            return;
        }

        if (clave !== clave2) {
            Alert.alert("Error", "Las nuevas contraseñas no coinciden.");
            return;
        }

        if (claveActual === clave) {
            Alert.alert("Error", "La nueva contraseña debe ser diferente a la actual.");
            return;
        }

        dispatch(updatePassword(clave));

        setLoading(true);

        console.log('Paso todas  las validaciones listo para cambiar password');

    };

    const togglePassword = (value) => {
        setShowPassword(value);
    };

    const togglePagos = (value) => {
        setShowPagos(value);
    }

    const toggleLugares = (value) => {
        setShowLugares(value);
    }

    const toggleVehiculos = (value) => {
        setShowVehiculos(value);
    }

    useEffect(() => {
        if (props.dataUser.update_password_ok) {
            console.log('la password fue actualizada');
            dispatch(reset__Profile());
            logout();
        }
    },[props.dataUser.update_password_ok])

    const [vehiculos, setVehiculos] = useState(props.dataCarpooling.myVehiclesCP?.data || []);

    const actualizarValor = (id, campo, valor) => {
        console.log('Actualizar valor del vehiculo', id, campo, valor);
        setVehiculos(vehiculos.map(vehiculo =>
            vehiculo._id === id ? { ...vehiculo, [campo]: valor } : vehiculo
        ));
    };

    const onActualizarPagos = () => {
        console.log('Actualizar pagos', nequi);
        console.log('Actualizar pagos', daviplata);
        const data = {
            _id: infoUser.DataUser.idNumber,
            nequi: nequi,
            daviplata: daviplata,
        };  
        console.log('data', data);
        dispatch(patch_conductor_carpooling(data)); 
    }

    const onActualizarVehiculo = (vehiculo) => {
        console.log('Actualizar vehiculo', vehiculo);
        const vehiculoActualizado = {
            ...vehiculo,
            marca: marca || vehiculo.marca,
            modelo: modelo || vehiculo.modelo,
            placa: placa || vehiculo.placa,
            color: color || vehiculo.color,
        };
        console.log('vehiculo actualizado', vehiculoActualizado);
        dispatch(patch_vehiculos_carpooling(vehiculoActualizado));
    }

    useEffect(() => {
        if (props.dataCarpooling.vehiculoUpdateCarpooling) {
            console.log('Vehiculo actualizado correctamente');
            dispatch(getVehicles_carpooling());
            dispatch(reset__patch_veh());
            setMarca('');
            setModelo('');
            setPlaca('');
            setColor('');
        }
    },[props.dataCarpooling.vehiculoUpdateCarpooling])

    useEffect(() => {
        if (props.dataCarpooling.conductorUpdateCarpooling) {
            dispatch(getDataPago(infoUser.DataUser.idNumber));
            dispatch(reset__patch_cond());
        }
    },[props.dataCarpooling.conductorUpdateCarpooling])

    return (
    <ScrollView> 
        <View style={estilos.contenedor}>
            <View style={estilos.cajaCabeza}>
                <Pressable onPress={goBack} style={estilos.btnAtras}>
                    <Image source={Images.menu_icon} style={estilos.iconMenu} />
                </Pressable>
                <Text style={estilos.titulo}>Configuración</Text>
                <View style={estilos.LineaHorizontal} />
            </View>
             
            <View style={estilos.cajaContenido}>
                {/*CAMBIO CONTRASEÑA*/}
                <Pressable
                    onPress={() => togglePassword(!showPassword)} 
                    style={estilos.Acordeon}>
                        <Text style={estilos.textAcordeon}>Actualizar contraseña</Text>
                        <Image 
                            source={Images.iconPickerYellow} 
                            style={{ 
                                height: 30, 
                                width: 30, 
                                resizeMode: 'contain', 
                                tintColor: Colors.$adicional,
                                transform: [{ rotate: showPassword ? '180deg' : '0deg' }] 
                            }}  
                        />
                </Pressable>

                {
                    showPassword ?
                    <View style={estilos.seccionPassword}>                    
                        <Text style={ estilos.textInputs }>Contraseña actual</Text>
                        <TextInput
                            style={estilos.input}
                            keyboardType="numeric"
                            autoCompleteType={'password'}
                            onChangeText={setClaveActual}
                            value={claveActual}
                            placeholder="Ingrese su contraseña actual"
                            secureTextEntry
                        />
                        <Text style={ estilos.textInputs }>Contraseña Nueva</Text>
                        <TextInput
                            style={estilos.input}
                            keyboardType="numeric"
                            autoCompleteType={'password'}
                            onChangeText={setClave}
                            value={clave}
                            placeholder="Ingrese su nueva contraseña"
                            secureTextEntry
                        />
                        <Text style={ estilos.textInputs }>Repita la contraseña Nueva</Text>
                        <TextInput
                            style={estilos.input}
                            keyboardType="numeric"
                            autoCompleteType={'password'}
                            onChangeText={setClave2}
                            value={clave2}
                            placeholder="Repita su nueva contraseña"
                            secureTextEntry
                        />
                        <Pressable style={estilos.btnActualizar} onPress={handleChangePassword} disabled={loading}>
                            <Text style={estilos.textoBoton}>{loading ? "Actualizando..." : "Actualizar Contraseña"}</Text>
                        </Pressable>                    
                    </View>
                    :
                    <></>
                }       

                {/*CAMBIO MEDIOS DE PAGO*/}
                <Pressable
                    onPress={() => togglePagos(!showPagos)} 
                    style={estilos.Acordeon}>
                        <Text style={estilos.textAcordeon}>Cambiar medios de pago</Text>
                        <Image 
                            source={Images.iconPickerYellow} 
                            style={{ 
                                height: 30, 
                                width: 30, 
                                resizeMode: 'contain', 
                                tintColor: Colors.$adicional,
                                transform: [{ rotate: showPagos ? '180deg' : '0deg' }] 
                            }}  
                        />
                </Pressable>    

                {
                    showPagos && props.dataCarpooling.dataPagoCargada ?
                    <View style={styles.container}>
                        <Text style={styles.title}>Medios de pago</Text>

                        <View style={styles.switchContainer}>
                            <Text style={styles.label}>Daviplata</Text>
                            <Switch
                                value={daviplata}
                                onValueChange={setDaviplata}
                                trackColor={{ false: "#ccc", true: "#4CAF50" }}
                                thumbColor={daviplata ? "#fff" : "#f4f3f4"}
                            />
                        </View>

                        <View style={styles.switchContainer}>
                            <Text style={styles.label}>Nequi</Text>
                            <Switch
                                value={nequi}
                                onValueChange={setNequi}
                                trackColor={{ false: "#ccc", true: "#4CAF50" }}
                                thumbColor={nequi ? "#fff" : "#f4f3f4"}
                            />
                        </View>

                        <Pressable 
                        style={styles.button} 
                        onPress={() => onActualizarPagos()}>
                            <Text style={styles.buttonText}>Actualizar</Text>
                        </Pressable>
                    </View>
                    :
                    <></>
                }

                {
                <Pressable
                    onPress={() => toggleLugares(!showLugares)} 
                    style={estilos.Acordeon}>
                        <Text style={estilos.textAcordeon}>Cambiar Lugares</Text>
                        <Image 
                            source={Images.iconPickerYellow} 
                            style={{ 
                                height: 30, 
                                width: 30, 
                                resizeMode: 'contain', 
                                tintColor: Colors.$adicional,
                                transform: [{ rotate: showLugares ? '180deg' : '0deg' }] 
                            }}  
                        />
                </Pressable> 
                }   

                {
                    showLugares ?
                    <View style={estilos.seccionPassword}>                    
                        <Text style={ estilos.textInputs }>Aun no disponible</Text>
                    </View>
                    :
                    <></>
                }

                {<Pressable
                    onPress={() => toggleVehiculos(!showVehiculos)} 
                    style={estilos.Acordeon}>
                        <Text style={estilos.textAcordeon}>Editar Vehículos</Text>
                        <Image 
                            source={Images.iconPickerYellow} 
                            style={{ 
                                height: 30, 
                                width: 30, 
                                resizeMode: 'contain', 
                                tintColor: Colors.$adicional,
                                transform: [{ rotate: showVehiculos ? '180deg' : '0deg' }] 
                            }}  
                        />
                </Pressable>}

                {
                    showVehiculos && props.dataCarpooling.myVehiclesCPCargados?
                    <ScrollView style={{
                        width: "100%"
                    }}>
                    {props.dataCarpooling.myVehiclesCP.data.length > 0 ? (
                        props.dataCarpooling.myVehiclesCP.data.map((data) => (
                            <View key={data._id} style={styles.vehiculeTouch}>
                                <View style={styles.cajaRow}>
                                    <View style={styles.cajaPartidaImg}>
                                        {data.tipo === 'Carro' ? 
                                            <Image source={Images.carrorojo} style={styles.imgCarro}/> : 
                                            <Image source={Images.moto} style={styles.imgMoto}/>
                                        }
                                    </View>
        
                                    <View style={styles.inputContainer}>
                                        <Text style={ estilos.textInputs }>Marca: {data.marca}</Text>
                                        <TextInput
                                            style={styles.input}
                                            placeholder="Nueva Marca"
                                            value={marca}
                                            onChangeText={object => setMarca( object )}
                                        />
                                        <Text style={ estilos.textInputs }>Módelo {data.modelo}</Text>
                                        <TextInput
                                            style={styles.input}
                                            value={modelo}
                                            onChangeText={object => setModelo( object )}
                                            placeholder="Nueva Módelo"
                                            keyboardType="numeric"
                                        />
                                        <Text style={ estilos.textInputs }>Placa - Serial {data.placa}</Text>
                                        <TextInput
                                            style={styles.input}
                                            value={placa}
                                            onChangeText={object => setPlaca( object )}
                                            placeholder="Nueva Placa"
                                            autoCapitalize="characters"
                                        />
                                        <Text style={ estilos.textInputs }>Color {data.color}</Text>
                                        <TextInput
                                            style={styles.input}
                                            value={color}
                                            onChangeText={object => setColor( object )}
                                            placeholder="Nueva Color"
                                        />
                                    </View>
                                </View>

                                <Pressable
                                    onPress={() => onActualizarVehiculo(data)}
                                    style={styles.button}
                                >
                                    <Text style={styles.buttonText}>Actualizar</Text>
                                </Pressable>
                            </View>
                        ))
                    ) : (
                        <Text style={styles.rulesTextTitulo}>No se encontraron vehículos registrados en el módulo de carpooling😞</Text>
                    )}
                    </ScrollView>
                    :
                    <></>
                }
            </View>
            
        </View>
    </ScrollView>
    );
}

const estilos = StyleSheet.create({
    contenedor: {
        flex: 1,
        alignItems: "center",
        backgroundColor: Colors.$blanco,
        height: Dimensions.get('window').height
    },
    cajaCabeza: {
        width: Dimensions.get('window').width,
        height: 120,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.$blanco,
        marginTop: 20
    },
    btnAtras: {
        position: 'absolute',
        top: 10,
        left: 10,
    },
    titulo: {
        fontSize: 24,
        color: Colors.$texto,
        marginTop: 25,
    },
    Acordeon: {
        width: '100%',
        textAlign: 'center',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        height: 'auto',
        fontSize: 20,
        color: Colors.$texto80,
        marginTop: 10,
        marginBottom: 10,
        backgroundColor: Colors.$secundario20,
        padding: 10,
        borderRadius: 10,
    },
    textAcordeon: {
        fontSize: 20, 
        color: Colors.$texto,
        fontFamily: Fonts.$poppinsregular,
    },

    iconMenu: {
        width: 50,
        height: 50,
    },
    LineaHorizontal: {
        width: "80%",
        height: 5,
        backgroundColor: Colors.$texto50,
        marginVertical: 20,
    },
    cajaContenido: {
        width: '80%',
        alignItems: 'center',
    },
    seccionPassword: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.$blanco,
        marginBottom: 20,
    },
    input: {
        textAlignVertical : 'bottom',
        fontSize : moderateScale(18),
        paddingLeft: moderateScale(10),
        paddingVertical:moderateScale(5),
        borderColor: 'black',
        borderWidth: .8,
        borderRadius: moderateScale(5),
        marginBottom: moderateScale(20),
        marginTop: moderateScale(2),
        paddingBottom: moderateScale(5),
        paddingTop: moderateScale(5),
        width: 'auto',
        color: 'black',
    },
    btnActualizar: {
        marginTop: 20,
        padding: 10,
        borderRadius: 25,
        backgroundColor: Colors.$primario,
        alignItems: 'center',
        width: '80%',
    },
    textoBoton: {
        color: Colors.$blanco,
        fontSize: 18,
        fontFamily: Fonts.$poppinsregular
    },
    textInputs: { 
        fontFamily: Fonts.$poppinsregular, 
        fontSize : 16, 
        color : Colors.$secundario,
        textAlign: 'left',
        width: '100%',
    }
});

const styles = StyleSheet.create({
    container: {
        width: '80%',
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 10,
        elevation: 3,
        marginTop: 10,
    },
    title: {
        fontSize: 18,
        fontFamily: Fonts.$poppinsregular,
        marginBottom: 20,
        color: Colors.$texto,
    },
    switchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        color: Colors.$texto50,
        fontFamily: Fonts.$poppinsregular,
    },
    button: {
        backgroundColor: Colors.$primario,
        padding: 12,
        borderRadius: 25,
        alignItems: 'center',
        marginTop: 15,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    vehiculeTouch: {
        backgroundColor: Colors.$blanco,
        padding: 20,
        borderRadius: 20,
        elevation: 3,
        marginTop: 10,
    },
    cajaRow: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
    },
    cajaPartidaImg: {
        marginRight: 10,
    },
    imgCarro: {
        width: 50,
        height: 50,
        resizeMode: 'contain',
    },
    imgMoto: {
        width: 50,
        height: 50,
        resizeMode: 'contain',
    },
    inputContainer: {
        flex: 1,
    },
    input: {
        borderWidth: 1,
        borderColor: Colors.$secundario,
        padding: 8,
        borderRadius: 10,
        marginBottom: 5,
        color: Colors.$texto,
        width: '100%',
        fontFamily: Fonts.$poppinsregular,
        fontSize: 16,
    },
    rulesTextTitulo: {
        textAlign: 'center',
        fontSize: 16,
        color: '#555',
        marginTop: 20,
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
export default connect(mapStateToProps)(ConfiguracionPerfil);
