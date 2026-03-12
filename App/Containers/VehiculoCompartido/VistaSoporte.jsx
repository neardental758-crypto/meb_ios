import { Image, ImageBackground, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import Fonts from '../../Themes/Fonts';
//Components
import HeaderNavComponent from '../../Components/HeaderNavComponent'
import Images from '../../Themes/Images';
import React,{ useState }from 'react';
import { connect } from 'react-redux';
import styles from './Styles/SupportScreen.style';
import { navigationNewTicket, supportRequest } from '../../actions/actions';
import Colors from '../../Themes/Colors';

function SupportScreen (props) {
    const [ state, setState ] = useState({});
    const goNewTicket = () => {
        props.navigationProp.navigate('NewTicketScreen');
    }
    const frequentQuestions = () => {
        props.navigationProp.navigate('FaqScreen');
    }

    const goBack = () => {
        props.navigation.goBack();
      }
        const { loading } = props;
        return (
            <View style={{ flex: 1, backgroundColor: '#fff' }}>
                {/*botones top*/}
                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                <TouchableOpacity onPress={() => { goBack() }} style={{flexDirection : 'row', justifyContent : 'center', padding: 15, backgroundColor : Colors.$primario}}>
                    <View >
                        <Image style={{width : 320, height : 50}} source={Images.flechaAtras} />
                    </View>
                </TouchableOpacity>
                </View>
                    <SafeAreaView style={{ flex: 1, backgroundColor: 'rgba(255, 255, 255, 0.8)', margin: 30 }}>

                        <ScrollView style={{ flex: 1 }}>
                            <View style={{ marginTop: 20 }}>
                                <Text Text style={[styles.accountTitle, { fontFamily: Fonts.$montserratExtraBold, fontSize: 30, textAlign: 'center', color: Colors.$texto, marginBottom: 5 }]}>Soporte</Text>
                                <View style={{ height: 4, width: 160, backgroundColor: Colors.$primario, alignSelf: 'center', borderRadius: 10 }} /></View>
                            <View style={{ marginTop: 40, marginHorizontal: 20 }}>
                                <Text style={{ fontFamily: Fonts.$poppinsregular, fontSize: 16, marginBottom: 20 }}>Si tienes dudas o inquietudes nos puedes contactar usando la siguiente información. {"\n"}
                                    Nuestro equipo de asesores te responderá la más pronto posible para que sigas disfrutando de nuestros servicios.</Text>
                                <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 15 }}>
                                    <Image style={{ resizeMode: "contain", width: 30, height: 30, marginRight: 20 }} source={Images.adjuntar}></Image>
                                    <Text style={{ fontFamily: Fonts.$poppinsregular, fontSize: 16 }}>+57 316 779 2746</Text>

                                </View>
                                <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 15 }}>
                                    <Image style={{ resizeMode: "contain", width: 30, height: 30, marginRight: 20 }} source={Images.mailRed}></Image>
                                    <Text style={{ fontFamily: Fonts.$poppinsregular, fontSize: 16 }}>info@bicyclecapital.co</Text>
                                </View>
                                <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 15 }}>
                                    <Image style={{ resizeMode: "contain", width: 30, height: 30, marginRight: 20 }} source={Images.distance}></Image>
                                    <Text style={{ fontFamily: Fonts.$poppinsregular, fontSize: 16 }}>www.bicyclecapital.co</Text>
                                </View>
                                <Text style={{ fontFamily: Fonts.$poppinsregular, fontSize: 16 }}>También puedes consultar nuestra sección de Preguntas Frecuentes o crear un Ticket por si tienes alguna urgencia.</Text>
                                {/* <View style={{ height: 40, width: 200 , marginTop:20, marginBottom:10, alignSelf: 'center'}}>
                            <TouchableOpacity onPress={() => {goFaq() }} style={{ flex: 1, borderRadius: 25, justifyContent: "center", backgroundColor: Colors.$primario }}>
                                    <Text style={{ fontFamily: Fonts.$poppinsregular, textAlign: "center", fontSize: 16, paddingTop: 'auto', paddingBottom: 'auto', color: 'white', fontWeight: '800' }}>Preguntas Frecuentes</Text>
                                </TouchableOpacity>
                            </View> */}
                                <View style={{ height: 40, width: 200, marginTop: 20, marginBottom: 20, alignSelf: 'center' }}>
                                    <TouchableOpacity onPress={() => { frequentQuestions() }} style={{ flex: 1, borderRadius: 25, justifyContent: "center", backgroundColor: Colors.$primario }}>
                                        <Text style={{ fontFamily: Fonts.$poppinsregular, textAlign: "center", fontSize: 16, paddingTop: 'auto', paddingBottom: 'auto', color: 'white', fontWeight: '800' }}>Preguntas frecuentes</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={{ height: 40, width: 200, marginBottom: 30, alignSelf: 'center' }}>
                                    <TouchableOpacity onPress={() => { goNewTicket() }} style={{ flex: 1, borderRadius: 25, justifyContent: "center", backgroundColor: Colors.$texto }}>
                                        <Text style={{ fontFamily: Fonts.$poppinsregular, textAlign: "center", fontSize: 16, paddingTop: 'auto', paddingBottom: 'auto', color: 'white', fontWeight: '800' }}>Crear un Ticket</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </ScrollView>
                    </SafeAreaView>
            </View>
        );
    }

function mapStateToProps(state) {
    return {
        dataOthers: state.othersReducer,
        dataUser: state.userReducer,
        loading: state.othersReducer.isFetching,
        emailSupportSended: state.othersReducer.emailSupportSended,
        error: state.othersReducer.error,
        navigationProp: state.globalReducer.nav._navigation
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
)(SupportScreen);
