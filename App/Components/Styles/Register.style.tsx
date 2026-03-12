import EStyleSheet from 'react-native-extended-stylesheet';
import Colors  from '../../Themes/Colors';
import GeneralBaseStyles from '../../Containers/Screens/Styles/GeneralBase.styles';
import { horizontalScale, moderateScale, verticalScale } from '../../Themes/Metrics';

export default EStyleSheet.create({
	...GeneralBaseStyles,
	labelInput_2: {
			color: Colors.$texto,
			backgroundColor: Colors.$primario,
			width: 200
		},
	inputRegister: {
			paddingLeft: moderateScale(20),
			marginLeft: moderateScale(20),
			marginRight: moderateScale(20),
			paddingVertical:moderateScale(10),
			borderColor: Colors.$primario,
			borderWidth: moderateScale(2),
			borderRadius: moderateScale(25),
			marginBottom: moderateScale(5),
			marginTop: moderateScale(2),
			paddingBottom: moderateScale(10),
			paddingTop: moderateScale(10),
			width: 'auto',
			color: Colors.$texto,
			fontSize:moderateScale(20),
	}
});
