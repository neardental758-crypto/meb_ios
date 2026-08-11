import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Pressable,
    Modal,
    Dimensions
} from 'react-native';
import Colors from '../../Themes/Colors';
import Fonts from '../../Themes/Fonts';

const { width } = Dimensions.get('window');

export default function IntroduccionResultado({
    visible,
    resultado, // { estado: 'aprobado'|'reprobado', respuestas_correctas, total_preguntas, porcentaje, siguiente_modulo_desbloqueado }
    onRetry,
    onReturnHome
}) {
    if (!resultado) return null;

    const isAprobado = resultado.estado === 'aprobado';

    return (
        <Modal
            transparent
            visible={visible}
            animationType="slide"
            onRequestClose={onReturnHome}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    {/* Indicador Visual */}
                    <View style={[styles.iconCircle, isAprobado ? styles.iconCircleSuccess : styles.iconCircleError]}>
                        <Text style={styles.iconText}>{isAprobado ? '🎉' : '💡'}</Text>
                    </View>

                    {/* Mensaje Principal */}
                    <Text style={styles.titleText}>
                        {isAprobado ? '¡Felicitaciones!' : 'Aún puedes mejorar'}
                    </Text>

                    <Text style={styles.subtitleText}>
                        {isAprobado
                            ? 'Has aprobado este submódulo exitosamente y puedes continuar con el siguiente.'
                            : 'Revisa nuevamente el contenido del video y vuelve a presentar el cuestionario.'}
                    </Text>

                    {/* Tarjeta de Resultado */}
                    <View style={[styles.scoreCard, isAprobado ? styles.scoreCardSuccess : styles.scoreCardError]}>
                        <Text style={styles.scoreTitle}>Resultado Obtenido</Text>
                        <Text style={[styles.scorePercentage, isAprobado ? styles.scoreTextSuccess : styles.scoreTextError]}>
                            {resultado.porcentaje}%
                        </Text>
                        <Text style={styles.scoreDetails}>
                            {resultado.respuestas_correctas} de {resultado.total_preguntas} respuestas correctas
                        </Text>

                        {resultado.min_preguntas_aprobar && (
                            <Text style={styles.minRequiredText}>
                                (Mínimo requerido para aprobar: {resultado.min_preguntas_aprobar} aciertos)
                            </Text>
                        )}

                        <View style={[styles.statusBadge, isAprobado ? styles.badgeSuccess : styles.badgeError]}>
                            <Text style={[styles.statusBadgeText, isAprobado ? styles.badgeTextSuccess : styles.badgeTextError]}>
                                {isAprobado ? 'ESTADO: APROBADO' : 'ESTADO: REPROBADO'}
                            </Text>
                        </View>
                    </View>

                    {isAprobado && (
                        <View style={styles.emailNoticeContainer}>
                            <Text style={styles.emailNoticeText}>
                                📩 Hemos enviado un certificado de aprobación a tu correo electrónico{resultado.email_destino ? `: ${resultado.email_destino}` : '.'}
                            </Text>
                        </View>
                    )}

                    {/* Acciones */}
                    <View style={styles.buttonContainer}>
                        {!isAprobado && (
                            <Pressable style={styles.btnRetry} onPress={onRetry}>
                                <Text style={styles.btnRetryText}>🔄 Volver a intentar</Text>
                            </Pressable>
                        )}

                        <Pressable style={styles.btnHome} onPress={onReturnHome}>
                            <Text style={styles.btnHomeText}>
                                {isAprobado ? 'Continuar al menú →' : 'Regresar al menú'}
                            </Text>
                        </Pressable>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.65)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modalContent: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 24,
        width: width * 0.88,
        alignItems: 'center',
        elevation: 6,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 6,
    },
    iconCircle: {
        width: 70,
        height: 70,
        borderRadius: 35,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    iconCircleSuccess: {
        backgroundColor: '#E8F5E9',
    },
    iconCircleError: {
        backgroundColor: '#FFF3E0',
    },
    iconText: {
        fontSize: 36,
    },
    titleText: {
        fontSize: 22,
        fontFamily: Fonts.$poppinsbold || 'sans-serif',
        color: '#222222',
        marginBottom: 8,
        textAlign: 'center',
    },
    subtitleText: {
        fontSize: 13,
        fontFamily: Fonts.$poppinsregular || 'sans-serif',
        color: '#666666',
        textAlign: 'center',
        lineHeight: 19,
        marginBottom: 20,
    },
    scoreCard: {
        width: '100%',
        padding: 16,
        borderRadius: 14,
        alignItems: 'center',
        marginBottom: 22,
        borderWidth: 1,
    },
    scoreCardSuccess: {
        backgroundColor: '#F4FBF7',
        borderColor: '#C8E6C9',
    },
    scoreCardError: {
        backgroundColor: '#FFF8F6',
        borderColor: '#FFCCBC',
    },
    scoreTitle: {
        fontSize: 12,
        fontFamily: Fonts.$poppinsbold || 'sans-serif',
        color: '#777777',
        textTransform: 'uppercase',
        marginBottom: 4,
    },
    scorePercentage: {
        fontSize: 36,
        fontFamily: Fonts.$poppinsbold || 'sans-serif',
        marginBottom: 2,
    },
    scoreTextSuccess: {
        color: '#2E7D32',
    },
    scoreTextError: {
        color: '#D84315',
    },
    scoreDetails: {
        fontSize: 13,
        fontFamily: Fonts.$poppinsregular || 'sans-serif',
        color: '#555555',
        marginBottom: 4,
    },
    minRequiredText: {
        fontSize: 11,
        fontFamily: Fonts.$poppinsregular || 'sans-serif',
        color: '#888888',
        marginBottom: 10,
    },
    statusBadge: {
        paddingVertical: 5,
        paddingHorizontal: 14,
        borderRadius: 12,
    },
    badgeSuccess: {
        backgroundColor: '#C8E6C9',
    },
    badgeError: {
        backgroundColor: '#FFCCBC',
    },
    statusBadgeText: {
        fontSize: 11,
        fontFamily: Fonts.$poppinsbold || 'sans-serif',
    },
    badgeTextSuccess: {
        color: '#1B5E20',
    },
    badgeTextError: {
        color: '#BF360C',
    },
    emailNoticeContainer: {
        backgroundColor: '#E8F5E9',
        borderRadius: 10,
        padding: 12,
        marginBottom: 18,
        width: '100%',
        borderLeftWidth: 4,
        borderLeftColor: '#2E7D32',
    },
    emailNoticeText: {
        fontSize: 12,
        fontFamily: Fonts.$poppinsregular || 'sans-serif',
        color: '#1B5E20',
        lineHeight: 18,
        textAlign: 'center',
    },
    buttonContainer: {
        width: '100%',
        gap: 10,
    },
    btnRetry: {
        backgroundColor: '#F57C00',
        paddingVertical: 12,
        borderRadius: 10,
        alignItems: 'center',
        width: '100%',
    },
    btnRetryText: {
        color: '#FFFFFF',
        fontFamily: Fonts.$poppinsbold || 'sans-serif',
        fontSize: 14,
    },
    btnHome: {
        backgroundColor: Colors.$primario,
        paddingVertical: 12,
        borderRadius: 10,
        alignItems: 'center',
        width: '100%',
    },
    btnHomeText: {
        color: '#FFFFFF',
        fontFamily: Fonts.$poppinsbold || 'sans-serif',
        fontSize: 14,
    },
});
