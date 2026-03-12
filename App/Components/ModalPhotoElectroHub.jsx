import { ActivityIndicator, Image, PermissionsAndroid, Platform, Text, Pressable, View } from 'react-native';
import { appActions, saveDocumentUser } from '../actions/actions';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { Alert } from 'react-native';
import { ButtonComponent } from './ButtonComponent';
import Colors from '../Themes/Colors';
import Fonts from '../Themes/Fonts';
import Images from '../Themes/Images';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import React from 'react';
import { connect } from 'react-redux';
import styles from './Styles/ModalPhotoDocument.style';
import { horizontalScale, moderateScale, verticalScale } from '../Themes/Metrics';

const options = {
    title: 'Selecciona una imagen',
    storageOptions: {
        skipBackup: true,
        path: 'images',
    },
    quiality: 0.6

};
function ModalPhotoElectroHub(props){
    const permissions = async () => {
        if (Platform.OS == 'android') {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.CAMERA,
                {
                    title: "App Camera Permission",
                    message: "App needs access to your camera ",
                    buttonNeutral: "Ask Me Later",
                    buttonNegative: "Cancel",
                    buttonPositive: "OK"
                }
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                showPhotoPickerCamera();
            } else {
                setTimeout(function(){
                    Alert.alert("Alerta", "por favor acepte permisos para tomar la foto")
                }, 100)
            }
        } catch (err) {
            console.warn(err);
        }
    }else {
        showPhotoPickerCamera();
    }
    }
    const showPhotoPickerCamera = () => {
        launchCamera(options, (response) => { // Use launchImageLibrary to open image gallery

            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error || response.errorCode) {
                console.log('ImagePicker Error: ', response);
            } else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            } else {
                props.onSelectPhoto("ok");
                handleCloseButtonPress();
                props.saveDocumentUser(response);
            }
        });
    }

    const showPhotoPickerGallery = () => {
        launchImageLibrary(options, (response) => { // Use launchImageLibrary to open image gallery
            console.log(response);
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error || response.errorCode) {
                console.log('ImagePicker Error: ', response);
            } else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            } else {
                props.onSelectPhoto("ok");
                handleCloseButtonPress();
                props.saveDocumentUser(response);
            }
        });
    }

    handleCloseButtonPress = () => {
        const { onClosePress } = props;
        if (onClosePress) {
            onClosePress();
        }
    }
    const { loading } = props;
        if (loading) {
            return (<ActivityIndicator style={{ alignSelf: 'center', marginTop: 100, marginBottom: 100 }} size="large" color={Colors.$red} />);
        } else {
            return (
                <View style={{
                    width: '100%',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    borderRadius: 20
                }}>
                    <Pressable
                        style={{
                            position: 'absolute',
                            top: 2,
                            left: 2,
                        }}
                        onPress={() => { handleCloseButtonPress() }}>
                        <Image style={{ 
                            height: 40, 
                            width: 40
                        }} 
                        source={Images.x_icon} 
                    />
                    </Pressable>

                    <View style={{ 
                        width: "80%", 
                        marginTop: 40,
                        marginBottom: 40,
                    }}>
                    <View style={{ flexDirection : 'row', justifyContent : 'center'}}>
                        <Image style={{ 
                            height: 80, 
                            width: 80,
                            tintColor : Colors.$parqueo_color_primario
                            }} 
                            source={Images.cameraRed} 
                        />
                    </View>
                        <Text style={{
                            fontSize: 20,
                            textAlign: 'center',
                            marginBottom: 10,
                            fontWeight : 'bold'
                        }}>Seleccione una opción</Text>
                        <View style={{}}>                      
                            <Pressable
                                onPress={() => { showPhotoPickerGallery()}}
                                style={{
                                    backgroundColor: Colors.$parqueo_color_primario,
                                    height: 45,
                                    borderRadius: 25,
                                    marginBottom: 5,
                                    marginTop: 5,
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                <Text style={{ 
                                    color: Colors.$parqueo_color_fondo,
                                    fontSize: 18
                                }}>Galeria</Text>
                            </Pressable>
                        </View>
                        <View style={{}}>
                            <Pressable
                                onPress={() => { permissions()}}
                                style={{
                                    backgroundColor: Colors.$secundario,
                                    height: 45,
                                    borderRadius: 25,
                                    marginBottom: 10,
                                    marginTop: 10,
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                <Text style={{ 
                                    color: Colors.$parqueo_color_fondo,
                                    fontSize: 18
                                }}>Cámara</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            )
    }
}


function mapStateToProps(state) {
    return {
        loading: state.othersReducer.isFetching
    }
}
function mapDispatchToProps(dispatch) {
    return {
        saveDocumentUser: (document) => dispatch(saveDocumentUser(document)),
        onSelectPhoto: (state) => dispatch(appActions.onSelectPhoto(state))
    }
}
export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(ModalPhotoElectroHub);
