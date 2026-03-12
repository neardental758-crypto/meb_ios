import {
  Text,
  View,
  StyleSheet,
  Pressable,
  Image,
  ScrollView,
  TextInput,
  StatusBar,
  SafeAreaView,
  TouchableOpacity
} from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import { connect, useDispatch } from 'react-redux';
import Colors from '../../Themes/Colors';
import Fonts from '../../Themes/Fonts';
import Images from '../../Themes/Images';
import { horizontalScale, moderateScale, verticalScale } from '../../Themes/Metrics';
import { updateForm } from '../../actions/actions';
import PhoneInput from "react-native-phone-number-input";
import * as RootNavigation from '../../RootNavigation';

function PhoneComponent(props) {
  const dispatch = useDispatch();
  const [ canContinue, setCanContinue ] = useState(false);
  const [ phoneNumber, setPhoneNumber ] = useState('');
  
  const goBack = () => {
    RootNavigation.navigate("RegisterScreen"); 
  }
  const goPhoto = () => {
    RootNavigation.navigate("PhotoScreen");
  }
  useEffect(() => {
    if(phoneNumber.length > 5){
      const actuallyForm = props.formState.formRegister;
      const updatedUser = {
        ...actuallyForm,
        phoneNumber: phoneNumber
      };
      dispatch(updateForm(updatedUser));
      setCanContinue(true);
    }else{
      setCanContinue(false);
    }
  },[phoneNumber])

  return (
  <View style={{flex : 1, backgroundColor : 'white'}}>
    <StatusBar barStyle="dark-content" />
     <ScrollView>
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
         <Image style={{ width: horizontalScale(25), height: verticalScale(25), borderRadius: horizontalScale(30), }} source={Images.atras_Icon} />
       </Pressable>
      </View>
          <Text style={estilos.firstTitle}>Confirma tu teléfono</Text>
          <Text style={estilos.firstParagraph}>Por favor completa tu información para crear la cuenta.</Text>
          <PhoneInput
            placeholder='Número de teléfono'
            defaultValue={phoneNumber}
            defaultCode="CO"
            layout="first"
            onChangeText={(text) => {
              setPhoneNumber(text);
            }}
            countryPickerProps={{withAlphaFilter:true}}
            withLightTheme
            withShadow
            autoFocus
            containerStyle={{ width : '100%', paddingHorizontal : 20 }}
            textInputStyle={{ fontSize : moderateScale(18) }}
          />
     </ScrollView>
    <View style={estilos.buttonContainer}>
      <View  style={{display : 'flex', alignItems : 'center', marginBottom : moderateScale(15)}}>
        <Pressable 
            onPress={()  => canContinue ? goPhoto() : ''}
            style={[estilos.botonItem, { backgroundColor : canContinue ? Colors.$primario : Colors.$secundario}]}
          >
          <Text style={estilos.textBoton}>Confirmación de número</Text>
        </Pressable>
      </View>
    </View>
  </View>
  );
}
const estilos = StyleSheet.create({
  container: {
   width : '100%',
   backgroundColor : 'red'
  }, 
  overlay: {
		backgroundColor: "rgba(0,0,0,0.5)",
		borderRadius: 10,
		zIndex: 5,
	},
  modalsContainer: {
		backgroundColor: Colors.$blanco,
		borderRadius: 10,
		padding: 20,
		paddingTop: moderateScale(45),
		width: '90%',
		marginLeft: 'auto',
		marginRight: 'auto',
	},
  labelInput_2: {
    color: Colors.$texto,
    backgroundColor: Colors.$primario,
    width: 200
  },
  firstTitle: {
    marginStart : '10%',
    fontSize : moderateScale(25),
    marginBottom : 10
  },
  firstParagraph: {
    marginStart : '10%',
    width : '80%',
    fontSize : moderateScale(18),
    marginBottom : 40
  },
  placeholderUpPhoneNumber: {
    color : Colors.$secundario, 
    marginStart : '10%', 
    width : '80%',
    fontSize : moderateScale(18),
    paddingVertical : 10
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
  buttonContainer: {
    justifyContent: 'flex-end',
    marginBottom: moderateScale(10),
  },
  phoneInput: {
    width : '80%',
    fontFamily: Fonts.$poppinsregular,
    fontSize: moderateScale(16),
    paddingLeft : 15,
    paddingVertical: 5
  },
  countryPickerContainer : {
    flexDirection : 'row',
    justifyContent : 'center',
    alignItems : 'center',
    width : '85%',
    borderWidth: .8,
    borderRadius: 12,
  },
})

function mapStateToProps(state) {
  return {
    formState: state.userReducer.formRegister,
  }
}

export default connect(mapStateToProps)(PhoneComponent);