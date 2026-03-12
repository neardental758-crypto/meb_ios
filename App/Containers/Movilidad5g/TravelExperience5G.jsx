import React, { useState, useEffect, useContext } from 'react';
import {
    ScrollView,
    ActivityIndicator,
    Image,
    Modal,
    SafeAreaView,
    Text,
    TextInput,
    View,
    PermissionsAndroid,
    Platform,
    StyleSheet,
    Pressable,
    Dimensions,
    Keyboard,
} from 'react-native';
import { useFocusEffect, useRoute } from '@react-navigation/native';
import { Rating } from 'react-native-ratings';
import { launchCamera } from 'react-native-image-picker';
import { Alert } from 'react-native';
import { connect, useDispatch } from 'react-redux';
import Colors from '../../Themes/Colors';
import Fonts from '../../Themes/Fonts';
import Images from '../../Themes/Images';
import {
    saveDocumentUser,
    setFeedback,
    validateInfoUserExperience,
    reset_img_experience,
    clearActualTrip
} from '../../actions/actions';
import { saveComentario } from '../../actions/actions3g';
import { AuthContext } from '../../AuthContext';
import { Env } from "../../Utils/enviroments";
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as RootNavigation from '../../RootNavigation';
import { api } from '../../api/api.service';

const { width } = Dimensions.get('window');

const options = {
    title: 'Selecciona una imagen',
    storageOptions: {
        skipBackup: true,
        path: 'images',
    },
    quality: 0.4
};

function TravelExperience5G(props) {
    const [state, setState] = useState({
        type: "endTrip",
        comment: "",
        rating: 0,
        isChecked: false
    });

    const { infoUser, logout } = useContext(AuthContext);
    const dispatch = useDispatch();
    const route = useRoute();
    const tripId = route.params?.tripId || props.activeTripId;

    useEffect(() => {
        props.saveDocumentUser({ assets: [] });
        props.reset_img_experience();
    }, []);

    const clearTrackingData = async () => {
        try {
            await AsyncStorage.multiRemove([
                'rutaCoordinates',
                'vehiculoVP',
                'distanciaRecorrida',
                'isTrackingActive',
                'posicionInicial'
            ]);
            console.log('Datos de rastreo eliminados');

            if (Env.modo === 'tablet') {
                console.log('Modo tablet: Cerrando sesión');
                await logout();
                if (Platform.OS === 'android') {
                    const { NativeModules } = require('react-native');
                    NativeModules.AppExit.exitApplication();
                }
                return;
            }
            RootNavigation.navigate('Home');
        } catch (err) {
            console.log('Error al limpiar los datos de rastreo:', err);
        }
    };

    const registerPuntos5G = async () => {
        try {
            const dataPuntos = {
                pun_usuario: infoUser.DataUser.idNumber,
                pun_puntos: 10,
                pun_motivo: "Viaje 5G Finalizado",
                pun_fecha: new Date().toISOString().split('T')[0],
                pun_modulo: "5G"
            };
            console.log('Registrando puntos 5G:', dataPuntos);
            await api.postMysql('bc_puntos/registrar', dataPuntos);
        } catch (error) {
            console.error('Error al registrar puntos 5G:', error);
        }
    };

    const submit = async () => {
        if (!state.rating) {
            Alert.alert('Falta calificar', 'Falta calificar el viaje');
            return;
        }
        if (!state.comment) {
            Alert.alert('Falta comentario', 'Cuéntanos como te fue');
            return;
        }
        if (Env.modo === 'movil' && (!props.documentUser.assets || props.documentUser.assets.length === 0)) {
            Alert.alert('Tomar foto', 'Por favor tomar una foto del vehículo en la estación');
            return;
        }
        if (!state.isChecked) {
            Alert.alert('Seguridad', 'Por favor confirma que has asegurado el vehículo correctamente');
            return;
        }

        console.log('Enviando feedback 5G para trip:', tripId);

        let finalImageUrl = null;

        // Verify photo exists and natively upload via FormData to local api/upload Route
        if (props.documentUser.assets && props.documentUser.assets.length > 0) {
            const photoAsset = props.documentUser.assets[0];
            const formData = new FormData();

            formData.append('image', {
                uri: Platform.OS === 'android' ? photoAsset.uri : photoAsset.uri.replace('file://', ''),
                type: photoAsset.type || 'image/jpeg',
                name: photoAsset.fileName || `trip_photo_${Date.now()}.jpg`,
            });

            console.log('Subiendo imagen de 5g localmente...', formData);

            try {
                const imgRes = await api.postImgFile(formData);
                console.log('Respuesta de upload:', imgRes);
                if (imgRes && imgRes.success) {
                    finalImageUrl = imgRes.imageUrl;
                }
            } catch (error) {
                console.error('Error al subir la imagen en submit():', error);
            }
        }

        // Map feedback to the valid MySQL payload from 3G/4G exactly
        const dataComentario = {
            "com_id": "0",
            "com_usuario": infoUser.DataUser.idNumber,
            "com_prestamo": tripId,
            "com_fecha": new Date().toJSON(),
            "com_comentario": state.comment === '' ? 'sin_comentario' : state.comment,
            "com_estado": "ACTIVA",
            "com_calificacion": state.rating,
            "com_imagen": finalImageUrl || null
        };

        // Enviar comentario con la action de 3G directa para 'bc_comentarios_rentas'
        props.saveComentario(dataComentario);

        // Se elimina la sincronizacion obsoleta (validateInfoUserExperience / setFeedback) para no disparar AWS S3 duplicados


        // Registrar puntos directamente para 5G
        await registerPuntos5G();

        Alert.alert('Terminando', '¡Gracias por tu comentario! Viaje finalizado correctamente.');

        props.clearActualTrip();
        await clearTrackingData();
    };

    const ratingCompleted = (rating) => {
        Keyboard.dismiss();
        setState({ ...state, rating });
    };

    const takePhoto = async () => {
        if (Platform.OS === 'android') {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.CAMERA,
                    {
                        title: "Permiso de cámara",
                        message: "La app necesita acceso a tu cámara para validar el parqueo",
                        buttonPositive: "OK"
                    }
                );
                if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
                    Alert.alert("Error", "Se requieren permisos de cámara");
                    return;
                }
            } catch (err) {
                console.warn(err);
            }
        }

        launchCamera(options, (response) => {
            if (response.didCancel) return;
            if (response.error || response.errorCode) {
                console.log('ImagePicker Error: ', response);
            } else {
                props.saveDocumentUser(response);
            }
        });
    };

    const renderLoading = () => (
        <Modal transparent={true}>
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={Colors.$primario} />
                <Text style={styles.loadingText}>Guardando tu experiencia...</Text>
            </View>
        </Modal>
    );

    if (props.loadingEnd) return renderLoading();

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.header}>
                    <Text style={styles.congratsTitle}>¡Felicitaciones!</Text>
                    <Text style={styles.congratsText}>¡Sumaste 10 puntos más! Sigue viajando y puedes canjearlos por increíbles recompensas.</Text>
                </View>

                <View style={styles.photoSection}>
                    {props.documentUser.assets && props.documentUser.assets.length > 0 ? (
                        <View style={styles.photoPreviewContainer}>
                            <Image
                                source={{ uri: props.documentUser.assets[0].uri }}
                                style={styles.photoPreview}
                            />
                            <Pressable onPress={takePhoto} style={styles.retakeButton}>
                                <Text style={styles.buttonTextSmall}>Cambiar foto</Text>
                            </Pressable>
                        </View>
                    ) : (
                        Env.modo !== 'tablet' && (
                            <Pressable onPress={takePhoto} style={styles.uploadButton}>
                                <Text style={styles.buttonText}>Subir foto</Text>
                            </Pressable>
                        )
                    )}
                </View>

                <View style={styles.ratingCard}>
                    <Text style={styles.cardTitle}>Califica la experiencia</Text>
                    <Rating
                        type="custom"
                        ratingImage={Images.borderStar}
                        ratingColor={Colors.$reservada}
                        ratingBackgroundColor={Colors.$blanco}
                        ratingCount={5}
                        imageSize={45}
                        startingValue={0}
                        onFinishRating={ratingCompleted}
                        showRating={false}
                        style={{ paddingVertical: 15 }}
                    />
                    <Text style={styles.commentLabel}>Deja tu comentario</Text>
                    <TextInput
                        multiline={true}
                        numberOfLines={3}
                        placeholder="Cuéntanos sobre tu viaje..."
                        placeholderTextColor={Colors.$texto50}
                        style={styles.commentInput}
                        onChangeText={comment => setState({ ...state, comment })}
                    />
                </View>

                <View style={styles.checkRow}>
                    <Pressable
                        onPress={() => setState({ ...state, isChecked: !state.isChecked })}
                        style={[styles.checkCircle, state.isChecked && styles.checkCircleOk]}
                    />
                    <Text style={styles.checkText}>He asegurado el vehículo correctamente en el bicicletero.</Text>
                </View>

                <Pressable
                    onPress={submit}
                    style={[styles.finishButton, !state.isChecked && styles.finishButtonDisabled]}
                >
                    <Text style={styles.finishButtonText}>Finalizar viaje</Text>
                </Pressable>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.$blanco,
    },
    scrollContent: {
        alignItems: 'center',
        paddingBottom: 40,
    },
    header: {
        marginTop: 30,
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    congratsTitle: {
        fontFamily: Fonts.$poppinsmedium,
        color: Colors.$texto,
        fontSize: 28,
        fontWeight: 'bold',
    },
    congratsText: {
        fontFamily: Fonts.$poppinsregular,
        fontSize: 16,
        textAlign: 'center',
        color: Colors.$texto70,
        marginTop: 10,
    },
    photoSection: {
        marginVertical: 25,
        width: '100%',
        alignItems: 'center',
    },
    photoPreviewContainer: {
        alignItems: 'center',
    },
    photoPreview: {
        height: 120,
        width: 120,
        borderRadius: 60,
        borderWidth: 3,
        borderColor: Colors.$primario,
    },
    retakeButton: {
        marginTop: 10,
        padding: 5,
    },
    uploadButton: {
        backgroundColor: Colors.$texto,
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 25,
    },
    buttonText: {
        color: 'white',
        fontFamily: Fonts.$poppinsregular,
        fontSize: 16,
    },
    buttonTextSmall: {
        color: Colors.$primario,
        fontFamily: Fonts.$poppinsregular,
        fontSize: 14,
    },
    ratingCard: {
        width: width * 0.85,
        backgroundColor: Colors.$blanco,
        alignItems: "center",
        padding: 20,
        borderRadius: 20,
        elevation: 5,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    cardTitle: {
        fontFamily: Fonts.$poppinsmedium,
        color: Colors.$texto,
        fontSize: 20,
    },
    commentLabel: {
        fontFamily: Fonts.$poppinsregular,
        fontSize: 14,
        color: Colors.$texto50,
        marginTop: 10,
    },
    commentInput: {
        width: '100%',
        height: 100,
        backgroundColor: Colors.$secundario20,
        borderRadius: 15,
        padding: 15,
        marginTop: 10,
        color: Colors.$texto,
        fontFamily: Fonts.$poppinsregular,
        textAlignVertical: 'top',
    },
    checkRow: {
        flexDirection: 'row',
        alignItems: 'center',
        width: width * 0.85,
        marginTop: 30,
        paddingHorizontal: 10,
    },
    checkCircle: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: Colors.$texto,
        marginRight: 10,
    },
    checkCircleOk: {
        backgroundColor: Colors.$adicional,
        borderColor: Colors.$adicional,
    },
    checkText: {
        flex: 1,
        fontFamily: Fonts.$poppinsregular,
        fontSize: 14,
        color: Colors.$texto,
    },
    finishButton: {
        marginTop: 35,
        backgroundColor: Colors.$primario,
        paddingVertical: 15,
        paddingHorizontal: 60,
        borderRadius: 30,
        width: width * 0.7,
        alignItems: 'center',
    },
    finishButtonDisabled: {
        backgroundColor: Colors.$secundario,
    },
    finishButtonText: {
        color: 'white',
        fontFamily: Fonts.$poppinsmedium,
        fontSize: 18,
    },
    loadingContainer: {
        flex: 1,
        backgroundColor: 'rgba(255,255,255,0.9)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 20,
        fontFamily: Fonts.$poppinsregular,
        fontSize: 18,
        color: Colors.$texto,
    }
});

function mapStateToProps(state) {
    return {
        loadingEnd: state.rideReducer.loadingEnd,
        documentUser: state.userReducer.documentUser,
        activeTripId: state.movilidad5gReducer.activeTrip,
    };
}

const mapDispatchToProps = {
    saveDocumentUser,
    setFeedback,
    validateInfoUserExperience,
    reset_img_experience,
    clearActualTrip,
    saveComentario
};

export default connect(mapStateToProps, mapDispatchToProps)(TravelExperience5G);
