import EStyleSheet from 'react-native-extended-stylesheet';
import Fonts  from '../../../Themes/Fonts';
import GeneralBaseStyles from './GeneralBase.styles';
import Colors from '../../../Themes/Colors';
import { horizontalScale, moderateScale, verticalScale } from '../../../Themes/Metrics';

export default {
	...GeneralBaseStyles,
	settingBackground: {
		flex: 1,
	},
	titleUpdate: {
		alignSelf: 'center',
		color: Colors.$texto,
		marginTop: 50,
		marginBottom: 30,
		fontSize: moderateScale(25),
		fontFamily: Fonts.$poppinsregular,
	},
	updatePasswordInput: {
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
	    marginTop: verticalScale(8),
		marginBottom: verticalScale(8),
	    marginRight: horizontalScale(12),
		marginLeft: horizontalScale(12),
	    height: verticalScale(30),
	    width: horizontalScale(23),
	    resizeMode: 'contain'
	},
	inputWithIcon:{
		flexDirection: 'row',
		borderColor: Colors.$primario,
    	borderWidth: 2,
		borderRadius: 25,
    	marginBottom: 30,
	},
	updateButton: {
		alignSelf: 'center',
		height: 50,
		width: 200,
		marginTop: 20,
		marginBottom: 10,
	},
	forgotLink:{
		marginTop: -20,
		fontSize: moderateScale(16),
		fontWeight: '500',
		color: '#FF5454',
		alignSelf: 'center',
		fontFamily: Fonts.$poppinsregular,
	},
	borderButton:{
		borderRadius: 20,
		height: 40,
		borderColor: '$darkgray',
		borderWidth: 1,
		paddingTop: 10,
		paddingBottom: 5,
		marginTop: 8,
		marginBottom: 8,
		width: '100%',
		color: '$blanco',
		flexDirection: 'row',
		position: 'relative',
	},
	borderButtonText:{
		display: 'flex',
		flex: 1,
		color: '$blanco',
		textAlign: 'center',
		fontSize: moderateScale(14),
		fontFamily: Fonts.$poppinsregular,
	},
};