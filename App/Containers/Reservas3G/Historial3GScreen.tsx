import {
    Image,
    ImageBackground,
    SafeAreaView,
    Text,
    TouchableOpacity,
    View,
    StyleSheet,
    Alert,
    ScrollView
} from 'react-native';
//Layout
import Images from '../../Themes/Images';
//Components
import React from 'react';
import { connect } from 'react-redux';
import RNPickerSelect from '@nejlyg/react-native-picker-select';
import { navigationNewTicket, supportRequest } from '../../actions/actions';
import { fetch } from '../../Services/refresh.service';
import Fonts from '../../Themes/Fonts';
import URL_mysql from './functions/url';

const mapRef: any = React.createRef();
class Historial3GScreen extends React.Component<any, any> {
    
    constructor(props:any) {
        super(props);
        this.state = {
           user: '',
           userValido: null,
           prestamos: [],
        }
        console.log('state inicial', this.state);
    }

    goBack = () => {
        this.props.navigation.goBack();
    }

    verInfo = () => {
        console.log('Función mostrando usuario por ID');
        const url = URL_mysql.url_api+"/bc_usuarios/1111";
        fetch(url)
        .then((dato:any) => {
            console.log(dato);
            let cedula = dato.body.data.usu_documento;
            let habilitado = dato.body.data.usu_habilitado;
            
            habilitado === 1 ?
            this.setState({ 
                user: cedula,
                userValido: true,
            })
            :
            this.setState({ 
                user: cedula,
                userValido: false,
            });
        })
    }

    verState = () => {
        console.log('EL STATE ACT::::: ', this.state)
    }

    verPrestamos = async (cc:any) => {
        const url_prestamo = URL_mysql.url_api+"bc_prestamos/prestamoUsuario/"+cc;
        await fetch(url_prestamo)
        .then((data:any) => {
            console.log('array de prestamos', data.body.data);
            console.log('tamaño de prestamos', data.body.data.length);

            if (data.body.data.length === 0 ) {
                this.setState({ prestamo : [{ "pre_retiro_estacion": "", "pre_bicicleta": "" }] })
            }else{
                this.setState({ prestamos : data.body.data, prestamoActivo : true })
            }
        })
    }

    componentDidMount() {
        this.verInfo();
        this.verPrestamos('1111');
        console.log('DESPUES DEL COMPONENTDIDMOUNT::: ', this.state)
    }

    render() {
        return (
            <ImageBackground source={Images.grayBackground} style={estilos.generales}>
                <SafeAreaView style={estilos.safeArea}>
                    <ScrollView style={estilos.contenedor}>
                        <View style={estilos.contentTop}>
                            <TouchableOpacity onPress={() => { this.goBack() }} style={{ width: 100, margin: 4}}>
                                <View style={estilos.btnBack}>
                                    <Image source={Images.goBackRed} />
                                </View>
                            </TouchableOpacity>

                            <View style={estilos.contentTitle}>
                                <Text style={estilos.title}>
                                Mis prestamos
                                </Text>
                                <View style={{ height: 4, width: 400, backgroundColor: '#fff', alignSelf: 'center', borderRadius: 10 }} />
                            </View> 
                        </View>
                        <View>
                            <>
                            {
                                (this.state.prestamos.map((data:any) => {
                                    <Text>ID: {data.pre_id}</Text>
                                }))
                            }
                            </>
                            <TouchableOpacity  onPress={() => { this.verState() }}>
                                <Text>ver state</Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </SafeAreaView>
            </ImageBackground>
        );
    }

}

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

const estilos = StyleSheet.create({
    generales: {
        flex: 1,
    },
    contentTop: {
        backgroundColor: '#40CC9A'
    },
    contenedor:{
        backgroundColor: 'rgba(255, 255, 255, 1)', 
        marginLeft: 0,
        marginRight: 0,
    },
    title:{
        fontFamily: Fonts.$montserratExtraBold, 
        fontSize: 30, 
        textAlign: 'center', 
        color: '#FFFFFF', 
        marginBottom: 5
    },
    contentTitle: { 
        marginTop: 20, 
        flex: 1, 
        width: '100%',
        backgroundColor: '#40CC9A',
    },
    btnBack: {
        flexDirection: "row",
        alignItems: 'center', 
        justifyContent: 'center', 
        backgroundColor: '#40CC9A',
        width: 40, 
        height: 30, 
        borderRadius: 10,
    },
    safeArea: {
        flex: 1, 
        backgroundColor: '#40CC9A',
        margin: 1, 
        alignItems: 'center', 
        justifyContent: 'center',
    },
    titleSelect: {
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 22,
        textAlign: 'center',
        fontFamily: Fonts.$size26,
        color: '#878787', 
        marginTop: 20,
    },
    itemSelect: {
        backgroundColor: '#40CC9A',
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
    cajaImgReserva: {
        width: 350,
        height: 350,
        alignSelf: 'center',
        justifyContent: 'center',
    },
    imgReserva: {
        width: '100%',
        height: 350,
    },
    msnHorarios: {
        width: 370,
        height: 'auto',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 50, 
        fontFamily: Fonts.$size26,
        textAlign: 'center', 
    },
    denegado: {
        fontFamily: Fonts.$size26,
        fontSize: 20,
        backgroundColor: '#FF7979',
        color: '#fff',
        width: '100%',
        marginBottom: 5,
        paddingLeft: 10,
        borderRadius: 5,
    },
    aceptado: {
        fontFamily: Fonts.$size26,
        fontSize: 20,
        color: '#40CC9A',
        marginBottom: 8,
        width: '100%',
        backgroundColor: '#EAEAEA',
        paddingLeft: 10,
        borderRadius: 5,
    },
    contentMsn: {
        width: 350, 
        height: 'auto',
        flex: 1,
        alignItems: 'flex-start',
        justifyContent: 'center',
        marginTop: 10,
        paddingLeft: 10,
    },
});

function mapStateToProps(state:any) {
    return {
        dataUser: state.userReducer,
        navigationProp: state.globalReducer.nav._navigation
    }
}

function mapDispatchToProps(dispatch:any) {
    return {
        supportRequest: (requestSupport:any) => dispatch(supportRequest(requestSupport)),
        navigationNewTicket: () => dispatch(navigationNewTicket()),
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(Historial3GScreen);


