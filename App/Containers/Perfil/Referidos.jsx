import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Share,
  Dimensions,
  Pressable,
  Image,
  Clipboard,
  TextInput,
  ScrollView
} from 'react-native';
import Colors from '../../Themes/Colors';
import Images from '../../Themes/Images';
import Fonts from '../../Themes/Fonts';
import { connect, useDispatch } from 'react-redux';
import {
    generar_cod_ref,
    buscar_cod_ref,
    otorgarPuntosReferente
} from '../../actions/actionPerfil';
import * as RootNavigation from '../../RootNavigation';
import { value } from 'react-native-extended-stylesheet';

const ReferralCodeGenerator = ({ perfil }) => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [loadingCheck, setLoadingCheck] = useState(true);
  const [codOtorgarPuntos, setCodOtorgarPuntos] = useState(null);
  const goBack = () => { RootNavigation.navigate('Home') }
  // Verificar si el usuario ya tiene un código al cargar el componente
  useEffect(() => {
    checkExistingCode();
    console.log('ingresando referido', perfil.codigoReferido)
  }, []);

  useEffect(() => {
    if (perfil.otorgoOK) {
      console.log('Se otorgaron los puntos y se actualizó reg referidos con el documento del referente');
      checkExistingCode();
      Alert.alert(
        '¡Puntos otorgados exitosamente!',
        `Se otorgaron 200 puntos a tu referente y a ti`,
        [{ text: 'OK' }]
      );
    }
  }, [perfil.otorgoOK]);

  // Escuchar cambios en el estado de perfil
  useEffect(() => {
    if (perfil?.hasCode !== undefined) {
      setLoadingCheck(false);
    }
  }, [perfil?.hasCode]);

  // Función para generar un código único
  const generateUniqueCode = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  };

  // Verificar si ya existe un código para el usuario
  const checkExistingCode = async () => {
    try {
      dispatch(buscar_cod_ref());
    } catch (error) {
      console.log('Error checking existing code:', error);
      setLoadingCheck(false);
    }
  };

  // Función principal para generar el código
  const generateReferralCode = async () => {
    setIsLoading(true);
    
    try {
      const newCode = generateUniqueCode();
      const fechaCreacion = new Date().toISOString().slice(0, 19).replace('T', ' ');
      
      // Enviar al backend
      dispatch(generar_cod_ref(newCode, fechaCreacion));
      
      // Mostrar mensaje de éxito
      Alert.alert(
        '¡Código generado exitosamente!',
        `Tu código de referidos es: ${newCode}\n\n¡Compártelo y obtén 200 puntos por cada referido!`,
        [{ text: 'OK' }]
      );
      
      // Refrescar la búsqueda para obtener el código actualizado
      setTimeout(() => {
        checkExistingCode();
      }, 1000);
      
    } catch (error) {
      console.error('Error generating code:', error);
      Alert.alert('Error', 'Ocurrió un error al generar el código. Verifica tu conexión a internet.');
    } finally {
      setIsLoading(false);
    }
  };

  const otorgarPuntosref = async (cod) => {
    console.log('codigo para referente', cod);
    //se valida que el cod no sea el mismo usuario
    if (cod === referralCode) {
      Alert.alert('No puedes enviar tu propio codigo');
      return
    }

    //se valida el codigo en la tabla bc_usuario_referidos para optener el docuemnto
    dispatch(otorgarPuntosReferente(cod))

    //se crea un registro con el documento al referido con 200 puntos
    //se crea un registro con puntos para quin los está otorgando
    //se actualiza la tabla bc_usuarios_referidos con un tru en el campo referente para saber que ya otorgó puntos

  }

  // Copiar código al portapapeles
  const copyToClipboard = (code) => {
    Clipboard.setString(code);
    Alert.alert('¡Copiado!', 'El código ha sido copiado al portapapeles.');
  };

  // Compartir código
  const shareCode = async (code) => {
    try {
      const message = `¡Únete usando mi código de referidos: ${code} y obtén beneficios exclusivos!\n\nDescarga la app y usa mi código para obtener puntos de bienvenida.`;
      
      await Share.share({
        message: message,
        title: 'Código de Referidos',
      });
    } catch (error) {
      console.log('Error sharing:', error);
    }
  };

  // Obtener datos del estado de Redux
  const hasCode = perfil?.hasCode || false;
  const referralCode = perfil?.codigoReferido?.codigo || null;
  const referralUser = perfil?.codigoReferido?.referente || null;

  

  // Mostrar loading mientras verifica código existente
  if (loadingCheck) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <View style={[styles.card, { backgroundColor: Colors.$blanco }]}>
          <ActivityIndicator size="large" color={Colors.$primario} />
          <Text style={[styles.loadingText, { color: Colors.$texto }]}>
            Verificando código de referidos...
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: Colors.$blanco }]}>
      <View style={styles.cajaCabeza}>
            <Pressable  
                onPress={() => { goBack() }}
                style={ styles.btnAtras }>
                <View>
                <Image source={Images.menu_icon} style={[styles.iconMenu]}/> 
                </View>
            </Pressable>
        </View>
      <ScrollView style={styles.container2}>
      <View style={[styles.card, { backgroundColor: Colors.$blanco }]}>
        
        {/* Imagen de referidos */}
        <View style={styles.imageContainer}>
          <View style={[styles.imagePlaceholder, { backgroundColor: Colors.$primario20 }]}>
            <Text style={[styles.imageIcon, { color: Colors.$primario }]}>👥</Text>
          </View>
        </View>

        <Text style={[styles.title, { color: Colors.$texto }]}>
          Sistema de Referidos
        </Text>
        
        <View style={[styles.pointsInfo, { backgroundColor: Colors.$disponible }]}>
          <Text style={[styles.pointsText, { color: Colors.$blanco }]}>
            🎁 200 puntos por cada referido
          </Text>
        </View>

        {hasCode ? (
          // Vista cuando ya existe código
          <View style={styles.existingCodeContainer}>
            <Text style={[styles.codeLabel, { color: Colors.$texto80 }]}>
              Tu código de referidos:
            </Text>
            
            <View style={[styles.codeContainer, { backgroundColor: Colors.$primario20 }]}>
              <Text style={[styles.codeText, { color: Colors.$primario }]}>
                {referralCode}
              </Text>
            </View>
            
            <Text style={[styles.instructionsText, { color: Colors.$texto50 }]}>
              Compártelo con amigos y familiares para obtener puntos cuando se registren
            </Text>

            <View style={styles.actionsContainer}>
              <Pressable
                style={[styles.actionButton, { backgroundColor: Colors.$adicional }]}
                onPress={() => copyToClipboard(referralCode)}
                activeOpacity={0.8}
              >
                <Text style={[styles.actionButtonText, { color: Colors.$blanco }]}>
                  📋 Copiar
                </Text>
              </Pressable>

              <Pressable
                style={[styles.actionButton, { backgroundColor: Colors.$primario }]}
                onPress={() => shareCode(referralCode)}
                activeOpacity={0.8}
              >
                <Text style={[styles.actionButtonText, { color: Colors.$blanco }]}>
                  📤 Compartir
                </Text>
              </Pressable>
            </View>
          </View>
        ) : (
          // Vista cuando no existe código
          <View style={styles.generateContainer}>
            <Text style={[styles.description, { color: Colors.$texto80 }]}>
              Genera tu código único y compártelo para obtener 200 puntos por cada persona que se registre usando tu código
            </Text>

            <Pressable
              style={[
                styles.generateButton, 
                { backgroundColor: isLoading ? Colors.$secundario : Colors.$primario }
              ]}
              onPress={generateReferralCode}
              disabled={isLoading}
              activeOpacity={0.8}
            >
              {isLoading ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator color={Colors.$blanco} size="small" />
                  <Text style={[styles.buttonText, { color: Colors.$blanco, marginLeft: 10 }]}>
                    Generando...
                  </Text>
                </View>
              ) : (
                <Text style={[styles.buttonText, { color: Colors.$blanco }]}>
                  Generar código para referidos
                </Text>
              )}
            </Pressable>
          </View>
        )}

        {/* Beneficios adicionales */}
        <View style={[styles.benefitsContainer, { backgroundColor: Colors.$adicional20 }]}>
          <Text style={[styles.benefitsTitle, { color: Colors.$adicional }]}>
            💡 Beneficios del programa
          </Text>
          <Text style={[styles.benefitsText, { color: Colors.$texto80 }]}>
            • Obtén puntos por cada referido exitoso{'\n'}
            • Tus amigos también reciben beneficios{'\n'}
            • Sin límite de referidos
          </Text>
        </View>


        {/* Quien fue tu referen*/}
        {referralUser === 'NULL' && referralUser !== null?
        <View style={[styles.benefitsContainer, { backgroundColor: Colors.$secundario20 }]}>
          <Text style={[styles.benefitsTitle, { color: Colors.$black }]}>
            Otórgale puntos a tu referente
          </Text>
          <TextInput
            placeholder='Código referente'
            style={styles.loginInput}
            keyboardType={'email-address'}
            placeholderTextColor={Colors.$secundario}
            value={codOtorgarPuntos}
            onChangeText={objectEmail => setCodOtorgarPuntos(objectEmail)}
          />

          <View style={styles.generateContainer}>
          <Pressable
              style={{
                backgroundColor: Colors.$primario,
                width: 250,
                height: 40,
                borderRadius: 25,
                alignItems: 'center',
                justifyContent: 'center'
              }}
              onPress={() => otorgarPuntosref(codOtorgarPuntos)}
              activeOpacity={0.8}
            >
              <Text style={[styles.actionButtonText, { color: Colors.$blanco }]}>
               Enviar
              </Text>
            </Pressable>
          </View>

        </View> : null
        }

      </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  container2:{
    flex: 1,
    borderRadius: 20,
    backgroundColor: Colors.$blanco,
  },
  loginInput: {
    width: '80%',
    fontFamily: Fonts.$poppinsregular,
    fontSize: 20,
    alignSelf: 'center',
    paddingLeft : 15,
    paddingVertical: 8,
  },
  cajaCabeza: {
      backgroundColor: Colors.$primario,
      justifyContent: 'space-around',
      alignItems: 'center', 
      borderRadius: 1,
      width: Dimensions.get('window').width,
      position: 'absolute',
      top: 20
  },
  btnAtras:{
      position: 'absolute',
      top: 10, 
      left: 10,
      width: 50,
      height: 50,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 25,
      zIndex: 999
  },
  iconMenu: {
      width: 50,
      height: 50,
  },
  centerContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    borderRadius: 15,
    padding: 25,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 8,
    width: '100%',
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  imagePlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageIcon: {
    fontSize: 40,
  },
  title: {
    fontSize: 24,
    fontFamily: Fonts.$poppinsregular,
    textAlign: 'center',
    marginBottom: 20,
  },
  pointsInfo: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 25,
    alignItems: 'center',
  },
  pointsText: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  existingCodeContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  codeLabel: {
    fontSize: 16,
    marginBottom: 10,
    fontWeight: '500',
  },
  codeContainer: {
    paddingHorizontal: 25,
    paddingVertical: 15,
    borderRadius: 12,
    marginBottom: 15,
  },
  codeText: {
    fontSize: 28,
    fontWeight: 'bold',
    letterSpacing: 3,
    textAlign: 'center',
  },
  instructionsText: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
    paddingHorizontal: 10,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 10,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  generateContainer: {
    alignItems: 'center',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 25,
    paddingHorizontal: 10,
  },
  generateButton: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 55,
    width: '100%',
    marginBottom: 20,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
  },
  benefitsContainer: {
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
  },
  benefitsTitle: {
    fontSize: 18,
    marginBottom: 10,
    textAlign: 'center',
    fontFamily: Fonts.$poppinsregular
  },
  benefitsText: {
    fontSize: 14,
    lineHeight: 20,
  },
  loadingText: {
    textAlign: 'center',
    marginTop: 15,
    fontSize: 16,
    fontWeight: '500',
  },
});

function mapStateToProps(state) {
    return {
        perfil: state.reducerPerfil,
    };
}

export default connect(mapStateToProps)(ReferralCodeGenerator);