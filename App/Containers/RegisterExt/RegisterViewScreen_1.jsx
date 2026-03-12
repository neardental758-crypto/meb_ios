import React, { useState, useEffect } from 'react';
import { 
  Image, 
  StyleSheet, 
  Text,
  View,
  Dimensions, 
  Pressable} from 'react-native';
import { routing } from '../../actions/actions';
import Fonts from '../../Themes/Fonts';
import Images from '../../Themes/Images';
import Colors from '../../Themes/Colors';
import { connect, useDispatch } from 'react-redux';
import { updateForm } from '../../actions/actions';
import { horizontalScale, moderateScale, verticalScale } from '../../Themes/Metrics';

function RegisterViewScreen_1 (props) {
  const { canContinue, setCanContinue } = props;
  const dispatch = useDispatch();
  const valorInicialGenero = props.formState.formRegister && props.formState.formRegister.gender ? props.formState.formRegister.gender : 'No contesto';
  const [ genero , setGenero ] = useState(valorInicialGenero);

  useEffect(() => {
    setCanContinue(false);
  }, []);

  useEffect(() => {
    if(genero !== 'No contesto'){
      setCanContinue(true);
    }
  }, [genero]);

  useEffect(() => {
   const actuallyForm = props.formState.formRegister;
    const updatedUser = {
      ...actuallyForm,
      gender: genero
    };

    dispatch(updateForm(updatedUser));
  },[genero])

  return (
        <View style={ pickerSelectStyles.contenedor }>
            <View style={pickerSelectStyles.cajaGenero}>
              <Text style={{ fontFamily: Fonts.$montserratExtraBold, fontSize: moderateScale(22), textAlign: 'center', color: Colors.$texto, marginLeft: 10, marginRight: 10, marginBottom : 30 }}>¿Cuál es tu género?</Text>
              <View style={pickerSelectStyles.cajaImages}> 
              <Pressable onPress={() => setGenero('Femenino')} style={{ flexDirection : 'row', justifyContent : 'center', paddingVertical : 10, position: 'relative' }}>
              <View style={{ 
                  width: 125, 
                  height: 125, 
                  borderRadius: 70, 
                  backgroundColor: 'transparent', 
                  position: 'absolute', 
                  bottom : 8, 
                  shadowColor: 'black', 
                  shadowOffset: { width: 0, height: 50 },
                  shadowOpacity: 0.3, // Opacidad de la sombra
                  shadowRadius: 50, // Radio de la sombra
                  elevation: 5, // Para Android
                  zIndex: -1 // Asegúrate de que esté detrás de la imagen
                }} />
                <Image source={Images.female} style={{ width: 125, height: 125, borderRadius : moderateScale(135), backgroundColor : genero === 'Femenino' ? 'white' :  'black', tintColor : genero === 'Femenino' ? Colors.$primario :  Colors.$secundario }} />
              </Pressable>
              <Text style={{ fontFamily: Fonts.$montserratExtraBold, fontSize: moderateScale(22), textAlign: 'center', color: Colors.$texto, marginLeft: 10, marginRight: 10, marginBottom : 30 }}>Femenino</Text>
              <Pressable onPress={() => setGenero('Masculino')} style={{ flexDirection : 'row', justifyContent : 'center', paddingVertical : 10, position: 'relative' }}>
                <View style={{ 
                  width: 125, 
                  height: 125, 
                  borderRadius: 70, 
                  backgroundColor: 'transparent', 
                  position: 'absolute', 
                  bottom : 8, 
                  shadowColor: 'black', 
                  shadowOffset: { width: 0, height: 50 },
                  shadowOpacity: 0.3, // Opacidad de la sombra
                  shadowRadius: 70, // Radio de la sombra
                  elevation: 5, // Para Android
                  zIndex: -1 // Asegúrate de que esté detrás de la imagen
                }} />
                <Image source={Images.male} style={{ width: 125, height: 125, borderRadius : moderateScale(135), backgroundColor : genero === 'Masculino' ? 'white' :  'black', tintColor : genero === 'Masculino' ? Colors.$primario :  Colors.$secundario }} />
              </Pressable>
                <Text style={{ fontFamily: Fonts.$montserratExtraBold, fontSize: moderateScale(22), textAlign: 'center', color: Colors.$texto, marginLeft: 10, marginRight: 10, marginBottom : 30 }}>Masculino</Text>
              </View>
            </View>
        </View>
)};

const pickerSelectStyles = StyleSheet.create({
  
  cajaGenero: {
    flex:  1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    width: Dimensions.get("window").width,    
  },  
  cajaImages:{
    width: Dimensions.get("window").width,  
    flexDirection: 'column', 
    alignItems: 'center', 
    justifyContent: 'center',
  },
  Inputfecha: {
    backgroundColor: Colors.$secundario50, 
    backgroundColor: Colors.$secundario50, 
    borderRadius: moderateScale(15),
    paddingLeft: moderateScale(20),
    fontSize: moderateScale(20),


  },
  contenedor: {
    flex: 1, 
    backgroundColor: Colors.$blanco,
    position : 'relative', 
    top : -30
  },
  cajavpmas:{
    position: 'absolute',
    zIndex: 0,
    minHeight: Dimensions.get("window").height,
    width: Dimensions.get("window").width,
  },
  vpmas: {
    minHeight: Dimensions.get("window").height,
    width: Dimensions.get("window").width,
  },  
  flechaBack: { 
    flexDirection: 'row', 
    justifyContent: 'center', 
    alignItems: 'center',
    position: 'absolute',
    top: 0,
  },
  flechaNext: { 
    flexDirection: 'row', 
    justifyContent: 'center', 
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
  },
});

function mapStateToProps(state) {
  return {
    formState: state.userReducer.formRegister,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    routing: (component) => dispatch(routing(component))
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(RegisterViewScreen_1);
