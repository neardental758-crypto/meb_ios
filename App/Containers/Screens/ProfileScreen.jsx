import React, { useEffect, useState } from 'react';
import { Image, StatusBar, View, Text, TouchableOpacity, ScrollView, ActivityIndicator, SafeAreaView, Platform } from 'react-native';
import Colors from '../../Themes/Colors';
import Fonts from '../../Themes/Fonts';
import Images from '../../Themes/Images';
import { ButtonComponent } from '../../Components/ButtonComponent';
import { connect } from 'react-redux';
import { PhoneTokenService } from '../../Services/PhoneToken.service';
import HeaderComponent from '../../Components/HeaderComponent';
import { getItem } from '../../Services/storage.service';
import { getUserLogged, getNotifications } from '../../actions/actions';
import { Grayscale } from 'react-native-color-matrix-image-filters';
import * as RootNavigation from '../../RootNavigation';
import { useDispatch } from 'react-redux';

function ProfileScreen (props){

  const dispatch = useDispatch();
  const [state , setState ] = useState({
      user: {},
      languageSt: '',
      unreadNotis: 0,
    })
    useEffect( ()=> {
      getUser();
      getNotificationsCount();
      //props.navigation.addListener("didFocus", async () => {
      /*RootNavigation.navigate.addListener('focus', () => {
        var language = await getItem('language');
  
        //setLocale(language);
        setState({ ...state , languageSt: language });
        // user has navigated to this screen
        setTimeout(() => {
          getNotificationsCount();
        }, 1000);
      });
      */
      //props.navigation.addListener("didBlur", () => {
        // user has navigated away from this screen
      //});
      PhoneTokenService.updatePhoneToken(true);
      setState({ ...state , birthday: new Date() });
      setTimeout(() => {
        StatusBar.setBarStyle('light-content');
        if (Platform.OS == 'android')
          StatusBar.setBackgroundColor('#333333');
      }, 1000);

    });
  /**
 * GET  USER DATABASE
 */
  const getUser = () => {
    //props.getUserLogged();
    dispatch(getUserLogged());
  }

  const getNotificationsCount = () => {
    //props.getNotifications();
    dispatch(getNotifications());
    if (props.notifications && props.notifications.length > 0) {
      let notisCount = 0;
      props.notifications.forEach((noti) => {
        if (noti.state == 'unread') {
          notisCount = notisCount + 1;
          setState({ ...state , unreadNotis: notisCount });
        }
      });
    }
  }
    if (props.loading) {
      return (
        <SafeAreaView style={[{ flex: 1 }, { backgroundColor: Colors.$texto, color: 'white' }]}>
          <HeaderComponent backgroundColor="transparent" iconLeft={Images.syncRed} iconRight={Images.settingsRed} pressLeft={() => { props.navigation.navigate('PickDeviceScreen') }} pressRight={() => { props.navigation.navigate('ConfigurationScreen') }} title={'PERFIL'}></HeaderComponent>
          <ActivityIndicator style={{ alignSelf: 'center', marginTop: 100 }} size="large" color={Colors.$red} />
        </SafeAreaView>
      )
    } else {
      return (
        <>
          <SafeAreaView style={[{ flex: 1 }, { backgroundColor: Colors.$texto, color: 'white' }]}>
            <HeaderComponent backgroundColor="transparent" iconLeft={Images.syncRed} iconRight={Images.settingsRed} pressLeft={() => { props.navigation.navigate('PickDeviceScreen') }} pressRight={() => { props.navigation.navigate('ConfigurationScreen') }} title={'PERFIL'}></HeaderComponent>
            <ScrollView style={{ flex: 1 }}>
              {
                //CONTAINER
              }
              <Grayscale style={{ flex: 1, position: 'absolute', top: 0, width: '100%', height: 400 }}>
                <Image source={props.dataUserInfo.photo ? { uri: props.dataUserInfo.photo } : Images.club} style={{ resizeMode: 'cover', flex: 1, position: 'absolute', top: 0, width: '100%', height: "100%", justifyContent: "center" }} blurRadius={1} />
              </Grayscale>
              <Image source={Images.profileBlackFilter} style={{ resizeMode: 'contain', flex: 1, position: 'absolute', top: -50, width: "100%", height: "100%", justifyContent: "center" }} />
              <View style={{ flex: 1 }}>
                <View style={{ flex: 1, marginTop: 200, marginBottom: 8, marginHorizontal: '10%' }}>
                  <Image source={Images.diamondRed} style={{ height: 30, width: 30 }} />
                </View>
                <View style={{ marginHorizontal: '10%', flexDirection: "row", alignItems: 'flex-end', flexWrap: 'wrap' }}>
                  <Text numberOfLines={4} style={{ maxWidth: '80%', fontFamily: Fonts.$montserratExtraBold, color: "white", fontSize: 40, lineHeight: 44 }}>{props.dataUserInfo.name ? props.dataUserInfo.name.toUpperCase() : ''}</Text>
                  <TouchableOpacity style={{ marginLeft: 20, marginBottom: 10 }} onPress={() => props.navigation.navigate('EditProfileScreen')}>
                    <Image source={Images.editRed} style={{ resizeMode: "contain", height: 30, width: 30 }} />
                  </TouchableOpacity>
                </View>
                {
                  //CARD
                }
                <View style={{ flex: 1, marginBottom: 50 }}>
                  <View style={{ flex: 1, marginHorizontal: '10%' }}>
                    <View style={{ flex: 1, flexDirection: "row", alignItems: 'flex-end' }}>
                      <View style={{ flex: 1, marginBottom: 15, paddingRight: 15 }}>
                        <Text style={{ fontFamily: Fonts.$poppinsregular, color: "white", fontSize: 12 }}>{props.dataUserInfo.age}</Text>
                        <Text style={{ fontFamily: Fonts.$poppinsregular, color: "white", fontSize: 12 }}>{props.dataUserInfo.description}</Text>
                      </View>
                      <TouchableOpacity style={{ flex: 0.2, }} onPress={() => { props.navigation.navigate('NotificationScreen') }}>
                        <View style={{ height: 35, backgroundColor: Colors.$red, borderTopLeftRadius: 6, borderTopRightRadius: 10 }}>
                          <View style={{ height: 20, width: 20, backgroundColor: "white", position: "absolute", top: -7, right: -7, borderRadius: 50 }}>
                            <Text style={{ color: Colors.$red, alignSelf: "center", marginTop: 'auto', marginLeft: 'auto', marginBottom: 'auto', marginRight: 'auto', fontSize: 10, fontFamily: Fonts.$poppinsregular }}>{state.unreadNotis}</Text>
                          </View>
                          <Image source={Images.bellWhite} style={{ resizeMode: "contain", alignSelf: "center", marginVertical: 5, height: 25, width: 25 }} />
                        </View>
                      </TouchableOpacity>
                      <View style={{ flex: 0.1 }}></View>
                    </View>
                    {
                      //CARD WHITE
                    }
                    <View style={{ flex: 1, backgroundColor: "white", flexDirection: "column", borderTopLeftRadius: 20, borderTopRightRadius: 20 }}>
                      <View style={{ flex: 1, flexDirection: "row", marginVertical: 10, marginTop: 20, marginHorizontal: 20, paddingHorizontal: 10, borderBottomWidth: 1, paddingBottom: 10, borderBottomColor: Colors.$linesGray }}>
                        <Text style={{ fontFamily: Fonts.$montserratExtraBold, color: Colors.$textogray, fontSize: 20, fontWeight: Platform.OS == 'ios' ? '800' : 'bold', flex: 1 }}>{'Tipo de Actividad'}</Text>
                        <Image style={{ height: 30, width: 30, resizeMode: "contain", alignSelf: "center" }} source={props.dataUserInfo.activity == 'bike' ? Images.bicycleRed : Images.redRoadC}></Image>
                      </View>
                      <View style={{ flex: 1, flexDirection: "column", marginVertical: 5, marginHorizontal: 20, paddingHorizontal: 10, borderBottomWidth: 1, paddingBottom: 10, borderBottomColor: Colors.$linesGray }}>
                        <Text style={{ fontFamily: Fonts.$montserratExtraBold, color: Colors.$textogray, fontSize: 20, fontWeight: Platform.OS == 'ios' ? '800' : 'bold', flex: 1 }}>{'Categoría'}</Text>
                        <Text style={{ fontFamily: Fonts.$poppinsregular, color: Colors.$textogray, fontSize: 12, flex: 0.4 }}>{props.dataUserInfo.category}</Text>
                      </View>
                      <View style={{ flex: 1, flexDirection: "column", marginVertical: 5, marginHorizontal: 20, paddingHorizontal: 10, borderBottomWidth: 1, paddingBottom: 10, borderBottomColor: Colors.$linesGray }}>
                        <Text style={{ fontFamily: Fonts.$montserratExtraBold, color: Colors.$textogray, fontSize: 20, fontWeight: Platform.OS == 'ios' ? '800' : 'bold', flex: 1 }}>{'Habilidades'}</Text>
                        <Text style={{ fontFamily: Fonts.$poppinsregular, color: Colors.$textogray, fontSize: 12, flex: 1 }}>{props.dataUserInfo.skills}</Text>
                      </View>
                      <View style={{ flex: 1, flexDirection: "column", marginVertical: 5, marginHorizontal: 20, paddingHorizontal: 10, borderBottomWidth: 1, paddingBottom: 10, borderBottomColor: Colors.$linesGray }}>
                        <Text style={{ fontFamily: Fonts.$montserratExtraBold, color: Colors.$textogray, fontSize: 20, fontWeight: Platform.OS == 'ios' ? '800' : 'bold', flex: 1 }}>{'Logros'}</Text>
                        <Text style={{ fontFamily: Fonts.$poppinsregular, color: Colors.$textogray, fontSize: 12, flex: 1 }}>{props.dataUserInfo.achievement}</Text>
                      </View>
                      <View style={{ flex: 1, flexDirection: "row", marginVertical: 5, marginBottom: 15, marginHorizontal: 20, paddingBottom: 10, paddingHorizontal: 10, borderBottomColor: Colors.$linesGray }}>
                        <View style={{ flex: 1 }}>
                          <Text style={{ fontFamily: Fonts.$montserratExtraBold, color: Colors.$textogray, fontSize: 20, fontWeight: Platform.OS == 'ios' ? '800' : 'bold', flex: 1 }}>Club</Text>
                          <Text style={{ fontFamily: Fonts.$poppinsregular, color: Colors.$textogray, fontSize: 12, flex: 1 }}>{props.club ? props.club.name : "Aun no haces parte de un club"}</Text>
                        </View>
                        <View style={{ marginVertical: 10, height: 25, width: 110 }}>
                          <ButtonComponent color={Colors.$textogray} fontFamily={Fonts.$montserratExtraBold} backgroundColor={Colors.$yellow} text={'Ver clubes'} onTouch={() => { props.navigation.navigate('ClubsScreen') }}></ButtonComponent>
                        </View>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
              {
                //END-CONTAINER
              }
            </ScrollView>

          </SafeAreaView>
        </>
      );
    }
  }

function mapStateToProps(state) {
  return {
    dataUser: state.userReducer.dataUser,
    dataUserInfo: state.userReducer.dataUserInfo,
    club: state.userReducer.club,
    notifications: state.userReducer.notifications,
    loading: state.userReducer.isFetching,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    //getUserLogged: () => dispatch(getUserLogged()),
    //getNotifications: () => dispatch(getNotifications()),
  }
}

export default connect(mapStateToProps)(ProfileScreen);
