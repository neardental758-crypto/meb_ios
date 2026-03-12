import EStyleSheet from 'react-native-extended-stylesheet';
import GeneralBaseStyles from '../../Containers/Screens/Styles/GeneralBase.styles.tsx';
import Colors from '../../Themes/Colors';
import Fonts from '../../Themes/Fonts';

export default EStyleSheet.create({
	...GeneralBaseStyles,
	registerBackground: {
		height: 500,
	},
	trackingTitle:{
		marginBottom: 20,
		fontWeight: '900',
		fontSize: 20,
	    marginLeft: 'auto',
	    marginRight: 'auto',
	    color: Colors.$yellow,
	    textAlign: 'center',
	    fontFamily:Fonts.$montserratExtraBold,
	},
	trackingsContainer:{
		borderBottomWidth: 0.3,
		borderBottomColor: Colors.$blanco,
		flexDirection: 'row',
		marginBottom: 20,
		width: '85%',
		marginRight: 'auto',
		marginLeft: 'auto',
	},
	trackingImage:{
		height: 60,
		width: 60,
	},
	trackingInformation:{
		width: '73%',
		marginTop: 0,
		marginLeft: 20,
	},
	trackingsGeneralInfo:{
		flexDirection: 'column',
		justifyContent: 'space-between'
	},
	trakingInfos:{
		fontSize: 12,
		color:Colors.$gray,
		fontFamily:Fonts.$poppinsregular,
	},
	trackingName:{
		color:Colors.$yellow,
		fontWeight: '900',
		fontFamily:Fonts.$montserratExtraBold,
		fontSize: 12,
	}
});