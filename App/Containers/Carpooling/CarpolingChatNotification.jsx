import React, { useState, useEffect, useContext, useCallback, useLayoutEffect, useRef } from 'react';
import { 
    View, 
    Text, 
    Dimensions, 
} from 'react-native';
import {
  collection,
  addDoc,
} from 'firebase/firestore';
import { connect } from 'react-redux';
import { GiftedChat, Bubble, Send } from 'react-native-gifted-chat';
import { database } from '../../Services/firebase';
import Colors from '../../Themes/Colors';
import { AuthContext } from '../../AuthContext';

export function CarpoolingChatNotification(props) {

    const { idChat, updateMessageCount, chatNotifications, setChatNotifications, messages: propMessages } = props;
    const { infoUser } = useContext(AuthContext);
    const [messages, setMessages] = useState(propMessages); // Usa los mensajes recibidos como prop
  
    // Actualiza los mensajes locales cuando cambian los mensajes recibidos como prop
    useEffect(() => {
      setMessages(propMessages);
    }, [propMessages]);
  
    // Desactivar notificación cuando el chat está abierto
    useEffect(() => {
      if (chatNotifications[idChat]) {
        setChatNotifications((prevState) => ({
          ...prevState,
          [idChat]: false,
        }));
      }
    }, [idChat, chatNotifications]);
  
    // Función para enviar mensajes
    const onSend = useCallback(
      (newMessages = []) => {
        setMessages((previousMessages) => GiftedChat.append(previousMessages, newMessages));
        const { _id, createdAt, text, user } = newMessages[0];
  
        addDoc(collection(database, 'chats'), {
          _id,
          createdAt,
          text,
          chat: idChat,
          user,
        });
  
        // Actualiza el contador de mensajes en el componente padre
        updateMessageCount(idChat, messages.length + 1);
      },
      [idChat, messages.length, updateMessageCount]
    );
  
    return (
      <GiftedChat
        messages={messages}
        onSend={(newMessages) => onSend(newMessages)}
        user={{
          _id: infoUser.DataUser.email,
          email: infoUser.DataUser.email,
          nombre: infoUser.DataUser.name,
          apellido: infoUser.DataUser.firstLastname,
        }}
        renderMessage={(props) => (
          <View key={props.currentMessage._id}>
            <Text
              style={
                infoUser.DataUser.email === props.currentMessage.user.email
                  ? { textAlign: 'right', color: Colors.$texto50, paddingRight: 10 }
                  : { textAlign: 'left', color: Colors.$texto50, paddingLeft: 10 }
              }
            >
              {props.currentMessage.user.nombre} {props.currentMessage.user.apellido}
            </Text>
            <Bubble
              {...props}
              wrapperStyle={{
                right: {
                  backgroundColor: Colors.$primario,
                  marginBottom: 5,
                  marginRight: 5,
                },
                left: {
                  backgroundColor: Colors.$secundario,
                  marginBottom: 5,
                  marginLeft: 5,
                },
              }}
            />
          </View>
        )}
        textInputProps={{
          style: {
            backgroundColor: Colors.$blanco,
            width: Dimensions.get('window').width * 0.75,
            color: Colors.$texto,
            marginTop: 1,
            fontSize: 18,
            paddingLeft: 10,
          },
        }}
        renderSend={(props) => (
          <Send {...props}>
            <View
              style={{
                width: Dimensions.get('window').width * 0.2,
                height: 50,
                marginRight: 1,
                textAlign: 'center',
                justifyContent: 'center',
                backgroundColor: Colors.$adicional,
                borderRadius: 10,
              }}
            >
              <Text
                style={{
                  backgroundColor: Colors.$adicional,
                  color: Colors.$blanco,
                  textAlign: 'center',
                }}
              >
                Enviar
              </Text>
            </View>
          </Send>
        )}
        onPress={() =>
          setChatNotifications((prevState) => ({
            ...prevState,
            [idChat]: false,
          }))
        }
      />
    );
  }

function mapStateToProps(state) {
    return {
        dataCarpooling: state.reducerCarpooling
    };
}

export default connect(mapStateToProps)(CarpoolingChatNotification);
