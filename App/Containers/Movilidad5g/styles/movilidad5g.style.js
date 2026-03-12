/* eslint-disable prettier/prettier */
/**
 * Movilidad5g Styles
 * Styles for the 5G bicycle mobility module
 */

import { StyleSheet, Dimensions } from 'react-native';
import Colors from '../../../Themes/Colors';
import Fonts from '../../../Themes/Fonts';

const { width, height } = Dimensions.get('window');

export const styles = StyleSheet.create({
    // Container
    container: {
        flex: 1,
        backgroundColor: Colors.$fondo,
    },

    // Header
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 16,
        backgroundColor: Colors.$primario,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    backButton: {
        fontSize: 32,
        color: Colors.$blanco,
        fontWeight: 'bold',
    },
    headerTitle: {
        fontSize: 20,
        fontFamily: Fonts.$poppinsmedium,
        color: Colors.$blanco,
    },
    headerSpacer: {
        width: 32,
    },

    // Camera
    camera: {
        flex: 1,
    },

    // Overlay
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'transparent',
        justifyContent: 'center',
        alignItems: 'center',
        pointerEvents: 'none',
    },
    scanAreaContainer: {
        alignItems: 'center',
    },
    scanFrame: {
        width: width * 0.7,
        height: width * 0.7,
        borderWidth: 3,
        borderColor: Colors.$primario,
        borderRadius: 16,
        backgroundColor: 'transparent',
    },
    instructionText: {
        marginTop: 24,
        fontSize: 16,
        fontFamily: Fonts.$poppinsregular,
        color: Colors.$blanco,
        textAlign: 'center',
        backgroundColor: 'rgba(0,0,0,0.6)',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
    },

    // Bottom controls
    bottomControls: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 24,
        paddingHorizontal: 16,
        backgroundColor: Colors.$blanco,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    controlButton: {
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 12,
        backgroundColor: Colors.$secundario,
        minWidth: 140,
    },
    controlButtonIcon: {
        fontSize: 28,
        marginBottom: 4,
    },
    controlButtonText: {
        fontSize: 14,
        fontFamily: Fonts.$poppinsmedium,
        color: Colors.$blanco,
    },

    // Loading state
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.$fondo,
        paddingHorizontal: 32,
    },
    loadingText: {
        marginTop: 16,
        fontSize: 18,
        fontFamily: Fonts.$poppinsregular,
        color: Colors.$texto80,
        textAlign: 'center',
    },
    retryText: {
        marginTop: 8,
        fontSize: 14,
        fontFamily: Fonts.$poppinsregular,
        color: Colors.$texto50,
        textAlign: 'center',
    },

    // Error state
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.$fondo,
        paddingHorizontal: 32,
    },
    errorIcon: {
        fontSize: 64,
        marginBottom: 16,
    },
    errorTitle: {
        fontSize: 24,
        fontFamily: Fonts.$poppinsbold,
        color: Colors.$error,
        marginBottom: 8,
    },
    errorMessage: {
        fontSize: 16,
        fontFamily: Fonts.$poppinsregular,
        color: Colors.$texto80,
        textAlign: 'center',
        marginBottom: 24,
    },
    errorButton: {
        paddingVertical: 14,
        paddingHorizontal: 32,
        backgroundColor: Colors.$primario,
        borderRadius: 12,
    },
    errorButtonText: {
        fontSize: 16,
        fontFamily: Fonts.$poppinsmedium,
        color: Colors.$blanco,
    },

    // Modal styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalScrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        width: width * 0.85,
        backgroundColor: Colors.$blanco,
        borderRadius: 16,
        padding: 24,
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
    },
    modalTitle: {
        fontSize: 22,
        fontFamily: Fonts.$poppinsbold,
        color: Colors.$texto80,
        marginBottom: 8,
        textAlign: 'center',
    },
    modalDescription: {
        fontSize: 14,
        fontFamily: Fonts.$poppinsregular,
        color: Colors.$texto50,
        marginBottom: 20,
        textAlign: 'center',
    },
    modalInput: {
        borderWidth: 1,
        borderColor: Colors.$texto30,
        borderRadius: 12,
        padding: 14,
        fontSize: 16,
        fontFamily: Fonts.$poppinsregular,
        color: Colors.$texto80,
        backgroundColor: Colors.$fondo,
        marginBottom: 20,
    },
    modalButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 12,
    },
    modalButton: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
    },
    modalCancelButton: {
        backgroundColor: Colors.$texto30,
    },
    modalCancelButtonText: {
        fontSize: 16,
        fontFamily: Fonts.$poppinsmedium,
        color: Colors.$texto80,
    },
    modalSubmitButton: {
        backgroundColor: Colors.$primario,
    },
    modalSubmitButtonText: {
        fontSize: 16,
        fontFamily: Fonts.$poppinsmedium,
        color: Colors.$blanco,
    },
});
