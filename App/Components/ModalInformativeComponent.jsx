import { ActivityIndicator, Image, PermissionsAndroid, Platform, Text, TouchableOpacity, View } from 'react-native';
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


function ModalInformativeComponent(props){
    return (
                <View style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: 22,
                    height: 20,
                }}>
                    <Modal transparent={true} animationType="slide">
                        <View style={{ backgroundColor: Colors.$texto, flexDirection: "column", flex: 1 }}>
                            <View style={{ flex: 3, borderRadius: 6, marginVertical: 300, marginHorizontal: 50, justifyContent: "center", alignItems: "center", paddingHorizontal: 25, position: "relative" }}>
                                <Image style={{
                                    width: Dimensions.get("window").width,
                                    height: verticalScale(500),
                                    zIndex: 2,
                                    position: "absolute",
                                    top: -100,
                                }} source={Images.fondoModalYellow} />
    
                                <Text style={{ 
                                    textAlign: "center", 
                                    color: Colors.$texto,
                                    fontSize: moderateScale(20),
                                    margin: moderateScale(35),
                                    zIndex: 100
                                }}
                                >Reserva Exitosa</Text>
                                
                                <View style={{
                                    marginTop: 40,
                                    flexDirection: 'row',
                                    justifyContent: 'space-between'
                                }}>
                                    <View style={{ marginRight: 8, borderRadius: 10, zIndex: 100, overflow: 'hidden' }}>
                                        <TouchableOpacity style={{backgroundColor:'black'}} onPress={() => { guardarReserva() }}>
                                            <Text style={{color : 'white', padding: moderateScale(15), fontSize: moderateScale(25)}}>Aceptar</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </Modal>
                </View>
    )
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
)(ModalInformativeComponent);
