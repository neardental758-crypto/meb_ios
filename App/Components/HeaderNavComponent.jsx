import { Header } from 'native-base';
import { Image, TouchableOpacity, View } from 'react-native';
import Images from '../Themes/Images';
import React from 'react';
import Colors from '../Themes/Colors';
import { horizontalScale, moderateScale, verticalScale } from '../Themes/Metrics';

export default function HeaderNavComponent (props){ 
    const { onTouch } = props;
    const { perfile } = props
    return (
      <Header style={{ backgroundColor: Colors.$primario, flexDirection : 'row', justifyContent : 'space-between', alignItems : 'center', height : verticalScale(90), padding : horizontalScale(10) }}>
        <TouchableOpacity
          onPress={() => { onTouch() }}>
          <Image style={{ tintColor: 'white', width: horizontalScale(50), height: verticalScale(50)}} source={Images.MenuIcon} />
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={1}>
          <Image style={{ width: horizontalScale(140), height: verticalScale(55)}} source={Images.logoHome} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => { perfile() }}>
          <Image style={{ tintColor: 'white', width: horizontalScale(40), height: verticalScale(42)}} source={Images.userIcon} />
        </TouchableOpacity>
      </Header>
    );
  }
