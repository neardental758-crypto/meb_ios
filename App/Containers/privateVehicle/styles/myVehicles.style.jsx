import Fonts from '../../../Themes/Fonts';
import Colors from '../../../Themes/Colors';
import { Dimensions } from 'react-native';
import { horizontalScale, moderateScale, verticalScale } from '../../../Themes/Metrics';


export default {
    contenedor:{
        width: Dimensions.get("window").width, 
        height: Dimensions.get("window").height,
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative',
    },
    boxBtns: {
        width: Dimensions.get("window").width, 
        height: 100,
        alignItems: "center", 
        justifyContent: "space-around", 
        flexDirection: "column",
        backgroundColor: Colors.$blanco,
        position: 'absolute',
        bottom: 20,
    },
    btnPrimarioViajeSave: {
        alignItems: "center",
        justifyContent: "center",
        backgroundColor : Colors.$primario,
        borderRadius : 50,
        width: 200,
        height: 30,
        marginBottom: 10
    },
    textButton : {
        fontFamily: Fonts.$poppinsregular, 
        textAlign: "center", 
        fontSize: 18, 
        paddingTop: 'auto', 
        paddingBottom: 'auto', 
        color: 'white',
        color: Colors.$blanco,
        alignSelf: "center",
    },
    boxPrincipalItems: {
        width: Dimensions.get("window").width,
        alignItems: 'center',
        flexDirection: 'column',
        flexWrap: "nowrap",
        paddingTop: 20,
        paddingBottom: 120,
    },
    btnAtras: {
        width: 50,
        height: 50,
        backgroundColor: Colors.$primario,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
    },
    btnAdd: {
        width: 50,
        height: 50,
        backgroundColor: Colors.$primario,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
    },
    btnRefresh: {
        width: 50,
        height: 50,
        backgroundColor: Colors.$primario,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
    },
    descripcion: {
        flex: 1,
        width: '70%',
        textAlign: 'center',
        color: Colors.$texto,
        padding: 5,
        marginTop: 40,
        fontSize: 20
    },
    iconBici: {
        width: 60,
        height: 60,
    },
    iconBiciBlanco: {
        width: 50,
        height: 50,
        tintColor : Colors.$blanco,
        padding: 5
    },
    iconBiciNegro: {
        width: 50,
        height: 50,
        tintColor: Colors.$texto,
        padding: 5
    },
    iconBici2: {
        width: 30,
        height: 30,
    },
    btnAtrasImg: {
        marginLeft: moderateScale(10), 
        width : horizontalScale(350), 
        height : verticalScale(55)
    },
    cajavpmas:{
        position: 'absolute',
        zIndex: 0,
        width: "100%",
        height: "100%",
    },
    subRaya: {
        height: 2, 
        width: Dimensions.get("window").width, 
        backgroundColor: Colors.$primario, 
        alignSelf: 'center',
    },
    btnFlechaBack: {
        width: 40, 
        margin: 4,
        position: 'absolute',
        left: 0,
        zIndex: 10,
    },
    contentTop: {
        flex: 1,
        backgroundColor: Colors.$texto,
        height: 60,
        with: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 15,
        zIndex: 1,
        width : '100%'
    },
    generales: {
        flex: 1,
        width: '100%',
        alignItems: 'center', 
        justifyContent: 'center',
    },
    safeArea: {
        flex: 1, 
        width: '100%',
        backgroundColor: '#ffffff',
        margin: 1, 
        alignItems: 'center', 
        justifyContent: 'center',
    },
    btnBack: {
        flexDirection: "row",
        alignItems: 'center', 
        justifyContent: 'center',
        width: 40, 
        height: 30, 
        borderRadius: 10,
        zIndex: 10,
    },
    contentTitle: { 
        flex: 1, 
        width: '100%',
    },
    title:{
        fontFamily: Fonts.$sizeSubtitle, 
        fontSize: 22, 
        textAlign: 'center', 
        color: Colors.$texto, 
        marginBottom: 20,
        zIndex: 1,
    },
    
    btnVehiculos: {
        width: Dimensions.get('window').width*.9,
        height: 120,
        backgroundColor: Colors.$blanco,
        margin: moderateScale(10),
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 18,
        shadowColor: Colors.$texto,
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 4.29,
        shadowRadius: 4.65,
        elevation: 7,
    },
    cajaiconos: {
        width: 100,
        height: 150,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 10
    },
    btnVehiculos2: {
        width: 100, 
        height: 100,
        borderRadius: 50,
        alignSelf: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.$secundario50
    },
    btnVehiculos2Select: {
        width: 100, 
        height: 100,
        borderRadius: 50,
        alignSelf: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.$primario
    },
    btnVehiculosSelect: {
        width: 70, 
        height: 70,
        backgroundColor: '#40CC9A',
        margin: 5,
        alignSelf: 'center',
        justifyContent: 'center',
        borderRadius: 18,
    },
    cajaTextVehiuclos: {
        width: "100%",
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-around',
    },
    cajaTextVehiuclos2: {
        width: "100%",
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
    },
    textVehiculo: {
        fontSize: 16,
        color: Colors.$texto,
        textAlign: 'center',
        fontFamily: Fonts.$poppinsmedium
    },
    textVehiculo2: {
        fontSize: 16,
        color: Colors.$texto50,
        textAlign: 'center',
        fontFamily: Fonts.$poppinsmedium
    },
    cajaImgVP: {
        position: 'absolute',
        right: -5,
        width: 90,
        height: 90,
        borderWidth: 4,
        borderColor: Colors.$blanco,
        borderRadius: 45,
        backgroundColor: Colors.$primario,
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    imgVP: {
        width: 70,
        height: 70,
    },
    btnNext: {
        flexDirection: "row",
        alignItems: 'center', 
        justifyContent: 'center', 
        backgroundColor: Colors.$secundario,
        width: 250, 
        height: 'auto', 
        borderRadius: 25,
        paddingTop: 10,
        paddingBottom: 10,
        marginTop: 5,
        marginBottom: 5,
        zIndex: 200,
    },
    btnReg: {
        flexDirection: "column",
        alignItems: 'center', 
        justifyContent: 'space-between', 
        backgroundColor: Colors.$primario,
        width: 250, 
        height: 'auto', 
        borderRadius: 25,
        paddingTop: 10,
        paddingBottom: 10,
        marginTop: 5,
        marginBottom: 5,
        zIndex: 100,
    },
    textBtnNext: {
        color: Colors.$cuarto,
        fontSize: 20,
    },
    textBtnNext2: {
        color: Colors.$secundario,
        fontSize: 20,
    },
    textMsn: {
        color: 'red',
        fontSize: 14,
    }
}