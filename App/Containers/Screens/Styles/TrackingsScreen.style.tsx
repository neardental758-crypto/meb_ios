import EStyleSheet from 'react-native-extended-stylesheet';
import GeneralBaseStyles from './GeneralBase.styles';
import Colors from '../../../Themes/Colors';
import Fonts from '../../../Themes/Fonts';

export default EStyleSheet.create({
	...GeneralBaseStyles,
	registerBackground: {
		flex: 1,
		resizeMode: "cover",
	},
	trackingTitle: {
		marginVertical: 40,
		fontWeight: '900',
		fontSize: 20,
		marginLeft: 'auto',
		marginRight: 'auto',
		color: Colors.$yellow,
		fontFamily: Fonts.$montserratExtraBold,
	},
	trackingsContainer: {
		borderBottomWidth: 0.3,
		borderBottomColor: Colors.$blanco,
		flexDirection: 'row',
		marginBottom: 20,
		width: '85%',
		marginRight: 'auto',
		marginLeft: 'auto',
	},
	trackingImage: {
		width: '100%',
		height: '100%',
		resizeMode: 'cover'
	},
	trackingInformation: {
		width: '73%',
		marginTop: 10,
		marginLeft: 20,
	},
	trackingsGeneralInfo: {
		flexDirection: 'row',
		justifyContent: 'space-between'
	},
	trakingInfos: {
		fontSize: 12,
		color: Colors.$blanco,
		fontFamily: Fonts.$poppinsregular,
	},
	trackingName: {
		color: Colors.$yellow,
		fontWeight: '900',
		textTransform: 'uppercase',
		fontFamily: Fonts.$montserratExtraBold,
	}
});