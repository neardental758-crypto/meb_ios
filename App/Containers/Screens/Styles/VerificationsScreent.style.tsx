import EStyleSheet from 'react-native-extended-stylesheet';
import Fonts from '../../../Themes/Fonts';
import GeneralBaseStyle from './GeneralBase.styles';
import Colors from '../../../Themes/Colors';
import { horizontalScale, moderateScale, verticalScale } from '../../../Themes/Metrics';
import {Dimensions} from 'react-native';

export default {
    ...GeneralBaseStyle,
    settingBackground: {
        flex: 1,
    },
    textCenter: {
        fontSize: 20,
        fontFamily: Fonts.$poppinsregular,
        fontWeight: 'normal',
        color: '#a4a4a4',
        marginTop: 20,
        marginHorizontal: 20,
        textAlign: 'center'
    },
    textNumber: {
        fontFamily: Fonts.$poppinsregular, 
        fontSize: 30, 
        paddingRight: 20,
        color: '#a4a4a4'
    },
    textValidation: {
        fontFamily: Fonts.$poppinsregular, 
        fontSize: 20, 
        width: 200,
        color: '#a4a4a4'
    },
    greenBar: {
        height: 3, width: 150, backgroundColor: Colors.$primario, alignSelf: 'center', borderRadius: 10
    },
    colorRed: {
        color: '#FF3838'
    },
    btnFinishing: {
        height: 50,
        width: 200,
        marginTop: 20,
        borderRadius: 5,
        justifyContent: "center",
        //borderColor: Colors.$primario
        backgroundColor: Colors.$primario
    },
    cajaScroll: {
        flex: 1,
        backgroundColor: Colors.$blanco,
        height: Dimensions.get("window").height,
        width: Dimensions.get("window").width,
        alignItems: "center",
    },
    btnFinishing2: {
        height: 50,
        width: 200,
        marginTop: 50,
        borderRadius: 5,
        justifyContent: "center",
        backgroundColor: Colors.$primario
    },
    btnTextFiniahing: {
        textAlign: "center",
        fontSize: 20,
        paddingTop: 'auto',
        paddingBottom: 'auto',
        color: 'white',
        fontWeight: '800',
        fontFamily: Fonts.$montserratMedium
    }
};