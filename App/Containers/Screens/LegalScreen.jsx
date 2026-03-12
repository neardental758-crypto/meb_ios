import React from 'react';
import { View, Text, SafeAreaView } from 'react-native';
import { Content } from 'native-base';
import styles from './Styles/LegalScreen.style';
import { connect } from 'react-redux';
import Images from '../../Themes/Images';
import Colors from '../../Themes/Colors';
import Fonts from '../../Themes/Fonts';
import HeaderComponent from '../../Components/HeaderComponent';
import I18n from '../../Utils/language.utils';

function LegalScreen(props){
    const goBack = () => {
        props.navigation.goBack();
    }
        return (
            <>
                <SafeAreaView style={{ flex: 1 }}>
                    <HeaderComponent iconLeft={Images.goBackRed} backgroundColor="white" pressLeft={() => { goBack() }} isBlack={true} title={I18n('Legal_Screen')}></HeaderComponent>
                    <Content style={{ backgroundColor: "white" }}>
                        {
                            //CARD WHITE
                        }
                        <View style={{ flex: 1, marginHorizontal: '10%', marginTop: 20, borderTopLeftRadius: 20, borderTopRightRadius: 20, paddingHorizontal: 10 }}>
                            <View style={styles.p}>
                                <Text style={{ fontFamily: Fonts.$montserratExtraBold, color: Colors.$textogray, fontSize: 25, fontWeight: '800' }}>¿Sed ut perspiciatis?</Text>
                                <Text style={{ fontFamily: Fonts.$poppinsregular, color: Colors.$textogray, fontSize: 12 }}>Unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto</Text>
                            </View>
                            <View style={styles.p}>
                                <Text style={{ fontFamily: Fonts.$montserratExtraBold, color: Colors.$textogray, fontSize: 25, fontWeight: '800' }}>beatae vitae dicta sunt explicabo.Nemo enim ipsam</Text>
                                <Text style={{ fontFamily: Fonts.$poppinsregular, color: Colors.$textogray, fontSize: 12 }}>Voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur mag</Text>
                            </View>
                            <View style={styles.p}>
                                <Text style={{ fontFamily: Fonts.$montserratExtraBold, color: Colors.$textogray, fontSize: 25, fontWeight: '800' }}>eos qui ratione voluptatem sequi nesciunt.</Text>
                                <Text style={{ fontFamily: Fonts.$poppinsregular, color: Colors.$textogray, fontSize: 12 }}>Neque quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur.Ut enim ad minima veniam, quis nostrum exercitationem ullam.Beatae vitae dicta sunt explicabo.</Text>
                            </View>
                            <View style={[styles.p, { marginBottom: 40 }]}>
                                <Text style={{ fontFamily: Fonts.$montserratExtraBold, color: Colors.$textogray, fontSize: 25, fontWeight: '800' }}>Nemo enim ipsam</Text>
                            </View>
                        </View>
                    </Content>
                </SafeAreaView>
            </>
        );
}

function mapStateToProps(state) {
    return {
        dataUser: state.userReducer
    }
}

export default connect(
    mapStateToProps,
)(LegalScreen);
