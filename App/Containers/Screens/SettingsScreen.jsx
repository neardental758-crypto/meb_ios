import { Image, ImageBackground, SafeAreaView, ScrollView, Text, TextInput, View, TouchableOpacity, Pressable, StyleSheet } from 'react-native';
import React, { useState } from 'react';
import { ButtonComponent } from '../../Components/ButtonComponent'
import Colors from '../../Themes/Colors';
import Fonts from '../../Themes/Fonts';
import { horizontalScale, moderateScale, verticalScale } from '../../Themes/Metrics';
import Images from '../../Themes/Images';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { connect } from 'react-redux';
import styles from './Styles/SettingsScreen.style';
import { validatePassword } from '../../actions/actions';


function SettingsScreen (props){
    const [ state , setState] = useState({
            password: '',
            repeatedPassword: ''
        });

    const update = () => {
        props.validatePassword(state);
    };
    const goBack = () => {
        props.navigation.goBack();
    }
        return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
        {/*<TouchableOpacity onPress={() => { goBack() }} style={{flexDirection : 'row', justifyContent : 'flex-start', padding: 10, backgroundColor : Colors.$primario}}>
            <View >
                <Image style={{marginLeft: moderateScale(10), width : horizontalScale(350), height : verticalScale(55)}} source={Images.flechaAtras} />
            </View>
        </TouchableOpacity>*/}
        <SafeAreaView style={{ flex: 1, backgroundColor: 'rgba(255, 255, 255, 0.8)', margin: 30 }}>
            <ScrollView style={{ marginHorizontal: 40 }}>
                <KeyboardAwareScrollView enableOnAndroid>
                    <View style={{ backgroundColor: 'transparent' }}>

                    <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: verticalScale(40) }}>
                        <Text style={{
                            fontSize: moderateScale(25), fontFamily: Fonts.$poppinsregular,
                            fontWeight: 'normal', color: Colors.$texto
                        }}>Cambiar contraseña</Text>
                    </View>
                        
                        <View style={{marginTop: 40}}>
                            <View style={styles.inputWithIcon}>
                                <Image style={styles.imageLeft} source={Images.yellowPassword} />
                                <TextInput
                                    maxLength={4}
                                    keyboardType="numeric"
                                    placeholder='Contraseña nueva'
                                    placeholderTextColor={Colors.$texto}
                                    autoCompleteType={'password'}
                                    style={styles.updatePasswordInput}
                                    secureTextEntry={true}
                                    placeholderTextWeight='700'
                                    onChangeText={password => setState({ ...state, password: password })}
                                />
                            </View>
                            <View style={styles.inputWithIcon}>
                                <Image style={styles.imageLeft} source={Images.yellowPassword} />
                                <TextInput
                                    maxLength={4}
                                    keyboardType="numeric"
                                    placeholder='Repetir contraseña'
                                    placeholderTextColor={Colors.$texto}
                                    autoCompleteType={'password'}
                                    style={styles.updatePasswordInput}
                                    secureTextEntry={true}

                                    placeholderTextWeight='700'
                                    onChangeText={password => setState({ ...state , repeatedPassword: password })}
                                />
                            </View>
                            {!props.error.equal?
                            <View>
                                <Text style={styles.forgotLink}>{props.error.errorMessage}</Text>
                            </View>:
                            <View></View>
                            }
                            {!props.error.paswordLength?
                            <View>
                                <Text style={styles.forgotLink}>{props.error.errorMessage}</Text>
                            </View>:
                            <View></View>
                            }
                            <View style={styles.centeredItems}>
                                <View style={styles.updateButton}>
                                    <Pressable 
                                        onPress={()  => update()}
                                        style={ estilos.botonItem }
                                    >
                                        <Text style={ estilos.textBoton }>Guardar cambios</Text>
                                    </Pressable>
                                </View>
                            </View>
                        </View>
                    </View>
                </KeyboardAwareScrollView>
            </ScrollView>
        </SafeAreaView>
    </View>
        )
    }

const estilos = StyleSheet.create({
    botonItem: {
        backgroundColor: Colors.$primario,
        width: "100%",
        height: "auto",
        alignItems: "center",
        justifyContent: "center",
        padding: 10,
        borderRadius: 20
    },
    textBoton: {
        fontSize: 18,
    },
})

function mapStateToProps(state) {
    return {
        //error: state.globalReducer.errorChangePassword,
    }
}
function mapDispatchToProps(dispatch) {
    return {
        validatePassword: (passwords) => dispatch(validatePassword(passwords)),
    }
}
export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(SettingsScreen);
