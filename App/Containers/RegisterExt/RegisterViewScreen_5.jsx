import React, { useState, useEffect } from 'react';
import { 
  Image, 
  StyleSheet, 
  Text, 
  View, 
  Dimensions,
  TextInput,
  ScrollView } from 'react-native';
import { routing } from '../../actions/actions';
import Fonts from '../../Themes/Fonts';
import Images from '../../Themes/Images';
import { connect, useDispatch } from 'react-redux';
import Colors from '../../Themes/Colors';
import { horizontalScale, moderateScale, verticalScale } from '../../Themes/Metrics';
import RNPickerSelect from '@nejlyg/react-native-picker-select';
import { updateForm } from '../../actions/actions';

function RegisterViewScreen_5 (props) {
  const { canContinue, setCanContinue } = props;
  const dispatch = useDispatch();
  const times = [
    { label: 'Menos de 15 minutos', value: 'Menos de 15 minutos' },
    { label: 'Entre 15 a 30 minutos', value: 'Entre 15 a 30 minutos' },
    { label: 'Entre 30 a 45 minutos', value: 'Entre 30 a 45 minutos' },
    { label: 'Entre 45 minutos a 1 hora', value: 'Entre 45 minutos a 1 hora' },
    { label: 'Entre 1 hora a 1 hora y 30 minutos', value: 'Entre 1 hora a 1 hora y 30 minutos' },
    { label: 'Entre 1 hora y 30 minutos a 2 horas', value: 'Entre 1 hora y 30 minutos a 2 horas' },
    { label: 'Más de 2 hora', value: 'Más de 2 hora' }
  ];
  const daysEachWeek = [
    { label: '1', value: '1' },
    { label: '2', value: '2' },
    { label: '3', value: '3' },
    { label: '4', value: '4' },
    { label: '5', value: '5' },
    { label: '6', value: '6' },
  ];
  const levelsSatisfaction = [
    { label: '1', value: '1' },
    { label: '2', value: '2' },
    { label: '3', value: '3' },
    { label: '4', value: '4' },
    { label: '5', value: '5' },
  ];
  const showAlternatives = [
    { label: 'Bicicleta', value: 'Bicicleta' },
    { label: 'Bicicleta Eléctrica', value: 'Bicicleta Eléctrica' },
    { label: 'Carro Compartido', value: 'Carro Compartido' },
    { label: 'Caminata', value: 'Caminata' },
    { label: 'Patineta eléctrica', value: 'Patineta eléctrica' },
    { label: 'Ruta corporativa', value: 'Ruta corporativa' },
    { label: 'Transporte Público', value: 'Transporte Público' },
  ];

  const valorInicialTiempo = props.formState.formRegister && props.formState.formRegister.tiempo_casa_trabajo ? props.formState.formRegister.tiempo_casa_trabajo : '';
  const valorInicialTiempoTrabajoCasa = props.formState.formRegister && props.formState.formRegister.tiempo_trabajo_casa ? props.formState.formRegister.tiempo_casa_trabajo : '';
  const valorInicialDias = props.formState.formRegister && props.formState.formRegister.dias_trabajo ? props.formState.formRegister.dias_trabajo : '';
  const valorInicialSatisfaccion = props.formState.formRegister && props.formState.formRegister.satisfaccion_transporte ? props.formState.formRegister.satisfaccion_transporte : '';
  const valorInicialGastoTiempo = props.formState.formRegister && props.formState.formRegister.dinero_gastado_tranporte ? props.formState.formRegister.dinero_gastado_tranporte : '';
  const valorInicialAlternativa = props.formState.formRegister && props.formState.formRegister.alternativas ? props.formState.formRegister.alternativas : '';

  const [ chooseTime , setChooseTime ] = useState(valorInicialTiempo);
  const [ chooseTimeWorkToHome , setChooseTimeWorkToHome ] = useState(valorInicialTiempoTrabajoCasa);
  const [ chooseDays , setChooseDays ] = useState(valorInicialDias);
  const [ satisfaction , setSatisfaction ] = useState(valorInicialSatisfaccion);
  const [ spendRide , setSpendRide ] = useState(valorInicialGastoTiempo);
  const [ alternative , setAlternative ] = useState(valorInicialAlternativa);

  const formatNumber = (value) => {
    const cleanedValue = value.replace(/[^0-9]/g, '');
    const formattedValue = cleanedValue.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return formattedValue ? `$${formattedValue}` : '';
  };

  useEffect(() => {
    setCanContinue(false);
  }, []);

  useEffect(() => {
    const fields = [chooseTime, chooseDays, satisfaction, spendRide, alternative];
    const allFieldsFilled = fields.every(field => field !== '');
    setCanContinue(allFieldsFilled);
  }, [ chooseTime, chooseDays, satisfaction, spendRide, alternative ]);

  useEffect(() => {
    const actuallyForm = props.formState.formRegister;
     const updatedUser = {
      ...actuallyForm,
      "tiempo_casa_trabajo": chooseTime,
      "tiempo_trabajo_casa": chooseTimeWorkToHome,
      "dias_trabajo": chooseDays,
      "satisfaccion_transporte": satisfaction,
      "dinero_gastado_tranporte": spendRide,
      "alternativas": alternative,
     };
     dispatch(updateForm(updatedUser));
   },[ chooseTime, chooseDays, satisfaction, spendRide, alternative ])

  return (
    <ScrollView style={ estilos.contenedor }>
        <View style={estilos.cajaGenero}>
          <Text style={estilos.firstTitle}>Diagnóstico de movilidad</Text>
          <Text style={estilos.firstParagraph}>Tu opinión es muy importante para nosotros. Ayúdanos a entender mejor tus necesidades y preferencias</Text>
        </View>
        <View>
          <Text style={{ fontFamily: Fonts.$poppinsregular, fontSize : moderateScale(18),  paddingHorizontal : '8%', color : Colors.$secundario}}>¿Tiempo de casa a trabajo?</Text>
          <RNPickerSelect
            style={pickerSelectStyles}
            placeholder={{label: 'Selecciona tu tiempo...', value:'' }}
            useNativeAndroidPickerStyle={false}
            value={chooseTime}
            onValueChange={(value) => { setChooseTime(value) }}
            items={times.map(data =>
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
          <Text style={{ fontFamily: Fonts.$poppinsregular, fontSize : moderateScale(18),  paddingHorizontal : '8%', color : Colors.$secundario}}>¿Tiempo de trabajo a casa?</Text>
          <RNPickerSelect
            style={pickerSelectStyles}
            placeholder={{label: 'Selecciona tu tiempo...', value:'' }}
            useNativeAndroidPickerStyle={false}
            value={chooseTimeWorkToHome}
            onValueChange={(value) => { setChooseTimeWorkToHome(value) }}
            items={times.map(data =>
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
          <Text style={{ fontFamily: Fonts.$poppinsregular, fontSize : moderateScale(18),  paddingHorizontal : '8%', color : Colors.$secundario}}>¿Días en oficina por semana?</Text>
          <RNPickerSelect
            style={pickerSelectStyles}
            placeholder={{label: 'Selecciona tus días en oficina...', value:'' }}
            useNativeAndroidPickerStyle={false}
            value={chooseDays}
            onValueChange={(value) => { setChooseDays(value) }}
            items={daysEachWeek.map(data =>
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
          <Text style={{ fontFamily: Fonts.$poppinsregular, fontSize : moderateScale(18),  paddingHorizontal : '8%', color : Colors.$secundario}}>¿Satisfacción con tu modo de transporte?{"\n"}1 siendo insatisfecho y 5 satisfecho</Text>
          <RNPickerSelect
            style={pickerSelectStyles}
            placeholder={{label: 'Selecciona tu nivel de satisfacción...', value: '' }}
            useNativeAndroidPickerStyle={false}
            value={satisfaction}
            onValueChange={(value) => { setSatisfaction(value) }}
            items={levelsSatisfaction.map(data =>
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
          <Text style={{ fontFamily: Fonts.$poppinsregular, fontSize : moderateScale(18),  paddingHorizontal : '8%', color : Colors.$secundario}}>¿Gasto semanal en transporte?</Text>
          <TextInput
            style={[estilos.inputRegister, { fontFamily: Fonts.$poppinsregular }]}
            placeholder={'Ingresa tu gasto semanal'}
            placeholderTextColor={Colors.$secundario}
            keyboardType='number-pad'
            onChangeText={(value) => setSpendRide(formatNumber(value))}
            value={spendRide}
          />
        </View>
        <View>
          <Text style={{ fontFamily: Fonts.$poppinsregular, fontSize : moderateScale(18),  paddingHorizontal : '8%', color : Colors.$secundario}}>¿Cuál alternativa intentarías?</Text>
          <RNPickerSelect
            style={pickerSelectStyles}
            placeholder={{label: 'Selecciona tu alternativa...', value: '' }}
            useNativeAndroidPickerStyle={false}
            value={alternative}
            onValueChange={(value) => { setAlternative(value) }}
            items={showAlternatives.map(data =>
            ({ label: data.value, value: data.value }))
            }
            Icon={() => {
              return (
            <Image source={Images.iconPickerYellow} style={{ top: 12, right: 30, height: 20, width: 20, resizeMode: 'contain', tintColor: Colors.$secundario }} />
            );
            }}
          />
        </View>
    </ScrollView >

  );

}

const estilos = StyleSheet.create({
  registerTitleContainer:{
    marginTop: 20,
    marginBottom: 20,
  },
  contenedor: {
    flex : 1,
    flexDirection: 'column',
    width: Dimensions.get("window").width,
    backgroundColor: Colors.$blanco,
    position : 'relative', 
    top : -30
  },
  botonDias:{
    backgroundColor: Colors.$primario,
    backgroundColor: Colors.$primario,
    width: 250,
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    marginBottom: 10,
  },
  botonDiasGris:{
    backgroundColor: Colors.$texto,
    backgroundColor: Colors.$texto,
    width: 250,
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    marginBottom: moderateScale(10),
  },
  letraTiempo:{
    color: Colors.$blanco,
    color: Colors.$blanco,
    fontSize: moderateScale(16),
  },
  letraTiempoGris:{
    color: Colors.$blanco,
    color: Colors.$blanco,
    fontSize: moderateScale(16),
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
    marginBottom : 10
  },
  firstParagraph: {
    marginStart : '8%',
    width : '80%',
    fontSize : moderateScale(18),
    marginBottom : 40
  },
  // cajaGenero: {
  //   flex:  1,
  //   flexDirection: "column",
  //   alignItems: "center",
  //   justifyContent: "center",
  //   width: Dimensions.get("window").width,    
  // },  
  inputRegister: {
    textAlignVertical : 'bottom',
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
    fontSize: moderateScale(18),
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
    routing: (component) => dispatch(routing(component)),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(RegisterViewScreen_5);