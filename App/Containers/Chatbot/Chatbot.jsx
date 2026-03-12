import React, { useState, useEffect, useContext } from 'react';
import {
    Text,
    View,
    Pressable,
    StyleSheet,
    Image,
    Dimensions,
    ActivityIndicator,
    LogBox,
    KeyboardAvoidingView,
    Platform,
    Linking
} from 'react-native';
import { v4 as uuidv4 } from 'uuid';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
// Suprimir warning conocido de react-native-gifted-chat con React 19
LogBox.ignoreLogs([
    'A props object containing a "key" prop is being spread into JSX',
]);
import { GiftedChat, Bubble, Send, InputToolbar } from 'react-native-gifted-chat';
import Fonts from '../../Themes/Fonts';
import Colors from '../../Themes/Colors';
import Images from '../../Themes/Images';
import * as RootNavigation from '../../RootNavigation';
import { AuthContext } from '../../AuthContext';

function Chatbot(props) {
    const { infoUser, logout, token } = useContext(AuthContext);
    const [messages, setMessages] = useState([]);
    const [isTyping, setIsTyping] = useState(false);
    const [context, setContext] = useState({}); // Memoria para el flujo (waiting_for, tipo_solicitud, etc.)
    const goBack = () => {
        if (props.goBack) {
            props.goBack();
        } else {
            RootNavigation.navigate('Home');
        }
    }

    // URL del webhook de n8n
    //const n8nChatbotUrl = 'http://192.168.1.7:5678/webhook-test/ride-main'; //n8n local
    const n8nChatbotUrl = 'https://n8n.srv1205652.hstgr.cloud/webhook/ride-main'; //n8n VPS

    useEffect(() => {
        if (infoUser) {
            console.log('infoUser', infoUser.DataUser.idNumber);
        }
    }, [infoUser]);

    useEffect(() => {
        setMessages([
            {
                _id: 1,
                text: '¡Hola! Soy tu asistente virtual. ¿En qué puedo ayudarte hoy?',
                createdAt: new Date(),
                user: {
                    _id: 2,
                    name: 'Chatbot',
                    avatar: 'https://cdn-icons-png.flaticon.com/512/4712/4712035.png',
                },
            },
        ]);
    }, []);

    // Generar un ID de sesión único al montar el componente
    const [sessionId] = useState(() => Math.random().toString(36).substring(7) + new Date().getTime());

    const onSend = React.useCallback((messages = []) => {
        setMessages(previousMessages => GiftedChat.append(previousMessages, messages));
        const userMessage = messages[0].text;
        sendMessageToN8n(userMessage);
    }, [sessionId, context]); // Agregamos context aquí

    const onQuickReply = (replies) => {
        const reply = replies[0];
        const val = (reply.value || '').trim();

        // Si el valor es un enlace (WhatsApp, URL o Teléfono), intentamos abrirlo directamente
        if (val.startsWith('https://') || val.startsWith('http://') || val.startsWith('wa.me/') || val.startsWith('tel:')) {
            const url = val.startsWith('wa.me/') ? `https://${val}` : val;

            Linking.openURL(url).catch(err => console.error("Error al abrir el enlace:", err));

            // Mostramos la acción en el chat como feedback visual, pero NO llamamos a sendMessageToN8n
            const feedbackMessage = {
                _id: Math.round(Math.random() * 1000000),
                text: `📲 ${reply.title}`,
                createdAt: new Date(),
                user: { _id: 1 },
            };
            setMessages(previousMessages => GiftedChat.append(previousMessages, [feedbackMessage]));
        } else {
            // Si es una respuesta normal, seguimos con el flujo habitual de n8n
            onSend([{
                _id: Math.round(Math.random() * 1000000),
                text: val,
                createdAt: new Date(),
                user: { _id: 1 },
            }]);
        }
    };

    const sendMessageToN8n = async (text) => {
        setIsTyping(true);
        try {
            const response = await fetch(n8nChatbotUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: text,
                    sessionId: sessionId,
                    idNumber: infoUser?.DataUser?.idNumber,
                    idUser: infoUser?.DataUser?.id,
                    token: token,
                    hashedPassword: '$2y$10$lRUwQIcwEJAsvYKssbRUguqyQQ.3w7O8auyDNiF2qpV30CNT3P.kW',
                    id_soporte: uuidv4(),
                    ...context, // Enviamos toda la memoria del flujo de vuelta
                }),
            });

            const textResponse = await response.text();
            console.log('Raw response from n8n:', textResponse);

            let botText;
            let botQuickReplies;
            try {
                const data = JSON.parse(textResponse);
                let firstData = data;

                // 1. Extraer primer nivel (array o objeto)
                if (Array.isArray(data) && data.length > 0) {
                    firstData = data[0];
                }

                // 2. Extraer propiedades básicas
                botText = firstData.response || firstData.text || firstData.output || firstData.message || firstData.data;
                botQuickReplies = firstData.quickReplies;

                // Actualizar contexto con metadatos del servidor
                const newContext = {};
                if (firstData.waiting_for) newContext.waiting_for = firstData.waiting_for;
                if (firstData.tipo_solicitud) newContext.tipo_solicitud = firstData.tipo_solicitud;

                // Si el mensaje es "Menú Principal" o similar, limpiamos el contexto
                if (text.toLowerCase().includes('principal') || text.toLowerCase().includes('menu')) {
                    setContext({});
                } else {
                    setContext(prev => ({ ...prev, ...newContext }));
                }

                // 3. DESEMPAQUETADO PROFUNDO: Si botText es un string que parece JSON, intentamos parsearlo
                // (Ocurre cuando n8n devuelve {"response": "{\"response\": \"...\", \"quickReplies\": ...}"})
                if (typeof botText === 'string' && (botText.startsWith('{') || botText.startsWith('['))) {
                    try {
                        const innerData = JSON.parse(botText);
                        const finalData = Array.isArray(innerData) ? innerData[0] : innerData;

                        botText = finalData.response || finalData.text || finalData.output || finalData.message || finalData.data || botText;
                        if (finalData.quickReplies) botQuickReplies = finalData.quickReplies;
                    } catch (e) {
                        // Si no es JSON válido, nos quedamos con el string original
                    }
                }
            } catch (e) {
                // Si falla el JSON.parse inicial, es texto plano
                botText = textResponse;
            }

            // Fallback si no encontramos el texto
            if (!botText || typeof botText === 'object') {
                botText = "No se pudo interpretar la respuesta del servidor.";
            }

            const botMessage = {
                _id: Math.round(Math.random() * 1000000),
                text: botText,
                createdAt: new Date(),
                user: {
                    _id: 2,
                    name: 'Chatbot',
                    avatar: 'https://cdn-icons-png.flaticon.com/512/4712/4712035.png',
                },
                quickReplies: botQuickReplies,
            };

            setMessages(previousMessages => GiftedChat.append(previousMessages, [botMessage]));
        } catch (error) {
            console.error('Error enviando mensaje a n8n:', error);
            const errorMessage = {
                _id: Math.round(Math.random() * 1000000),
                text: 'Lo siento, hubo un error al conectar con el servidor. Por favor intenta de nuevo.',
                createdAt: new Date(),
                user: {
                    _id: 2,
                    name: 'Chatbot',
                },
            };
            setMessages(previousMessages => GiftedChat.append(previousMessages, [errorMessage]));
        } finally {
            setIsTyping(false);
        }
    };

    const renderBubble = (props) => {
        return (
            <Bubble
                {...props}
                wrapperStyle={{
                    right: {
                        backgroundColor: Colors.$primario,
                        borderRadius: 15,
                        padding: 5,
                        elevation: 2,
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 1 },
                        shadowOpacity: 0.2,
                        shadowRadius: 1,
                    },
                    left: {
                        backgroundColor: Colors.$blanco,
                        borderRadius: 15,
                        padding: 5,
                        elevation: 2,
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 1 },
                        shadowOpacity: 0.1,
                        shadowRadius: 1,
                    },
                }}
                textStyle={{
                    right: {
                        color: Colors.$blanco,
                        fontFamily: Fonts.$poppinsregular,
                        fontSize: 16,
                    },
                    left: {
                        color: '#333',
                        fontFamily: Fonts.$poppinsregular,
                        fontSize: 16,
                    },
                }}
            />
        );
    };

    const renderSend = (props) => {
        return (
            <Send {...props} containerStyle={styles.sendContainer}>
                <View style={styles.sendButton}>
                    <Text style={styles.sendText}>Enviar</Text>
                </View>
            </Send>
        );
    };

    const renderInputToolbar = (props) => {
        return (
            <InputToolbar
                {...props}
                containerStyle={styles.inputToolbar}
                primaryStyle={{ alignItems: 'center' }}
            />
        );
    };

    const renderFooter = () => {
        if (isTyping) {
            return (
                <View style={{ height: 40, paddingHorizontal: 15, justifyContent: 'center' }}>
                    {/* El isTyping de GiftedChat ya muestra los puntos, 
                        este footer da el espacio necesario para que no se corten */}
                </View>
            );
        }
        return null;
    };

    const insets = useSafeAreaInsets();
    const headerHeight = (Platform.OS === 'ios' ? 60 : 40) + 20 + insets.top;

    return (
        <SafeAreaView style={styles.contenedor}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                style={{ flex: 1 }}
                keyboardVerticalOffset={Platform.OS === 'ios' ? headerHeight : 0}
            >
                <View style={[styles.cajaCabeza, { paddingTop: Platform.OS === 'ios' ? 10 : 10 }]}>
                    <Pressable
                        onPress={() => { goBack() }}
                        style={styles.btnAtrasFixed}>
                        <View style={styles.circleIcon}>
                            <Image source={Images.home} style={[styles.iconMenu]} tintColor={Colors.$blanco} />
                        </View>
                    </Pressable>
                    <View style={styles.headerInfo}>
                        <Text style={styles.textTitle}>Asistente Virtual</Text>
                        <View style={styles.statusContainer}>
                            <View style={styles.statusDot} />
                            <Text style={styles.statusText}>En línea</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.chatContainer}>
                    <GiftedChat
                        messages={messages}
                        onSend={messages => onSend(messages)}
                        user={{
                            _id: 1,
                        }}
                        isTyping={isTyping}
                        placeholder="Escribe un mensaje..."
                        locale="es"
                        renderAvatarOnTop={true}
                        alwaysShowSend
                        renderBubble={renderBubble}
                        renderSend={renderSend}
                        renderInputToolbar={renderInputToolbar}
                        renderFooter={renderFooter}
                        scrollToBottom
                        renderUsernameOnMessage={false}
                        infiniteScroll
                        bottomOffset={Platform.OS === 'ios' ? insets.bottom : 0}
                        onQuickReply={onQuickReply}
                        quickReplyStyle={styles.quickReply}
                        quickReplyTextStyle={styles.quickReplyText}
                        quickReplyContainerStyle={styles.quickReplyContainer}
                        isKeyboardInternallyHandled={false}
                    />
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    contenedor: {
        flex: 1,
        backgroundColor: Colors.$blanco,
    },
    cajaCabeza: {
        backgroundColor: Colors.$primario,
        justifyContent: 'center',
        alignItems: 'center',
        width: Dimensions.get('window').width,
        paddingBottom: 20,
        flexDirection: 'row',
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    headerInfo: {
        alignItems: 'center',
    },
    textTitle: {
        fontSize: 16,
        fontFamily: Fonts.$poppinsregular,
        color: Colors.$blanco,
        textAlign: 'center',
    },
    statusContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 2,
    },
    statusDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#4ade80',
        marginRight: 6,
    },
    statusText: {
        fontSize: 16,
        color: Colors.$blanco,
        fontFamily: Fonts.$poppinsregular,
        opacity: 1,
    },
    btnAtrasFixed: {
        position: 'absolute',
        top: 10,
        left: 15,
        zIndex: 10,
    },
    circleIcon: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(255,255,255,0.2)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconMenu: {
        width: 24,
        height: 24,
    },
    chatContainer: {
        flex: 1,
        backgroundColor: '#F8F9FA',
    },
    sendContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        marginRight: 10,
    },
    sendButton: {
        backgroundColor: Colors.$primario,
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 5,
    },
    sendText: {
        color: Colors.$blanco,
        fontFamily: Fonts.$poppinsregular,
        fontSize: 16,
    },
    inputToolbar: {
        backgroundColor: Colors.$blanco,
        borderTopWidth: 1,
        borderTopColor: '#EEE',
        paddingHorizontal: 5,
        paddingVertical: 2,
    },
    quickReply: {
        backgroundColor: Colors.$blanco,
        borderWidth: 1,
        borderColor: Colors.$primario,
        borderRadius: 20,
        paddingHorizontal: 12,
        paddingVertical: 4,
        marginTop: 5,
        marginBottom: 15, // Aumentado para mayor visibilidad
        minHeight: 35,
    },
    quickReplyText: {
        color: Colors.$texto,
        fontFamily: Fonts.$poppinsregular,
        fontSize: 16,
        textAlign: 'center',
    },
    quickReplyContainer: {
        paddingBottom: 5,
        justifyContent: 'flex-start',
    },
});

export default Chatbot;
