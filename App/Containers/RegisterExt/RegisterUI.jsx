import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, ScrollView, Pressable, Image, Text, StyleSheet,ActivityIndicator,Alert, Dimensions } from 'react-native';
import { connect } from 'react-redux';
import RegisterViewScreen_1 from './RegisterViewScreen_1';
import RegisterViewScreen_2 from './RegisterViewScreen_2';
import RegisterViewScreen_3 from './RegisterViewScreen_3';
import RegisterViewScreen_4 from './RegisterViewScreen_4';
import RegisterViewScreen_5 from './RegisterViewScreen_5';
import RegisterViewScreen_6 from './RegisterViewScreen_6';
import ProgressBar from './ProgressBar';
import Fonts from '../../Themes/Fonts';
import Images from '../../Themes/Images';
import Colors from '../../Themes/Colors';
import { horizontalScale, moderateScale, verticalScale } from '../../Themes/Metrics';
import { routing, guardarForm, validateLogin, validateForm } from '../../actions/actions';
import * as RootNavigation from '../../RootNavigation';
import { saveRegisterExt } from '../../actions/actions3g';
import { async } from 'validate.js';

const components = [RegisterViewScreen_1, RegisterViewScreen_2, RegisterViewScreen_3, RegisterViewScreen_4, RegisterViewScreen_5, RegisterViewScreen_6];

function RegisterUI (props) {
  const [ progress, setProgress ] = useState(16.7);
  const [ page, setPage ] = useState(0);
  const [ canContinue, setCanContinue ] = useState(true);
  const [loading, setLoading] = useState(false);
  const titleMapping = {
    0: 'Género',
    1: 'Datos', 
    2: 'Datos',
    3: 'Datos',
    4: 'Encuesta',
    5: '¡Por último!',
  };

  const increaseProgress = () => {
    setProgress((prevProgress) => Math.min(prevProgress + 16.7, 100));
  };
  const reduceProgress = () => {
    setProgress((prevProgress) => Math.min(prevProgress - 16.7, 100));
  };
  const nextPage = async() => {
    
    const startTime = Date.now();
    if (page < components.length - 1) {
      increaseProgress();
      setPage((prevPage) => prevPage + 1);
    }else{
      await setLoading(true);
      const endTime = Date.now();
      //Alert.alert(`funcion nextPage total execution time: ${endTime - startTime} ms`);
      registerUser();
    }
  };
  const prevPage = () => {
    reduceProgress();
    setPage((prevPage) => Math.max(prevPage - 1, 0));
  };
  const getTitleForPage = (page, mapping) => {
    return mapping[page] ;
  };
  const goBack = () => {
    if(page === 0){
      RootNavigation.navigate("PhotoScreen");
    }else{
      prevPage();
    }
  }

  const CurrentComponent = components[page];
  const currentTitle = getTitleForPage(page, titleMapping);

  const registerUser = async () => {
   // Iniciar indicador de carga
    try {
        const result = await guardar5Gdata();
        console.log("User created successfully:", result);
    } catch (error) {
        console.error("Error creating user:", error.message);
    } finally {
        // Detener indicador de carga
    }
  }

  const guardar5Gdata = async () => {
    await props.validateForm(props.formState.formRegister);
  }

  return (
  <View style={{backgroundColor : 'white', flex : 1}}>
    <View style={{flexDirection : 'row', justifyContent : 'flex-start', padding: 20, backgroundColor : 'white'}}>
      <Pressable onPress={() => { goBack() }} style={{    
        backgroundColor : 'white',
        justifyContent: 'center',
        alignItems: 'center',
        width: horizontalScale(40),
        height: verticalScale(40),
        borderRadius: moderateScale(40),
        borderColor: 'black',
        overflow: 'hidden',
        shadowColor: 'black', 
        shadowOffset: { width: horizontalScale(40), height: verticalScale(40), }, 
        shadowOpacity: 1, 
        shadowRadius: moderateScale(60), 
        elevation: 5, }}>
        <Image style={{ width: horizontalScale(25), height: verticalScale(25), borderRadius: horizontalScale(30) }} source={Images.atras_Icon} />
      </Pressable>
    </View>
    <View style={{ position : 'relative', top : -30 }}>
      <Text style={{ fontFamily: Fonts.$montserratExtraBold, fontSize: moderateScale(22), textAlign: 'center', color: Colors.$texto, marginLeft: 10, marginRight: 10 }}>{currentTitle}</Text>
      <SafeAreaView style={estilos.container}>
        <View style={estilos.innerContainer}>
          <ProgressBar progress={progress} />
        </View>
      </SafeAreaView>
    </View>
    {/* Logica de formulario */}
      <CurrentComponent canContinue={canContinue} setCanContinue={setCanContinue} progress={progress} />
    <View style={estilos.buttonContainer}>
        <View  style={{display : 'flex', alignItems : 'center', marginBottom : moderateScale(15)}}>
        {
            loading ? 
            <View style={{
                textAlign: "center",
                justifyContent: "center",
                padding  : 5,
                margin : 20,
                backgroundColor : Colors.$secundario50,
                width: Dimensions.get('window').width*.4,
                borderRadius : 30
            }}>
                <Image source={require('../../Resources/gif/loadingbici.gif')} style={{width: 30, height: 30}} />
            </View>
            :
            <Pressable onPress={() => nextPage() } 
            style={canContinue ? estilos.botonItem : estilos.botonItemOff}> 
                    <Text style={estilos.textBoton}>Continuar</Text>
            </Pressable>

        }
                                      
        </View>
      </View>
  </View>
  );
};

const estilos = StyleSheet.create({
  body : {
    backgroundColor : 'white'
  },
  container: {
    flexDirection : 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerContainer: {
    width : '100%'
  },
  textBoton: {
    fontSize: moderateScale(20),
    color: Colors.$blanco,
    fontFamily: Fonts.$poppinsregular,
  },
  botonItem: {
    backgroundColor: Colors.$primario,
    width: "90%",
    alignItems: "center",
    justifyContent: "center",
    padding: 5,
    borderRadius: 30,
    shadowColor: 'black',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.4,
    shadowRadius: 2,
    elevation: 16,
  },
    botonItemOff: {
    backgroundColor: Colors.$secundario,
    width: "90%",
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    borderRadius: 30,
    shadowColor: 'black',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.4,
    shadowRadius: 2,
    elevation: 16,
  },
  buttonContainer: {
    justifyContent: 'flex-end',
    marginBottom: moderateScale(10),
  },
});

function mapStateToProps(state) {
    return {
      dataUser: state.userReducer,
      formState: state.userReducer.formRegister,
    }
  }
  
  function mapDispatchToProps(dispatch) {
    return {
      routing: (component) => dispatch(routing(component)),
      guardarForm: (formRegister) => dispatch(guardarForm(formRegister)),
      saveRegisterExt: (data, vehiculo, reservaId) => dispatch(saveRegisterExt(data)),
      validateLogin: (userCredentials) => dispatch(validateLogin(userCredentials)),
      validateForm: (formRegister) => dispatch(validateForm(formRegister)),
    }
  }
  
  export default connect(
    mapStateToProps,
    mapDispatchToProps,
  )(RegisterUI);
  