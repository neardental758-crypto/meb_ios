import {
    Image,
    ImageBackground,
    SafeAreaView,
    Text,
    TouchableOpacity,
    View,
    StyleSheet,
    TextInput,
    Alert,
    Dimensions,
    Modal, 
    Button
  } from 'react-native';
  import { Content } from 'native-base';
  //Layout
  import Images from '../../Themes/Images';
  //Components
  import React, { useState, useEffect } from 'react';
  import { connect } from 'react-redux';
  import { fetch } from '../../Services/refresh.service';
  import Fonts from '../../Themes/Fonts';
  import Colors from '../../Themes/Colors';
  import { horizontalScale, moderateScale, verticalScale } from '../../Themes/Metrics';
  
  function ActualizarPerfil (props) {
  
    const [ state , setState ] = useState({
      info: 'informacion del usuario 3G',
        cedula: 'XXXXXX',
        nombres: 'Prueba',
        apellidos: '',
        fecha_nacimiento: '',
        celular: '310000000',
        correo: 'prueba@c.co',
        tel_emergencia: '3201111111',
        eps: '',
        rh: '',
        fecha_registro: '',
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
                        <View style={{ flex: 3, borderRadius: 6, marginVertical: 130, marginHorizontal: 50, backgroundColor: "#fff", justifyContent: "center", alignItems: "center", paddingHorizontal: 25 }}>
                            <Image style={{
                                justifySelf: 'center', width: 250,
                                height: 120,
                            }} source={Images.bicycleicon} />
  
                            <Text style={{ 
                              textAlign: "center", 
                              color: Colors.$secundario,
                              fontSize: 22, 
                              fontWeight: "700", 
                              marginTop: 20 }}
                            >Datos actualizados</Text>
                            
                            
                            
                            <View style={{
                                marginTop: 40,
                                flexDirection: 'row',
                                justifyContent: 'space-between'
                            }}>
                                <View style={{ marginRight: 8 }}>
                                    <Button
                                        title="ACEPTAR"
                                        color={Colors.$primario}
                                        onPress={() => { 
                                          displayBackgroundInfoModal(false) 
                                          //guardar()
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
    
    
    const goBack = () => {
        props.navigation.goBack();
    }
  
    const verState = () => {
        console.log('ver state actualizado', state)
    }
    
    /*guardarRegistro = () =>{
        console.log('guardando el registro VP')
        if (state.tipo !== '' && state.marca !== '' && state.color !== '') {
            const data = {
            "codigoQR": state.codigo, 
            "tipo": state.tipo, 
            "marca": state.marca, 
            "modelo": state.modelo, 
            "color": state.color,
            "serial": state.serial
            }
  
            const url = "http://192.168.1.10:3002/api/registroVehiculoParticular/register";
            const request = {
                method: 'POST',
                body: JSON.stringify(data),
            };
            fetch(url, request)
            .then((dato:any) =>{ 
                console.log('Guardando REGISTRO VP');
                console.log('la data', data);
                console.log(dato);
                setState({ ...state,  registroBici: true })
            })
        }else{
            console.log('Los campos estan vacios')
        }
    }
  
    guardarCambios = () => {
        console.log('guardando el cambio ')
        
        const data = {
            "Cedula": state.cedula,	
            "Nombre": state.nombres,   
            "Apellido": state.apellidos,
            "EPS": state.eps,
            "RH": state.rh,
            "Tel2": state.tel_emergencia
        }
  
        const url = "";
        const request = {
            method: 'POST',
            body: JSON.stringify(data),
        };
        fetch(url, request)
        .then((dato:any) =>{
            console.log('respuesta del fecht guardando cambios', dato);
            console.log('respuesta: ', dato.body.data);
            Alert.alert(
                "Actualización exitosa",
                ":(",
                [
                  { text: "OK", onPress: () => console.log("OK Pressed") }
                ]
              );
        })
        
    }
    
    verInfo = () => {
        console.log('Función mostrando usuario por ID');
        const url = "";
        fetch(url)
        .then((dato:any) => {
            console.log(dato);
            console.log(dato.body.data.Cedula);
            let cedula = dato.body.data.usu_documento;
            let nombre = dato.body.data.usu_nombres;
            let apellidos = dato.body.data.usu_apellidos;
            let fecha_nacimiento = dato.body.data.usu_fecha_nacimiento;
            let celular = dato.body.data.usu_telefono;
            let correo = dato.body.data.usu_correo;
            let tel_emergencia = dato.body.data.usu_telefono2;
            let eps = dato.body.data.usu_eps;
            let rh = dato.body.data.usu_rh;
            let fecha_registro = dato.body.data.usu_fecha_registro;
            
  
            setState({ ...state,  
                cedula: cedula,
                nombres: nombre,
                apellidos: apellidos,
                fecha_nacimiento: fecha_nacimiento,
                celular: celular,
                correo: correo,
                tel_emergencia: tel_emergencia,
                eps: eps,
                rh: rh,
                fecha_registro: fecha_registro,
            });
  
        })
    }*/
  
    useEffect(() => {
        //verInfo();
        console.log('pintando state: '+ state.celular)
    },[])
  
    return (
                  <Content>
                  <View style={estilos.contenedor}>
                        {/*botones top*/}
                        <TouchableOpacity onPress={() => { goBack() }} style={{flexDirection : 'row', justifyContent : 'flex-start', padding: 10, backgroundColor : Colors.$primario}}>
              <View >
                  <Image style={{marginLeft: moderateScale(10), width : horizontalScale(250), height : verticalScale(42)}} source={Images.flechaAtras} />
              </View>
  
              
          </TouchableOpacity>
  
          <ImageBackground source={Images.qrRuta} style={{        
        flex: 1,
        width: '100%', 
        justifyContent: 'center'
        }}></ImageBackground>
  
                        <View style={{ marginTop: 20, flex: 1, width: '100%', alignItems: 'center' }}>
                            <Text style={estilos.title}>
                            ¡Bienvenido!
                            </Text>
                            <View style={estilos.subRaya} />
                            <Image style={{width: 150, height : 150}} source={Images.generoM} />
                        </View>
                        
                        
                        <View style={estilos.cajaForm}>
                            <View>
                                <Text style={estilos.title_user}>
                                    Usuario: {state.cedula}
                                </Text>
                            </View>
  
                            <View style={estilos.divInput}>
                                <Text style={estilos.inputText}>Nombres</Text>
                                <TextInput
                                    style={[estilos.input]}
                                    value={state.nombres}
                                    placeholder="Nombres"
                                    placeholderTextColor={Colors.$secundario}
                                    onChangeText={objectName => setState({ ...state,  nombres: objectName })}
                                />
                            </View>
  
                            <View style={estilos.divInput}>
                                <Text style={estilos.inputText}>Apellidos</Text>
                                <TextInput
                                    style={[estilos.input]}
                                    value={state.apellidos}
                                    placeholder="Apellidos"
                                    placeholderTextColor={Colors.$secundario}
                                    onChangeText={objectApellidos => setState({ ...state,  apellidos: objectApellidos })}
                                />
                            </View>
  
                            <View style={estilos.divInput}>
                                <Text style={estilos.inputText}>Fecha de nacimiento</Text>
                                <TextInput
                                    style={[estilos.input]}
                                    value={state.fecha_nacimiento}
                                    placeholder="Fecha de nacimiento"
                                    placeholderTextColor={Colors.$secundario}
                                    onChangeText={objectFecha_nacimiento => setState({ ...state,  fecha_nacimiento: objectFecha_nacimiento })}
                                />
                            </View>
  
                            
                            <View style={estilos.divInput}>
                                <Text style={estilos.inputText}>Teléfono </Text>
                                <TextInput
                                    style={[estilos.input]}
                                    keyboardType='numeric'
                                    value={state.celular}
                                    placeholder={"Teléfono"}
                                    placeholderTextColor={Colors.$secundario}
                                    onChangeText={objectCelular => setState({ ...state,  celular: objectCelular })}
                                />
                            </View>
  
                            <View style={estilos.divInput}>
                                <Text style={estilos.inputText}>Teléfono de emergencia</Text>
                                <TextInput
                                    style={[estilos.input]}
                                    keyboardType='numeric'
                                    value={state.tel_emergencia}
                                    placeholder={"Teléfono de emergencia"}
                                    placeholderTextColor={Colors.$secundario}
                                    onChangeText={objectTelEmergencia => setState({ ...state,  tel_emergencia: objectTelEmergencia })}
                                />
                            </View>
  
                            <View style={estilos.divInput}>
                                <Text style={estilos.inputText}>Correo</Text>
                                <TextInput
                                    style={[estilos.input]}
                                    value={state.correo}
                                    placeholder={"Email"}
                                    placeholderTextColor={Colors.$secundario}
                                    onChangeText={objectCorreo => setState({ ...state,  correo: objectCorreo })}
                                />
                            </View>
  
                            <View style={estilos.divInput}>
                                <Text style={estilos.inputText}>EPS</Text>
                                <TextInput
                                    style={[estilos.input]}
                                    value={state.eps}
                                    placeholder={"EPS"}
                                    placeholderTextColor={Colors.$secundario}
                                    onChangeText={objectEPS => setState({ ...state,  eps: objectEPS })}
                                />
                            </View>
  
                            <View style={estilos.divInput}>
                                <Text style={estilos.inputText}>RH</Text>
                                <TextInput
                                    style={[estilos.input]}
                                    value={state.rh}
                                    placeholder={"RH"}
                                    placeholderTextColor={Colors.$secundario}
                                    onChangeText={objectRH => setState({ ...state,  rh: objectRH })}
                                />
                            </View>  
                        </View>
  
                        <TouchableOpacity  onPress={() => { displayBackgroundInfoModal(true) }} style={estilos.btnCenter}>
                            <View style={estilos.btnSave}>
                                <Text style={estilos.btnSaveColor}>Actualizar</Text>
                            </View>
                        </TouchableOpacity>
                  </View> 
                  </Content>
    );
  
  }
  
  const estilos = StyleSheet.create({
    generales: {
        flex: 1,
        width: Dimensions.get("window").width, 
        padding: 0,
        margin: 0,
    },
    subRaya: {
      height: 2, 
      width: Dimensions.get("window").width, 
      backgroundColor: 'transparent', 
      alignSelf: 'center',
    },
    title:{
        fontFamily: Fonts.$montserratExtraBold, 
        fontSize: 30, 
        textAlign: 'center', 
        color: '#878787', 
        marginBottom: 5
    },
    safeArea: {
        flex: 1, 
        width: Dimensions.get("window").width,
        margin: 1, 
        alignItems: 'center', 
        justifyContent: 'center',
    },
    contenedor:{ 
        backgroundColor: Colors.$blanco,
    },
    cajaForm:{
      flex: 1,
      alignItems: 'center',
    },
    divInput: {
        width: "90%",
        backgroundColor: Colors.$blanco,
        borderRadius: 10,
        marginBottom: 20,
    },
    input:{
        width: '100%',
        fontSize: 22,
        fontFamily: Fonts.$montserratExtraBold,
        paddingLeft: 20,
        color: Colors.$secundario,
        backgroundColor: Colors.$tercer,
        borderRadius: 20,
    },
    inputText: {
        color: Colors.$secundario,
        fontSize: 14,
        paddingLeft: 10
    },
    title_user:{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 30,
        textAlign: 'center',
        fontFamily: Fonts.$montserratExtraBold,
        color: '#878787', 
    },
    btnBack: {
        flexDirection: "row",
        alignItems: 'center', 
        justifyContent: 'center', 
        backgroundColor: '#40CC9A',
        width: 80, 
        height: 30, 
        borderRadius: 10,
    },
    btnSave: {
        flex: 1,
        flexDirection: "row",
        alignItems: 'center', 
        justifyContent: 'center', 
        backgroundColor: Colors.$primario,
        width: 180, 
        height: 'auto', 
        borderRadius: 25,
        paddingTop: 10,
        paddingBottom: 10,
    },
    btnCenter: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 30,
        marginBottom: 20,
        paddingLeft: 10
    },
    btnSaveColor: {
        color: Colors.$texto,
        fontSize: 20,
    },
  });
  
  function mapStateToProps(state) {
    return {
        
    }
  }
  
  function mapDispatchToProps(dispatch) {
    return {
        
    }
  }
  
  export default connect(
    mapStateToProps,
    mapDispatchToProps,
  )(ActualizarPerfil);
  
  
  