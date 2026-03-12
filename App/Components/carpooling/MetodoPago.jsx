import React, { useState } from 'react';
import {
    Image,
    Text,
    Pressable,
    View,
    StyleSheet,
} from 'react-native';
import Images from '../../Themes/Images';
import Colors from '../../Themes/Colors';
import Fonts from '../../Themes/Fonts';

export function MetodoPago({ modalActivo, checkCash, setCheckCash, checkDaviPlata, setCheckDaviPlata, checkNequi, setCheckNequi }){

  const [isCheckedEfectivo, setIsCheckedEfectivo] = useState(checkCash);
  const [isCheckedDaviplata, setIsCheckedDaviplata] = useState(checkDaviPlata);
  const [isCheckedNequi, setIsCheckedNequi] = useState(checkNequi);
  const [isCheckedOtro, setIsCheckedOtro] = useState(false);

  const toggleCheckBoxEfectivo = () => {
    setIsCheckedEfectivo(!isCheckedEfectivo);
    setCheckCash(!isCheckedEfectivo);
  };
  const toggleCheckBoxDaviplata = () => {
    setIsCheckedDaviplata(!isCheckedDaviplata);
    setCheckDaviPlata(!isCheckedDaviplata)
  };
  const toggleCheckBoxNequi = () => {
    setCheckNequi(!isCheckedNequi);
    setIsCheckedNequi(!isCheckedNequi);
  };
  const toggleCheckBoxOtro = () => {
    setIsCheckedOtro(!isCheckedOtro);
  };
   
  return(
    <View style={{ flex: 1, flexDirection: 'column', marginVertical: 190, marginHorizontal: 20, backgroundColor: Colors.$blanco, justifyContent: "center", alignItems: "center", width:"90%", height: "100%", borderRadius:20, position: "relative"}}>     
      <View style={{
        height: '60%',
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
        >Metodo de pago</Text>
        <View style={{flexDirection:'column',  marginTop:0, width:270}}>

          <View style={{width:250,height:30,  alignItems:'left', marginTop:15,borderRadius:20, backgroundColor:'#c8cace', margin:10}}>
            <View style={{flexDirection:'row', paddingLeft:15, justifyContent: 'space-between' }}>
              <View style={{flexDirection:'row', justifyContent: 'flex-start', alignItems:'center' }}>
                <View style={{width:40, alignItems: 'center', justifyContent: 'center'}}>
                  <Image style={{width:25, height: 25}} resizeMode='contain' source={Images.iconobillete}/>
                </View> 
            
                <Text style={{width: 100, fontSize:18, marginTop:2, fontFamily: Fonts.$poppinsregular}}>Efectivo</Text>
              </View>

              <View style={estilos.CajaHorCenter}>
                { isCheckedEfectivo ?
                <Pressable
                  onPress={() => toggleCheckBoxEfectivo()}
                  style={estilos.btnCheckOK}
                />:
                <Pressable
                  onPress={() => toggleCheckBoxEfectivo()}
                  style={estilos.btnCheck}
                />
                }
              </View>
            </View>
           
          </View>

          <View style={{width:250,height:30,  alignItems:'left', marginTop:15,borderRadius:20, backgroundColor:'#c8cace', margin:10}}>
            <View style={{flexDirection:'row', paddingLeft:15, justifyContent: 'space-between' }}>
              <View style={{flexDirection:'row', justifyContent: 'flex-start' }}>
                <View style={{width:40, alignItems: 'center', justifyContent: 'center'}}>
                  <Image style={{width:30, height: 30}} resizeMode='contain' source={Images.logodaviplata}/>
                </View>  
            
                <Text style={{width: 100, fontSize:18, marginTop:2, fontFamily: Fonts.$poppinsregular}}>Daviplata</Text>
              </View>

              <View style={estilos.CajaHorCenter}>
                { isCheckedDaviplata ?
                <Pressable
                  onPress={() => toggleCheckBoxDaviplata()}
                  style={estilos.btnCheckOK}
                />:
                <Pressable
                  onPress={() => toggleCheckBoxDaviplata()}
                  style={estilos.btnCheck}
                />
                }
              </View>
            </View>
           
          </View>

          <View style={{width:250,height:30,  alignItems:'left', marginTop:15,borderRadius:20, backgroundColor:'#c8cace', margin:10}}>
            <View style={{flexDirection:'row', paddingLeft:15, justifyContent: 'space-between' }}>
              <View style={{flexDirection:'row', justifyContent: 'flex-start' }}>
                <View style={{width:40, alignItems: 'center', justifyContent: 'center'}}>
                  <Image style={{width:25, height: 25}} resizeMode='contain' source={Images.logonequi}/>
                </View>  
            
                <Text style={{width: 100, fontSize:18, marginTop:2}}>Nequi</Text>
              </View>

              <View style={estilos.CajaHorCenter}>
                { isCheckedNequi ?
                <Pressable
                  onPress={() => toggleCheckBoxNequi()}
                  style={estilos.btnCheckOK}
                />:
                <Pressable
                  onPress={() => toggleCheckBoxNequi()}
                  style={estilos.btnCheck}
                />
                }
              </View>
            </View>
          </View>
        </View>                      
      </View>
        
      <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginTop: 20
      }}>
          <View style={{ backgroundColor: 'white', alignItems: 'center', justifyContent: 'center'}}>
            <Pressable 
              onPress={() => { 
                //addSolicitud(),
                modalActivo(false)
              }} 
              style={estilos.btnConfirmar}>                
                  <Text style={estilos.textSolicitar}>Confirmar</Text>               
            </Pressable>
          </View>
      </View>

      <Pressable  
          onPress={() => modalActivo(false)}
          style={{ position: 'absolute', top: 10, left: 10}}>
              <Image style={{width:50, height: 50}} resizeMode='contain' source={Images.iconoatras}/>
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
      backgroundColor : '#da3833',
      borderRadius : 20,
      height: 40,
      marginBottom: 10,
      marginLeft:70,
      marginRight:50,
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
})


