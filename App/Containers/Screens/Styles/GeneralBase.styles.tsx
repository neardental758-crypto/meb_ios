import { Platform } from 'react-native';
import Colors from '../../../Themes/Colors'
import { horizontalScale, moderateScale, verticalScale } from '../../../Themes/Metrics';

export default {
	modalsContainer: {
		backgroundColor: Colors.$blanco,
		borderRadius: 10,
		padding: 20,
		paddingTop: moderateScale(45),
		width: '90%',
		marginLeft: 'auto',
		marginRight: 'auto',
	},
	modalsContainerAward: {
		backgroundColor: Colors.$gray,
		borderRadius: 10,
		padding: 0,
		width: '90%',
		marginLeft: 'auto',
		marginRight: 'auto',
	},
	modalsContainerConfirm: {
		backgroundColor: Colors.$gray,
		borderRadius: 10,
		padding: 20,
		paddingTop: moderateScale(45),
		width: '90%',
		marginLeft: 'auto',
		marginRight: 'auto',
	},
	createClubTitleContainer: {
		marginTop: 90,
		marginLeft: 'auto',
		marginRight: 'auto',
	},
	createTitleContainer: {
		marginTop: 20,
		width: '90%',
		marginLeft: 'auto',
		marginRight: 'auto',
	},
	createClubForm: {
		marginTop: 20,
		paddingBottom: 5,
		width: '90%',
		marginLeft: 'auto',
		marginRight: 'auto',
		borderTopLeftRadius: 20,
		borderTopRightRadius: 20,
		backgroundColor: '$blanco',
		shadowColor: "$texto",
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
		elevation: 5,
	},
	editUserForm: {
		marginTop: 30,
		marginBottom: 80,
		width: '90%',
		marginLeft: 'auto',
		marginRight: 'auto',
		borderTopLeftRadius: 20,
		borderTopRightRadius: 20,
		backgroundColor: '$blanco',
		shadowColor: "$texto",
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
		elevation: 5,
	},
	createItemForm: {
		marginTop: 100,
		width: '90%',
		marginLeft: 'auto',
		marginRight: 'auto',
		borderTopLeftRadius: 20,
		borderTopRightRadius: 20,
		backgroundColor: '$blanco',
		shadowColor: "$texto",
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
		elevation: 5,
	},
	createInputCont: {
		borderBottomColor: Colors.$linesGray,
		borderBottomWidth: 1,
		width: '90%',
		marginLeft: 'auto',
		marginRight: 'auto',
		position: 'relative',
	},
	iconInputInfo: {
		position: 'absolute',
		right: 0,
		top: 20,
	},
	createInputCont2: {
		position: 'relative',
		width: '90%',
		marginLeft: 'auto',
		marginRight: 'auto',
	},
	createClubInput: {
		paddingBottom: 15,
		marginTop: 15,
		width: '90%',
		marginLeft: 'auto',
		marginRight: 'auto',
	},
	createItemInput: {
		borderBottomColor: Colors.$linesGray,
		borderBottomWidth: 1,
		paddingBottom: 15,
		marginTop: 15,
		width: '90%',
		marginLeft: 'auto',
		marginRight: 'auto',
	},
	changeHourButton: {
		marginRight: 'auto',
		marginLeft: 'auto',
	},
	fromToRow: {
		flexDirection: 'row',
		width: '90%',
		marginLeft: 'auto',
		marginRight: 'auto',
		marginBottom: 10,
	},
	createShortInput: {
		width: 'moderateScale(45)%',
		paddingBottom: 15,
		marginTop: 15,
	},


	overlay: {
		backgroundColor: "rgba(0,0,0,0.5)",
		borderRadius: 10,
		zIndex: 5,
	},

	textInput: {
		marginTop: 5,
		marginBottom: 30,
		padding: 5,
		borderBottomColor: '$darkgray',
		color: '$blanco',
		borderBottomWidth: 1,
	},
	labelInput: {
		color: '$blanco',
		fontWeight: '700'
	},
	submitButtonText: {
		color: '$blanco',
		fontWeight: '900',
		fontSize: 14,
	},
	centeredItems: {
		alignItems: 'center',
	},
	centeredMargins: {
		marginRight: 'auto',
		marginLeft: 'auto',
	},

	loginCont: {
		marginTop: 10,
		marginBottom: 10,
		marginLeft: '10%',
		marginRight: '10%',
	},
	loginTitle: {
		fontSize: 20,
		
		margin: 10,
	},
	loginButtons: {
		flexDirection: 'row',
	},
	registerTitleContainer: {
		marginBottom: 40,
		marginTop: 50,
	},
	createTitle: {
		color: '$blanco',
		fontSize: moderateScale(45),
		fontWeight: '900',
		lineHeight: moderateScale(45),
	},
	accountTitle: {
		color: '$yellow',
		fontSize: moderateScale(45),
		fontWeight: '900',
		lineHeight: moderateScale(45),
	},
	registerButtonCont: {
		marginTop: 70,
		marginBottom: 40,
		height: 40,
		width: 200,
		marginRight: 'auto',
		marginLeft: 'auto',
	},
};