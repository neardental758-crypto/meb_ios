import Fonts from '../../../Themes/Fonts';
import Colors from '../../../Themes/Colors';
import {Dimensions} from 'react-native';
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from '../../../Themes/Metrics';

export default {
    contenedor:{
        width: Dimensions.get('window').width,
        minHeight: Dimensions.get('window').height,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
    },
    title:{
        fontSize: 30, 
        textAlign: 'center', 
        color: '#fff', 
    },
    cajaForm:{
      alignItems: 'center',
    },
    divInput: {
        width: "90%",
        borderRadius: 10,
        marginBottom: 20,
    },
    input:{
        width: '100%',
        fontSize: 22,
        fontFamily: Fonts.$montserratExtraBold,
        paddingLeft: 20,
        color: Colors.$secundario,
        backgroundColor: Colors.$tercer,
        borderRadius: 20,
    },
    inputText: {
        color: Colors.$secundario,
        fontSize: 14,
        paddingLeft: 10
    },
    title_user:{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 30,
        textAlign: 'center',
        fontFamily: Fonts.$montserratExtraBold,
        color: '#878787', 
    },
    btnBack: {
        flexDirection: "row",
        alignItems: 'center', 
        justifyContent: 'center', 
        backgroundColor: '#40CC9A',
        width: 80, 
        height: 30, 
        borderRadius: 10,
    },
    btnSave: {
        flexDirection: "row",
        alignItems: 'center', 
        justifyContent: 'center', 
        backgroundColor: Colors.$primario,
        width: 180, 
        height: 'auto', 
        borderRadius: 25,
        paddingTop: 10,
        paddingBottom: 10,
    },
    btnCenter: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 30,
        marginBottom: 20,
        paddingLeft: 10
    },
    btnSaveColor: {
        color: Colors.$texto,
        fontSize: 20,
    },
    cajaInfo: {
        width: "90%",
        backgroundColor: Colors.$overlayTransparent,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 10,
        borderRadius: 10
    },
    subCajaInfo: {
        flexDirection: 'column', 
        justifyContent: 'center',
    },
    texto1: {
        fontSize: 18,
        fontFamily: Fonts.$montserratExtraBold,
        textAlign: 'center',
        color: 'black',
    },
    texto2: {
        fontSize: 40,
        fontFamily: Fonts.$overlayTransparent,
        textAlign: 'center',
        color: 'black',
    },
    boxBtns: {
        alignItems: "center", 
        justifyContent: "space-around", 
        flexDirection: "column",
        position: "absolute",
        top: 20,
        left: 20,
    },
    boxPrincipalItems: {
        width: Dimensions.get("window").width*.8,
        flexDirection: 'row',
        flexWrap: "wrap",
    },
    btnAtras: {
        width: 50,
        height: 50,
        backgroundColor: Colors.$primario,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000
    },
    iconBici2: {
        width: 30,
        height: 30,
    },
    btnver: {
        backgroundColor: Colors.$tercer,
        width: 250,
        borderRadius: 40,
        alignItems: 'left',
        paddingLeft: 10,
        marginBottom: 5
    },
    btnCerrar: {
        backgroundColor: Colors.$tercer,
        width: Dimensions.get('window').width,
        alignItems: 'center',
    },
    textoBtnVer: {
        fontSize: 12,
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cajaViajes: {
        width: Dimensions.get('window').width,
        backgroundColor: Colors.$blanco,
        alignItems: 'center',
    },
    cajaBtnTransition: {
        width: 250,
        flexDirection: 'column',
        justifyContent: 'space-between',
    },
    cajaItemViaje: {
        width: Dimensions.get('window').width,
        marginBottom: 5,
        marginTop: 5,
        backgroundColor: Colors.$tercer,
        borderRadius: 10,
        flexDirection: 'column',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
    },
    cajaItemViajeRow: {
        width: Dimensions.get('window').width,
        marginBottom: 5,
        marginTop: 5,
        backgroundColor: Colors.$tercer,
        borderRadius: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        padding: 10
    },
    cajaSubItem: {
        width: Dimensions.get('window').width*.3,
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: Colors.$blanco
    },
    tituloItem: {
        width: Dimensions.get('window').width,
        alignItems: 'center',
    },
    tituloItemText: {
        fontSize: 14
    }
}