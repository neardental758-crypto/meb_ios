import React, { useState } from 'react';
import {
    Image,
    Text,
    Pressable,
    View,
    StyleSheet,
    TextInput
} from 'react-native';
import Images from '../../Themes/Images';
import Colors from '../../Themes/Colors';
import Fonts from '../../Themes/Fonts';
import * as RootNavigation from '../../RootNavigation';

export function EditInfo(props){
   const { modalActivo, email, telefono } = props
   const [ newEmail, setNewEmail ] = useState(email)
   const [ newPhone, setNewPhone ] = useState(telefono)
  return(
    <View style={{ flex: 1, flexDirection: 'column', marginVertical: 80, marginHorizontal: 20, backgroundColor: Colors.$blanco, justifyContent: "space-around", alignItems: "center", width:"90%", borderRadius:20, position: "relative"}}>     
        <View style={{
            alignItems: "center",
            justifyContent: "center",
        }}>
            <Text style={{ 
            textAlign: "center",
            color: Colors.$cuarto,
            fontSize: 22, 
            fontWeight: "400",
            fontFamily: Fonts.$poppinsmedium
            }}
            >Editar información</Text>                
        </View>

        <View style={{
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
        }}>
            <TextInput
                placeholder='Correo'
                autoCompleteType={'email'}
                style={estilos.loginInput}
                keyboardType={'email-address'}
                placeholderTextColor={Colors.$texto}
                value={newEmail}
                onChangeText={objectEmail => setNewEmail( objectEmail )}
                />

            <TextInput
                placeholder='Correo'
                autoCompleteType={'email'}
                style={estilos.loginInput}
                keyboardType={'email-address'}
                placeholderTextColor={Colors.$texto}
                value={newPhone}
                onChangeText={objectPhone => setNewPhone( objectPhone )}
                />
        </View>
        
        <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
        }}>
            <View style={{ backgroundColor: 'white', alignItems: 'center', justifyContent: 'center'}}>
                <Pressable 
                onPress={() => { 
                    //addSolicitud(),
                    modalActivo(false)
                }} 
                style={estilos.btnConfirmar}>                
                    <Text style={estilos.textSolicitar}>Confirmar </Text>               
                </Pressable>
            </View>
        </View>

        <Pressable  
            onPress={() => modalActivo(false)}
            style={{ position: 'absolute', top: 10, left: 10}}>
                <Image style={{width:50, height: 50, tintColor: 'black'}} resizeMode='contain' source={Images.iconoblack}/>
        </Pressable> 
    </View> 
  )
}

const estilos = StyleSheet.create({
    textTitle:{
        fontWeight:'600'
    },
    CajaHorCenter:{
      flexDirection: 'row',
      alignItems:'right',
      marginTop:5,
    },
    CajaHorCenter2:{
      flexDirection: 'row',
      alignItems:'right',
      marginLeft:50,
      marginTop:5,
    },
    CajaHorCenter3:{
      flexDirection: 'row',
      alignItems:'right',
      marginLeft:78,
      marginTop:5,
    },
    CajaHorCenter4:{
      flexDirection: 'row',
      alignItems:'right',
      marginLeft:85,
      marginTop:5,
    },
    
    btnConfirmar:{
      alignItems: "center",
      justifyContent: "center",
      backgroundColor : Colors.$primario,
      borderRadius : 20,
      padding: 5,
      width:200
    },
    textSolicitar:{
      fontFamily: Fonts.$poppinsregular,
      textAlign: "center", 
      fontSize: 16, 
      paddingTop: 'auto', 
      paddingBottom: 'auto', 
      color: 'white',
      alignSelf: "center",
    },
    btnCheckOK: {
      width: 20,
      height: 20,
      borderWidth : 3,
      borderColor : Colors.$texto,
      borderRadius : 100,
      backgroundColor: Colors.$adicional,
      marginRight: 5,
    },
    btnCheck: {
      width: 20,
      height: 20,
      borderWidth : 3,
      borderColor : Colors.$texto,
      borderRadius : 100,
      marginRight: 5,
    },
    loginInput: {
        marginBottom: 20,
        paddingLeft: 20,
        width: 250,
        color: Colors.$texto,
        fontFamily: Fonts.$poppinsregular,
        fontSize: 16,
        backgroundColor: Colors.$secundario80,
        borderRadius: 20
    },
})


