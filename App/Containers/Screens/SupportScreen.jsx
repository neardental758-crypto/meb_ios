import { 
    Image, 
    SafeAreaView, 
    ScrollView, 
    Text, 
    TouchableOpacity, 
    View,
    Pressable,
    StyleSheet,
    Linking,
    Dimensions
} from 'react-native';
import React from 'react';
import { connect } from 'react-redux';
import Fonts from '../../Themes/Fonts';
import Images from '../../Themes/Images';
import Colors from '../../Themes/Colors';
import { navigationNewTicket, supportRequest } from '../../actions/actions';
import { horizontalScale, moderateScale, verticalScale } from '../../Themes/Metrics';

function SupportScreen (props) {
    const goBack = () => {
        props.navigation.goBack();
    };

    return (
        <View style={{ flex: 1, backgroundColor: Colors.$blanco }}>
            
            {/* Header */}
            <View style={estilos.cajaCabeza}>
                <Text style={estilos.textTitle}>Soporte</Text>
                <Pressable onPress={goBack} style={estilos.btnAtras}>
                    <Image 
                        source={Images.atras_Icon} 
                        style={estilos.iconAtras}
                    /> 
                </Pressable>
            </View>

            {/* Content */}
            <SafeAreaView style={estilos.container}>
                <ScrollView 
                    showsVerticalScrollIndicator={false} 
                    contentContainerStyle={estilos.scrollContent}
                >
                    <Text style={estilos.textDescription}>
                        Si tienes dudas o inquietudes, nos puedes contactar usando la siguiente información. {"\n\n"}
                        Nuestro equipo de asesores te responderá lo más pronto posible para que sigas disfrutando de nuestros servicios.
                    </Text>

                    {/* Contact Info */}
                    <View style={estilos.infoRow}>
                        <Image style={estilos.icon} source={Images.adjuntar} />
                        <Text style={estilos.textInfo}>+57 316 812 7343</Text>
                    </View>

                    <View style={estilos.infoRow}>
                        <Image style={estilos.icon} source={Images.mailRed} />
                        <Text style={estilos.textInfo}>servicio@bicyclecapital.co</Text>
                    </View>

                    <View style={estilos.infoRow}>
                        <Image style={estilos.icon} source={Images.distance} />
                        <Text style={estilos.textInfo}>bicyclecapital.co</Text>
                    </View>

                    {/* Botón soporte */}
                    <TouchableOpacity 
                        activeOpacity={0.8} 
                        onPress={() => Linking.openURL("https://wa.link/oulc2m")} 
                        style={estilos.btnPrimary}
                    >
                        <Text style={estilos.btnText}>Chat de soporte</Text>
                    </TouchableOpacity>

                    {/* Eliminar cuenta */}
                    <Text style={estilos.textSecondary}>
                        Si deseas eliminar tu cuenta, por favor llena el siguiente formulario. 
                        Nuestro administrador se encargará de eliminar tu cuenta y te notificará por correo cuando el proceso se haya completado.
                    </Text>

                    <TouchableOpacity 
                        activeOpacity={0.8} 
                        onPress={() => Linking.openURL("https://www.bicyclecapital.co/clear_data_ride/")} 
                        style={estilos.btnSecondary}
                    >
                        <Image style={estilos.iconInsideBtn} source={Images.distance} />
                        <Text style={estilos.btnText}>Eliminar cuenta</Text>
                    </TouchableOpacity>
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}

const estilos = StyleSheet.create({
    cajaCabeza: {
        backgroundColor: Colors.$blanco,
        justifyContent: 'center',
        alignItems: 'center',
        width: Dimensions.get('window').width,
        height: verticalScale(70),
        borderBottomWidth: 1,
        borderBottomColor: Colors.$texto20,
    },
    textTitle: {
        fontSize: moderateScale(22),
        fontFamily: Fonts.$poppinsmedium,
        color: Colors.$texto80,
    },
    btnAtras: {
        position: 'absolute',
        left: 15,
        top: 20,
        padding: 8,
        borderRadius: 25,
    },
    iconAtras: {
        tintColor: Colors.$texto80,
        width: 28,
        height: 28,
    },
    container: {
        flex: 1,
        backgroundColor: Colors.$blanco,
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingVertical: 15,
    },
    textDescription: {
        fontFamily: Fonts.$poppinsregular,
        fontSize: moderateScale(15),
        color: Colors.$texto,
        textAlign: 'justify',
        marginBottom: 20,
        lineHeight: 22,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 8,
    },
    icon: {
        tintColor: Colors.$adicional,
        resizeMode: 'contain',
        width: 28,
        height: 28,
        marginRight: 15,
    },
    textInfo: {
        fontFamily: Fonts.$poppinsregular,
        fontSize: moderateScale(15),
        color: Colors.$texto,
    },
    btnPrimary: {
        marginTop: 25,
        backgroundColor: Colors.$primario,
        borderRadius: 25,
        paddingVertical: 12,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    btnSecondary: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 15,
        backgroundColor: Colors.$negro,
        borderRadius: 25,
        paddingVertical: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    iconInsideBtn: {
        tintColor: Colors.$blanco,
        width: 20,
        height: 20,
        marginRight: 10,
    },
    btnText: {
        fontFamily: Fonts.$poppinsmedium,
        fontSize: moderateScale(16),
        color: Colors.$blanco,
    },
    textSecondary: {
        marginTop: 20,
        fontFamily: Fonts.$poppinsregular,
        fontSize: moderateScale(14),
        color: Colors.$texto,
        textAlign: 'justify',
        lineHeight: 20,
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

export default connect(mapStateToProps, mapDispatchToProps)(SupportScreen);
