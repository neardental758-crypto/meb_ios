import {
    Image,
    ImageBackground,
    SafeAreaView,
    Text,
    TouchableOpacity,
    View,
    StyleSheet,
} from 'react-native';
import { connect } from 'react-redux';
import estilos from './styles/rentas.style';
import React, { useState } from 'react';

function TimeComponent (props){
    const [state, setState] = useState({});

    return (
        <>  
            <Text style={estilos.titleSelect}>La reserva vence en:</Text>
            <View style={estilos.cajaCuentaRegresiva}>  
                <View style={estilos.subcajaCuentaRegresiva}>
                    <Text style={estilos.numeroCuentaRegrasiva}>
                        {(props.dataRent.diaResta < 10) ? '0'+props.dataRent.diaResta: props.dataRent.diaResta}
                    </Text>
                    <Text style={estilos.subtextoCuentaR}>dias</Text>
                </View>
                <Text>:</Text>
                <View style={estilos.subcajaCuentaRegresiva}>
                    <Text style={estilos.numeroCuentaRegrasiva}>
                        {(props.dataRent.horasResta < 10) ? '0'+props.dataRent.horasResta: props.dataRent.horasResta}
                    </Text>
                    <Text style={estilos.subtextoCuentaR}>horas</Text>
                </View>
                <Text>:</Text>
                <View style={estilos.subcajaCuentaRegresiva}>
                    <Text style={estilos.numeroCuentaRegrasiva}>
                        {(props.dataRent.minutosResta < 10) ? '0'+props.dataRent.minutosResta: props.dataRent.minutosResta}
                    </Text>
                    <Text style={estilos.subtextoCuentaR}>minutos</Text>
                </View>
                <Text>:</Text>
                <View style={estilos.subcajaCuentaRegresiva}>
                    <Text style={estilos.numeroCuentaRegrasiva}>
                        {(props.dataRent.segundosResta < 10) ? '0'+props.dataRent.segundosResta: props.dataRent.segundosResta}
                    </Text>
                    <Text style={estilos.subtextoCuentaR}>segundos</Text>
                </View>
            </View>
        </>
    )
}

function mapStateToProps() {
    return {
        dataUser: state.userReducer,
        stations: state.mapReducer.stations,
        penalty: state.mapReducer.penalty
    }
}

function mapDispatchToProps() {
    return {
        getStations: () => dispatch(getStations()),
        validatePenalty: () => dispatch(validatePenalty()),
        socketConection: () => dispatch(socketConection(props)),
        routingIfHasTrip: () => dispatch(routingIfHasTrip())
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(TimeComponent);