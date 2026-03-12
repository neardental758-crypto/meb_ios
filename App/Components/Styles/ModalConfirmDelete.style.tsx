import EStyleSheet from 'react-native-extended-stylesheet';
import GeneralBaseStyles from '../../Containers/Screens/Styles/GeneralBase.styles';
import {Platform} from 'react-native';
import Fonts from '../../Themes/Fonts';

export default EStyleSheet.create({
  ...GeneralBaseStyles,
  modalForgotContainer:{
  	height: 350,
  	position: 'relative',
    width: '100%',
  },
  forgotTitle:{
  	fontSize: 28,
  	textAlign: 'center',
  	fontWeight: Platform.OS == 'ios'?'900':'bold',
  	color: '#878787',
  	marginTop: 10,
	marginBottom: 18,
	fontFamily: Fonts.$montserratSemiBold
  },
  forgotText:{
  	fontSize: 11,
  	textAlign: 'center',
  },
  forgotText2:{
  	fontSize: 11,
  	textAlign: 'center',
  	marginLeft: 30,
	  marginRight: 20,
	  fontFamily: Fonts.$montserratLight
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
  	height: 40,
  	width: 130,
	marginTop: 25,
	marginBottom: 10,
  	marginLeft: 'auto',
  	marginRight: 'auto'
  },
  closeButtonForgot:{
  	position: 'absolute',
  	right: -10,
  	top: -30,
  }
});