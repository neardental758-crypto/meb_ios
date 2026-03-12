import EStyleSheet from 'react-native-extended-stylesheet';
import GeneralBaseStyles from './GeneralBase.styles';
import Colors from '../../../Themes/Colors';
import Fonts from '../../../Themes/Fonts';
export default {
  ...GeneralBaseStyles,
  settingBackground: {
    flex: 1,
  },
  labelInput_2: {
		color: 'black',
	},
  container: {
    flex: 1
  },
  p: {
    flex: 1,
    marginTop: 20
  },
  inputBorder: {
    marginTop: 2,
    paddingLeft: 20,
    width: '85%',
    height:170,
    color: Colors.$texto,
    fontFamily: Fonts.$poppinsregular,
    fontSize: 20,
  },
  textInfo: {
    marginTop: 20,
    paddingHorizontal: 20,
    fontSize: 20,
    fontFamily: Fonts.$poppinsregular,
    fontWeight: 'normal',
    color: Colors.$texto
  },
  inputWithIcon: {
    margin: 20,
    borderColor: Colors.$primario,
    borderWidth: 2,
    borderRadius: 15,
    marginBottom: 10,
  },
  updateButton: {
    alignSelf: 'center',
    height: 40,
    width: 170,
    marginTop: 20,
    marginBottom: 10,
  },
  submit: {
    alignSelf: 'center',
    height: 40,
    width: 220,
    marginTop: 20,
    marginBottom: 10,
  }
}