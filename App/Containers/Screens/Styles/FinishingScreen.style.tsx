import EStyleSheet from 'react-native-extended-stylesheet';
import Fonts from '../../../Themes/Fonts';
import GeneralBaseStyle from './GeneralBase.styles';
import Colors from '../../../Themes/Colors';

export default {
    ...GeneralBaseStyle,
    settingBackground: {
        flex: 1,
    },
    titleFinishing: {
		alignSelf: 'center',
		color: '#878787',
		marginTop: 15,
		marginBottom: 0,
		fontSize: 20,
		fontFamily: Fonts.$montserratLight,
	},
    textNumber: {
        fontFamily: Fonts.$montserratMedium, 
        fontSize: 30, 
        width: '10%',
        color: '#a4a4a4',
        fontWeight: 'bold'
    },
    textValidation: {
        fontFamily: Fonts.$montserratLight, 
        fontSize: 17, 
        width: '60%',
        color: '#a4a4a4'
    },
	line: {
		alignSelf: 'center',
		color: Colors.$primario,
		marginTop: -10,
		marginBottom: 10,
		fontSize: 30,
		fontFamily: Fonts.$montserratLight,
	},
    textCenter: {
        fontSize: 17,
        fontFamily: Fonts.$montserratLight,
        fontWeight: 'normal',
        color: '#a4a4a4',
        marginTop: 20,
        marginHorizontal: 20,
        textAlign: 'center'
    },
    btnFinishing: {
        flex: 1,
        marginHorizontal: 10,
        marginTop: 20,
        borderRadius: 5,
        justifyContent: "center",
        //borderColor: Colors.$primario
        backgroundColor: Colors.$primario
    },
    btnTextFiniahing: {
        textAlign: "center",
        fontSize: 20,
        paddingTop: 'auto',
        paddingBottom: 'auto',
        color: 'white',
        fontWeight: '800',
        fontFamily: Fonts.$montserratSemiBold
    }
};