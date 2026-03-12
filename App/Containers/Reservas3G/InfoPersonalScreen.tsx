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
} from 'react-native';
//Layout
import Images from '../../Themes/Images';
//Components
import React from 'react';
import { connect } from 'react-redux';
import styles from '../Screens/Styles/FaqScreen.style';
import Colors from '../../Themes/Colors';
import { fetch } from '../../Services/refresh.service';
import Fonts from '../../Themes/Fonts';
import URL_mysql from './functions/url';

class InfoPersonalScreen extends React.Component<any, any> {
    constructor(props:any) {
        super(props);
        this.state = {
           info: 'informacion del usuario 3G',
           cedula: '',
           nombres: '',
           apellidos: '',
           fecha_nacimiento: '',
           celular: '',
           correo: '',
           tel_emergencia: '',
           eps: '',
           rh: '',
           fecha_registro: '',
           URL_user: 'http://192.168.1.7:3003/api/', 
        }
        console.log('state inicial', this.state);
    }

    //HOOK componentDidMount se ejecuta despues del primer renderizado
    componentDidMount() {
        this.verInfo();
        console.log('pintando state: '+ this.state.celular)
    }
    
    goBack = () => {
        this.props.navigation.goBack();
    }

    verState = () => {
        console.log('ver state actualizado', this.state)
    }
    
    guardarRegistro = () =>{
        console.log('guardando el registro VP')
        if (this.state.tipo !== '' && this.state.marca !== '' && this.state.color !== '') {
            const data = {
            "codigoQR": this.state.codigo, 
            "tipo": this.state.tipo, 
            "marca": this.state.marca, 
            "modelo": this.state.modelo, 
            "color": this.state.color,
            "serial": this.state.serial
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
                this.setState({ registroBici: true })
            })
        }else{
            console.log('Los campos estan vacios')
        }
    }

    guardarCambios = () => {
        console.log('guardando el cambio ')
        
        const data = {
            "Cedula": this.state.cedula,	
            "Nombre": this.state.nombres,   
            "Apellido": this.state.apellidos,
            "EPS": this.state.eps,
            "RH": this.state.rh,
            "Tel2": this.state.tel_emergencia
        }

        const url = URL_mysql.url_api+"usuario/updateusuario";
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
        const url = URL_mysql.url_api+"/bc_usuarios/1111";
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
            

            this.setState({ 
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
    }

    render() {
        return (
        <SafeAreaView style={estilos.contenedor}>
            <TouchableOpacity  onPress={() => { this.goBack() }} style={{flexDirection : 'row', justifyContent : 'center', padding: 15, backgroundColor : Colors.$primario}}>
                    <View >
                        <Image style={{width : 320, height : 50}} source={Images.flechaAtras} />
                    </View>
            </TouchableOpacity>
            <View style={{ marginTop: 20, flex: 1, width: '100%' }}>
                <Text style={estilos.title}>
                ¡Bienvenido!
                </Text>
                <View style={{ height: 4, width: 400, backgroundColor: '#fff', alignSelf: 'center', borderRadius: 10 }} />
            </View>
        <View>
            <View>
                <Text style={estilos.title_user}>
                    Usuario: {this.state.cedula}
                </Text>
            </View>

            <View style={estilos.divInput}>
                <Text style={estilos.inputText}>Nombres</Text>
                <TextInput
                    style={[estilos.input]}
                    value={this.state.nombres}
                    placeholder="Nombres"
                    placeholderTextColor="#878787"
                    onChangeText={objectName => this.setState({ nombres: objectName })}
                />
            </View>

            <View style={estilos.divInput}>
                <Text style={estilos.inputText}>Apellidos</Text>
                <TextInput
                    style={[estilos.input]}
                    value={this.state.apellidos}
                    placeholderTextColor="#878787"
                    onChangeText={objectApellidos => this.setState({ apellidos: objectApellidos })}
                />
            </View>

            <View style={estilos.divInput}>
                <Text style={estilos.inputText}>Fecha de nacimiento</Text>
                <TextInput
                    style={[estilos.input]}
                    value={this.state.fecha_nacimiento}
                    placeholderTextColor="#878787"
                    onChangeText={objectFecha_nacimiento => this.setState({ fecha_nacimiento: objectFecha_nacimiento })}
                />
            </View>

            
            <View style={estilos.divInput}>
                <Text style={estilos.inputText}>Teléfonos: </Text>
                <TextInput
                    style={[estilos.input]}
                    keyboardType='numeric'
                    value={this.state.celular}
                    placeholder={'Tel: '+this.state.celular}
                    placeholderTextColor="#000000"
                    onChangeText={objectCelular => this.setState({ celular: objectCelular })}
                />
                <TextInput
                    style={[estilos.input]}
                    keyboardType='numeric'
                    value={this.state.tel_emergencia}
                    placeholder={'Tel emergencias: '+this.state.tel_emergencia}
                    placeholderTextColor="#000000"
                    onChangeText={objectTelEmergencia => this.setState({ tel_emergencia: objectTelEmergencia })}
                />
            </View>

            <View style={estilos.divInput}>
                <Text style={estilos.inputText}>Correo</Text>
                <TextInput
                    style={[estilos.input]}
                    value={this.state.correo}
                    placeholderTextColor="#878787"
                    onChangeText={objectCorreo => this.setState({ correo: objectCorreo })}
                />
            </View>

            <View style={estilos.divInput}>
                <Text style={estilos.inputText}>EPS</Text>
                <TextInput
                    style={[estilos.input]}
                    value={this.state.eps}
                    placeholderTextColor="#878787"
                    onChangeText={objectEPS => this.setState({ eps: objectEPS })}
                />
            </View>

            <View style={estilos.divInput}>
                <Text style={estilos.inputText}>RH</Text>
                <TextInput
                    style={[estilos.input]}
                    value={this.state.rh}
                    placeholderTextColor="#CCCCCC"
                    onChangeText={objectRH => this.setState({ rh: objectRH })}
                />
            </View>  
        </View>

        <TouchableOpacity  onPress={() => { this.guardarCambios() }} style={estilos.btnCenter}>
            <View style={estilos.btnSave}>
                <Text style={estilos.btnSaveColor}>Actualizar</Text>
            </View>
        </TouchableOpacity>
            
    </SafeAreaView>
        );
    }

}

const estilos = StyleSheet.create({
    generales: {
        flex: 1,
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
        backgroundColor: '#40CC9A',
        margin: 1, 
        alignItems: 'center', 
        justifyContent: 'center',
    },
    contenedor:{
        backgroundColor: 'rgba(255, 255, 255, 1)', 
        margin: 20,
    },
    divInput: {
        marginTop: 10,
        marginBottom: 10,
        backgroundColor: '#FFFFFF',
    },
    input:{
        width: '100%',
        height: 'auto',
		borderBottomWidth: 1,
        borderColor: '#CCCCCC',
        fontSize: 20,
        fontFamily: Fonts.$montserratExtraBold,
    },
    inputText: {
        color: '#CCCCCC',
        fontSize: 16,
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
        backgroundColor: '#40CC9A',
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
    },
    btnSaveColor: {
        color: '#FFFFFF',
        fontSize: 20,
    },
});

function mapStateToProps(state:any) {
    return {
        dataUser: state.userReducer
    }
}

export default connect(
    mapStateToProps,
)(InfoPersonalScreen);


