import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Pressable,
    Dimensions,
    Modal,
    ScrollView,
    TextInput,
    Alert
} from 'react-native';
import { connect, useDispatch } from 'react-redux';
import LottieView from 'lottie-react-native';
import Colors from '../../Themes/Colors';
import Fonts from '../../Themes/Fonts';
import { saveFormPreoperacional } from '../../actions/actionPerfil';

function FormularioPreoperacional(props) {
    const dispatch = useDispatch();
    const [respuestas, setRespuestas] = useState({});
    const [comentarios, setComentarios] = useState("");
    const [aceptado, setAceptado] = useState(false);
    const [preoperacionalOK, setPreoperacionalOK] = useState(false);
    const [modalTest, setModalTest] = useState(props.modalVisible || false);

    const preguntas = [
        { texto: "¿Te comprometes a conducir de manera responsable, respetando todas las normas de tránsito, manteniendo una velocidad inferior a 25 km/h en todo momento, sin utilizar audífonos y con total concentración en la vía?", comentario: false },
        { texto: "¿Estás en condiciones de salud y descanso para usar la bicicleta sin malestar, mareos, fiebre, sueño u otros síntomas?", comentario: false },
        { texto: "¿Llevas los elementos de protección requeridos: casco para ciclista? y si vas a realizar un recorrido después de las 6 p.m o antes de las 6 a.m valida si llevas una prenda reflectiva.", comentario: false },
        { texto: "¿Existen condiciones óptimas en los componentes mecánicos?: Marco, Manubrio, llantas, reflectores, asiento, pedales, frenos, cambios, plato, cadenilla, tenedor, campana, y manillares, entre otros?", comentario: false },
        { texto: "Las llantas cuentan con un labrado y sin desgastes, se encuentren sin protuberancias, cortes, fisuras o deformaciones?", comentario: false },
        { texto: "¿Existen condiciones óptimas en los componentes eléctricos?: Batería, motor, controlador, display, luces delantera y trasera, pedaleo asistido y cableado, entre otros?", comentario: false },
        { texto: "¿Hay alguna situación o elemento de los descritos a continuación que esté presentado un riesgo y pueda llegar a causar un accidente? : Vías internas deterioradas, iluminación deficiente, ausencia de señalización en los parqueaderos, conexiones eléctricas peligrosas, elementos eléctricos deteriorados, rampas de acceso muy empinadas o resbalosas, comportamientos riesgosos de otros actores viales en estos espacios, entre otros.", comentario: false },
        { texto: "Si dentro de la respuesta anterior algún elemento NO cumple: detalla aquí lo que encontraste. (Opcional)", comentario: true },
    ];

    const handleRespuesta = (index, valor) => {
        setRespuestas({ ...respuestas, [index]: valor });
    };

    const validarFormulario = () => {
        // Verificar todas las preguntas menos la de comentario (comentario: true)
        for (let i = 0; i < preguntas.length; i++) {
            if (!preguntas[i].comentario && !respuestas[i]) {
                Alert.alert("Formulario incompleto", "Debes responder todas las preguntas obligatorias antes de continuar.");
                return;
            }
        }

        // Validar respuestas obligatorias
        for (let i = 0; i < preguntas.length; i++) {
            const esComentario = preguntas[i].comentario;
            const esRiesgo = preguntas[i].texto.includes("¿Hay alguna situación o elemento de los descritos");

            if (!esComentario && !esRiesgo && respuestas[i] !== "SI") {
                Alert.alert(
                    "Respuestas inválidas",
                    "Si notas algún problema en este vehículo, te sugerimos rentar otro que esté en perfecto estado para tu seguridad."
                );
                return;
            }

            if (esRiesgo) {
                if (respuestas[i] !== "NO") {
                    if (!comentarios || comentarios.trim() === "") {
                        Alert.alert(
                            "Comentario requerido",
                            "Si reportaste un riesgo, debes detallar la situación en el comentario."
                        );
                        return;
                    }
                }
            }
        }

        if (!aceptado) {
            Alert.alert("Aceptación requerida", "Debes aceptar la declaración antes de continuar.");
            return;
        }

        console.log('Respuestas del formulario', respuestas);
        console.log('comentario', comentarios);
        const formulario = {
            "respuestas": respuestas,
            "comentario": comentarios !== "" ? comentarios : 'sincomentario'
        };
        console.log('Datos formularios unidos', formulario);
        dispatch(saveFormPreoperacional(formulario));
    };

    useEffect(() => {
        if (props.perfil && props.perfil.form_preoperacional_estado) {
            console.log('STATE en reducer', props.perfil.form_preoperacional);
            setModalTest(false);
            setPreoperacionalOK(true);
            // Reset del formulario
            setRespuestas({});
            setComentarios("");
            setAceptado(false);
        }
    }, [props.perfil?.form_preoperacional_estado]);

    // Sincronizar el modal prop con el estado local
    useEffect(() => {
        if (props.modalVisible !== undefined) {
            setModalTest(props.modalVisible);
        }
    }, [props.modalVisible]);

    const cerrarModal = () => {
        setModalTest(false);
        if (props.onClose) {
            props.onClose();
        }
    };

    return (
        <Modal transparent={false} animationType="slide" visible={modalTest}>
            <ScrollView style={styles.container}>
                <View style={styles.headerContainer}>
                    <Text style={styles.titulo}>Cuestionario Preoperacional</Text>
                    <LottieView source={require('../../Resources/Lotties/bicy_feliz_viaje.json')} autoPlay loop 
                        style={{
                        width: Dimensions.get('window').width,
                        height: Dimensions.get('window').width,             
                    }}/>
                </View>

                <View style={styles.contentContainer}>
                    {preguntas.map((pregunta, index) => (
                        <View key={index} style={styles.preguntaContainer}>
                            <Text style={styles.pregunta}>{pregunta.texto}</Text>

                            {index === 7 ? (
                                <TextInput
                                    style={[styles.input, { height: 100 }]}
                                    placeholder="Escribe tu comentario..."
                                    value={comentarios}
                                    onChangeText={setComentarios}
                                    multiline
                                    numberOfLines={4}
                                    placeholderTextColor={Colors.$texto70 || '#999'}
                                />
                            ) : (
                                <View style={styles.botones}>
                                    <Pressable
                                        style={[
                                            styles.boton,
                                            respuestas[index] === "SI" && styles.botonSeleccionado,
                                        ]}
                                        onPress={() => handleRespuesta(index, "SI")}
                                    >
                                        <Text
                                            style={[
                                                styles.botonTexto,
                                                respuestas[index] === "SI" && styles.textoSeleccionado,
                                            ]}
                                        >
                                            SI
                                        </Text>
                                    </Pressable>

                                    <Pressable
                                        style={[
                                            styles.boton,
                                            respuestas[index] === "NO" && styles.botonSeleccionado,
                                        ]}
                                        onPress={() => handleRespuesta(index, "NO")}
                                    >
                                        <Text
                                            style={[
                                                styles.botonTexto,
                                                respuestas[index] === "NO" && styles.textoSeleccionado,
                                            ]}
                                        >
                                            NO
                                        </Text>
                                    </Pressable>
                                </View>
                            )}
                        </View>
                    ))}

                    <Pressable
                        style={styles.checkboxContainer}
                        onPress={() => setAceptado(!aceptado)}
                    >
                        <View style={[styles.checkbox, aceptado && styles.checkboxMarcado]} />
                        <Text style={styles.textoCheckbox}>
                            Declaro que he realizado la inspección preoperacional de la bicicleta asignada, y soy consciente del estado en el que se encuentra. En caso de haber identificado fallas, las he registrado en este formato y notificado al BC Amigo de la estación
                        </Text>
                    </Pressable>

                    <Pressable style={styles.botonAceptar} onPress={validarFormulario}>
                        <Text style={styles.botonAceptarTexto}>Aceptar</Text>
                    </Pressable>

                    <Pressable
                        style={[styles.botonAceptar, styles.botonCancelar]}
                        onPress={cerrarModal}
                    >
                        <Text style={[styles.botonAceptarTexto, styles.textoCancelar]}>Cancelar</Text>
                    </Pressable>
                </View>
            </ScrollView>
        </Modal>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    marginTop: 10,
  },
  headerContainer: {
    flex: 1,
    textAlign: 'center',
    alignItems: 'center'
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  titulo: {
    fontFamily: Fonts.$poppinsmedium,
    fontSize: 24,
    color: Colors.$texto80,
    width: Dimensions.get('window').width*.6,
    textAlign: 'center',
    marginTop: 20
  },
  preguntaContainer: {
    marginBottom: 20,
    width: Dimensions.get('window').width*.9,
    backgroundColor: Colors.$parqueo_color_secundario_20,
    padding: 20,
    borderRadius: 20
  },
  pregunta: {
    fontSize: 18,
    fontFamily: Fonts.$poppinsregular,
    marginBottom: 20,
    color: Colors.$texto,
    textAlign: 'justify',

  },
  botones: {
    flexDirection: "row",
    gap: 10,
  },
  boton: {
    flex: 1,
    paddingVertical: 10,
    backgroundColor: Colors.$parqueo_color_secundario_50,
    borderRadius: 8,
    alignItems: "center",
  },
  botonSeleccionado: {
    backgroundColor: Colors.$primario,
  },
  botonTexto: {
    fontSize: 16,
    color: "#333",
  },
  textoSeleccionado: {
    color: "#fff",
    fontWeight: "600",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    fontSize: 14,
    backgroundColor: "#f9f9f9",
    minHeight: 60,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: "#555",
    marginRight: 10,
    borderRadius: 4,
  },
  checkboxMarcado: {
    backgroundColor: "#007bff",
  },
  textoCheckbox: {
    fontSize: 14,
    color: "#333",
    fontFamily: Fonts.$poppinsregular,
    textAlign: 'justify',
    width: "70%",
  },
  botonAceptar: {
    width: Dimensions.get('window').width*.8,
    backgroundColor: Colors.$primario,
    paddingVertical: 10,
    borderRadius: 30,
    alignItems: "center",
    marginBottom: 40,
    marginTop: 30
  },
  botonAceptarTexto: { 
    color: "#fff", 
    fontSize: 18, 
    fontFamily: Fonts.$poppinsmedium
    },
});

function mapStateToProps(state) {
    return {
        perfil: state.reducerPerfil,
    };
}

export default connect(mapStateToProps)(FormularioPreoperacional);