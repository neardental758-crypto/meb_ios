import Fonts from '../../../Themes/Fonts';
import Colors from '../../../Themes/Colors';
import { Dimensions } from 'react-native';

export default {
    contenedor:{
        flex: 1,
        width: Dimensions.get("window").width,
        height: Dimensions.get("window").height*.9,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.$blanco,
    },
    titulo: {
        width: Dimensions.get("window").width*.7,
        textAlign: 'center',
        fontSize: 22,
        fontFamily: Fonts.$montserratExtraBold,
        marginBottom: 30,
        color: Colors.$secundario
    },
    btnFlechaBack: {
        width: 40, 
        margin: 4,
        position: 'absolute',
        left: 0,
        zIndex: 10,
    },
    contentTop: {
        backgroundColor: Colors.$primario,
        height: 80,
        with: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },     
    contenedorQR: {
        flexDirection: 'column', 
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        width: 300,
        height: 300,
        padding: 20,
        borderRadius: 25
    },
    cajaQR: {
        width: 280,
        height: 280,
    },
    centerText: {
        flex: 1,
        fontSize: 16,
        zIndex: 10,
    },
    textBold: {
        fontWeight: '300',
        color: '#000'
    },
    buttonText: {
        fontSize: 21,
        color: 'rgb(0,122,255)'
    },
    buttonTouchable: {
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
    buttonNext: {
        flexDirection: "row",
        alignItems: 'center', 
        justifyContent: 'center', 
        backgroundColor: '#878787',
        width: 180, 
        height: 'auto', 
        borderRadius: 25,
        paddingTop: 10,
        paddingBottom: 10,
    },
    divInput: {
        width: 300,
        borderRadius: 25,
        marginBottom: 30,
        marginTop: 30,
    },
    input:{
        width: '100%',
        height: 'auto',
        fontSize: 20,
        fontFamily: Fonts.$size26,
        textAlign: 'center',
        borderRadius: 25,
        backgroundColor: Colors.$tercer,
    },
}
