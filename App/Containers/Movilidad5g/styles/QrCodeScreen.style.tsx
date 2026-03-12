import {
    Dimensions,
    StyleSheet
  } from 'react-native';
  
  import Fonts from '../../../Themes/Fonts';
  import Colors from '../../../Themes/Colors';
  
  export const styles = StyleSheet.create({
    centerText: {
      flex: 1,
      fontSize: 18,
      padding: 32,
      color: '#777',
      fontFamily: Fonts.$poppinsregular
    },
    centeredView: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      marginTop: 22
    },
    textBold: {
      color: '#000',
      fontFamily: Fonts.$poppinsregular
    },
    buttonText: {
      fontSize: 13,
      color: '#fff',
      textAlign: "center",
      fontFamily: Fonts.$poppinsregular
    },
    buttonTouchable: {
      flex: 0.3,
      padding: 14,
      backgroundColor: Colors.$primario,
      borderRadius: 30,
      justifyContent: "center",
    },
    buttonTouchable2: {
      padding: 14,
      paddingHorizontal: 20,
      backgroundColor: "#fff",
      borderRadius: 30,
      justifyContent: "center",
    },
    buttonText2: {
      fontSize: 18,
      color: '#000',
      textAlign: "center",
      fontFamily: Fonts.$poppinsregular
    },
    fixToText: {
      paddingTop: 30,
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    topContainer: {
      marginHorizontal: 10,
      flexDirection: "row",
      zIndex: 1000
    },
    buttonBack: {
      flex: 0.15,
      padding: 10,
      backgroundColor: Colors.$primario,
      borderRadius: 30,
      fontFamily: Fonts.$poppinsregular
    },
    buttonQr: {
      flex: 0.3,
      padding: 15,
      backgroundColor: Colors.$primario,
      borderRadius: 30,
      marginTop: 30,
      justifyContent: 'center',
      fontFamily: Fonts.$poppinsregular
    },
    buttonQr2: {
      flex: 0.3,
      padding: 15,
      backgroundColor: "#fff",
      borderRadius: 30,
      marginTop: 30,
      justifyContent: 'center',
      fontFamily: Fonts.$poppinsregular
    },
    modalStyle: {
      flex: 1, borderRadius: 20, marginVertical: 200, marginHorizontal: 25, justifyContent: "space-between", alignItems: "center", paddingHorizontal: 25, position: "relative", backgroundColor: Colors.$blanco, padding: 10
    },
    buttonClose: {
      flex: 0.1,
      padding: 5,
      borderRadius: 30,
      left: 150,
      top: 5,
    },
    mainContainer: {
      flex: 1,
    },
    infoView: {
      flex: 2,
      justifyContent: 'center',
      alignItems: 'center',
      width: Dimensions.get('window').width,
    },
    camera: {
      flex: 0,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'transparent',
      height: Dimensions.get('window').width,
      width: Dimensions.get('window').width,
    },
  
    rectangleContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'transparent',
    },
    rectangle: {
      height: Dimensions.get('window').width*.8,
      width: Dimensions.get('window').width*.8,
      borderColor: Colors.$primario,
      backgroundColor: 'transparent',
      borderRadius: 15,
      borderWidth: 5
    },
    btnAtras:{
      position: 'absolute',
      top: 20, 
      left: 10,
      width: 50,
      height: 50,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 25
  },
    textRectangle: {
      flex: 0.6,
      top:80,
      color: Colors.$Texto,
      fontSize: 20,
      marginHorizontal: 10,
      textAlign: "center",
      fontFamily: Fonts.$poppinsregular
    }
  });
  