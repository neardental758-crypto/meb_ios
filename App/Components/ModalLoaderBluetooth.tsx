import { ActivityIndicator, Image, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Alert } from 'react-native';
import { ButtonComponent } from '../Components/ButtonComponent';
import Colors from '../Themes/Colors';
import Fonts from '../Themes/Fonts';
import Images from '../Themes/Images';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import React from 'react';
import { connect } from 'react-redux';
import styles from './Styles/ModalLoaderBluetooth.style';
import { validateEmailPassword } from '../actions/actions';
import { navigationLogin } from '../actions/actions';
import { deleteAccount } from '../actions/settingsAction';
import { changeStatusLock } from '../actions/tripActions';
import LottieView from 'lottie-react-native';

interface CustomButtonSelectProps {
    onClosePress?: () => void;
    showModalLoaderBluetooth: boolean;
}

class ModalLoaderBluetooth extends React.Component<CustomButtonSelectProps,
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

    render() {
        let { showModalLoaderBluetooth } = this.props;
        return (
            <View style={styles.modalForgotContainer}>
                {/* <TouchableOpacity
                    style={styles.closeButtonForgot}
                    onPress={() => { this.handleCloseButtonPress() }}>
                    <Image style={[styles.closeForgotIcon, { height: 50, width: 50 }]} source={Images.close} />
                </TouchableOpacity> */}
                <KeyboardAwareScrollView enableOnAndroid extraScrollHeight={-100}>
                    <View style={styles.animationContainer}>
                        <LottieView
                            source={require('../Resources/Lotties/lock.json')}
                            autoPlay
                            loop
                            style={styles.lottieAnimation}
                        />
                    </View>
                    <Text style={styles.forgotTitle}>Abriendo candado por bluetooth, por favor espere... </Text>
                </KeyboardAwareScrollView>
            </View>
        )

    }
}


function mapStateToProps(state: any) {
    return {
        dataOthers: state.othersReducer,
        loading: state.othersReducer.isFetching,
        emailSend: state.othersReducer.emailSend,
        error: state.othersReducer.error,
    }
}

function mapDispatchToProps(dispatch: any) {
    return {
        navigationLogin: () => dispatch(navigationLogin()),
        deleteAccount: () => dispatch(deleteAccount()),
        validateEmailPassword: (emailForgot: any) => dispatch(validateEmailPassword(emailForgot)),
        changeStatusLock: () => dispatch(changeStatusLock()),
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(ModalLoaderBluetooth);