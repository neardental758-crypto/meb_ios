import EStyleSheet from 'react-native-extended-stylesheet';
import GeneralBaseStyles from './GeneralBase.styles';
import Colors from '../../../Themes/Colors'
export default {
	...GeneralBaseStyles,
	container:{
		flex:1
    },
	settingBackground: {
		flex: 1,
	},
    p:{
        flex:1,
        marginTop:20
    },
    modalForgotContainer: {
		backgroundColor:Colors.$gray,
		height: 300,
		position: 'relative',
		width: '100%',
	},
    overlay: {
    	backgroundColor: "$overlayTransparent",
    	borderRadius: 10,
    	zIndex: 5,
  	},
	createItemInput:{
		borderBottomColor: '$lightgray',
		borderBottomWidth: 1,
		paddingBottom: 15,
		marginTop: 15,
	  width: '90%',
	  marginLeft: 'auto',
	  marginRight: 'auto',
  },
	forgotTitle: {
		fontSize: 25,
		textAlign: 'center',
		fontWeight: '900',
		color: '$textogray',
		marginTop: 20,
		marginBottom: 18,
	},
	forgotText: {
		fontSize: 11,
		textAlign: 'center',
	},
	forgotText2: {
		fontSize: 11,
		textAlign: 'center',
		marginLeft: 30,
		marginRight: 20,
	},
	inputForgotCont: {
		marginTop: 30,
		borderRadius: 15,
		height: 30,
		borderWidth: 2,
		borderColor: '$darkgray',
		position: 'relative',
		flexDirection: 'row',
	},
	forgotInput: {
		color: '$darkgray',
		paddingLeft: 15,
		width: '80%'
	},
	imageInput: {
		marginLeft: 15,
		marginTop: 7,
	},
	forgotButton: {
		height: 30,
		width: 120,
		marginTop: 30,
		marginLeft: 'auto',
		marginRight: 'auto',
	},
	closeButtonForgot: {
		position: 'absolute',
		right: -10,
		top: -30,
	},
	modalsContainer:{
		backgroundColor: Colors.$gray,
		borderRadius: 10,
		padding: 20,
		paddingTop: 45,
		width: '90%',
		marginLeft: 'auto',
		marginRight: 'auto',
	},
}