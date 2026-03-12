import EStyleSheet from 'react-native-extended-stylesheet';
import GeneralBaseStyles from '../../Containers/Screens/Styles/GeneralBase.styles';
import Fonts from '../../Themes/Fonts'

export default EStyleSheet.create({
  ...GeneralBaseStyles,
  modalConfirmContainer:{
  	height: 250,
  	position: 'relative',
    width: '100%',
  },
  confirmTitle:{
    fontSize: 28,
    lineHeight: 28,
    textAlign: 'center',
    fontWeight: '900',
    color: '$blanco',
    paddingRight: 30,
    paddingLeft: 30,
  	marginTop: 50,
  	marginBottom: 10,
    fontFamily: Fonts.$poppinsregular,
  },
  confirmButton:{
  	height: 40,
  	width: 140,
  	marginTop: 30,
  	marginLeft: 'auto',
  	marginRight: 'auto',
  },
  closeButtonForgot:{
  	position: 'absolute',
  	right: -10,
  	top: -30,
  }
});
