import EStyleSheet from 'react-native-extended-stylesheet';
import GeneralBaseStyles from '../../Containers/Screens/Styles/GeneralBase.styles';
import Fonts from '../../Themes/Fonts'


export default EStyleSheet.create({
	...GeneralBaseStyles,
	eventsHeaderArea: {
		backgroundColor: '$gray',
		flex: 0,
		zIndex: 2,
	},
	eventsHeader: {
		textAlign: 'center',
		padding: 10,
		height: 100,
		fontWeight: '900',
		color: '$blanco',
		fontSize: 20,
		paddingTop: 20,
		fontFamily: Fonts.$montserratExtraBold,
	},
	addEventHeader: {
		position: 'absolute',
		top: 25,
		marginLeft: 20,
		zIndex: 2,
	},
	eventHeaderContainerContainer: {
		position: 'relative',
	},
	eventsTopBar: {
		flexDirection: 'row',
		marginLeft: '6%',
		marginRight: '6%',
		marginTop: 20,
		marginBottom: 20,
	},
	eventsTitle: {
		fontSize: 16,
		marginLeft: 'auto',
		marginRight: 'auto',
		color: '$yellow',
		fontFamily: Fonts.$montserratExtraBold,
	},
	searchEventInput: {
		width: '80%',
		backgroundColor: '$blanco',
		color: '$texto',
		height: 25,
		padding: 0
	},
	searchInputContainer: {
		marginLeft: 'auto',
		marginRight: 'auto',
		flexDirection: 'row',
		width: '88%',
		height: 25,
		backgroundColor: '$blanco',
		borderRadius: 13,
		marginBottom: 30,
		marginTop: 15,
	},
	searchRedIcon: {
		marginLeft: 10,
		marginRight: 10,
		marginTop: 2,
		width: 20,
		height: 20,
		resizeMode: 'contain'
	},
	eventMenu: {
		position: 'absolute',
		width: '100%',
		height: '125%',
		zIndex: 40,
		top: 50,
	},
	menuBg: {
		position: 'absolute',
		marginLeft: 'auto',
		marginRight: 'auto',
		width: '100%',
		height: '100%',
	},
	eventsButtons: {
		flexDirection: 'row',
		marginLeft: '12%',
		marginRight: '12%',
		justifyContent: 'space-between',
		marginTop: 'auto',
		marginBottom: 'auto',
	},
	eventsButtonsTitles: {
		fontWeight: '800',
		fontSize: 23,
		lineHeight: 23,
		marginLeft: 'auto',
		marginRight: 'auto',
		color: '$blanco',
		fontFamily: Fonts.$montserratExtraBold,
	},
	buttonsIcons: {
		marginLeft: 'auto',
		marginRight: 'auto',
		height: 40,
		width: 40,
		marginBottom: 10,
	}
});
