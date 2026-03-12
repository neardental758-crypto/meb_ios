import {
    Image,
    ImageBackground,
    SafeAreaView,
    Text,
    TouchableOpacity,
    View,
    StyleSheet,
} from 'react-native';
//Layout
import Images from '../../Themes/Images';
//Components
import React from 'react';
import { connect } from 'react-redux';
import Fonts from '../../Themes/Fonts';

class notificacionesPushScreen extends React.Component<any, any> {
    constructor(props:any) {
        super(props);
        this.state = {
           
        }
        console.log('state inicial', this.state);
    }

    
    goBack = () => {this.props.navigation.goBack();}
    verState = () => {console.log('ver state actualizado', this.state)}

    ///// Funcion enviar notificacion
    sendNotification = async () => {
        const FIREBASE_API_KEY = 'HtYJGi1LIRFXX8Bb3rKDKybLzVNO4yImD0_vUdosUGE';
        const message = {
            registration_ids: ["eiDvgYaNSnOpHnoVbUE75q:APA91bEXs2OXKO_ud0twUol_zXNxkb_d8Po3ln8nR2znN7i9PqrU7g-_zFBQAC9fW0uS7znuAZQZwzq-RE94pNqojQXwk7jchGs-LSNKzml3vLgriY07bxDChtl1b_H1f8h5KgH4YUY6"],
            notification: {
                title: 'titulo de la notificacion',
                body: 'Cuerpo notificacion',
                "vibrate": 1,
                "sound": 1,
                "show_in_foreground": true,
                "priority": 1,
                "content_available": true
            }
        }

        let headers = new Headers({
            "Content-Type": "application/json",
            "Authorization": "key="+FIREBASE_API_KEY
        });

        let response = await fetch(`https://fcm.googleapis.com/fcm/send`, {
            method: "POST",
            headers,
            body: JSON.stringify(message)
        })
        //response = await response.json();
        
        console.log(response);
    }
    
    /////////////////////////////////
    
    //HOOK componentDidMount se ejecuta despues del primer renderizado
    componentDidMount() {
        console.log('pintando state: '+ this.state.celular)
    }

    render() {
        return (

            <ImageBackground source={Images.grayBackground} style={estilos.generales}>
                <SafeAreaView style={estilos.safeArea}>
                    <View style={estilos.contenedor}>
                        <TouchableOpacity onPress={() => { this.goBack() }} style={{ width: 100, margin: 4}}>
                            <View style={estilos.btnBack}>
                                <Image source={Images.goBackRed} />
                            </View>
                        </TouchableOpacity>
                            <View style={{ marginTop: 20, flex: 1, width: '100%' }}>
                                <Text style={estilos.title}>
                                PUSH
                                </Text>
                                <View style={{ height: 4, width: 400, backgroundColor: '#fff', alignSelf: 'center', borderRadius: 10 }} />
                            </View>     

                            <TouchableOpacity 
                                onPress={() => { this.sendNotification() }} 
                                style={{ width: 500, margin: 4}}>
                                <View style={estilos.btnBack}>
                                    <Text>ENVIAR PUSH</Text>
                                </View>
                            </TouchableOpacity>      
                    </View>
                </SafeAreaView>
            </ImageBackground>
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
)(notificacionesPushScreen);


