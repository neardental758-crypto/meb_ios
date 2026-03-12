import EStyleSheet from 'react-native-extended-stylesheet';
import GeneralBaseStyles from '../../Containers/Screens/Styles/GeneralBase.styles';

export default EStyleSheet.create({
	...GeneralBaseStyles,
	navbararea: {
		backgroundColor: '$gray',
		flex: 0,
		zIndex: 2,
	},
	navbar: {
		textAlign: 'center',
		padding: 10,
		height: 100,
		fontWeight: '900',
		color: '$blanco',
		fontSize: 20,
		paddingTop: 20,
	},
	goBackHeader: {
		position: 'absolute',
		top: 25,
		marginLeft: 20,
		zIndex: 2,
	},
	navbarContainer:{
		position: 'relative',
	},
	headerImage:{
		height: 100,
		width: 100,
	},
	headerImageContainer:{
		height: 100,
		width: 100,
		borderRadius: 50,
		overflow: 'hidden',
		marginBottom: -50,
		left: '50%',
		transform: [{ translateX: -50 }],
	},
	submitButtonHead:{
		position: 'absolute',
		top: 25,
		right: 0,
		marginRight: 20,
		zIndex: 2,
	}
});
