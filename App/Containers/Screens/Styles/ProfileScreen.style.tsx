import EStyleSheet from 'react-native-extended-stylesheet';
import GeneralBaseStyles from './GeneralBase.styles';

export default {
	...GeneralBaseStyles,
	iconInputUser:{
		position: 'absolute',
		left: '20%',
		top: 10,
	},
	iconInputDescription:{
		position: 'absolute',
		left: '30%',
		top: 10,
	},
	registerBackground:{
		flex: 1,
	    resizeMode: "cover",
	},
};