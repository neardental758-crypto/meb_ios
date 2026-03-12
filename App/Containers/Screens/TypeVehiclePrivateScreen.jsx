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

    vehicle = () => {
        props.navigationProp.navigate('MyVehiclesScreen');
        console.log('mis vehiculos');
    }

    trans = () => {
        props.navigationProp.navigate('Reservar3GScreen');
        console.log('transporte publico');
    }

    peaton = () => {
        props.navigationProp.navigate('Rentar3GScreen');
        console.log('peaton');
    }

    test = () => {
        props.navigationProp.navigate('TestExperienceScreen');
        console.log('test');
    }

    return (
        <View style={{ flex: 1, backgroundColor: '#fff' }}>
            <HeaderNavComponent 
            onTouch={() => props.navigation.toggleDrawer()} 
            perfile={()=> props.navigationProp.navigate('PerfileUser')}/>
            <ImageBackground source={Images.grayBackground} style={styles.settingBackground}>
                <SafeAreaView style={{ flex: 1, backgroundColor: 'rgba(255, 255, 255, 0.8)', margin: 30 }}>

                    <ScrollView style={{ flex: 1 }}>
                        <View style={{ marginTop: 20 }}>
                            <Text style={[{ fontFamily: Fonts.$montserratExtraBold, fontSize: 30, textAlign: 'center', color: '#878787', marginBottom: 5 }]}>
                                Vehiculos particulares
                            </Text>
                            <View style={{ height: 4, width: 160, backgroundColor: Colors.$primario, alignSelf: 'center', borderRadius: 10 }} />
                        </View>
                        
                        <View>
                            <TouchableOpacity  onPress={() => { vehicle() }}>
                                <Text>Mis Vehículos</Text>
                            </TouchableOpacity>

                            <TouchableOpacity  onPress={() => { trans() }}>
                                <Text>Transporte público</Text>
                            </TouchableOpacity>

                            <TouchableOpacity  onPress={() => { peaton() }}>
                                <Text>Peatón</Text>
                            </TouchableOpacity>

                            <TouchableOpacity  onPress={() => { test() }}>
                                <Text>test</Text>
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


