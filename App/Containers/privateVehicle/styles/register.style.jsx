import Fonts from '../../../Themes/Fonts';
import Colors from '../../../Themes/Colors';

export default {
    subtitle:{
        fontFamily: Fonts.$sizeSubtitle, 
        fontSize: 22, 
        textAlign: 'center', 
        color: 'black', 
        marginBottom: 10,
        marginTop: 10,
    },
    divInput: {
        width: 300,
        borderRadius: 30,
        marginBottom: 10,
    },
    formularioVP:{
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    input:{
        width: '100%',
        height: 'auto',
        fontSize: 18,
        fontFamily: Fonts.$poppinsregular,
        justifyContent: 'center',
        textAlign: 'start',
        paddingLeft: 30,
        borderWidth: 3,
        borderColor: Colors.$blanco,
        borderRadius: 30,
        backgroundColor : Colors.$blanco, 
        shadowColor: Colors.$texto,
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 4.29,
        shadowRadius: 4.65,
        elevation: 7,       
    },
}