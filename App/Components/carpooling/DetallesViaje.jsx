import React, { useState, useEffect } from 'react';
import {
    Image,
    ImageBackground,
    SafeAreaView,
    Text,
    Pressable,
    View,
    StyleSheet,
    Alert,
    TextInput,
    Modal, 
    Button,
    ScrollView,
    Dimensions,
    Animated,
    Easing
} from 'react-native';
import Images from '../../Themes/Images';
import Colors from '../../Themes/Colors';
import Fonts from '../../Themes/Fonts';
import DetallesViaje, { Estrellas } from '../../Components/carpooling/Estrellas';
import * as RootNavigation from '../../RootNavigation';
import { horizontalScale, moderateScale, verticalScale } from '../../Themes/Metrics';
import { styles } from '../../Containers/Screens/Styles/QrCodeScreen.style';


export default function DetalleViaje(){
    const [ cal1, setCal1 ] = useState(false);
    const [ cal2, setCal2 ] = useState(false);
    const [ cal3, setCal3 ] = useState(false);
    const [ cal4, setCal4 ] = useState(false);
    const [ cal5, setCal5 ] = useState(false);
    return(
        <View style={{ backgroundColor: "white", flexDirection: "column", flex: 1 }}>
        <View style={{ flex: 3, borderRadius: 6, marginVertical: 130, marginHorizontal: 50, backgroundColor: Colors.$primer, justifyContent: "center", alignItems: "center", paddingHorizontal: 25, borderWidth:1, width:300 }}>
          
          <View style={{}}>
            <Text style={{ 
              textAlign: "center",
              color: Colors.$cuarto,
              fontSize: 22, 
              fontWeight: "400",
              }}
            >Detalles del viaje</Text>
            <View style={{flexDirection:'column', borderWidth:1, marginTop:15, height:300, width:270, borderRadius:10}}>
            <Text style={estilos.textNombreSolicitud}>Carlos Perez</Text>
            <View style={estilos.cajaStartsSolicitud}>
            <Estrellas calificacion={4}/>
            <View style={estilos.cajaViajes}>
                <Text>2 </Text>
                <Text>Viajes</Text>

            </View>
            </View>    
            <View style={estilos.lineaSolicitudViaje}>
      <Text>...</Text>  
</View>
<View>
<Text style={{marginLeft:10, marginTop:5}} >Fecha y hora</Text>
<Text style={{marginLeft:10}}>Oficina</Text>

</View>
<View style={{flexDirection:'row'}}>
<Text style={estilos.textPrecio}>$4.000</Text>
<Image style={{width:36}} resizeMode='contain' source={Images.daviplata_icon}/>
<Image source={Images.cash_icon} style={{marginLeft:25, width:36}}/>
<Image source={Images.chat_icon} style={{marginLeft:30, marginBottom:30}}/>
</View> 

     </View>                      
        </View>
            <View style={{
                marginTop: 40,
                flexDirection: 'row',
                justifyContent: 'space-between'
            }}>

                <View style={{ marginBottom:80 }}>
                <Pressable 
          onPress={() => { 
            //displayBackgroundInfoModal(false) 
            //irSolicitudes()
        }}
          style={estilos.btnConfirmar}>
            <View>
              <Text style={estilos.textSolicitar}>Iniciar </Text>
            </View>
        </Pressable>
                </View>
            </View>
        </View>
    </View>
    )



}
const estilos = StyleSheet.create({
    cajaStartsSolicitud: {
        width: 20,
        flexDirection: "row",
        alignItems: 'left',
        justifyContent: 'center',
        marginLeft: 120, 
      },
      textPrecio:{
        fontSize:20,
        marginLeft:20,
        fontWeight:'400'
      },
      cajaViajes:{
        width:50,
        flexDirection : 'row',
        justifyContent : 'space-between',
      },
      lineaSolicitudViaje:{
        borderWidth : 1,
        borderColor : Colors.$black,
        borderRadius:15,
        backgroundColor:'black',
        height:5,
        marginTop:20,
        width:250
      },
      textViajes:{
        fontSize:14,
       fontWeight:'400',
       right:10
         
       },
      cajaStart:{
        width: 50,
        flexDirection: "row",
        alignItems: 'left',
        justifyContent: 'center',
        marginTop: 20,
        marginLeft: 90,
      },
      btnStart:{
        width:7,
        padding:20,
      },
      textNombreSolicitud:{
        fontSize:18,
        fontWeight:'bold',
        marginTop:20,
        marginLeft:10
      },
      cajaViajes:{
        width:50,
        marginLeft:60,
        marginTop:20,
        flexDirection : 'row',
        justifyContent : 'space-between',
      },
      textViajes:{
        fontSize:14,
       fontWeight:'400',
       position:'absolute',
       top:30,
       right:10
         
       },
       btnConfirmar:{
        alignItems: "center",
        justifyContent: "center",
        backgroundColor : '#da3833',
        borderRadius : 10,
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

})
