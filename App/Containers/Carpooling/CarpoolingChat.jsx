import React from 'react';
import { useState, useContext, useCallback, useLayoutEffect, useRef } from 'react';
import { 
    View, 
    Text, 
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
import { sendGroupNotification } from '../../actions/actionCarpooling';
import Colors from '../../Themes/Colors';
import Images from '../../Themes/Images';
import Fonts from '../../Themes/Fonts';

export function CarpoolingChat (props) {
    const { idChat } = props;
    const dispatch = useDispatch();
    const { isLogin, infoUser } = useContext( AuthContext );
    const [ messages, setMessages] = useState([]);
    const currentUserEmail = infoUser.DataUser.email;
    const chatID = idChat;
    
    // Usar useRef para mantener los miembros del chat sin causar re-renders
    const chatMembersRef = useRef(new Set());
    
    useLayoutEffect(() => {
      const collectionRef = collection(database, 'chats');
      const q = query(
        collectionRef,
        where('chat', '==', chatID), 
        orderBy('createdAt', 'desc')
      );

      const unsubscribe = onSnapshot(q, querySnapshot => {
        setMessages(
            querySnapshot.docs.map(doc => ({
              _id: doc.data()._id,
              createdAt: doc.data().createdAt.toDate(),
              chat: doc.data().chat,
              text: doc.data().text,
              user: {
                _id: doc.data().user._id,
                email: doc.data().user.email,
                nombre: doc.data().user.nombre, 
                apellido: doc.data().user.apellido
              },
            }))
        );
        
        // Actualizar los miembros del chat en el ref (no causa re-render)
        querySnapshot.docs.forEach(doc => {
          const userEmail = doc.data().user.email;
          if (userEmail !== currentUserEmail) {
            chatMembersRef.current.add(userEmail);
          }
        });
        
        console.log('👥 Miembros del chat actualizados:', Array.from(chatMembersRef.current));
      });
      
      return unsubscribe;
    }, [currentUserEmail, chatID]);

    const onSend = useCallback((messages = []) => {
      setMessages(previousMessages =>
        GiftedChat.append(previousMessages, messages)
      );
      
      const { _id, createdAt, text, user } = messages[0];
      
      // Guardar mensaje en Firebase
      addDoc(collection(database, 'chats'), {
        _id,
        createdAt,
        text,
        chat: chatID,
        user
      });

      // Enviar notificaciones a todos los miembros del grupo
      const recipients = Array.from(chatMembersRef.current);
      
      if (recipients.length > 0) {
        const mensaje = `💬 ${user.nombre}: ${text.substring(0, 50)}${text.length > 50 ? '...' : ''}`;
        
        console.log('📤 Enviando notificaciones a:', recipients);
        
        // Dispatch de la acción para notificaciones grupales
        dispatch(sendGroupNotification({
          recipients: recipients,
          message: mensaje,
          chatId: chatID,
          senderEmail: currentUserEmail,
          senderName: `${user.nombre} ${user.apellido}`
        }));
      } else {
        console.log('⚠️ No hay otros miembros en el chat para notificar');
      }
    }, [chatID, currentUserEmail, dispatch, infoUser.DataUser.name, infoUser.DataUser.firstLastname]);

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
            renderMessage={(props) => {
              const { currentMessage, key, ...bubbleProps } = props;
              const isCurrentUser = infoUser.DataUser.email === currentMessage.user.email;
              
              return (
                <View key={key}>
                  <Text style={{
                    textAlign: isCurrentUser ? 'right' : 'left',
                    color: Colors.$texto50,
                    paddingRight: isCurrentUser ? 10 : 0,
                    paddingLeft: isCurrentUser ? 0 : 10
                  }}>
                    {currentMessage.user.nombre} {currentMessage.user.apellido}
                  </Text>
                  <Bubble                
                    currentMessage={currentMessage}
                    {...bubbleProps}                
                    wrapperStyle={{
                      right: {
                        backgroundColor: Colors.$primario,
                        marginBottom: 5,
                        marginRight: 5
                      },
                      left: {
                        backgroundColor: Colors.$secundario,
                        marginBottom: 5,
                        marginLeft: 5
                      },
                    }}
                  />
                </View>
              );
            }}
            textInputProps={{
              style: {
                backgroundColor: Colors.$blanco,
                width: Dimensions.get("window").width*.75,
                color: Colors.$texto,
                marginTop: 1,
                fontSize: 18,
                paddingLeft: 10
              },
            }}
            renderSend={(props) => (
              <Send {...props}>
                <View style={{ 
                  width: Dimensions.get("window").width*.2,
                  height: 50,
                  marginRight: 1, 
                  textAlign: "center",
                  justifyContent: "center",
                  backgroundColor:  Colors.$adicional,
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