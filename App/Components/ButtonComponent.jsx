import {  Image,  Text,  TouchableOpacity } from 'react-native';
import Fonts from '../Themes/Fonts';
import React, { useState } from 'react';
import { horizontalScale, moderateScale, verticalScale } from '../Themes/Metrics';

function ButtonComponent (props){
  const [state, setState] = useState({
      borderWidth:props.borderWidth,
      color: props.color,
      backgroundColor: props.backgroundColor,
      fontSize: props.fontSize,
      imagen: props.image
    });
    const { text, onTouch } = props;
    return (
      <>
      {!!props.image
      ?
      <TouchableOpacity onPress={() => { onTouch() }} style={{ flex: 1,flexDirection:'row', borderRadius: 25, justifyContent: "center", backgroundColor: state.backgroundColor, borderWidth: 2, borderColor: 'rgb(164,164,164)', alignItems:'center'}}>
      {!!props.image && <Image source={props.image} style={{height:25,width:25}}/>}
      <Text style={{ fontFamily: props.fontFamily ? Fonts.$montserratExtraBold : Fonts.$poppinsregular, fontSize: moderateScale(state.fontSize), paddingTop: 'auto', paddingBottom: 'auto', color: state.color }}>{text}</Text>
      </TouchableOpacity>
      :
      <TouchableOpacity onPress={() => { onTouch() }} style={{ flex: 1, borderRadius: 25, justifyContent: "center", backgroundColor: state.backgroundColor, borderWidth: 2, borderColor: 'rgba(164,164,164, 0.0)', padding : moderateScale(state.fontSize)}}>
      <Text style={{ fontFamily: props.fontFamily ? Fonts.$montserratExtraBold : Fonts.$poppinsregular, fontSize: moderateScale(state.fontSize-5), paddingTop: 'auto', paddingBottom: 'auto', color: state.color}}>{text}</Text>
      </TouchableOpacity>
      }
      </>
    )
  }
  export { ButtonComponent };
