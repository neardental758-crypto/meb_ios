import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Pressable,
    ActivityIndicator,
    Alert
} from 'react-native';
import Colors from '../../Themes/Colors';
import Fonts from '../../Themes/Fonts';
import { getModuloDetalle, finalizarModulo } from '../../api/apiIntroduccionMovilidad';
import IntroduccionVideo from './IntroduccionVideo';
import IntroduccionQuiz from './IntroduccionQuiz';
import IntroduccionResultado from './IntroduccionResultado';

export default function IntroduccionModuloDetalle({ route, navigation }) {
    const { idModulo, tituloModulo } = route.params || {};

    const [loading, setLoading] = useState(true);
    const [submoduloData, setSubmoduloData] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);

    // Estados del flujo: 'video' | 'quiz'
    const [currentStep, setCurrentStep] = useState('video');
    const [videoCompleted, setVideoCompleted] = useState(false);
    const [submittingQuiz, setSubmittingQuiz] = useState(false);

    // Estado del resultado
    const [resultadoQuiz, setResultadoQuiz] = useState(null);
    const [showResultModal, setShowResultModal] = useState(false);

    const fetchDetalle = async () => {
        setLoading(true);
        setErrorMsg(null);
        const res = await getModuloDetalle(idModulo);
        if (res && res.id) {
            setSubmoduloData(res);
        } else if (res && res.message) {
            setErrorMsg(res.message);
        } else if (res && res.error) {
            setErrorMsg(res.error);
        } else {
            setErrorMsg('No se pudo cargar la información del submódulo.');
        }
        setLoading(false);
    };

    useEffect(() => {
        if (idModulo) {
            fetchDetalle();
        }
    }, [idModulo]);

    const handleVideoEnded = () => {
        setVideoCompleted(true);
    };

    const handleStartQuiz = () => {
        if (!videoCompleted) {
            Alert.alert('Video en reproducción', 'Debes finalizar la reproducción del video para comenzar el cuestionario.');
            return;
        }
        setCurrentStep('quiz');
    };

    const handleSubmitQuiz = async (respuestasPayload) => {
        setSubmittingQuiz(true);
        const res = await finalizarModulo(idModulo, respuestasPayload);
        setSubmittingQuiz(false);

        if (res && res.estado) {
            setResultadoQuiz(res);
            setShowResultModal(true);
        } else if (res && res.message) {
            Alert.alert('Error', res.message);
        } else {
            Alert.alert('Error', 'Ocurrió un error al enviar el cuestionario. Inténtalo de nuevo.');
        }
    };

    const handleRetryQuiz = () => {
        setShowResultModal(false);
        setResultadoQuiz(null);
        setCurrentStep('video');
        setVideoCompleted(false);
    };

    const handleReturnHome = () => {
        setShowResultModal(false);
        navigation.navigate('IntroduccionMovilidadHome');
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Pressable
                    onPress={() => navigation.goBack()}
                    style={styles.backButton}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                    <Text style={styles.backButtonText}>← Salir</Text>
                </Pressable>
                <Text style={styles.headerTitle} numberOfLines={1}>
                    {tituloModulo || submoduloData?.titulo || 'Submódulo'}
                </Text>
            </View>

            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={Colors.$primario} />
                    <Text style={styles.loadingText}>Cargando submódulo...</Text>
                </View>
            ) : errorMsg ? (
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>{errorMsg}</Text>
                    <Pressable style={styles.retryBtn} onPress={fetchDetalle}>
                        <Text style={styles.retryBtnText}>Reintentar</Text>
                    </Pressable>
                </View>
            ) : (
                <ScrollView style={styles.scrollContent} contentContainerStyle={styles.scrollContainer}>
                    <Text style={styles.submoduloTitle}>{submoduloData?.titulo}</Text>

                    {/* Step Tabs Indicator */}
                    <View style={styles.stepTabsRow}>
                        <View style={[styles.stepTab, currentStep === 'video' && styles.stepTabActive]}>
                            <Text style={[styles.stepTabText, currentStep === 'video' && styles.stepTabTextActive]}>
                                1. Video Educativo
                            </Text>
                        </View>
                        <View style={[styles.stepTab, currentStep === 'quiz' && styles.stepTabActive]}>
                            <Text style={[styles.stepTabText, currentStep === 'quiz' && styles.stepTabTextActive]}>
                                2. Cuestionario
                            </Text>
                        </View>
                    </View>

                    {currentStep === 'video' ? (
                        <View style={styles.stepSection}>
                            <IntroduccionVideo
                                videoUrl={submoduloData?.url_video}
                                onVideoEnded={handleVideoEnded}
                                onReplayVideo={() => setVideoCompleted(false)}
                            />

                            <Pressable
                                style={[
                                    styles.btnStartQuiz,
                                    !videoCompleted && styles.btnStartQuizDisabled
                                ]}
                                onPress={handleStartQuiz}
                                disabled={!videoCompleted}
                            >
                                <Text style={styles.btnStartQuizText}>
                                    {videoCompleted
                                        ? 'Comenzar Cuestionario →'
                                        : 'Finaliza el video para continuar'}
                                </Text>
                            </Pressable>
                        </View>
                    ) : (
                        <View style={styles.stepSection}>
                            <IntroduccionQuiz
                                preguntas={submoduloData?.preguntas}
                                onSubmitQuiz={handleSubmitQuiz}
                                submitting={submittingQuiz}
                            />
                        </View>
                    )}
                </ScrollView>
            )}

            {/* Modal de Resultado */}
            <IntroduccionResultado
                visible={showResultModal}
                resultado={resultadoQuiz}
                onRetry={handleRetryQuiz}
                onReturnHome={handleReturnHome}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F7F9FC',
    },
    header: {
        backgroundColor: Colors.$primario,
        paddingTop: 50,
        paddingBottom: 15,
        paddingHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
        elevation: 3,
    },
    backButton: {
        marginRight: 15,
    },
    backButtonText: {
        color: '#FFFFFF',
        fontFamily: Fonts.$poppinsbold || 'sans-serif',
        fontSize: 14,
    },
    headerTitle: {
        color: '#FFFFFF',
        fontFamily: Fonts.$poppinsbold || 'sans-serif',
        fontSize: 17,
        flex: 1,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 12,
        fontSize: 14,
        color: '#666666',
        fontFamily: Fonts.$poppinsregular || 'sans-serif',
    },
    errorContainer: {
        flex: 1,
        padding: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        fontSize: 14,
        color: '#C62828',
        textAlign: 'center',
        fontFamily: Fonts.$poppinsregular || 'sans-serif',
        marginBottom: 20,
    },
    retryBtn: {
        backgroundColor: Colors.$primario,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
    },
    retryBtnText: {
        color: '#FFFFFF',
        fontFamily: Fonts.$poppinsbold || 'sans-serif',
        fontSize: 14,
    },
    scrollContent: {
        flex: 1,
    },
    scrollContainer: {
        padding: 20,
        paddingBottom: 50,
    },
    submoduloTitle: {
        fontSize: 20,
        fontFamily: Fonts.$poppinsbold || 'sans-serif',
        color: Colors.$texto || '#222222',
        marginBottom: 15,
    },
    stepTabsRow: {
        flexDirection: 'row',
        marginBottom: 20,
        gap: 10,
    },
    stepTab: {
        flex: 1,
        paddingVertical: 10,
        paddingHorizontal: 12,
        backgroundColor: '#E2E8F0',
        borderRadius: 8,
        alignItems: 'center',
    },
    stepTabActive: {
        backgroundColor: Colors.$primario,
    },
    stepTabText: {
        fontSize: 12,
        fontFamily: Fonts.$poppinsbold || 'sans-serif',
        color: '#64748B',
    },
    stepTabTextActive: {
        color: '#FFFFFF',
    },
    stepSection: {
        width: '100%',
    },
    btnStartQuiz: {
        backgroundColor: Colors.$primario,
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 20,
        elevation: 3,
    },
    btnStartQuizDisabled: {
        backgroundColor: '#CBD5E1',
        elevation: 0,
    },
    btnStartQuizText: {
        color: '#FFFFFF',
        fontFamily: Fonts.$poppinsbold || 'sans-serif',
        fontSize: 15,
    },
});
