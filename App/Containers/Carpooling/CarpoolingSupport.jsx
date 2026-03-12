import { 
    Image, 
    SafeAreaView, 
    Text, 
    TouchableOpacity, 
    View,
    Pressable,
    StyleSheet,
    Linking,
    Dimensions
} from 'react-native';
import Fonts from '../../Themes/Fonts';
//Components
import Images from '../../Themes/Images';
import React,{ useState }from 'react';
import { connect } from 'react-redux';
import { navigationNewTicket, supportRequest } from '../../actions/actions';
import Colors from '../../Themes/Colors';
import { horizontalScale, moderateScale, verticalScale } from '../../Themes/Metrics';
import DrawerComponent from './CarpoolingDrawer';

function CarpoolingSupport (props) {
    const goBack = () => {
        props.navigation.navigate('Home');
    }
        return (
        <View style={{ flex: 1, backgroundColor: '#fff' }}>
        <View
              style={{
                flex: 1,
                position: 'absolute',
                width: '100%',
                height: '10%',
                bottom: 0,
                alignItems: 'center',
                backgroundColor: Colors.$texto50,
                zIndex: 5,
              }}
            >
            <DrawerComponent navigation={props.navigation} />
        </View>
        <View style={estilos.cajaCabeza}>
        <Text Text style={{ fontFamily: Fonts.$poppinsmedium, fontSize: 26, textAlign: 'center', color: Colors.$texto80 }}>Soporte</Text>
        <Pressable  
            onPress={goBack} 
            style={ estilos.btnAtras }>
            <View>
              <Image source={Images.home} style={[estilos.iconBici, {tintColor : 'black'}]} /> 
            </View>
        </Pressable>
        </View>
                    <SafeAreaView style={{ flex: 1, backgroundColor: 'rgba(255, 255, 255, 0.8)', justifyContent: 'flex-start', alignItems: 'center', padding: 5 }}>
                            <View style={{ marginTop: 5, marginHorizontal: 20 }}>
                                <Text style={{ fontFamily: Fonts.$poppinsregular, fontSize: moderateScale(15), marginBottom: 20, color: Colors.$texto, textAlign: 'justify', color : 'black'}}>Si tienes dudas o inquietudes, nos puedes contactar usando la siguiente información. {"\n"}Nuestro equipo de asesores te responderá lo más pronto posible para que sigas disfrutando de nuestros servicios.</Text>
                                <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 10 }}>
                                    <Image style={{ tintColor : Colors.$adicional, resizeMode: "contain", width: 30, height: 30, marginRight: 20 }} source={Images.adjuntar}></Image>
                                    <Text style={{ fontFamily: Fonts.$poppinsregular, fontSize: 15, color: Colors.$texto}}>
                                        +57 316 812 7343
                                    </Text>
                                </View>
                                <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 10 }}>
                                    <Image style={{ tintColor : Colors.$adicional, resizeMode: "contain", width: 30, height: 30, marginRight: 20 }} source={Images.mailRed}></Image>
                                    <Text style={{ fontFamily: Fonts.$poppinsregular, fontSize: 15, color: 'black' }}>servicio@bicyclecapital.co</Text>
                                </View>
                                <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 10 }}>
                                    <Image style={{ tintColor : Colors.$adicional, resizeMode: "contain", width: 30, height: 30, marginRight: 20 }} source={Images.distance}></Image>
                                    <Text style={{ fontFamily: Fonts.$poppinsregular, fontSize: 15, color: 'black' }}>
                                        bicyclecapital.co
                                    </Text>
                                </View>
                                <View style={{ height: verticalScale(40), width: horizontalScale(200), marginVertical: 10, alignSelf: 'center' }}>
                                    <TouchableOpacity onPress={() => Linking.openURL("https://wa.link/oulc2m")} style={{ flex: 1, borderRadius: 25, justifyContent: "center", backgroundColor: 'black' }}>
                                        <Text style={{ fontFamily: Fonts.$poppinsregular, textAlign: "center", fontSize: moderateScale(15), paddingTop: 'auto', paddingBottom: 'auto', color: 'white', fontWeight: '800' }}>Chat de soporte</Text>
                                    </TouchableOpacity>
                                </View>
                                <Text style={{ fontFamily: Fonts.$poppinsregular, fontSize: moderateScale(15), color: 'black', marginVertical: 10, textAlign: 'justify', }}>Si deseas eliminar tu cuenta, por favor llenar el siguiente formulario  y nuestro administrador se encargara de eliminar tu cuenta notificandote por correo cuando se haya realizado el proceso</Text>
                                <View style={{ flexDirection : 'row', height: verticalScale(40), width: horizontalScale(200), marginVertical: 10, alignSelf: 'center' }}>
                                    <TouchableOpacity onPress={() => Linking.openURL("https://www.bicyclecapital.co/clear_data_ride/")} style={{ flex: 1, borderRadius: 25, justifyContent: "center", backgroundColor: 'black' }}>
                                        <Text style={{ fontFamily: Fonts.$poppinsregular, textAlign: "center", fontSize: moderateScale(15), paddingTop: 'auto', paddingBottom: 'auto', color: 'white', fontWeight: '800' }}>Eliminar cuenta</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                    </SafeAreaView>
            </View>
        );
    }

const estilos = StyleSheet.create({
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
        borderRadius: 25,
        backgroundColor: Colors.$blanco,
        shadowColor: "#000",
        shadowOffset: {
          width: 5,
          height: 5,
        },
        shadowOpacity: 1,
        shadowRadius: 5,
        elevation: 8,
    },
    iconMenu: {
        width: 50,
        height: 50,
    },
    textButton : {
        fontFamily: Fonts.$poppinsregular, 
        textAlign: "center", 
        fontSize: 15, 
        paddingTop: 'auto', 
        paddingBottom: 'auto', 
        color: 'white',
        color: Colors.$blanco,
        alignSelf: "center",
    },
    iconBici: {
        width: 30,
        height: 30,
    },
});

function mapStateToProps(state) {
    return {
        dataOthers: state.othersReducer,
        dataUser: state.userReducer,
        loading: state.othersReducer.isFetching,
        emailSupportSended: state.othersReducer.emailSupportSended,
        error: state.othersReducer.error,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        supportRequest: (requestSupport) => dispatch(supportRequest(requestSupport)),
        navigationNewTicket: () => dispatch(navigationNewTicket())
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(CarpoolingSupport);
