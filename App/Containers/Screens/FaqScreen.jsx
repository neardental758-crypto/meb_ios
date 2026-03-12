import { 
    Image, 
    ImageBackground, 
    SafeAreaView,
    ScrollView, 
    Text, 
    TouchableOpacity, 
    View,
    Dimensions,
    StyleSheet,
    Pressable
} from 'react-native';
import { Content } from 'native-base';
import { Accordian } from '../../Components/Accordian';
import Fonts from '../../Themes/Fonts';
import Images from '../../Themes/Images';
import React, { useState } from 'react';
import { connect } from 'react-redux';
import Colors from '../../Themes/Colors';
import estilos from '../Reservas3G/styles/rentas.style';
import { horizontalScale, moderateScale, verticalScale } from '../../Themes/Metrics';
import * as RootNavigation from '../../RootNavigation';

function FaqScreen(props){
    const [ state, setState] = useState({
        menu: [
            {
                icon: 'help',
                title: '¿Como me registro?',
                data: 'Creas una cuenta en esta app  2. Apruebas la prueba teórica  3. Apruebas la prueba práctica 4. Ya eres un usuario activo!',
            },
            {
                icon: 'help',
                title: 'Tengo que pagar para usar el sistema',
                data: 'El sistema es 100% gratuito para los colaboradores de tu organización.'
            },
            {
                icon: 'help',
                title: '¿Como inicio un viaje?',
                data: 'Acercate al vehículo y escanea el codigo qr que se encuentra en el candado. Espera a que el pasador libere la rueda e inicia tu recorrido.'
            },
            {
                icon: 'help',
                title: '¿Cuanto tiempo puedo usar el vehículo?',
                data: 'El prestamo dura 24 horas, si tienes problemas y necesitas mas tiempo, escribenos al whatsapp.'
            },
            {
                icon: 'help',
                title: 'Quiero rentar un vehículo para alguien mas',
                data: 'Solo tu puedes hacer uso del vehículo rentado y solo puedes rentar uno a la vez.'
            },
            {
                icon: 'help',
                title: 'Me accidenté!',
                data: 'Comunícate con el 123 si es grave, de lo contrario te podemos ayudar nuestra linea de Whatsapp o deja el reporte al finalizar tu viaje'
            },
            {
                icon: 'help',
                title: 'Tengo un problema tecnico que no me permite continuar',
                data: 'Comunicate a nuestra linea de Whatsapp'
            },
            {
                icon: 'help',
                title: 'Tengo un problema tecnico que si me permite continuar',
                data: 'Porfavor dejanos el comentario al finalizar el viaje.'
            },
            {
                icon: 'help',
                title: 'Quiero reportar novedades de sobre mi viaje o vehículo',
                data: 'Dejanos un comentario al finalizar el viaje y/o comunicate con nuestro Whatsapp'
            },
            {
                icon: 'help',
                title: '¿Como hago para terminar el viaje?',
                data: 'En la estación, asegura la guaya, cierra manualmente el candado y sigue las instrucciones del APP.'
            },
            {
                icon: 'help',
                title: '¿Donde puedo parquear el vehículo?',
                data: 'En un lugar seguro que esté vigilado y techado. Para terminar el viaje, deberás hacerlo en la estación del sistema.'
            },
            {
                icon: 'help',
                title: '¿Que hago si me quedé sin bateria en mi telefono?',
                data: 'Solo cierra el candado y cuando abras el APP de nuevo, podrás terminar el viaje.'
            }
        ]
    })

    const goBack = () => {
        RootNavigation.navigate('Soporte') 
    }

    const renderAccordians = () => {
        const items = [];
        for (item of state.menu) {
            items.push(
                <Accordian
                    key={item.title}
                    icon={item.icon}
                    title={item.title}
                    data={item.data}
                />
            );
        }
        return items;
    }

    return (   
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.$blanco }}>        

        <View style={styles.cajaCabeza}>
        <Text Text style={[{ fontFamily: Fonts.$poppinsmedium, fontSize: 24, textAlign: 'center', color: Colors.$texto80, marginBottom: 5 }]}>Preguntas frecuentes</Text>
            <Pressable  
                onPress={() => { goBack() }}
                style={ styles.btnAtras }>
                <View>
                <Image source={Images.atras_Icon} style={{tintColor : Colors.$texto80, width: 30, height: 30}}/> 
                </View>
            </Pressable>
        </View>

        <ScrollView style={{ marginTop: 30 }}>
            <View style={{ 
                marginHorizontal: 20, 
                marginTop: 20, 
                borderTopLeftRadius: 20, 
                borderTopRightRadius: 20, 
                paddingHorizontal: 0,
                marginBottom: 20 }}>
                {renderAccordians()}
            </View>
        </ScrollView>
    </SafeAreaView>
    );

}

const styles = StyleSheet.create({
    cajaCabeza: {
        backgroundColor: Colors.$blanco,
        justifyContent: 'space-around',
        alignItems: 'center', 
        borderRadius: 1,
        width: Dimensions.get('window').width,
        height: 80,
        position: 'relative',
        bottom: 10,
        top: 10,
    },
    textTitle: {
        marginTop: 30, 
        marginBottom: 20, 
        textAlign: 'center', 
        fontSize : 22, 
        fontFamily : Fonts.$poppinsmedium,
        alignSelf: "center",
        color: Colors.$texto80
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
});

function mapStateToProps(state) {
    return {
        dataUser: state.userReducer
    }
}

export default connect(
    mapStateToProps,
)(FaqScreen);