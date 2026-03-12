import { 
    Text, 
    View,
    StyleSheet,
    Pressable, 
    Platform 
} from 'react-native';
import { Alert } from 'react-native';
import Colors from '../Themes/Colors';
import Fonts from '../Themes/Fonts';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import React from 'react';
import { useContext, useEffect } from 'react';
import { connect, useDispatch } from 'react-redux';
import { validateEmailPassword } from '../actions/actions';
import { navigationLogin } from '../actions/actions';
import { deleteAccount } from '../actions/settingsAction';
import { changeStatusLock } from '../actions/tripActions';
import LottieView from 'lottie-react-native';
import { AuthContext } from '../AuthContext';
import { Env } from "../Utils/enviroments";
import { NativeModules } from 'react-native';

function ModalConfirmLock (props) {
   
    const { onOpenLock, modo } = props;
    const dispatch = useDispatch();
    const { logout } = useContext( AuthContext );

    const cerrarApp = () => {
        if (Platform.OS === 'android') {
            NativeModules.AppExit.exitApplication();
        }
    };

    const volver_ = async () => {
        await dispatch(changeStatusLock());
        if (Env.modo === 'tablet') {
            console.log('ESTAMOS EN TABLET ; VAMOS A CERRAR SESION');
            await logout(); 
            await cerrarApp();
            return
        }
        modo(Env.modo)
    }

    return (
        <View style={styles.modalForgotContainer}>
            <KeyboardAwareScrollView enableOnAndroid extraScrollHeight={-100}>
                
                <Text style={styles.forgotTitle}>¿El candado abrió correctamente?</Text>

                <View style={{
                    justifyContent: "center", 
                    alignItems: "center" 
                }}>
                    <LottieView 
                        style={{ 
                            width: 150, 
                            height: 200
                        }} 
                        source={require('../Resources/Lotties/bicy_lock2.json')} 
                        autoPlay loop />
                </View>

                <View style={[styles.view]}>
                    <View style={ styles.forgotButton }>
                        <Pressable 
                            onPress={()  => volver_() }
                            style={ styles.botonItem }
                        >
                            <Text style={ styles.textBoton }>Si</Text>
                        </Pressable>
                    </View>
                    <View style={{ flex: 2 }} />
                    <View style={ styles.forgotButton }>
                        <Pressable 
                            onPress={()  => onOpenLock()}
                            style={ styles.botonItem }
                        >
                            <Text style={ styles.textBoton }>No</Text>
                        </Pressable>
                    </View>
                </View>
            </KeyboardAwareScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    botonItem: {       
        flex: 1,
        backgroundColor: Colors.$primario,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 20,
        borderColor: Colors.$primario,
    },
    textBoton: {
        color: Colors.$blanco,
        fontSize: 20,
        fontFamily: Fonts.$poppinsregular
    },
    modalForgotContainer:{
        height: 'auto',
        position: 'relative',
        width: '100%',
        borderRadius: 50
    },
    centeredMargins: {
		marginRight: 'auto',
		marginLeft: 'auto',
	},
    forgotTitle:{
        fontSize: 24,
        color: Colors.$texto,
        marginTop: 10,
        marginBottom: 18,
        fontFamily: Fonts.$poppinsmedium,
        width: "100%",
        textAlign: "center",
    },
    forgotText:{
        fontSize: 11,
    },
    
    forgotInput:{
        color: '$darkgray',
        paddingLeft: 15,
        width: '80%'
    },
    imageInput:{
        marginLeft: 15,
        marginTop: 11,
    },
    forgotButton:{
        flex: 9,
        height: 40,
        width: 130,
        marginTop: 25,
        marginBottom: 10,
        marginLeft: 'auto',
        marginRight: 'auto',
        borderColor: '#acd576'
    },
    closeButtonForgot:{
        position: 'absolute',
        right: -10,
        top: -30,
    },
    view: {
      flexDirection: 'row', 
      flex: 1,
      justifyContent: 'center', 
      marginLeft: 'auto', 
      marginRight: 'auto', 
      width: '90%', 
      height: '40%', 
      marginTop: 30,
  },
})

export default connect()(ModalConfirmLock);