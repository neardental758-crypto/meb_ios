import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Pressable,
    ScrollView,
    ActivityIndicator,
    Alert
} from 'react-native';
import Colors from '../../Themes/Colors';
import Fonts from '../../Themes/Fonts';

export default function IntroduccionQuiz({ preguntas, onSubmitQuiz, submitting }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [respuestas, setRespuestas] = useState({}); // { [id_pregunta]: "Opción seleccionada" }
    const [selectedOption, setSelectedOption] = useState(null);

    const totalQuestions = preguntas ? preguntas.length : 0;
    const currentQuestion = preguntas && preguntas[currentIndex] ? preguntas[currentIndex] : null;

    const handleSelectOption = (opcion) => {
        setSelectedOption(opcion);
    };

    const handleNextQuestion = () => {
        if (!selectedOption) {
            Alert.alert('Selección requerida', 'Por favor selecciona una respuesta antes de continuar.');
            return;
        }

        const newRespuestas = {
            ...respuestas,
            [currentQuestion.id]: selectedOption
        };
        setRespuestas(newRespuestas);

        if (currentIndex + 1 < totalQuestions) {
            setCurrentIndex(currentIndex + 1);
            // Pre-select if already answered (or reset selection)
            const nextQ = preguntas[currentIndex + 1];
            setSelectedOption(newRespuestas[nextQ.id] || null);
        } else {
            // Última pregunta -> Enviar al backend
            const payload = Object.keys(newRespuestas).map((idPregunta) => ({
                id_pregunta: Number(idPregunta),
                respuesta: newRespuestas[idPregunta]
            }));

            onSubmitQuiz(payload);
        }
    };

    const handlePrevQuestion = () => {
        if (currentIndex > 0) {
            const prevIndex = currentIndex - 1;
            setCurrentIndex(prevIndex);
            const prevQ = preguntas[prevIndex];
            setSelectedOption(respuestas[prevQ.id] || null);
        }
    };

    if (!currentQuestion) {
        return (
            <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No hay preguntas disponibles para este cuestionario.</Text>
            </View>
        );
    }

    const progressPercentage = Math.round(((currentIndex + 1) / totalQuestions) * 100);

    return (
        <View style={styles.container}>
            {/* Componente de Progreso */}
            <View style={styles.progressContainer}>
                <View style={styles.progressHeaderRow}>
                    <Text style={styles.progressText}>
                        Pregunta {currentIndex + 1} de {totalQuestions}
                    </Text>
                    <Text style={styles.progressPercentageText}>{progressPercentage}%</Text>
                </View>
                <View style={styles.progressBarTrack}>
                    <View style={[styles.progressBarFill, { width: `${progressPercentage}%` }]} />
                </View>
            </View>

            {/* Enunciado de la Pregunta */}
            <View style={styles.questionCard}>
                <Text style={styles.questionTitle}>{currentQuestion.pregunta}</Text>
            </View>

            {/* Opciones de Respuesta */}
            <View style={styles.optionsList}>
                {currentQuestion.opciones && currentQuestion.opciones.map((opcion, index) => {
                    const isSelected = selectedOption === opcion;
                    return (
                        <Pressable
                            key={index}
                            style={({ pressed }) => [
                                styles.optionCard,
                                isSelected && styles.optionCardSelected,
                                pressed && styles.optionCardPressed
                            ]}
                            onPress={() => handleSelectOption(opcion)}
                            disabled={submitting}
                        >
                            <View style={[styles.radioCircle, isSelected && styles.radioCircleSelected]}>
                                {isSelected && <View style={styles.radioInnerCircle} />}
                            </View>
                            <Text style={[styles.optionText, isSelected && styles.optionTextSelected]}>
                                {opcion}
                            </Text>
                        </Pressable>
                    );
                })}
            </View>

            {/* Botones de Navegación */}
            <View style={styles.footerRow}>
                {currentIndex > 0 && (
                    <Pressable
                        style={styles.btnSecondary}
                        onPress={handlePrevQuestion}
                        disabled={submitting}
                    >
                        <Text style={styles.btnSecondaryText}>← Anterior</Text>
                    </Pressable>
                )}

                <Pressable
                    style={[
                        styles.btnPrimary,
                        !selectedOption && styles.btnDisabled,
                        currentIndex === 0 && { flex: 1 }
                    ]}
                    onPress={handleNextQuestion}
                    disabled={!selectedOption || submitting}
                >
                    {submitting ? (
                        <ActivityIndicator color="#FFFFFF" size="small" />
                    ) : (
                        <Text style={styles.btnPrimaryText}>
                            {currentIndex + 1 === totalQuestions ? 'Finalizar Cuestionario ✓' : 'Siguiente →'}
                        </Text>
                    )}
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        backgroundColor: '#FFFFFF',
        borderRadius: 14,
        padding: 18,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    emptyContainer: {
        padding: 30,
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 14,
        color: '#666666',
        fontFamily: Fonts.$poppinsregular || 'sans-serif',
    },
    progressContainer: {
        marginBottom: 16,
    },
    progressHeaderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 6,
    },
    progressText: {
        fontSize: 13,
        fontFamily: Fonts.$poppinsbold || 'sans-serif',
        color: Colors.$primario,
    },
    progressPercentageText: {
        fontSize: 13,
        fontFamily: Fonts.$poppinsbold || 'sans-serif',
        color: '#777777',
    },
    progressBarTrack: {
        height: 8,
        backgroundColor: '#E0E0E0',
        borderRadius: 4,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: Colors.$primario,
        borderRadius: 4,
    },
    questionCard: {
        backgroundColor: '#F7F9FC',
        padding: 16,
        borderRadius: 10,
        marginBottom: 16,
        borderLeftWidth: 4,
        borderLeftColor: Colors.$primario,
    },
    questionTitle: {
        fontSize: 16,
        fontFamily: Fonts.$poppinsbold || 'sans-serif',
        color: Colors.$texto || '#222222',
        lineHeight: 22,
    },
    optionsList: {
        paddingVertical: 4,
    },
    optionCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderWidth: 1.5,
        borderColor: '#E2E8F0',
        borderRadius: 10,
        padding: 14,
        marginBottom: 10,
    },
    optionCardSelected: {
        borderColor: Colors.$primario,
        backgroundColor: '#F0F9ED',
    },
    optionCardPressed: {
        opacity: 0.8,
    },
    radioCircle: {
        height: 20,
        width: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#94A3B8',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    radioCircleSelected: {
        borderColor: Colors.$primario,
    },
    radioInnerCircle: {
        height: 10,
        width: 10,
        borderRadius: 5,
        backgroundColor: Colors.$primario,
    },
    optionText: {
        fontSize: 14,
        fontFamily: Fonts.$poppinsregular || 'sans-serif',
        color: '#334155',
        flex: 1,
        lineHeight: 20,
    },
    optionTextSelected: {
        fontFamily: Fonts.$poppinsbold || 'sans-serif',
        color: Colors.$texto || '#0F172A',
    },
    footerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 15,
        gap: 10,
    },
    btnSecondary: {
        backgroundColor: '#E2E8F0',
        paddingVertical: 12,
        paddingHorizontal: 18,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    btnSecondaryText: {
        color: '#475569',
        fontFamily: Fonts.$poppinsbold || 'sans-serif',
        fontSize: 13,
    },
    btnPrimary: {
        flex: 1,
        backgroundColor: Colors.$primario,
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 2,
    },
    btnDisabled: {
        backgroundColor: '#CBD5E1',
        elevation: 0,
    },
    btnPrimaryText: {
        color: '#FFFFFF',
        fontFamily: Fonts.$poppinsbold || 'sans-serif',
        fontSize: 14,
    },
});
