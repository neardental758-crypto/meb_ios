import Colors from '../../../Themes/Colors';
import EStyleSheet from 'react-native-extended-stylesheet';
import Fonts from '../../../Themes/Fonts';
import GeneralBaseStyles from './GeneralBase.styles';
import {Platform} from 'react-native';
export default {
	...GeneralBaseStyles,
	margin:{
		marginHorizontal:30,
		// marginRight:35,
		// marginLeft:39,
	},
	marginNumbe:{
		marginHorizontal:20,
		marginRight:35,
		marginLeft:55,
	},
	button:{
		border: 'none',
		marginHorizontal:20,
		marginRight:70,
		marginLeft:71,
	},
	title:{
		fontFamily:Fonts.$montserratMedium,
		color:'#878787',
		fontSize:20,
		// fontWeight:Platform.OS == 'ios'? '800:'',
	},
	subtitle:{
		fontFamily:Fonts.$montserratExtraBold,
		fontSize:18,
		lineHeight: 31,
		color:Colors.$textogray,
	},
	text:{
		fontFamily:Fonts.$poppinsregular,
		fontSize:15,
		lineHeight: 21,
		color:Colors.$textogray,
		textAlign:'justify',
		marginTop:10,
	}
}