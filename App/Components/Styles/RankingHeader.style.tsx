import EStyleSheet from 'react-native-extended-stylesheet';
import GeneralBaseStyles from '../../Containers/Screens/Styles/GeneralBase.styles';
import Fonts from '../../Themes/Fonts'
import Colors from '../../Themes/Colors'

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
	},
	addEventHeader: {
		position: 'absolute',
		top: 25,
		marginLeft: 20,
		zIndex: 2,
	},
	eventHeaderContainer: {
		position: 'relative',
	},
	eventsTopBar: {
		flexDirection: 'row',
		marginLeft: '6%',
		marginRight: '6%',
		marginTop: 20,
		marginBottom: 20,
	},
	rankingTabsTopBar: {
		flexDirection: 'row',
		marginLeft: '6%',
		marginRight: '6%',
		marginTop: 20,
		marginBottom: 20,
		fontFamily: Fonts.$montserratExtraBold,
		justifyContent: 'space-between',
		paddingRight: 5,
		paddingLeft: 10,
	},
	rankingTitle: {
		fontWeight: '900',
		fontSize: 16,
		color: '$yellow',
		fontFamily: Fonts.$montserratExtraBold,
	},
	rankingTab: {
		fontWeight: '800',
		fontSize: 14,
		textAlign: "center",
		fontFamily: Fonts.$montserratExtraBold,
	},
	selectedTab: {
		color: '$yellow',
	},
	unselectedTab: {
		color: '$blanco',
	},
	searchEventInput: {
		flex: 1,
		marginRight: 15,
		backgroundColor: '$blanco',
		fontFamily: Fonts.$poppinsregular,
		color: Colors.$placeHolderGray,
		fontSize: 12,
		height: 30,
		padding: 0
	},
	dateInputsCont: {
		flexDirection: 'row',
		marginLeft: '6%',
		marginRight: '6%',
		marginBottom: 20,
		alignItems: 'stretch'
	},
	datesTitle: {
		color: Colors.$yellow,
		fontFamily: Fonts.$poppinsregular,
		fontWeight: '500',
		fontSize: 12,
		marginBottom: 10,
		marginTop: 5,
		marginLeft: '11%',
	},
	datePickers: {
		backgroundColor: Colors.$$overlayTranslucid,
	},
	datePickersLabelConts: {
		color: Colors.$blanco,
	},
	datePickersLabel: {
		color: Colors.$blanco,
		fontFamily: Fonts.$poppinsregular,
		width: 200,
		paddingBottom: 15,
		textAlign: 'center',
		paddingTop: 10,
		borderBottomLeftRadius: 10,
		marginLeft: 'auto',
		marginRight: 'auto',
	},
	dateInput: {
		flex: 1,
		marginHorizontal: 10,
		height: 30,
		borderRadius: 15,
		backgroundColor: Colors.$blanco,
	},
	searchInputContainer: {
		alignItems: 'stretch',
		flex: 1,
		flexDirection: 'row',
		height: 30,
		backgroundColor: '$blanco',
		borderRadius: 15
	},
	groupCircleIcon: {
		height: 30,
		width: 30,
		resizeMode: 'contain'
	},
	searchRedIcon: {
		marginLeft: 10,
		marginRight: 10,
		marginTop: 4,
		width: 21,
		height: 21,
		resizeMode: 'contain'
	},
	fromInput: {
		width: '45%',
		paddingBottom: 15,
		marginTop: 15,
	},
	eventMenu: {
		position: 'absolute',
		width: '100%',
		height: 155,
		zIndex: 40,
		top: 70,
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
		marginLeft: '15%',
		marginRight: '15%',
		justifyContent: 'space-between',
		marginTop: 'auto',
		marginBottom: 'auto',
	},
	eventsButtonsTitles: {
		fontWeight: '800',
		fontSize: 23,
		marginLeft: 'auto',
		marginRight: 'auto',
		color: '$blanco',
	},
	buttonsIcons: {
		marginLeft: 'auto',
		marginRight: 'auto',
	}
});
