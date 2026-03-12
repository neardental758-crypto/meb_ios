import Fonts from '../../../Themes/Fonts';
import Colors from '../../../Themes/Colors';
import { Dimensions } from 'react-native';
import { horizontalScale, moderateScale, verticalScale } from '../../../Themes/Metrics';

export default {
    generales: {
        flex: 1,
        alignItems: 'center', 
        justifyContent: 'center',
        backgroundColor: 'blue',
    },
    subTitle: {
        fontFamily: Fonts.$poppinsregular, 
        fontSize: 20, 
        textAlign: 'center', 
        color: Colors.$texto,
        marginTop: 30,
        marginBottom: 30,
    },
    safeArea: {
        flex: 1, 
        width: Dimensions.get("window").width,
        backgroundColor: Colors.$blanco, 
        alignItems: 'center', 
        justifyContent: 'center',
    },
    contenedor:{
        flex: 1,
        width: Dimensions.get("window").width,
        backgroundColor: Colors.$blanco,
    },
    vpsoporte: {
        width: horizontalScale(65),
        height: verticalScale(70),
        marginBottom : verticalScale(10)
    },
    contentTop: {
        width: Dimensions.get("window").width,
        backgroundColor: Colors.$blanco,
        flex: 1,
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        marginTop : 20,
        marginBottom : 20
    },
    ondaWhite: {
        width: Dimensions.get("window").width,
        height: 70,
        position: 'absolute',
        bottom: 0,
    },
    contenedor2:{
        flexDirection: 'column',
        backgroundColor: "#fff",
        width: "100%",
        height: 150,
        alignItems: 'center',
        position: 'absolute',
        top: 300,
    },
    cajas:{
        width: '100%',
        flexDirection: 'column',
        alignItems: 'center',
        position: 'absolute',
        top: 500,
    },
    title:{
        fontFamily: Fonts.$poppinsregular, 
        fontSize: 24, 
        textAlign: 'center', 
        color: Colors.$texto, 
        marginBottom: 5
    },
    contentTitle: {
        width: '100%',
        backgroundColor: Colors.$blanco,
    },
    btnBack: {
        flexDirection: "row",
        alignItems: 'center', 
        justifyContent: 'center', 
        width: Dimensions.get("window").width,
        height: 55, 
        position: "absolute",
        left: 0,
        top: 0,
        zIndex: 10,
        backgroundColor: Colors.$primario
    },
    imgback: {
        width: Dimensions.get("window").width,
        height: 50
    },
    btnSave: {
        flexDirection: "row",
        alignItems: 'center', 
        justifyContent: 'center', 
        backgroundColor: Colors.$tercer,
        width: 70, 
        height: 'auto', 
        borderRadius: 15,
        paddingTop: 10,
        paddingBottom: 10,
        marginRight: 20,
        marginLeft: 20
    },
    btnSaveSI: {
        flexDirection: "row",
        alignItems: 'center', 
        justifyContent: 'center', 
        backgroundColor: Colors.$primario,
        width: 60, 
        height: 'auto', 
        borderRadius: 20,
        paddingTop: 10,
        paddingBottom: 10,
        marginRight: 20,
        marginLeft: 20
    },
    letraSI: {
        color: Colors.$blanco,
        fontSize: 18
    },
    letraNO: {
        color: Colors.$texto,
        fontSize: 18
    },
    btnCenter: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    btnCenter1: {
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        bottom: 40,
        zIndex: 100
    },
    cajaBtnReservar: {
        marginBottom: 200
    },
    btnSaveColor: {
        color: Colors.$texto,
        fontSize: 18,
        textAlign: 'center',
        fontFamily: Fonts.$poppinsregular
    },
    cajaImgReserva: {
        width: Dimensions.get("window").width,
        height: 100,
        alignSelf: 'center',
        justifyContent: 'center',
        position: 'relative',
        marginBottom: 100
    },
    imgReserva: {
        width: Dimensions.get("window").width,
        height: 900,
        position: 'absolute',
        top: 0,
        zIndex: 10,
    },
    denegado: {
        fontFamily: Fonts.$size26,
        fontSize: moderateScale(20),
        backgroundColor: '#FF7979',
        color: '#fff',
        width: '80%',
        marginBottom: 5,
        paddingLeft: 10,
        borderRadius: 5,
    },
    aceptado: {
        fontFamily: Fonts.$size26,
        fontSize: moderateScale(20),
        color: Colors.$primario,
        marginBottom: 8,
        width: '80%',
        backgroundColor: '#EAEAEA',
        paddingLeft: 10,
        borderRadius: 5,
    },
    input:{
        width: '100%',
        height: 'auto',
		borderBottomWidth: 1,
        borderColor: '#CCCCCC',
        fontSize: moderateScale(40),
        fontFamily: Fonts.$montserratExtraBold,
        textAlign: 'center',
    },
    contentCenter: {
        width: Dimensions.get("window").width,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: -10,
        marginBottom: 30
    }, 
    btnSaveOK: {
        flexDirection: "row",
        alignItems: 'center', 
        justifyContent: 'center', 
        backgroundColor: Colors.$primario,
        width: 350, 
        height: 'auto', 
        borderRadius: 25,
        padding: 10,
    },
    contentMsn: {
        width: '100%', 
        height: 'auto',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
        paddingLeft: 10,
    },
    textTituloClave: {
        fontFamily: Fonts.$size22,
        color: '#878787',
    },
    textTituloClave2: {
        fontFamily: Fonts.$size26,
        backgroundColor: Colors.$overlayTransparent,
        fontSize: moderateScale(20),
        color: Colors.$texto, 
        padding: 10,
        zIndex: 100,
        position: 'absolute',
        width: "80%",
        textAlign: 'center',
        top: 180
    },
    textTituloClave4: {
        fontFamily: Fonts.$size22,
        color: '#878787',
        fontSize: moderateScale(20),
    },
    cajaEstacinarVehiculo: {
        alignItems: 'center',
        justifyContent: 'center',
        width: Dimensions.get("window").width,
        height: Dimensions.get("window").height,
        position: 'absolute',
        zIndex: 99,
        top: 0
    },
    inputBeneficios: {
        marginLeft: 20,
        marginRight: 20,
        borderWidth: 2,
        borderRadius: 25,
        marginBottom: 30,
        fontSize: 20,
        paddingHorizontal: 10,
        borderBottomWidth: 1,
        marginTop: 10,
        paddingBottom: 10,
        color: Colors.$texto,
        backgroundColor: Colors.$blanco,
        borderColor: Colors.$secundario,
        width: 300,
        paddingLeft: 20
    },
    cajaStarts: {
        width: "100%",
        flexDirection: "row",
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: verticalScale(20),
        marginBottom: verticalScale(20),
    },
    cajaInput: {
        width: "100%",
        alignItems: 'center',

    },
    cajaBtnFinalizar: {
        position: 'absolute',
        bottom: 0,
    },
    cajaCaliF: {
        flexDirection: 'row',
        width: Dimensions.get("window").width,
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingLeft: 50,
        paddingRight: 50
    },
    letraA: {
        fontSize: 20,
        color: Colors.$texto,
        fontFamily: Fonts.$montserratRegular
    },
    btnNext: {
        flexDirection: "row",
        alignItems: 'center', 
        justifyContent: 'center', 
        backgroundColor: Colors.$texto,
        width: 300, 
        height: 'auto', 
        borderRadius: 25,
        paddingTop: 10,
        paddingBottom: 10,
        marginTop: 5,
        marginBottom: 5,
        zIndex: 200,
    },
    textBtnNext: {
        color: Colors.$blanco,
        fontSize: 18,
        fontFamily: Fonts.$montserratRegular
    },
    cajaVestacinado:{
        width: Dimensions.get("window").width,
        alignItems: 'center',
        backgroundColor: Colors.$blanco,
        marginBottom: 20,
        paddingBottom:  10,
        paddingTop: 10,
    },
    cajaHorizontal: {
        flexDirection: 'row',
        flexWrap: 'nowrap',
        alignItems: 'center',
        justifyContent: 'center'
    },
    cajaVertical: {
        flexDirection: 'column',
        flexWrap: 'nowrap',
        alignItems: 'center',
        justifyContent: 'center'
    },
    letraBlanca: {
        width: Dimensions.get("window").width*.8,
        textAlign: 'center',
        fontSize: 20,
        color: Colors.$texto,
        marginBottom: 10,
        fontFamily: Fonts.$poppinsregular
    },
}