import {
  Text,
  View,
  StyleSheet,
  Pressable,
  Image,
  ScrollView 
} from 'react-native';
import React, { useState } from 'react';
import { connect } from 'react-redux';
import Colors from '../../Themes/Colors';
import Fonts from '../../Themes/Fonts';
import Images from '../../Themes/Images';
import { horizontalScale, moderateScale, verticalScale } from '../../Themes/Metrics';
import Overlay from 'react-native-modal-overlay';
import ModalPhotoDocument from '../../Components/ModalPhotoDocument';
import * as RootNavigation from '../../RootNavigation';

function PhotoComponent(props) {
  const imageSource = props.documentUser.assets && props.documentUser.assets.length > 0 ? { uri: props.documentUser.assets[0].uri } : Images.profilePhoto;
  const ThereIsImage = props.documentUser.assets && props.documentUser.assets.length > 0 ? true : false;
  const [ state, setState ] = useState({
  });

  const openModal = () => {
    setState({ ...state, modalVisible: true });
  }
  const closeModal = () => {
    setState({ ...state, modalVisible: false });
  };
  const goBack = () => {
    RootNavigation.navigate("PhoneScreen"); 
  }
  const goExtRegister = () => {
    if(ThereIsImage){
      RootNavigation.navigate("RegisterUI");
    }
  }


  return (
    <View style={{flex : 1, backgroundColor : 'white'}}>
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
      <Overlay
        containerStyle={estilos.overlay}
        visible={state.modalVisible}  
        childrenWrapperStyle={estilos.modalsContainer}
        onClose={closeModal}
        closeOnTouchOutside>
        <ModalPhotoDocument onClosePress={closeModal} />
      </Overlay>
      <Text style={estilos.firstTitle}>{ThereIsImage ? '¡Genial!' : '¡Casi listo!'}</Text>
      <Text style={estilos.firstParagraph}>{ThereIsImage ? 'Hasta ahora tu perfil se ve así' : 'Añade una foto de perfil para completar tu cuenta.'}</Text>
      <View style={{ flexDirection : 'row', justifyContent : 'center', paddingVertical : 10, position: 'relative' }}>
        <View style={{ 
          width: 200, // Debe ser igual al tamaño de la imagen
          height: 200, // Debe ser igual al tamaño de la imagen
          borderRadius: 100, // Mitad del tamaño de la imagen
          backgroundColor: 'transparent', // La sombra no debe tener fondo
          position: 'absolute', 
          top: 15, // Ajusta este valor según sea necesario para la distancia de la sombra
          shadowColor: 'black ', 
          shadowOffset: { width: 0, height: 10 }, // Ajusta el desplazamiento para la sombra
          shadowOpacity: 0.3, // Opacidad de la sombra
          shadowRadius: 10, // Radio de la sombra
          elevation: 10, // Para Android
          zIndex: -1 // Asegúrate de que esté detrás de la imagen
        }} />
        <Image source={imageSource} style={{ width: 200, height: 200, borderRadius : moderateScale(135)  }} />
      </View>
      <Text style={{textAlign : 'center', fontSize : moderateScale(18)}}>{ ThereIsImage ? props.formState.formRegister.email : '' }</Text>
      <Text style={{textAlign : 'center', fontSize : moderateScale(18)}}>{ ThereIsImage ? props.formState.formRegister.phoneNumber : '' }</Text>
      </ScrollView>
      <View style={estilos.buttonContainer}>
        <View  style={{display : 'flex', alignItems : 'center', marginBottom : moderateScale(15)}}>
          <Pressable 
              onPress={()  => openModal()}
              style={estilos.botonItem}
            >
            <Text style={estilos.textBoton}>{ThereIsImage ? 'Cambiar foto' : 'Subir foto'}</Text>
          </Pressable>
        </View>
        <View  style={{display : 'flex', alignItems : 'center', marginBottom : moderateScale(15)}}>
          <Pressable 
              onPress={()  => goExtRegister()}
              style={[estilos.botonItem, { backgroundColor: ThereIsImage ? Colors.$primario : Colors.$secundario}]}
            >
            <Text style={estilos.textBoton}>Continuar</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
const estilos = StyleSheet.create({
  overlay: {
		backgroundColor: "rgba(0,0,0,0.5)",
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
})

function mapStateToProps(state) {
  return {
    formState: state.userReducer.formRegister,
    documentUser: state.userReducer.documentUser,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    updateForm: (updateForm) => dispatch(updateForm(updateForm)),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PhotoComponent);