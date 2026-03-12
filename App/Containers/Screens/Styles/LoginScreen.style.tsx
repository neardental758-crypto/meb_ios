import EStyleSheet from 'react-native-extended-stylesheet';
import GeneralBaseStyles from './GeneralBase.styles';

export default {
	...GeneralBaseStyles,
	registerBackground: {
		flex: 1,
		resizeMode: "cover",
	},

	loginCont: {
	    marginTop: 10,
	    marginBottom: 10,
	    marginLeft: '10%',
	    marginRight: '10%',
	},
};