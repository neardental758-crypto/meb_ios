import { 
    ActivityIndicator, 
    Image, 
    ImageBackground, 
    Modal, 
    SafeAreaView, 
    ScrollView,
    StyleSheet, 
    Text, 
    TextInput, 
    TouchableOpacity, 
    View,
    Pressable,
    Dimensions
} from 'react-native';
import { Content } from 'native-base';
import RNPickerSelect from '@nejlyg/react-native-picker-select';
import { ButtonComponent } from '../../Components/ButtonComponent';
import Colors from '../../Themes/Colors';
import Fonts from '../../Themes/Fonts';
import Images from '../../Themes/Images';
import React, { useState , useEffect} from 'react';
import { connect } from 'react-redux';
//import styles from './Styles/NewTicketScreen.styles';
import { 
    appActions, 
    getActiveTrips, 
    getMasterListData, 
    saveDocumentUser, 
    validateTicketForm 
} from '../../actions/actions';
import ModalPhotoDocument from '../../Components/ModalPhotoDocument';
import Overlay from 'react-native-modal-overlay';
import estilos2 from '../Reservas3G/styles/rentas.style';
import { horizontalScale, moderateScale, verticalScale } from '../../Themes/Metrics';
import * as RootNavigation from '../../RootNavigation';

function NewTicketScreen (props) {
    const [state, setState ] = useState({
        stateDocumentUser: "",
        typeProblem: "",
        descriptionProblem: ""
    });

    const goBack = () => {
        RootNavigation.navigate('Soporte') 
    }

    useEffect(()=>{
        props.getMasterListData();
        props.saveDocumentUser({});
        props.getActiveTrips();
        props.onSelectPhoto("");
    },[]);

    const submit = () => {
        props.validateTicketForm(state);
    }
    const alertDecisionImage = () => {
        setState({ ...state, modalVisible: true });
    }
    
    const deleteImage = () => {
        setState({ ...state, stateDocumentUser: "" })
        props.saveDocumentUser({});
        props.onSelectPhoto("");
    }
    const closeModal = () => {
        setState({ ...state, modalVisible: false });
    };

    const renderLoading = () => {
        return (
            <Modal transparent={true}>
                <View style={{ backgroundColor: Colors.$primario, flexDirection: "column", flex: 1 }}>
                    <View style={{  justifyContent: "center", alignItems: "center" }}>
                        <ActivityIndicator size="large" color="#fff"></ActivityIndicator>
                        <Text style={{ textAlign: "center", color: "#fff", fontSize: 20, fontWeight: "700", marginTop: 20 }}>Enviando ticket...</Text>
                    </View>
                </View>
            </Modal>
        )
    }

    return (
    <View style={ estilos.container0 }>
        {props.loading ? renderLoading() :
        <SafeAreaView>

            <View style={styles.cajaCabeza}>
                <Text Text style={[{ fontFamily: Fonts.$poppinsmedium, fontSize: 24, textAlign: 'center', color: Colors.$texto80, marginBottom: 5 }]}>Crear ticket</Text>
                <Pressable  
                    onPress={() => { goBack() }}
                    style={ styles.btnAtras }>
                    <View>
                    <Image source={Images.atras_Icon} style={{tintColor : Colors.$texto80, width: 30, height: 30}}/> 
                    </View>
                </Pressable>
            </View>

            <ScrollView style={{height: Dimensions.get('window').height}}>
                <View style={ estilos.container1 }>
                                  
                <View>
                    <Text style={estilos.textInfo}>
                        Cuéntanos sobre tu problema. Alguien de nuestro equipo se pondrá en contacto contigo lo más pronto posible.
                    </Text>
                </View>

                {props.masterListTicketData
                ? 
                <View>
                    
                    <RNPickerSelect
                        style={pickerSelectStyles}
                        placeholder={{ label: 'Tipo de problema', value: '' }}
                        useNativeAndroidPickerStyle={false}
                        value={state.typeProblem}
                        onValueChange={(value) => { setState({ ...state , typeProblem: value }) }}
                        items={
                            props.masterListTicketData.map(data =>
                            ({ label: data.value, value: data.value }))
                        }

                        Icon={() => {
                            return (
                                <Image source={Images.iconPickerYellow} style={{ top: 25, right: 35, height: 20, width: 20, resizeMode: 'contain', tintColor: Colors.$texto }} />
                            );
                        }}
                    />
                </View>
                : 
                <></>
                }

                    <View style={estilos.inputWithIcon}>
                        <TextInput
                            multiline
                            numberOfLines={2}
                            placeholder='Descripción del problema'
                            placeholderTextColor={Colors.$texto50}
                            style={estilos.inputBorder}
                            placeholderTextWeight='500'
                            onChangeText={descriptionProblem => setState({ ...state , descriptionProblem: descriptionProblem })}
                        />
                    </View>
                    <View>
                        <Text style={estilos.textInfo
                        }>Sube una foto de tu vehículo o el asunto para ayudarte con más eficacia.</Text>
                    </View>

                    <View style={{ flexDirection: 'row', height: 40, width: 200, top: 20, marginBottom: 40, alignSelf: 'center' }}>
                        
                        <Pressable 
                            onPress={()  => alertDecisionImage()}
                            style={ estilos.botonItem }
                        >
                            <Text style={ estilos.textBoton }>Subir foto</Text>
                        </Pressable>
                    </View>
                    {props.documentUser.assets && props.documentUser.assets.length > 0 ?
                        <View style={{ flexDirection: 'row' }}>
                            <View style={{  }}>
                                <Text style={[estilos.labelInput_2, { fontFamily: Fonts.$poppinsregular, color: Colors.$texto, alignSelf: 'center' }]}>Imagen Seleccionada</Text>
                                <Text style={[estilos.labelInput_2, { fontFamily: Fonts.$poppinsregular, opacity: 0.5, color: Colors.$texto, maxWidth: 150, alignSelf: 'center', marginTop: 5 }]}>{props.documentUser?.assets[0]?.fileName}</Text>
                            </View>
                            <View style={{ marginRight: 20 }}>
                                <Image source={{ uri: props.documentUser?.assets[0]?.uri }}
                                    style={{ width: 80, height: 80, marginLeft: 30, marginBottom: 30, borderRadius: 20 }} />
                                <TouchableOpacity onPress={() => { deleteImage() }} style={{
                                    width: 160, height: 60, position: "absolute", zIndex: 9, top: -10, left: 80
                                }}>
                                    <Image source={Images.close} style={{ width: 40, height: 40, position: "absolute", zIndex: 9, top: -5 }} />
                                </TouchableOpacity>
                            </View>
                        </View> : <View ></View>
                    }

                    <Overlay
                        containerStyle={estilos.overlay}
                        visible={state.modalVisible}
                        childrenWrapperStyle={estilos.modalsContainer}
                        onClose={closeModal}
                        closeOnTouchOutside>
                        <ModalPhotoDocument onClosePress={closeModal} />
                    </Overlay>

                    <View style={{ flexDirection: 'row', height: 40, width: 300, top: 10, marginBottom: 40, alignSelf: 'center' }}>
                        <Pressable 
                            onPress={()  => submit()}
                            style={ estilos.botonItem }
                        >
                            <Text style={ estilos.textBoton }>Crear un ticket</Text>
                        </Pressable>
                    </View>
                </View>
                
            </ScrollView>
        </SafeAreaView>
        }
    </View>
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

const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
        fontSize: 13,
        paddingVertical: 8,
        borderBottomWidth: 1,
        backgroundColor: Colors.$blanco,
        paddingLeft: 15,
        marginLeft: 20,
        marginRight: 20,
        borderColor: Colors.$primario,
        borderWidth: 2,
        borderRadius: 15,
        marginTop: 15,
        color: Colors.$texto,
        height: 'auto',
        marginBottom: 5,
    },
    inputAndroid: {
        width: Dimensions.get('window').width*.8,
        marginLeft: 20,
        marginRight: 20,
        borderColor: Colors.$blanco,
        borderWidth: 2,
        borderRadius: 15,
        marginBottom: 5,
        fontSize: 15,
        paddingHorizontal: 10,
        borderBottomWidth: 1,
        marginTop: 10,
        paddingBottom: 10,
        color: Colors.$texto,
        backgroundColor: Colors.$tercer,
        height: 50,
        fontFamily: Fonts.$poppinsregular
    },
});

const estilos = StyleSheet.create({
    container0: {
        backgroundColor: Colors.$blanco,
    },
    container1: {
        flex: 1,
        width: Dimensions.get('window').width,
        alignItems: 'center',
        justifyContent: 'space-around',
        backgroundColor: Colors.$blanco,   
        paddingBottom: 50,
    },
    settingBackground: {
        flex: 1,
    },
    botonItem: {
        backgroundColor: Colors.$primario,
        width: "100%",
        height: "auto",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 20
    },
    textBoton: {
        fontSize: 18,
        color: Colors.$blanco,
        fontFamily: Fonts.$poppinsregular
    },
    labelInput_2: {
        color: Colors.$secundario,
        fontFamily: Fonts.$poppinsregular, 
        display: 'none',
    },
      container: {
        flex: 1
      },
      p: {
        flex: 1,
        marginTop: 20
      },
      inputBorder: {
        marginTop: 2,
        paddingLeft: 20,
        width: Dimensions.get('window').width*.8,
        height:120,
        color: Colors.$texto,
        fontFamily: Fonts.$poppinsregular,
        fontSize: 20,
        backgroundColor: Colors.$secundario20,
        borderRadius: 25
      },
      textInfo: {
        width: Dimensions.get('window').width*.8,
        marginTop: 20,
        paddingHorizontal: 20,
        fontSize: 16,
        fontFamily: Fonts.$poppinsregular,
        fontWeight: 'normal',
        color: Colors.$texto,
        textAlign: 'justify'
      },
      inputWithIcon: {
        margin: 20,
        borderColor: Colors.$tercer,
      },
      updateButton: {
        alignSelf: 'center',
        height: 40,
        width: 170,
        marginTop: 20,
        marginBottom: 10,
      },
      submit: {
        alignSelf: 'center',
        height: 40,
        width: 220,
        marginTop: 20,
        marginBottom: 10,
      }
})

function mapStateToProps(state) {
    return {
        loading: state.rideReducer.loading,
        documentUser: state.userReducer.documentUser,
        userHaveTrip: state.othersReducer.userHaveTrip,
        masterListTicketData: state.othersReducer.masterListTicketData
    }
}

function mapDispatchToProps(dispatch) {
    return {
        onSelectPhoto: (state) => dispatch(appActions.onSelectPhoto(state)),
        validateTicketForm: (form) => dispatch(validateTicketForm(form)),
        saveDocumentUser: (document) => dispatch(saveDocumentUser(document)),
        getActiveTrips: () => dispatch(getActiveTrips()),
        getMasterListData: () => dispatch(getMasterListData())
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(NewTicketScreen);
