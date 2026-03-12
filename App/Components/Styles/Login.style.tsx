import EStyleSheet from 'react-native-extended-stylesheet';
import Fonts  from '../../Themes/Fonts';
import Colors  from '../../Themes/Colors';
import {Dimensions} from 'react-native';
import GeneralBaseStyles from '../../Containers/Screens/Styles/GeneralBase.styles';
import { horizontalScale, moderateScale, verticalScale } from '../../Themes/Metrics';
export default EStyleSheet.create({
  ...GeneralBaseStyles,
	loginSubTitle: {
        justifyContent: 'center',
        alignItems: 'center',
        width: horizontalScale(340),
        height: verticalScale(220),
		marginBottom : verticalScale(0),
		marginTop : verticalScale(0)
	},
	titleLogin: {
		alignSelf: 'center',
		color: Colors.$texto,
		marginTop: -20,
		marginBottom: 0,
		fontSize: moderateScale(25),
		fontFamily: Fonts.$poppinsregular,
	},
	titleRegister: {
		alignSelf: 'center',
		color: Colors.$texto,
		marginTop: 20,
		fontSize: moderateScale(18),
		fontFamily: Fonts.$poppinsregular,
	},
	loginInput: {
		marginTop: 2,
		paddingBottom: 10,
		paddingTop: 10,
		width: '85%',
		color: Colors.$texto,
		fontFamily: Fonts.$poppinsregular,
		fontSize: moderateScale(20),
	},
	inputPlaceholder: {
		fontWeight: '900',
	},
	imageLeft:{
	    marginTop: verticalScale(10),
		marginBottom : verticalScale(10),
	    marginRight: horizontalScale(12),
		marginLeft: horizontalScale(12),
	    height: verticalScale(30),
	    width: horizontalScale(23),
	    resizeMode: 'contain'
	},
	buttonIconsLogin:{
	    left: horizontalScale(13),
	    top: verticalScale(6),
	    height: verticalScale(25),
	    width: horizontalScale(25),
	    position: 'absolute',
	},
	inputWithIcon:{
		flexDirection: 'row',
		borderColor: Colors.$primario,
    	borderWidth: 2,
		borderRadius: 25,
    	marginBottom: 30,
	},
	loginButton: {
		alignSelf: 'center',
		height: horizontalScale(45),
		width: horizontalScale(170),
	},
	forgotLink:{
		fontSize: moderateScale(18),
		fontWeight: '500',
		color: Colors.$texto,
		alignSelf: 'center',
		fontFamily: Fonts.$poppinsregular,
	},
	borderButton:{
		borderRadius: 50,
		borderColor: Colors.$primario,
		borderWidth: 2,
		marginTop: 20
	},
	borderButtonText:{
		color: Colors.$texto,
		textAlign: 'center',
		fontSize: moderateScale(18),
		fontFamily: Fonts.$montserratExtraBold,
		paddingEnd : 30,
		paddingStart : 30,
		paddingTop : 8,
		paddingBottom : 8
	},
});







