import EStyleSheet from 'react-native-extended-stylesheet';
import GeneralBaseStyles from '../../Containers/Screens/Styles/GeneralBase.styles';
import Fonts from '../../Themes/Fonts';
import Colors from '../../Themes/Colors';

export default EStyleSheet.create({
  ...GeneralBaseStyles,
  modalCreateAwardContainer: {
    height: 540,
    width: '100%',
    flexDirection: 'column',
    alignContent: 'center'
  },
  createAwardTitle: {
    fontSize: 25,
    textAlign: 'center',
    fontWeight: '900',
    color: '$red',
    marginTop: 15,
    marginBottom: 25,
    paddingRight: 30,
    paddingLeft: 30,
    fontFamily: Fonts.$montserratExtraBold,
  },
  createAwardButton: {
    height: 40,
    width: 120,
    marginVertical: 45,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  trophyImage: {
    resizeMode: 'contain',
    height: 50,
    width: 50,
  },
  closeButtonCreateAward: {
    position: 'absolute',
    right: -10,
    top: -30,
  },
  createAwardInput: {
    fontFamily: Fonts.$montserratMedium,
    fontWeight: '600',
    fontSize: 15,
    borderBottomColor: '$lightgray',
    borderBottomWidth: 1,
    paddingBottom: 18,
    marginTop: 18,
    width: '90%',
    marginLeft: 'auto',
    marginRight: 'auto',
    color: '$darkgray',
  },
  adjImage: {
    position: 'absolute',
    marginLeft: 85,
    top: 20,
    height: 20,
    width: 20
  },
  adjImageAndroid: {
    marginLeft: 10
  },
  createAwardInputImage: {
    color: Colors.$darkgray,
    borderBottomColor: '$lightgray',
    fontFamily: Fonts.$montserratMedium,
    fontWeight: '600',
    fontSize: 15,
    borderBottomWidth: 1,
    overflow: 'hidden',
    height: 20,
    paddingBottom: 18,
    marginTop: 18,
    width: '90%',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  createAwardInputImageAndroid: {
    color: Colors.$darkgray,
    fontFamily: Fonts.$montserratMedium,
    fontWeight: '600',
    fontSize: 15,
    height: 20,
  },
  conteinerMargin: {
    color: Colors.$darkgray,
    borderBottomWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    width: '90%',
    marginLeft: 'auto',
    marginRight: 'auto',
    borderBottomColor: '$lightgray',
  }
});
