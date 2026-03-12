import { ActivityIndicator, Image, Text, TextInput, TouchableOpacity, View } from 'react-native';
import I18n, { setLocale } from '../Utils/language.utils';

import { Alert } from 'react-native';
import { ButtonComponent } from '../Components/ButtonComponent';
import Colors from '../Themes/Colors';
import Fonts from '../Themes/Fonts';
import Images from '../Themes/Images';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import React from 'react';
import { connect } from 'react-redux';
import styles from './Styles/ModalConfirmDelete.style';
import { validateEmailPassword } from '../actions/actions';
import { navigationLogin } from '../actions/actions';
import { deleteAccount } from '../actions/settingsAction';

interface CustomButtonSelectProps {
    onClosePress?: () => void;
    showModalConfirmDelete: boolean;
}

class ModalConfirmDelete extends React.Component<CustomButtonSelectProps,
    any> {

    constructor(props: CustomButtonSelectProps) {
        super(props);
        this.state = {
            email: '',
        };
    }

    handleCloseButtonPress = () => {
        const { onClosePress } = this.props;
        if (onClosePress) {
            onClosePress();
        }
    }

    goLoggin = () => {
        this.props.navigationLogin();
    }

    deleteAccount = () => {
        this.props.deleteAccount();
        const { deleteAccount } = this.props;
    };


    render() {
        let { showModalConfirmDelete } = this.props;
        return (
            <View style={styles.modalForgotContainer}>
                <TouchableOpacity
                    style={styles.closeButtonForgot}
                    onPress={() => { this.handleCloseButtonPress() }}>
                    <Image style={[styles.closeForgotIcon, { height: 50, width: 50 }]} source={Images.close} />
                </TouchableOpacity>
                <KeyboardAwareScrollView enableOnAndroid extraScrollHeight={-100}>
                    <Image style={[styles.centeredMargins, { height: 30, width: 30, resizeMode: "contain" }]} source={Images.grayPadlock} />
                    <Text style={styles.forgotTitle}>¿Está seguro de que desea eliminar esta cuenta?</Text>
                    <View>
                        <View style={[styles.forgotButton, { borderColor: '#acd576' }]}>
                            <ButtonComponent color="#878787" fontSize={14} backgroundColor={'trasnparent'} fontFamily={Fonts.$montserratSemiBold} onTouch={async () => {
                                 this.deleteAccount()
                                 }} text="Eliminar"></ButtonComponent>
                        </View>
                        <View style={[styles.forgotButton, { borderColor: '#acd576' }]}>
                            <ButtonComponent color="#878787" fontSize={14} backgroundColor={'trasnparent'} fontFamily={Fonts.$montserratSemiBold} onTouch={() => {this.handleCloseButtonPress() }} text="Cancelar"></ButtonComponent>
                        </View>
                    </View>
                </KeyboardAwareScrollView>
            </View>
        )

    }
}


function mapStateToProps(state) {
    return {
        dataOthers: state.othersReducer,
        loading: state.othersReducer.isFetching,
        emailSend: state.othersReducer.emailSend,
        error: state.othersReducer.error,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        navigationLogin: () => dispatch(navigationLogin()),
        deleteAccount: ()=> dispatch(deleteAccount()),
        validateEmailPassword: (emailForgot) => dispatch(validateEmailPassword(emailForgot)),
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(ModalConfirmDelete);