import { 
    Image, 
    SafeAreaView, 
    Text, 
    View,
    Pressable,
    StyleSheet,
    Dimensions,
    ImageBackground,
    ScrollView, 
    Alert
} from 'react-native';
import Fonts from '../../Themes/Fonts';
import Images from '../../Themes/Images';
import React,{ useState }from 'react';
import { connect } from 'react-redux';
import { accept_tyc } from '../../actions/actionCarpooling';
import Colors from '../../Themes/Colors';
import { TYC } from '../../Components/carpooling/tyc';
import { useDispatch } from 'react-redux';

function CarpooolingTYCDriver (props) {
    const dispatch = useDispatch();
    const [isChecked, setIsChecked] = useState(false);
    
    const goBack = () => {
        props.navigation.navigate('Home');
    }
    const toggleCheckBox = () => {
        setIsChecked(!isChecked);
      };
    const aceptTyC = async () => {
        if (isChecked) {
            try {
                await dispatch(accept_tyc('Pasajero', ''));
                props.closeModal();
            } catch (error) {
                console.error("Error al aceptar T&C:", error);
            }
        } else {
            Alert.alert('Debe aceptar términos y condiciones.');
        }
    };
    
  
return (
  <View style={{ flex: 1, backgroundColor: 'rgba(255, 255, 255, 0.8)', justifyContent: 'flex-start' }}>
    <ImageBackground source={Images.fondoMapa} style={{        
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
        alignItems: 'center',
        paddingTop: '5%',
        }}>
        <View style={styles.cajaTyC}>
          <View  style={styles.cajaTituloCerrar}>
            <Text style={styles.textTitleTyC}>Términos y condiciones</Text>
            <Pressable onPress={() => goBack()}>
                <Image source={Images.home} style={[styles.iconBici]}/>   
            </Pressable>                       
          </View>
          
          <View style={styles.LineaHorizontal }></View>
          <ScrollView style={styles.cajaScrool}>
            <TYC />
          </ScrollView>

          <View  style={styles.cajaAceptarContinuar}>
            <View style={styles.CajaHorCenter}>
              
              { isChecked ?
                <Pressable
                  onPress={() => toggleCheckBox()}
                  style={styles.btnCheckOK}
                />:
                <Pressable
                  onPress={() => toggleCheckBox()}
                  style={styles.btnCheck}
                />
              }
              
              <Text style={{fontFamily: Fonts.$poppinsregular}}>Aceptar téminos y condiciones</Text>
            </View>
            
            <View style={styles.cajaContinuar}> 
              <Text></Text>
              <Pressable 
                onPress={() => { aceptTyC() }} 
                style={styles.buttonTyC}>
                <Text style={styles.textoTyC}>Continuar</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </ImageBackground>
    </View>
    );
  }

const styles = StyleSheet.create({
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
        borderRadius: 25,
        backgroundColor: Colors.$blanco,
        shadowColor: "#000",
        shadowOffset: {
          width: 5,
          height: 5,
        },
        shadowOpacity: 1,
        shadowRadius: 5,
        elevation: 8,
    },
    iconBici: {
        width: 30,
        height: 30,
    },
    input: {
        margin: 12,
        paddingLeft: 20,
        borderRadius: 20,
        fontSize: 16,
        backgroundColor: Colors.$secundario50,
        marginBottom: 10,
        fontFamily: Fonts.$poppinsregular
      },
      contenedor: {
        flex: 1,
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
        backgroundColor: Colors.$blanco,
        alignItems: "center",
        justifyContent: "space-between",
        position: "relative"
      },
      gif: {
        width: Dimensions.get('window').width*.8,
        height: 250, 
      },
      cajaRow: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-between",
      },
      cajaRowVA: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: 'flex-end',
        paddingLeft: 5,
        paddingRight: 5
      },
      cajaTrips: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height*.7,
        alignItems: "center",
        marginTop: 10
      },
      textId: {
        textAlign: 'right',
        fontFamily: Fonts.$poppinsregular, 
        fontSize: 12,
        marginBottom: 5,
        color: Colors.$overlayTranslucid,
      },
      textFecha: {
        width: Dimensions.get('window').width*.5,
        textAlign: 'left',
        fontSize: 16,
        color: Colors.$texto80,
        fontFamily: Fonts.$poppinslight
      },
      cajaTituloCerrar: {
          width: "90%",  
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
      },
      cajaAceptarContinuar:{
          width: "95%",  
          flexDirection: 'column',
          padding: 10,
      },
      CajaHorCenter:{
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 15,
      },
      cajaContinuar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 10
      },
      btnCheck: {
        width: 20,
        height: 20,
        borderWidth : 3,
        borderColor : Colors.$texto,
        borderRadius : 1,
        marginRight: 5,
      },
      btnCheckOK: {
        width: 20,
        height: 20,
        borderWidth : 3,
        borderColor : Colors.$texto,
        borderRadius : 1,
        backgroundColor: Colors.$adicional,
        marginRight: 5
      },
      btnRefresh: {
          position: 'absolute',
          top: 50, 
          right: 5,
          width: 50,
          height: 50,
          backgroundColor: Colors.$blanco,
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 25
      },
      textTitleTyC: {
        textAlign: 'center', 
        fontSize : 18, 
        fontFamily: Fonts.$poppinsregular,
        color: Colors.$texto,
        padding : 10
      },
      buttonTyC: {
        width: "60%",
        height: 30,
        alignContent: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.$primario,
        zIndex: 10,
        borderRadius: 15,
        fontFamily: Fonts.$poppinsregular
      },
      textoTyC: {
        fontFamily: Fonts.$poppinsregular, 
        textAlign: "center", 
        justifyContent: "center",
        fontSize: 20, 
        paddingTop: 'auto', 
        paddingBottom: 'auto', 
        color: Colors.$blanco,
      },
      cajaTyC: {
        backgroundColor: Colors.$blanco,
        width: Dimensions.get('window').width*.9,
        height: Dimensions.get('window').height*.8,
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: 10,
        paddingBottom: 20,
        borderRadius: 15,
        shadowColor: "#000",
        shadowOffset: {
          width: 5,
          height: 5,
        },
        shadowOpacity: 1,
        shadowRadius: 5,
        elevation: 8,
      },
      cajaScrool:{
        width: "90%",
        height: "40%",
      },
      LineaHorizontal: {
        width: "100%",
        height: 3,
        backgroundColor: Colors.$texto,
        marginTop: 10,
        marginBottom: 10
      },
  
});

function mapStateToProps(state) {
    return {
        dataUser: state.userReducer,
    }
}

function mapDispatchToProps(dispatch) {
    return {  }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(CarpooolingTYCDriver);
