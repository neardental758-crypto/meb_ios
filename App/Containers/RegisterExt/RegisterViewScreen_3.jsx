import React, { useState, useEffect } from 'react';
import {
  Image, 
  StyleSheet, 
  Text,
  View,
  TextInput,
  Dimensions} from 'react-native';
import { routing} from '../../actions/actions';
import Fonts from '../../Themes/Fonts';
import Images from '../../Themes/Images';
import Colors from '../../Themes/Colors';
import { connect, useDispatch } from 'react-redux';
import { horizontalScale, moderateScale, verticalScale } from '../../Themes/Metrics';
import { updateForm } from '../../actions/actions';
import RNPickerSelect from '@nejlyg/react-native-picker-select';

function RegisterViewScreen_3 (props) {
  const { canContinue, setCanContinue } = props;
  const dispatch = useDispatch();
  const areas = [
    { label: 'Administración', value: 'Administración' },
    { label: 'Atención al cliente', value: 'Atención al cliente' },
    { label: 'Compras', value: 'Compras' },
    { label: 'Finanzas', value: 'Finanzas' },
    { label: 'Mercadeo', value: 'Mercadeo' },
    { label: 'Oficina', value: 'Oficina' },
    { label: 'Operaciones', value: 'Operaciones' },
    { label: 'Recursos humanos', value: 'Recursos humanos' },
    { label: 'Ventas', value: 'Ventas' },
  ];
  const transporteModos = [
    { label: 'Bicicleta', value: 'Bicicleta' },
    { label: 'Bicicleta eléctrica', value: 'Bicicleta eléctrica' },
    { label: 'Caminata', value: 'Caminata' },
    { label: 'Carro(conductor)', value: 'Carro(conductor)' },
    { label: 'Carro compartido', value: 'Carro compartido' },
    { label: 'Metro', value: 'Metro' },
    { label: 'Moto', value: 'Moto' },
    { label: 'Patineta eléctrica', value: 'Patineta eléctrica' },
    { label: 'Transporte público', value: 'Transporte público' },
  ];
  
    const valorInicialArea = props.formState.formRegister && props.formState.formRegister.workStatus ? props.formState.formRegister.workStatus : '';
    const valorInicialTransporte = props.formState.formRegister && props.formState.formRegister.transportationMode ? props.formState.formRegister.transportationMode : '';
    const [ area , setArea ] = useState(valorInicialArea);
    const [ transporte_primario , setTransporte ] = useState(valorInicialTransporte);

    useEffect(() => {
      const actuallyForm = props.formState.formRegister;
       const updatedUser = {
        ...actuallyForm,
        workStatus: area,
        transportationMode: transporte_primario
       };
       dispatch(updateForm(updatedUser));
     },[ area, transporte_primario ])

     useEffect(() => {
      setCanContinue(false);
    }, []);
  
    useEffect(() => {
      if(area !== '' && transporte_primario !== ''){
        setCanContinue(true);
      }
    }, [ area, transporte_primario ]);

  return (
        <View style={estilos.contenedor}>
            <View style={estilos.cajaGenero}>
            <Text style={estilos.firstTitle}>Mejoraremos tu experiencia en la app</Text>
            <Text style={estilos.firstParagraph}>Completa la información a continuación para optimizar tus opciones de transporte.</Text>
            </View>
            <View>
              <Text style={{ fontFamily: Fonts.$poppinsregular, fontSize : moderateScale(20),  paddingLeft : '8%', color : Colors.$secundario}}>¿A qué área perteneces?</Text>
              <RNPickerSelect
                style={pickerSelectStyles}
                placeholder={{label: 'Selecciona tu área...', value: '' }}
                useNativeAndroidPickerStyle={false}
                value={area}
                onValueChange={(value) => { setArea(value) }}
                items={areas.map(data =>
                ({ label: data.value, value: data.value }))
                }
                Icon={() => {
                  return (
                <Image source={Images.iconPickerYellow} style={{ top: 12, right: 30, height: 20, width: 20, resizeMode: 'contain', tintColor: Colors.$secundario }} />
                );
                }}
              />
            </View>
            <View>
              <Text style={{ fontFamily: Fonts.$poppinsregular, fontSize : moderateScale(18),  paddingLeft : '8%', color : Colors.$secundario, marginVertical : 10}}>¿Cuál es tu modo de transporte principal?</Text>
              <RNPickerSelect
                style={pickerSelectStyles}
                placeholder={{label: 'Selecciona tu modo de transporte', value: '' }}
                useNativeAndroidPickerStyle={false}
                value={transporte_primario}
                onValueChange={(value) => { setTransporte(value) }}
                items={transporteModos.map(data =>
                ({ label: data.value, value: data.value }))
                }
                Icon={() => {
                  return (
                <Image source={Images.iconPickerYellow} style={{ top: 12, right: 30, height: 20, width: 20, resizeMode: 'contain', tintColor: Colors.$secundario }} />
                );
                }}
              />
            </View>
        </View>
)};

const estilos = StyleSheet.create({
  cajaGenero: {
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
  firstTitle: {
    marginStart : '8%',
    width : '80%',
    fontSize : moderateScale(25),
    marginVertical : 15
  },
  firstParagraph: {
    marginStart : '8%',
    width : '80%',
    fontSize : moderateScale(18),
    marginBottom : 40
  },
  inputRegister: {
    textAlignVertical : 'bottom',
    fontSize: moderateScale(16),
    paddingLeft: moderateScale(10),
    marginLeft: moderateScale(35),
    marginRight: moderateScale(35),
    paddingVertical:moderateScale(5),
    borderColor: 'black',
    borderWidth: .8,
    borderRadius: moderateScale(5),
    marginBottom: moderateScale(5),
    marginTop: moderateScale(2),
    paddingBottom: moderateScale(10),
    paddingTop: moderateScale(5),
    width: 'auto',
    color: 'black',
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: moderateScale(18),
    borderBottomWidth: 2,
    backgroundColor: "transparent",
    paddingLeft: 15,
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 10,
    borderColor: Colors.$secundario,
    borderRadius: 5,
    marginTop: 15,
    color: Colors.$secundario,
    height: 40,
  },
  placeholder: {
    color: Colors.$secundario,
  },
  inputAndroid: {
    fontSize: moderateScale(16),
    paddingLeft: moderateScale(10),
    marginLeft: moderateScale(25),
    marginRight: moderateScale(25),
    paddingVertical:moderateScale(5),
    borderColor: 'black',
    borderWidth: .8,
    borderRadius: moderateScale(5),
    marginBottom: moderateScale(20),
    marginTop: moderateScale(2),
    paddingBottom: moderateScale(5),
    paddingTop: moderateScale(5),
    width: 'auto',
    color: 'black',
    paddingHorizontal: moderateScale(10),
  },
  textBoton1: {
    fontSize: moderateScale(16),
    color: Colors.$texto,
    fontFamily: Fonts.$poppinsregular,
  },
  shadowContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: horizontalScale(80), // Tamaño del contenedor de la sombra
    height: verticalScale(80), // Tamaño del contenedor de la sombra
    borderRadius: horizontalScale(40), // La mitad del tamaño para un círculo
    backgroundColor: 'transparent',
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3, // Ajusta la opacidad según sea necesario
    shadowRadius: 10, // Ajusta el tamaño del difuminado de la sombra
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
)(RegisterViewScreen_3);
