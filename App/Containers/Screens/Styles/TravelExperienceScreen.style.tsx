import EStyleSheet from 'react-native-extended-stylesheet';
import GeneralBaseStyles from './GeneralBase.styles';
import Colors from '../../../Themes/Colors';
import Fonts from '../../../Themes/Fonts';
import { Platform } from 'react-native';

export default EStyleSheet.create({
	...GeneralBaseStyles,
	settingBackground: {
		flex: 1,
	},
	MainContainer:
	{
		flex: 1,
		justifyContent: 'center',
		paddingTop: (Platform.OS === 'ios') ? 20 : 0
	},
	inputBorder: {
	    marginTop: 2,
	    paddingLeft: 20,
	    width: '85%',
	    height:170,
	    color: '#a4a4a4',
	    fontFamily: Fonts.$poppinsregular,
	    fontSize: 20,
	},

	childView:
	{
		justifyContent: 'center',
		flexDirection: 'row',
	},

	StarImage:
	{
		width: 40,
		height: 40,
		resizeMode: 'cover'
	},

	textStyle:
	{
		textAlign: 'center',
		fontSize: 23,
		color: '#000',
		marginTop: 15
	},
	inputWithIcon: {
		marginTop: 5,
		borderColor: Colors.$primario,
		borderWidth: 2,
		borderRadius: 15,
		marginHorizontal: 20
	},
	endTripInput:{
		fontFamily: Fonts.$montserratExtraBold, 
		textAlign: "center", 
		color: 'yellow', 
		fontSize: 20, 
		paddingTop: 'auto', 
		paddingBottom: 'auto', 
		fontWeight: '800'
	},
	touchableEndTrip: {
		flex: 1, 
		borderRadius: 25, 
		justifyContent: "center", 
		backgroundColor: 'black', 
		borderWidth: 2,
	}
});