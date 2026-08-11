import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Pressable,
    ActivityIndicator,
    RefreshControl,
    Alert,
    Modal,
    Dimensions
} from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import Colors from '../../Themes/Colors';
import Fonts from '../../Themes/Fonts';
import { getModulosMovilidad } from '../../api/apiIntroduccionMovilidad';

const { width } = Dimensions.get('window');

export default function IntroduccionMovilidadHome({ navigation }) {
    const isFocused = useIsFocused();
    const [modulos, setModulos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [errorMsg, setErrorMsg] = useState(null);
    const [modalLockVisible, setModalLockVisible] = useState(false);
    const [selectedModuloBloqueado, setSelectedModuloBloqueado] = useState(null);

    const fetchModulos = async () => {
        setErrorMsg(null);
        const res = await getModulosMovilidad();
        if (res && Array.isArray(res)) {
            setModulos(res);
        } else if (res && res.error) {
            setErrorMsg(res.error);
        } else {
            setErrorMsg('No se pudieron cargar los submódulos. Intenta nuevamente.');
        }
        setLoading(false);
        setRefreshing(false);
    };

    useEffect(() => {
        if (isFocused) {
            setLoading(true);
            fetchModulos();
        }
    }, [isFocused]);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchModulos();
    }, []);

    const handlePressModulo = (mod) => {
        if (mod.disponible) {
            navigation.navigate('IntroduccionModuloDetalle', {
                idModulo: mod.id,
                tituloModulo: mod.titulo
            });
        } else {
            setSelectedModuloBloqueado(mod);
            setModalLockVisible(true);
        }
    };

    const getStatusBadge = (estado, disponible) => {
        if (!disponible || estado === 'bloqueado') {
            return {
                label: 'Bloqueado',
                bgColor: '#E0E0E0',
                textColor: '#757575',
                icon: '🔒'
            };
        }
        switch (estado) {
            case 'aprobado':
                return {
                    label: 'Aprobado',
                    bgColor: '#E8F5E9',
                    textColor: '#2E7D32',
                    icon: '✅'
                };
            case 'reprobado':
                return {
                    label: 'Reprobado',
                    bgColor: '#FFEBEE',
                    textColor: '#C62828',
                    icon: '❌'
                };
            case 'pendiente':
            default:
                return {
                    label: 'Disponible',
                    bgColor: '#E3F2FD',
                    textColor: '#1565C0',
                    icon: '▶️'
                };
        }
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
                    <Text style={styles.backButtonText}>← Regresar</Text>
                </Pressable>
                <Text style={styles.headerTitle}>Movilidad Sostenible</Text>
            </View>

            <ScrollView
                style={styles.scrollContent}
                contentContainerStyle={styles.scrollContainer}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[Colors.$primario]} />
                }
            >
                <View style={styles.bannerContainer}>
                    <Text style={styles.bannerTitle}>Introducción a la Movilidad Sostenible</Text>
                    <Text style={styles.bannerSubtitle}>
                        Completa los submódulos de forma secuencial para adquirir conocimientos y promover una movilidad responsable.
                    </Text>
                </View>

                {loading ? (
                    <View style={styles.loadingBox}>
                        <ActivityIndicator size="large" color={Colors.$primario} />
                        <Text style={styles.loadingText}>Cargando submódulos educativos...</Text>
                    </View>
                ) : errorMsg ? (
                    <View style={styles.errorBox}>
                        <Text style={styles.errorText}>{errorMsg}</Text>
                        <Pressable style={styles.retryButton} onPress={fetchModulos}>
                            <Text style={styles.retryButtonText}>Reintentar</Text>
                        </Pressable>
                    </View>
                ) : modulos.length === 0 ? (
                    <View style={styles.emptyBox}>
                        <Text style={styles.emptyText}>No hay submódulos disponibles en este momento.</Text>
                    </View>
                ) : (
                    modulos.map((mod, index) => {
                        const badge = getStatusBadge(mod.estado_usuario, mod.disponible);
                        const isLocked = !mod.disponible;

                        return (
                            <Pressable
                                key={mod.id}
                                style={({ pressed }) => [
                                    styles.card,
                                    isLocked && styles.cardLocked,
                                    pressed && styles.cardPressed
                                ]}
                                onPress={() => handlePressModulo(mod)}
                            >
                                <View style={styles.cardHeaderRow}>
                                    <View style={[styles.orderCircle, isLocked && styles.orderCircleLocked]}>
                                        <Text style={[styles.orderNumber, isLocked && styles.orderNumberLocked]}>
                                            {index + 1}
                                        </Text>
                                    </View>

                                    <View style={[styles.badge, { backgroundColor: badge.bgColor }]}>
                                        <Text style={[styles.badgeText, { color: badge.textColor }]}>
                                            {badge.icon} {badge.label}
                                        </Text>
                                    </View>
                                </View>

                                <Text style={[styles.cardTitle, isLocked && styles.cardTitleLocked]}>
                                    {mod.titulo}
                                </Text>

                                <View style={styles.cardFooter}>
                                    {isLocked ? (
                                        <Text style={styles.cardFooterLockedText}>
                                            🔒 Submódulo bloqueado. Aprueba el submódulo anterior.
                                        </Text>
                                    ) : (
                                        <Text style={styles.cardFooterActionText}>
                                            {mod.estado_usuario === 'aprobado'
                                                ? 'Revisar contenido →'
                                                : 'Iniciar submódulo →'}
                                        </Text>
                                    )}
                                </View>
                            </Pressable>
                        );
                    })
                )}
            </ScrollView>

            {/* Modal para Submódulo Bloqueado */}
            <Modal
                transparent
                visible={modalLockVisible}
                animationType="fade"
                onRequestClose={() => setModalLockVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalIcon}>🔒</Text>
                        <Text style={styles.modalTitle}>Submódulo Bloqueado</Text>
                        <Text style={styles.modalMessage}>
                            Para presentar "{selectedModuloBloqueado?.titulo}", primero debes completar y aprobar el submódulo anterior en la secuencia.
                        </Text>
                        <Pressable
                            style={styles.modalCloseButton}
                            onPress={() => setModalLockVisible(false)}
                        >
                            <Text style={styles.modalCloseButtonText}>Entendido</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>
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
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
    },
    backButton: {
        marginRight: 15,
    },
    backButtonText: {
        color: Colors.$blanco || '#FFFFFF',
        fontFamily: Fonts.$poppinsbold || 'sans-serif',
        fontSize: 14,
    },
    headerTitle: {
        color: Colors.$blanco || '#FFFFFF',
        fontFamily: Fonts.$poppinsbold || 'sans-serif',
        fontSize: 18,
        flex: 1,
    },
    scrollContent: {
        flex: 1,
    },
    scrollContainer: {
        padding: 20,
    },
    bannerContainer: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 18,
        marginBottom: 20,
        borderLeftWidth: 5,
        borderLeftColor: Colors.$primario,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    bannerTitle: {
        fontSize: 18,
        fontFamily: Fonts.$poppinsbold || 'sans-serif',
        color: Colors.$texto || '#333333',
        marginBottom: 6,
    },
    bannerSubtitle: {
        fontSize: 13,
        fontFamily: Fonts.$poppinsregular || 'sans-serif',
        color: '#666666',
        lineHeight: 18,
    },
    loadingBox: {
        padding: 40,
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 15,
        fontSize: 14,
        fontFamily: Fonts.$poppinsregular || 'sans-serif',
        color: '#666666',
    },
    errorBox: {
        padding: 25,
        backgroundColor: '#FFEBEE',
        borderRadius: 12,
        alignItems: 'center',
    },
    errorText: {
        fontSize: 14,
        fontFamily: Fonts.$poppinsregular || 'sans-serif',
        color: '#C62828',
        textAlign: 'center',
        marginBottom: 15,
    },
    retryButton: {
        backgroundColor: Colors.$primario,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
    },
    retryButtonText: {
        color: '#FFFFFF',
        fontFamily: Fonts.$poppinsbold || 'sans-serif',
        fontSize: 14,
    },
    emptyBox: {
        padding: 30,
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 14,
        color: '#888888',
        fontFamily: Fonts.$poppinsregular || 'sans-serif',
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 14,
        padding: 18,
        marginBottom: 16,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        borderWidth: 1,
        borderColor: '#EFEFEF',
    },
    cardLocked: {
        backgroundColor: '#F2F4F7',
        borderColor: '#E2E8F0',
    },
    cardPressed: {
        opacity: 0.85,
        transform: [{ scale: 0.99 }],
    },
    cardHeaderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    orderCircle: {
        width: 34,
        height: 34,
        borderRadius: 17,
        backgroundColor: Colors.$primario,
        justifyContent: 'center',
        alignItems: 'center',
    },
    orderCircleLocked: {
        backgroundColor: '#B0BEC5',
    },
    orderNumber: {
        color: '#FFFFFF',
        fontFamily: Fonts.$poppinsbold || 'sans-serif',
        fontSize: 15,
    },
    orderNumberLocked: {
        color: '#FFFFFF',
    },
    badge: {
        paddingVertical: 4,
        paddingHorizontal: 12,
        borderRadius: 12,
    },
    badgeText: {
        fontSize: 12,
        fontFamily: Fonts.$poppinsbold || 'sans-serif',
    },
    cardTitle: {
        fontSize: 16,
        fontFamily: Fonts.$poppinsbold || 'sans-serif',
        color: Colors.$texto || '#222222',
        marginBottom: 12,
        lineHeight: 22,
    },
    cardTitleLocked: {
        color: '#78909C',
    },
    cardFooter: {
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
        paddingTop: 10,
        marginTop: 4,
    },
    cardFooterActionText: {
        fontSize: 13,
        fontFamily: Fonts.$poppinsbold || 'sans-serif',
        color: Colors.$primario,
    },
    cardFooterLockedText: {
        fontSize: 12,
        fontFamily: Fonts.$poppinsregular || 'sans-serif',
        color: '#90A4AE',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modalContent: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 24,
        width: width * 0.85,
        alignItems: 'center',
        elevation: 5,
    },
    modalIcon: {
        fontSize: 40,
        marginBottom: 12,
    },
    modalTitle: {
        fontSize: 18,
        fontFamily: Fonts.$poppinsbold || 'sans-serif',
        color: '#333333',
        marginBottom: 10,
    },
    modalMessage: {
        fontSize: 14,
        fontFamily: Fonts.$poppinsregular || 'sans-serif',
        color: '#666666',
        textAlign: 'center',
        marginBottom: 20,
        lineHeight: 20,
    },
    modalCloseButton: {
        backgroundColor: Colors.$primario,
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 10,
        width: '100%',
        alignItems: 'center',
    },
    modalCloseButtonText: {
        color: '#FFFFFF',
        fontFamily: Fonts.$poppinsbold || 'sans-serif',
        fontSize: 14,
    },
});
