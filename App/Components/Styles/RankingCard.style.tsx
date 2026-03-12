import EStyleSheet from 'react-native-extended-stylesheet';
import GeneralBaseStyles from '../../Containers/Screens/Styles/GeneralBase.styles';
import Colors from '../../Themes/Colors';
import Fonts from '../../Themes/Fonts';


export default EStyleSheet.create({
	...GeneralBaseStyles,
	registerBackground: {
		flex: 1,
		resizeMode: "cover",
	},
	userBanner: {
		flex: 1,
		width: '100%',
		flexDirection: 'row',
	},
	userBanerTit: {
		flexDirection: 'row',
	},
	challengeInfoCont: {
		marginLeft: '6%',
		marginBottom: 15,
		flex: 0.55,
		marginTop: 'auto',
		zIndex: 6
	},
	challengeNameLabel: {
		color: Colors.$yellow,
		fontFamily: Fonts.$montserratExtraBold,
		fontSize: 12,
	},
	challengeDateLabel: {
		color: Colors.$blanco,
		fontFamily: Fonts.$montserratMedium,
		fontSize: 12,
	},
	userRankingTitle: {
		fontWeight: '900',
		fontSize: 30,
		color: Colors.$yellow,
		fontFamily: Fonts.$montserratExtraBold,
	},
	rankingUserName: {
		fontWeight: '900',
		fontSize: 30,
		color: Colors.$yellow,
		textTransform: 'uppercase',
		fontFamily: Fonts.$montserratExtraBold,
		lineHeight: 30,
	},
	trackingTitle: {
		marginVertical: 40,
		fontWeight: '900',
		fontSize: 20,
		marginLeft: 'auto',
		marginRight: 'auto',
		color: Colors.$yellow,
	},
	rankingContainer: {
		height: 70,
		flex: 1,
		flexDirection: 'row',
		marginBottom: 20,
		marginRight: '6%',
		marginLeft: '6%'
	},
	trackingImage: {
		height: 70,
		width: 70,
	},
	userImage: {
		height: 180,
		width: 200,
		resizeMode: "cover",
		position: 'absolute',
		zIndex: 1,
	},
	balckBg: {
		height: 180,
		width: '100%',
		position: 'absolute',
		zIndex: 2,
	},
	userInformation: {
		paddingTop: 30,
		height: 180,
		flexDirection: 'column',
		zIndex: 8,
		flex: 0.45,
		marginLeft: 'auto',
		//marginRight: '10%',
	},
	rankingTime: {
		fontSize: 13,
		fontWeight: '800',
		color: Colors.$blanco,
		marginLeft: 'auto',
		marginTop: 35,
		fontFamily: Fonts.$montserratExtraBold,
	},
	rankingUserTime: {
		fontSize: 15,
		fontWeight: '900',
		color: Colors.$blanco,
		marginTop: 14,
		marginLeft: 6,
		fontFamily: Fonts.$montserratExtraBold,
	},
	postition: {
		color: Colors.$yellow,
		fontSize: 40,
		fontFamily: Fonts.$poppinsregular,
		marginRight: 20,
		marginTop: 'auto',
		marginBottom: 'auto',
	},
	rankingInformation: {
		flex: 0.72,
		paddingLeft: 20,
		borderBottomWidth: 1,
		borderBottomColor: Colors.$yellow,
		flexDirection: 'row'
	},
	trackingsGeneralInfo: {
		flexDirection: 'column',
		marginTop: 5,
	},
	rankingInfos: {
		fontSize: 10,
		color: Colors.$blanco,
		fontFamily: Fonts.$poppinsregular,
	},
	rankingName: {
		fontSize: 12,
		color: Colors.$blanco,
		fontFamily: Fonts.$montserratExtraBold,
		fontWeight: '800',
	},
	trackingName: {
		color: Colors.$yellow,
		fontWeight: '900',
		fontSize: 15,
		fontFamily: Fonts.$montserratExtraBold,
	}
});