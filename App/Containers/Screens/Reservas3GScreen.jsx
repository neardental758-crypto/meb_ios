import {
    Image,
    ImageBackground,
    SafeAreaView,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
    StyleSheet
} from 'react-native';
import { getItem } from '../../Services/storage.service';
import Fonts from '../../Themes/Fonts';
import HeaderNavComponent from '../../Components/HeaderNavComponent'
import Images from '../../Themes/Images';
import React,{ useState }from 'react';
import { connect } from 'react-redux';
import styles from './Styles/SupportScreen.style';
import { navigationNewTicket, supportRequest } from '../../actions/actions';
import { fetch } from '../../Services/refresh.service';
import Colors from '../../Themes/Colors';

function Reservas3GScreen (props) {
    
    const [ state, setState ] = useState({});

    informacion = () => {
        props.navigationProp.navigate('InfoPersonalScreen');
    }

    reservar = () => {
        props.navigationProp.navigate('Reservar3GScreen');
    }

    rentar = () => {
        props.navigationProp.navigate('Rentar3GScreen');
    }

    finalizar = () => {
        props.navigationProp.navigate('Finalizar3GScreen');
    }

    historial = () => {
        props.navigationProp.navigate('Historial3GScreen');
       
    }

    notificaciones = () => {
        props.navigationProp.navigate('notificacionesPush3GScreen');
        
    }
    const { loading } = props;
    return (
        <View style={{ flex: 1, backgroundColor: '#fff' }}>
            <HeaderNavComponent 
            onTouch={() => props.navigation.toggleDrawer()}
            perfile={()=> props.navigationProp.navigate('PerfileUser')} />
            <ImageBackground source={Images.grayBackground} style={styles.settingBackground}>
                <SafeAreaView style={{ flex: 1, backgroundColor: 'rgba(255, 255, 255, 0.8)', margin: 30 }}>

                    <ScrollView style={{ flex: 1 }}>
                        <View style={{ marginTop: 20 }}>
                            <Text style={[{ fontFamily: Fonts.$montserratExtraBold, fontSize: 30, textAlign: 'center', color: '#878787', marginBottom: 5 }]}>
                                RESERVAS 3G
                            </Text>
                            <View style={{ height: 4, width: 160, backgroundColor: Colors.$primario, alignSelf: 'center', borderRadius: 10 }} />
                        </View>
                        
                        <View>
                            <TouchableOpacity  onPress={() => { informacion() }}>
                                <Text>INFORMACIÓN PERSONAL</Text>
                            </TouchableOpacity>

                            <TouchableOpacity  onPress={() => { reservar() }}>
                                <Text>RESERVAR</Text>
                            </TouchableOpacity>

                            <TouchableOpacity  onPress={() => { rentar() }}>
                                <Text>RENTAR</Text>
                            </TouchableOpacity>

                            <TouchableOpacity  onPress={() => { finalizar() }}>
                                <Text>FINALIZAR VIAJE</Text>
                            </TouchableOpacity>

                            <TouchableOpacity  onPress={() => { historial() }}>
                                <Text>HISTORIAL</Text>
                            </TouchableOpacity>

                            <TouchableOpacity  onPress={() => { notificaciones() }}>
                                <Text>NOTIFICACIONES PUSH</Text>
                            </TouchableOpacity>
                        
                        </View>
                        
                    </ScrollView>
                </SafeAreaView>
            </ImageBackground>
        </View>
    );
    
}

function mapStateToProps(state:any) {
    return {
        dataOthers: state.othersReducer,
        dataUser: state.userReducer,
        loading: state.othersReducer.isFetching,
        emailSupportSended: state.othersReducer.emailSupportSended,
        error: state.othersReducer.error,
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
)(Reservas3GScreen);


