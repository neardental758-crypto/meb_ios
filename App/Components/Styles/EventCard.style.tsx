import EStyleSheet from 'react-native-extended-stylesheet';
import GeneralBaseStyles from '../../Containers/Screens/Styles/GeneralBase.styles';
import Fonts from '../../Themes/Fonts'


export default EStyleSheet.create({
	...GeneralBaseStyles,
	eventImage: {
		width: '100%',
		height: 75,
		marginBottom: 20,
	},
	eventImageContainer: {
		borderRadius: 6,
		overflow: 'hidden'		
	},
	eventsCardsTitles: {
		fontWeight: '900',
		fontSize: 16,
		color: '$yellow',
		paddingRight: '6%',
		paddingLeft: '6%',
		marginBottom: 15,
		marginTop: 10,
		fontFamily: Fonts.$montserratExtraBold,
	},
	eventsContainer: {
		marginRight: '6%',
		marginLeft: '6%',
		borderBottomWidth: 0.5,
		borderBottomColor: '$blanco',
		paddingBottom: 30,
		marginBottom: 30,
	},
	eventCreatorImg: {
		height: 30,
		width: 30,
	},
	eventName: {
		color: "$yellow",
		fontWeight: '900',
		fontFamily: Fonts.$montserratExtraBold,
	}
});
