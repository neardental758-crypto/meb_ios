import React from 'react';
import { Image, Text, TouchableOpacity } from 'react-native';
import { Header, Left, Right, Body } from 'native-base';
import Fonts from '../Themes/Fonts';

export default function HeaderComponent (props){

  const pressRight = () => {
    const { pressRight } = props;
    pressRight();
  }
    const { iconRight, title, backgroundColor} = props;
    return (
      <Header style={{ backgroundColor: backgroundColor, shadowColor: 'red', shadowOpacity: 0, borderBottomWidth: 0 }}>
        <Left style={{flex:0.5}}>
        </Left>
        <Body style={{alignItems: 'center',flex:1}}>
          {
              <Text numberOfLines={2}  style={{flexShrink: 1, fontFamily:Fonts.$montserratExtraBold,  fontSize: 16, fontWeight: '800', color: "black" }}>{title}</Text>
          }
        </Body>
        <Right style={{flex:0.5}}>
          <TouchableOpacity onPress={() => { pressRight() }} style={{ heigth:300}}>
            <Image  style={{resizeMode:"contain",width:30,height:'100%',marginHorizontal:30}} source={iconRight} />
          </TouchableOpacity>
        </Right>
      </Header>
    );
  }
