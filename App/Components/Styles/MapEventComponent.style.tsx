import EStyleSheet from 'react-native-extended-stylesheet';
import { StyleSheet } from 'react-native';
import GeneralBaseStyles from '../../Containers/Screens/Styles/GeneralBase.styles';
import Fonts from '../../Themes/Fonts'
import Colors from '../../Themes/Colors'

export default EStyleSheet.create({
  ...GeneralBaseStyles,
  	container: {
		height: 200,
		width: '90%',
		marginLeft: 'auto',
		marginRight: 'auto',
		marginBottom: 100,
		justifyContent: 'flex-end',
    	alignItems: 'center',
	},
	map: {
		position: 'absolute',
	    top: 0,
	    left: 0,
	    right: 0,
	    bottom: 0,
	},
	notAvailableRoute: {
		fontFamily: Fonts.$montserratExtraBold,
		color: '$darkgray',
		fontSize: 14,
		width: '80%',
		marginLeft:'auto',
		marginRight:'auto',
		marginBottom:20,
	}
});
