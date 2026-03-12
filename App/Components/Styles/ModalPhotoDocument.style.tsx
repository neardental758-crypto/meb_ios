import EStyleSheet from 'react-native-extended-stylesheet';
import GeneralBaseStyles from '../../Containers/Screens/Styles/GeneralBase.styles';
import {Platform} from 'react-native';
import Fonts from '../../Themes/Fonts';
import { horizontalScale, moderateScale, verticalScale } from '../../Themes/Metrics';

export default EStyleSheet.create({
  ...GeneralBaseStyles,
  modalForgotContainer:{
  	height: verticalScale(300),
  	position: 'relative',
    width: '100%',
	backgroundColor: 'blue'
  },
  forgotTitle:{
  	fontSize: moderateScale(28),
  	textAlign: 'center',
  	marginTop: moderateScale(20),
	marginBottom: moderateScale(18),
	fontFamily: Fonts.$montserratExtraBold
  },
  forgotText:{
  	fontSize: moderateScale(11),
  	textAlign: 'center',
  },
  forgotText2:{
  	fontSize: moderateScale(11),
  	textAlign: 'center',
  	marginLeft: moderateScale(30),
	  marginRight: moderateScale(20),
	  fontFamily: Fonts.$poppinsregular
  },
  inputForgotCont:{
  	marginTop: 30,
  	borderRadius: 20,
  	height: 40,
  	borderWidth: 2,
  	borderColor: '$darkgray',
  	position: 'relative',
  	flexDirection: 'row',
  },
  forgotInput:{
  	color: '$darkgray',
  	paddingLeft: 15,
  	width: '80%'
  },
  imageInput:{
  	marginLeft: 15,
  	marginTop: 11,
  },
  forgotButton:{
  	height: verticalScale(40),
  	width: horizontalScale(200),
	marginBottom: verticalScale(40),
  	marginLeft: 'auto',
  	marginRight: 'auto',
    flexDirection:'row',
  },
  closeButtonForgot:{
  	position: 'absolute',
  	right: 10,
  	top: 10,
  }
});