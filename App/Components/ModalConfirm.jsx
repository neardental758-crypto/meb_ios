import React from 'react';
import { TouchableOpacity, View, Text, Image } from 'react-native';
import styles from './Styles/ModalConfirm.style';
import { ButtonComponent } from './ButtonComponent';
import Images from '../Themes/Images';
import Colors from '../Themes/Colors';
import I18n from '../Utils/language.utils';


function ModalConfirm(props) {
    const handleCloseButtonPress = () => {
        const { onClosePress } = props;
        if (onClosePress) {
            onClosePress();
        }
    }
    return (
        <View style={styles.modalConfirmContainer}>
            <TouchableOpacity
                style={styles.closeButtonForgot}
                onPress={handleCloseButtonPress}>
                <Image style={[styles.closeForgotIcon,{height: 20, width:20}]} source={Images.close} />
            </TouchableOpacity>
            <Text style={styles.confirmTitle}>
                {I18n('Alert_Verify')}
            </Text>
            <View style={[styles.confirmButton]}>
                <ButtonComponent 
                    color="white" 
                    onTouch={handleCloseButtonPress} 
                    backgroundColor={Colors.$red} 
                    text={I18n('Accept')}>
                </ButtonComponent>
            </View>
        </View>
    );
}
export { ModalConfirm };
