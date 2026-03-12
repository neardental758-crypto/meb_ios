import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet, Image } from 'react-native';
import Images from '../Themes/Images';
import { horizontalScale, moderateScale, verticalScale } from '../Themes/Metrics';

export function BotonBlanco(props){

  const { onPress, text } = props;
  return (
    <TouchableOpacity
      style = {{
        ...stiles.button,
        backgroundColor: '#eeeeee80',
      }}
      onPress={ onPress }
    >
      <Text
        style = {{
          ...stiles.buttonText,
          color: '#000000',
        }}
      >
        { text }
      </Text>
    </TouchableOpacity>
  ) 
}

export function BotonVerde(props){

  const { onPress, text } = props;

  return (
    <TouchableOpacity
      style = {{
        ...stiles.button,
        backgroundColor: '#a347ee',
      }}
      onPress={ onPress }
    >
      <Text
        style = {{
          ...stiles.buttonText,
          color: '#ffffff',
        }}
      >
         { text }
      </Text>
    </TouchableOpacity>
  ) 
}

export function BotonGris(props){

  const { onPress, text } = props;

  return (
    <TouchableOpacity
      style = {{
        ...stiles.button,
        backgroundColor: '#157c79',
      }}
      onPress={ onPress }
    >
      <Text
        style = {{
          ...stiles.buttonText,
          color: '#fff',
        }}
      >
         { text }
      </Text>
    </TouchableOpacity>
  ) 
}

export function BotonMujer(props){

  const { onPress } = props;

  return (
    <TouchableOpacity
      style = {{
        ...stiles.buttonM,
        backgroundColor: ''
      }}
      onPress={ onPress }
    >
    <View>
      <Image source={Images.generoM} style={{ width: moderateScale(130), height: moderateScale(130), alignSelf: 'center', marginBottom: moderateScale(30) }} />
    </View>
    </TouchableOpacity>
  ) 
}

export function BotonMujerGris(props){

  const { onPress } = props;

  return (
    <TouchableOpacity
      style = {{
        ...stiles.buttonM,
        backgroundColor: ''
      }}
      onPress={ onPress }
    >
    <View>
      <Image source={Images.generoMgris} style={{ width: moderateScale(130), height: moderateScale(130), alignSelf: 'center', marginBottom: moderateScale(30) }} />
    </View>
    </TouchableOpacity>
  ) 
}

export function BotonHombre(props){

  const { onPress } = props;

  return (
    <TouchableOpacity
      style = {{
        ...stiles.buttonM,
        backgroundColor: ''
      }}
      onPress={ onPress }
    >
    <View>
        <Image source={Images.generoH} style={{ width: horizontalScale(130), height: verticalScale(130), alignSelf: 'center', marginBottom: moderateScale(30) }} />
    </View>
    </TouchableOpacity>
  ) 
}

export function BotonHombreGris(props){

  const { onPress } = props;

  return (
    <TouchableOpacity
      style = {{
        ...stiles.buttonM,
        backgroundColor: ''
      }}
      onPress={ onPress }
    >
    <View>
        <Image source={Images.generoHgris} style={{ width: horizontalScale(130), height: verticalScale(130), alignSelf: 'center', marginBottom: moderateScale(30) }} />
    </View>
    </TouchableOpacity>
  ) 
}

const stiles = StyleSheet.create({
  button:{
    width: '70%',
    paddingVertical: moderateScale(15),
    borderRadius: moderateScale(12),
    marginBottom: moderateScale(10),
    zIndex: 10,
  },
  buttonText:{
    fontSize: moderateScale(20),
  },
  buttonM:{
    justifyContent: 'center',
    width: horizontalScale(180),
    height: verticalScale(180),
    borderRadius: moderateScale(90),
    marginBottom: moderateScale(10),
    zIndex: 10,
    overflow: 'hidden',
  },
})


