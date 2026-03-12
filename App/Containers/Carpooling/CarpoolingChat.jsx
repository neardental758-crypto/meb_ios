import React from 'react';
import { useState, useEffect, useContext, useCallback, useLayoutEffect } from 'react';
import { 
    View, 
    Text, 
    ScrollView, 
    TextInput,
    StyleSheet, 
    Pressable,
    Image,
    Dimensions, 
} from 'react-native';
import {
  collection,
  addDoc,
  orderBy,
  query,
  onSnapshot,
  where
} from 'firebase/firestore';
import { connect, useDispatch } from 'react-redux';
import * as RootNavigation from '../../RootNavigation';
import { AuthContext } from '../../AuthContext';
import { GiftedChat, Bubble, Send } from 'react-native-gifted-chat';
import { database } from '../../Services/firebase';
import Colors from '../../Themes/Colors';
import Images from '../../Themes/Images';
import Fonts from '../../Themes/Fonts';

export function CarpoolingChat (props) {
    const { idChat } = props;
    const dispatch = useDispatch();
    const { isLogin, infoUser } = useContext( AuthContext );
    const [ messages, setMessages] = useState([]);
    const currentUserEmail = infoUser.DataUser.email;
    //const chatID = props.dataCarpooling.tripSelect;
    const chatID = idChat;

    //console.log('props en charID', props.dataCarpooling);
    // console.log('esto es lo que viene en charID', chatID);
    // console.log('esto es lo que viene en infouser nombre', infoUser);
    // console.log('esto es lo que viene en infouser nombre', infoUser.DataUser.name);
    // console.log('esto es lo que viene en infouser apellido', infoUser.DataUser.firstLastname);
    
    useLayoutEffect(() => {
      const collectionRef = collection(database, 'chats');
      //const q = query(collectionRef, where("user", "==", "aaa@gmail.com"));
      //const q = query(collectionRef, where('chat', '==', 'chat1'));
      //const q = query(collectionRef, orderBy('createdAt', 'desc'));
      const q = query(
        collectionRef,
        where('chat', '==', chatID), 
        orderBy('createdAt', 'desc')
      );

      const unsubscribe = onSnapshot(q, querySnapshot => {
        // console.log('querySnapshot unsusbscribe');
        setMessages(
            querySnapshot.docs.map(doc => ({
              _id: doc.data()._id,
              createdAt: doc.data().createdAt.toDate(),
              chat: doc.data().chat,
              text: doc.data().text,
              user: {
                _id: doc.data().user._id, // Asegúrate de que este campo exista
                email: doc.data().user.email, // Asume que hay un campo 'name' en el documento del usuario
                nombre: doc.data().user.nombre, 
                apellido: doc.data().user.apellido
              },
            }))
          );
        });
        return unsubscribe;
    }, [currentUserEmail]);

    const onSend = useCallback((messages = []) => {
      setMessages(previousMessages =>
        GiftedChat.append(previousMessages, messages)
      );
      const { _id, createdAt, text, chat, user } = messages[0];    
      addDoc(collection(database, 'chats'), {
        _id,
        createdAt,
        text,
        chat: chatID,
        user
      });
    }, []);

    return ( 
        <GiftedChat
            messages={messages}
            onSend={messages => onSend(messages)}
            user={{
              _id: infoUser.DataUser.email,
              email: infoUser.DataUser.email,
              nombre: infoUser.DataUser.name,
              apellido: infoUser.DataUser.firstLastname
            }}
            renderMessage={(props) => (
              // Puedes personalizar la apariencia de cada mensaje aquí
              <View key={props.currentMessage._id}>
                <Text style={
                  infoUser.DataUser.email === props.currentMessage.user.email ?
                  {
                    textAlign: 'right',
                    color: Colors.$texto50,
                    paddingRight: 10  
                  }
                  :
                  {
                    textAlign: 'left',
                    color: Colors.$texto50,
                    paddingLeft: 10
                  }
                }>
                  {props.currentMessage.user.nombre} {props.currentMessage.user.apellido}
                </Text>
              <Bubble                
                {...props}                
                wrapperStyle={{
                  right: {
                    backgroundColor: Colors.$primario, // Color de fondo de los mensajes enviados por el usuario
                    marginBottom: 5,
                    marginRight: 5
                  },
                  left: {
                    backgroundColor: Colors.$secundario, // Color de fondo de los mensajes recibidos
                    marginBottom: 5,
                    marginLeft: 5
                  },
                }}
              />
              </View>
              
            )}
            textInputProps={{
              style: {
                backgroundColor: Colors.$blanco,
                width: Dimensions.get("window").width*.75,
                color: Colors.$texto, // Cambia el color del texto del cuadro de entrada
                marginTop: 1,
                fontSize: 18,
                paddingLeft: 10
              },
            }}
            renderSend={(props) => (
              // Puedes personalizar la apariencia del botón "Send" aquí
              <Send {...props}>
                <View style={{ 
                  width: Dimensions.get("window").width*.2,
                  height: 50,
                  marginRight: 1, 
                  textAlign: "center",
                  justifyContent: "center",
                  backgroundColor:  Colors.$adicional,
                  borderRadius: 10,
                  borderRadius: 20
                }}>
                  <Text style={{ 
                    backgroundColor: Colors.$adicional, 
                    color: Colors.$blanco, 
                    textAlign: "center",
                  }}>Enviar</Text>
                </View>
              </Send>
              
            )}
        />
    )
}

function mapStateToProps(state){
    return {
        dataCarpooling: state.reducerCarpooling
    }
}

export default connect(mapStateToProps)(CarpoolingChat);

