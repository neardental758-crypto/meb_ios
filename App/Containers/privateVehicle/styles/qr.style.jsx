import Fonts from '../../../Themes/Fonts';
import Colors from '../../../Themes/Colors';
import { Dimensions } from 'react-native';

export default {
    contenedor:{ 
        marginTop: 70,
        flex: 1,
        width: Dimensions.get("window").width,
        height: Dimensions.get("window").height*.8, 
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.$blanco,
    },
    contentTop: {
        flex: 1,
        backgroundColor: Colors.$primario,
        height: 60,
        with: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 10,
    }, 
    btnFlechaBack: {
        width: 40, 
        margin: 4,
        position: 'absolute',
        left: 0,
        zIndex: 10,
    }, 
    contenedorQR: {
        flex: 1,
        flexDirection: 'column', 
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        width: 350,
        height: 350,
    },
    cajaQR: {
        width: 350,
        height: 350,
    },
    centerText: {
        flex: 1,
        fontSize: 16,
        zIndex: 10,
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
        margin: 20
    },
    divInput: {
        width: 300,
        backgroundColor: Colors.$primario,
        borderRadius: 0,
        marginBottom: 10,
        marginTop: 20,
    },
    input:{
        width: '100%',
        height: 'auto',
        backgroundColor: Colors.$tercer,
        borderColor: Colors.$tercer,
        borderWidth: 4,
        fontSize: 20,
        fontFamily: Fonts.$size26,
        textAlign: 'center',
    },
    buttonText: {
        fontSize: 21,
        color: 'rgb(0,122,255)'
    },
}
