import EStyleSheet from 'react-native-extended-stylesheet';
import GeneralBaseStyles from './GeneralBase.styles';
import Colors from '../../../Themes/Colors';
import Fonts from '../../../Themes/Fonts';
export default {
	...GeneralBaseStyles,
	tutorialBackground: {
		flex: 1,
		resizeMode: "contain",
		width: '100%',
		height: '100%',
	},
	tutorialPerson: {
		marginLeft: 'auto',
		marginRight: 'auto',
		resizeMode: "contain",
		width: '100%',
	},
	bold: {
		fontFamily: Fonts.$montserratExtraBold,
		fontWeight: '900',
	},
	tutorialTexts: {
		position: 'absolute',
		top: '74%',
		marginLeft: '10%',
		marginRight: '10%',
	},
	tutorialTitle: {
		textAlign: 'center',
		fontSize: 35,
		lineHeight: 30,
		fontWeight: '800',
		color: Colors.$primario,
		fontFamily: Fonts.$montserratExtraBold,
	},
	tutorialSub: {
		textAlign: 'center',
		fontSize: 12,
		lineHeight: 18,
		marginTop: 5,
		fontWeight: '400',
		color: Colors.$blanco,
		fontFamily: Fonts.$montserratLight,
	},
	paginationStyle: {

	},
	skipButtons: {
	},
	skipButton: {
		fontWeight: '400',
		fontSize: 22,
		color: Colors.$blanco,
		fontFamily: Fonts.$poppinsregular,
		backgroundColor: Colors.$primario,
		padding: 16,
		borderRadius: 8,
		marginRight: 5
	},
	dotStyle: {
		backgroundColor: Colors.$overlayTransparent,
		borderColor: Colors.$yellow,
		marginHorizontal: 12,
		borderRadius: 6.5,
		borderWidth: 1,
		width: 13,
		height: 13
	},
	activeDotStyle: {
		backgroundColor: Colors.$yellow,
		borderRadius: 6.5,
		marginHorizontal: 12,
		width: 13,
		height: 13
	}
}