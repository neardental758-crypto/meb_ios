import React, { useState, useEffect } from 'react';
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

function Chatbot_Login(props) {
    const { onClose } = props;
    const [messages, setMessages] = useState([]);
    const [isTyping, setIsTyping] = useState(false);
    const [isWaitingForDocument, setIsWaitingForDocument] = useState(false);
    const [pendingOption, setPendingOption] = useState(null);
    const [visiblePins, setVisiblePins] = useState({}); // { messageId: boolean }

    // URL del webhook de n8n para usuarios no autenticados
    const n8nChatbotUrl = 'https://n8n.srv1205652.hstgr.cloud/webhook/main_login';

    useEffect(() => {
        setMessages([
            {
                _id: 1,
                text: '¡Hola! Bienvenido al soporte de MEB. ¿Cómo puedo ayudarte hoy?',
                createdAt: new Date(),
                user: {
                    _id: 2,
                    name: 'Soporte',
                    avatar: 'https://cdn-icons-png.flaticon.com/512/4712/4712035.png',
                },
                quickReplies: {
                    type: 'radio',
                    values: [
                        { title: '📝 Problemas Registro', value: '1. Problemas con el registro o usuario' },
                        { title: '🔑 Password no funciona', value: '2. Password no me funciona' },
                        { title: '🔄 Cambio de Password', value: '3. Cambio de password' },
                        { title: '👤 Hablar con Asesor', value: '4. Comunicarme con asesor' }
                    ]
                }
            },
        ]);
    }, []);

    // Generar un ID de sesión único
    const [sessionId] = useState(() => Math.random().toString(36).substring(7) + new Date().getTime());

    const onSend = React.useCallback((messages = []) => {
        setMessages(previousMessages => GiftedChat.append(previousMessages, messages));
        const userMessage = messages[0].text;

        if (isWaitingForDocument) {
            setIsWaitingForDocument(false);
            sendMessageToN8n(pendingOption, userMessage);
            setPendingOption(null);
        } else {
            sendMessageToN8n(userMessage);
        }
    }, [sessionId, isWaitingForDocument, pendingOption]);

    const onQuickReply = (replies) => {
        const reply = replies[0];
        const val = (reply.value || '').trim();

        if (val.startsWith('https://') || val.startsWith('http://') || val.startsWith('wa.me/') || val.startsWith('tel:')) {
            const url = val.startsWith('wa.me/') ? `https://${val}` : val;
            Linking.openURL(url).catch(err => console.error("Error al abrir el enlace:", err));

            const feedbackMessage = {
                _id: Math.round(Math.random() * 1000000),
                text: `📲 ${reply.title}`,
                createdAt: new Date(),
                user: { _id: 1 },
            };
            setMessages(previousMessages => GiftedChat.append(previousMessages, [feedbackMessage]));
        } else if (val === 'Menú Principal') {
            // Regresar al menú sin pedir documento
            const selectedMsg = {
                _id: Math.round(Math.random() * 1000000),
                text: val,
                createdAt: new Date(),
                user: { _id: 1 },
            };
            setMessages(previousMessages => GiftedChat.append(previousMessages, [selectedMsg]));
            sendMessageToN8n(val);
        } else {
            // Mostrar mensaje de confirmación de la opción seleccionada
            const selectedMsg = {
                _id: Math.round(Math.random() * 1000000),
                text: val,
                createdAt: new Date(),
                user: { _id: 1 },
            };
            setMessages(previousMessages => GiftedChat.append(previousMessages, [selectedMsg]));

            // Pedir documento
            setPendingOption(val);
            setIsWaitingForDocument(true);

            const botAskDoc = {
                _id: Math.round(Math.random() * 1000000),
                text: 'Para ayudarte mejor, por favor ingresa tu número de documento:',
                createdAt: new Date(),
                user: {
                    _id: 2,
                    name: 'Soporte',
                    avatar: 'https://cdn-icons-png.flaticon.com/512/4712/4712035.png',
                },
            };
            setTimeout(() => {
                setMessages(previousMessages => GiftedChat.append(previousMessages, [botAskDoc]));
            }, 600);
        }
    };

    const sendMessageToN8n = async (text, documento = null) => {
        setIsTyping(true);
        try {
            const payload = {
                message: text,
                sessionId: sessionId,
                id_soporte: uuidv4(),
                source: 'login'
            };

            if (documento) {
                payload.documento = documento;
            }

            const response = await fetch(n8nChatbotUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            const textResponse = await response.text();
            let botText;
            let botQuickReplies;
            try {
                const data = JSON.parse(textResponse);
                let firstData = Array.isArray(data) ? data[0] : data;

                botText = firstData.response || firstData.text || firstData.output || firstData.message || firstData.data;
                botQuickReplies = firstData.quickReplies;

                if (typeof botText === 'string' && (botText.startsWith('{') || botText.startsWith('['))) {
                    try {
                        const innerData = JSON.parse(botText);
                        const finalData = Array.isArray(innerData) ? innerData[0] : innerData;
                        botText = finalData.response || finalData.text || finalData.output || finalData.message || finalData.data || botText;
                        if (finalData.quickReplies) botQuickReplies = finalData.quickReplies;
                    } catch (e) { }
                }
            } catch (e) {
                botText = textResponse;
            }

            if (!botText || typeof botText === 'object') {
                botText = "No se pudo interpretar la respuesta del servidor.";
            }

            const botMessage = {
                _id: Math.round(Math.random() * 1000000),
                text: botText,
                createdAt: new Date(),
                user: {
                    _id: 2,
                    name: 'Soporte',
                    avatar: 'https://cdn-icons-png.flaticon.com/512/4712/4712035.png',
                },
                quickReplies: botQuickReplies,
            };

            setMessages(previousMessages => GiftedChat.append(previousMessages, [botMessage]));
        } catch (error) {
            console.error('Error enviando mensaje a n8n:', error);
            const errorMessage = {
                _id: Math.round(Math.random() * 1000000),
                text: 'Lo siento, hubo un error al conectar con el servidor.',
                createdAt: new Date(),
                user: { _id: 2, name: 'Soporte' },
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
                    right: { backgroundColor: Colors.$primario, borderRadius: 15, padding: 5 },
                    left: { backgroundColor: Colors.$blanco, borderRadius: 15, padding: 5, elevation: 2 },
                }}
                textStyle={{
                    right: { color: Colors.$blanco, fontFamily: Fonts.$poppinsregular, fontSize: 16 },
                    left: { color: '#333', fontFamily: Fonts.$poppinsregular, fontSize: 16 },
                }}
            />
        );
    };

    const togglePinVisibility = (messageId) => {
        setVisiblePins(prev => ({
            ...prev,
            [messageId]: !prev[messageId]
        }));
    };

    const renderMessageText = (props) => {
        const { currentMessage } = props;
        const text = currentMessage.text;

        // patron para [PIN:1234]
        const pinRegex = /\[PIN:(\d+)\]/g;

        if (pinRegex.test(text)) {
            const parts = text.split(pinRegex);
            // parts[0] = antes, parts[1] = pin, parts[2] = después

            const isVisible = visiblePins[currentMessage._id];
            const pinValue = parts[1];
            const maskedPin = "•".repeat(pinValue.length);

            return (
                <View style={{ padding: 5 }}>
                    <Text style={[props.textStyle, props.position === 'right' && { color: Colors.$blanco }]}>
                        {parts[0]}
                        <Text style={{ fontFamily: Fonts.$poppinsregular, color: props.position === 'right' ? Colors.$blanco : Colors.$primario }}>
                            {isVisible ? pinValue : maskedPin}
                        </Text>
                        {parts[2]}
                    </Text>
                    <Pressable
                        onPress={() => togglePinVisibility(currentMessage._id)}
                        style={styles.togglePinButton}
                    >
                        <Text style={styles.togglePinText}>
                            {isVisible ? 'Ocultar clave' : 'Ver clave'}
                        </Text>
                    </Pressable>
                </View>
            );
        }

        return (
            <View style={{ padding: 5 }}>
                <Text style={[props.textStyle, props.position === 'right' && { color: Colors.$blanco }]}>{text}</Text>
            </View>
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

    return (
        <View style={styles.contenedor}>
            <View style={styles.cajaCabeza}>
                <Pressable onPress={onClose} style={styles.btnClose}>
                    <Text style={styles.closeText}>Cerrar</Text>
                </Pressable>
                <View style={styles.headerInfo}>
                    <Text style={styles.textTitle}>Soporte Técnico</Text>
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
                    user={{ _id: 1 }}
                    isTyping={isTyping}
                    placeholder="Escribe un mensaje..."
                    locale="es"
                    renderAvatarOnTop={true}
                    alwaysShowSend
                    renderBubble={renderBubble}
                    renderSend={renderSend}
                    renderInputToolbar={renderInputToolbar}
                    scrollToBottom
                    renderUsernameOnMessage={false}
                    infiniteScroll
                    onQuickReply={onQuickReply}
                    quickReplyStyle={styles.quickReply}
                    quickReplyTextStyle={styles.quickReplyText}
                    renderMessageText={renderMessageText}
                />
            </View>
        </View>
    );
}

const { width: windowWidth, height: windowHeight } = Dimensions.get('window');

const styles = StyleSheet.create({
    contenedor: {
        width: windowWidth,
        height: '100%',
        backgroundColor: Colors.$blanco,
    },
    cajaCabeza: {
        backgroundColor: Colors.$primario,
        paddingBottom: 15,
        paddingTop: Platform.OS === 'ios' ? 50 : 20, // Ajuste para el header
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderBottomLeftRadius: 25,
        borderBottomRightRadius: 25,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
    },
    headerInfo: {
        alignItems: 'center',
    },
    textTitle: {
        fontSize: 20,
        fontFamily: Fonts.$poppinsbold,
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
        fontSize: 12,
        color: Colors.$blanco,
        fontFamily: Fonts.$poppinsregular,
        opacity: 0.9,
    },
    btnClose: {
        position: 'absolute',
        left: 20,
        top: Platform.OS === 'ios' ? 50 : 25,
        zIndex: 10,
    },
    closeText: {
        color: Colors.$blanco,
        fontFamily: Fonts.$poppinsregular,
        fontSize: 16,
    },
    chatContainer: {
        flex: 1,
        backgroundColor: '#F8F9FA',
    },
    sendContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    sendButton: {
        backgroundColor: Colors.$primario,
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 25,
        marginBottom: 5,
    },
    sendText: {
        color: Colors.$blanco,
        fontFamily: Fonts.$poppinsbold,
        fontSize: 14,
    },
    inputToolbar: {
        backgroundColor: Colors.$blanco,
        borderTopWidth: 1,
        borderTopColor: '#EEE',
        paddingHorizontal: 5,
    },
    quickReply: {
        backgroundColor: Colors.$blanco,
        borderWidth: 1.5,
        borderColor: Colors.$primario,
        borderRadius: 25,
        paddingHorizontal: 15,
        paddingVertical: 8,
        marginTop: 5,
        marginBottom: 10,
        marginHorizontal: 5,
    },
    quickReplyText: {
        color: Colors.$primario,
        fontFamily: Fonts.$poppinsbold,
        fontSize: 14,
        textAlign: 'center',
    },
    togglePinButton: {
        marginTop: 8,
        paddingVertical: 5,
        paddingHorizontal: 10,
        backgroundColor: '#f0f0f0',
        borderRadius: 10,
        alignSelf: 'flex-start',
    },
    togglePinText: {
        fontSize: 14,
        color: Colors.$primario,
        fontFamily: Fonts.$poppinsbold,
    },
});

export default Chatbot_Login;
