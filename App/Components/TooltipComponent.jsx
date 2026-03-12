import React, { useState } from 'react';
import { Image, Text, TouchableOpacity } from 'react-native';
import Images from '../Themes/Images';

function TooltipComponent (props){
    const [showing, setsShowing] = useState(false);
    const change = () => {
        setsShowing(!showing)
    }
        const { text , left } = props;
        return (
            <>
            {showing  &&
            <TouchableOpacity  onPress={()=>{change()}} style={{borderWidth:1,width:150,height:60,marginBottom: 20,backgroundColor:"white", bottom:10,left:left, position:"absolute",zIndex:2,padding:5,borderRadius:10}}>
             <Text style={{zIndex:1}}>{text}</Text>
            </TouchableOpacity>
            }
            <TouchableOpacity style={{ height: 30 }} onPress={()=>{change()}}>
                <Image source={Images.questionRed} style={{ marginLeft: 7, marginBottom: 5, width: 20, height: 20 }} />
            </TouchableOpacity>
            </>
        )
}
export { TooltipComponent };
