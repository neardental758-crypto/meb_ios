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
import { horizontalScale, moderateScale, verticalScale } from '../../Themes/Metrics';
import { updateForm } from '../../actions/actions';
import DatePicker from 'react-native-date-picker';

function RegisterViewScreen_2 (props) {
  const dispatch = useDispatch();
  const valorInicialDate = props.formState.formRegister && props.formState.formRegister.birthday
  ? new Date(props.formState.formRegister.birthday)
  : new Date();
  const [ bornDate, setBornDate ] = useState(new Date(valorInicialDate));
  const today = new Date();


  useEffect(() => {
    const actuallyForm = props.formState.formRegister;
    const updatedUser = {
      ...actuallyForm,
      birthday: bornDate.toISOString()
    };
    dispatch(updateForm(updatedUser));
  }, [bornDate]);

  return (
        <View style={ estilos.contenedor }>
            <View style={estilos.cajaGenero}>
              <Text style={{ fontFamily: Fonts.$montserratExtraBold, fontSize: moderateScale(22), textAlign: 'center', color: Colors.$texto, marginLeft: 10, marginRight: 10, marginVertical : 30 }}>¿Cuál es tu fecha de nacimiento?</Text>
              <View style={estilos.cajaImages}> 
              <Pressable style={{ flexDirection : 'row', justifyContent : 'center', paddingVertical : 10, position: 'relative' }}>
                <Image source={Images.newCalendar} style={{ width: 150, height: 150, backgroundColor : 'white', tintColor : Colors.$primario }} />
              </Pressable>
              <View style={{ flexDirection : 'row', justifyContent: 'center', alignItems: 'center' }}>
                <DatePicker
                    date={bornDate}
                    theme='light'
                    onDateChange={(newDate) => setBornDate(newDate)}
                    mode="date"
                    locale="es"
                    maximumDate={today}
                    />
                </View>
              </View>
            </View>
        </View>
)};

const estilos = StyleSheet.create({
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
    flex : 1,
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
  datePicker : {
    marginVertical : 30,
    color : 'black',
    backgroundColor: 'white',
  }
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
)(RegisterViewScreen_2);
