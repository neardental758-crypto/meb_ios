import { LayoutAnimation, Platform, StyleSheet, Text, TouchableOpacity, UIManager, View } from "react-native";
import React, {useState} from 'react';
import Fonts from '../Themes/Fonts';
import Icon from "react-native-vector-icons/MaterialIcons";
import Colors from '../Themes/Colors';
import Imagen from '../Themes/Images';
import { horizontalScale, moderateScale, verticalScale } from '../Themes/Metrics';

function Accordian (props){

    const [state, setState] = useState({ 
          data: props.data,
          expanded : false,
        });
        if (Platform.OS === 'android') {
            UIManager.setLayoutAnimationEnabledExperimental(true);
        }  
        const toggleExpand = ()=>{
            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
            setState({...state , expanded : !state.expanded})
          }
      return (
       <View>
            <TouchableOpacity style={styles.row} onPress={()=>toggleExpand()}>
                <Icon style={{paddingRight: 10}} name={Imagen.questionRed} size={30} color={Colors.$adicional} />
                <Text style={[styles.title, styles.font]}>{props.title}</Text>
                <Icon name={Imagen.iconPickerYellow} size={30} color={Colors.$blanco} />
            </TouchableOpacity>
            <View style={styles.parentHr}/>
            {
                state.expanded &&
                <View style={styles.child}>
                    <Text style={{fontSize : 16, fontFamily: Fonts.$poppinsregular, color:Colors.$texto}}>{props.data}</Text>    
                </View>
                
            }
            <View style={{height: 2, width: '120%', backgroundColor: Colors.$primario, alignSelf: 'center', borderRadius: 10}} />
       </View>
    )
  }

export { Accordian };

const styles = StyleSheet.create({
    title:{
        width: '80%',
        marginTop:10,
        marginBottom:10,
        fontSize: moderateScale(18),
        fontFamily:Fonts.$poppinsregular,
        color: '#a4a4a4',
    },
    font:{color:Colors.$texto},
    row:{
        flexDirection: 'row',
        justifyContent:'space-between',
        height:'auto',
        paddingLeft:0,
        alignItems:'center',
        backgroundColor: 'transparent',
    },
    parentHr:{
        height:1,
        color: '#ffff',
        width:'100%'
    },
    child:{
        backgroundColor: 'transparent',
        padding:16,
    }
});
