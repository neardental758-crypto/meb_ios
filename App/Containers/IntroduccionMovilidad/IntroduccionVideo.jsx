import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ActivityIndicator,
    Pressable,
    Dimensions
} from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import Video from 'react-native-video';
import Colors from '../../Themes/Colors';
import Fonts from '../../Themes/Fonts';

const { width } = Dimensions.get('window');

const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds) || seconds < 0) return '00:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
};

export default function IntroduccionVideo({ videoUrl, onVideoEnded, onReplayVideo }) {
    const isScreenFocused = useIsFocused();
    const videoRef = useRef(null);

    const [paused, setPaused] = useState(false);
    const [loading, setLoading] = useState(true);
    const [hasError, setHasError] = useState(false);
    const [completed, setCompleted] = useState(false);

    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [maxWatchedTime, setMaxWatchedTime] = useState(0);

    const officialFallback = 'https://bicyclecapital.co/wp-content/uploads/2026/03/Bcguiavideo2024.mp4';
    const [activeUri, setActiveUri] = useState(videoUrl || officialFallback);

    useEffect(() => {
        return () => {
            setPaused(true);
        };
    }, []);

    useEffect(() => {
        if (videoUrl) {
            setActiveUri(videoUrl.trim());
        } else {
            setActiveUri(officialFallback);
        }
        setHasError(false);
        setLoading(true);
        setCurrentTime(0);
        setMaxWatchedTime(0);
    }, [videoUrl]);

    const handleLoadStart = () => {
        setLoading(true);
        setHasError(false);
    };

    const handleLoad = (meta) => {
        setLoading(false);
        if (meta && meta.duration) {
            setDuration(meta.duration);
        }
    };

    const handleProgress = (progress) => {
        if (progress && progress.currentTime != null) {
            const time = progress.currentTime;
            setCurrentTime(time);

            // Bloquear intento de adelantamiento manual si la nativa intenta buscar más allá
            if (time > maxWatchedTime + 2.0) {
                if (videoRef.current) {
                    videoRef.current.seek(maxWatchedTime);
                }
            } else if (time > maxWatchedTime) {
                setMaxWatchedTime(time);
            }
        }
    };

    const handleEnd = () => {
        setCompleted(true);
        setPaused(true);
        if (onVideoEnded) {
            onVideoEnded();
        }
    };

    const handleReplay = () => {
        if (videoRef.current) {
            videoRef.current.seek(0);
        }
        setCurrentTime(0);
        setMaxWatchedTime(0);
        setPaused(false);
        setCompleted(false);
        if (onReplayVideo) {
            onReplayVideo();
        }
    };

    const togglePlayPause = () => {
        setPaused(!paused);
    };

    const handleError = (error) => {
        console.log('Video load error:', error);
        if (activeUri !== officialFallback) {
            console.log('Failing video URL, switching to official fallback video...');
            setActiveUri(officialFallback);
            setHasError(false);
            setLoading(true);
        } else {
            setLoading(false);
            setHasError(true);
        }
    };

    const videoSource = React.useMemo(() => {
        const uriToUse = activeUri || officialFallback;
        return {
            uri: uriToUse,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Linux; Android 10; Mobile) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36'
            }
        };
    }, [activeUri]);

    const progressPercent = duration > 0 ? Math.min(100, Math.max(0, (currentTime / duration) * 100)) : 0;

    return (
        <View style={styles.container}>
            <View style={styles.videoWrapper}>
                {hasError || !videoSource ? (
                    <View style={styles.errorContainer}>
                        <Text style={styles.errorIcon}>⚠️</Text>
                        <Text style={styles.errorTitle}>Error al cargar el video</Text>
                        <Text style={styles.errorMessage}>
                            No se pudo reproducir el video desde la fuente remota. Verifica tu conexión a internet o la URL del video.
                        </Text>
                        <Pressable style={styles.retryButton} onPress={handleReplay}>
                            <Text style={styles.retryButtonText}>Reintentar</Text>
                        </Pressable>
                    </View>
                ) : (
                    <>
                        <Video
                            ref={videoRef}
                            source={videoSource}
                            style={styles.videoPlayer}
                            controls={false}
                            paused={paused || !isScreenFocused}
                            playInBackground={false}
                            playWhenInactive={false}
                            resizeMode="contain"
                            bufferConfig={{
                                minBufferMs: 15000,
                                maxBufferMs: 30000,
                                bufferForPlaybackMs: 2500,
                                bufferForPlaybackAfterRebufferMs: 5000,
                            }}
                            onLoadStart={handleLoadStart}
                            onLoad={handleLoad}
                            onProgress={handleProgress}
                            onError={handleError}
                            onEnd={handleEnd}
                        />

                        {loading && (
                            <View style={styles.overlayLoading}>
                                <ActivityIndicator size="large" color={Colors.$primario} />
                                <Text style={styles.loadingText}>Cargando video educativo...</Text>
                            </View>
                        )}
                    </>
                )}
            </View>

            {/* Barra de Controles Personalizados (Sin opción de adelantar) */}
            {!hasError && (
                <View style={styles.customControlsWrapper}>
                    <View style={styles.customControlsRow}>
                        <Pressable style={styles.playPauseBtn} onPress={togglePlayPause}>
                            <Text style={styles.playPauseBtnText}>
                                {paused ? '▶️ Reproducir' : '⏸️ Pausar'}
                            </Text>
                        </Pressable>

                        <Text style={styles.timeText}>
                            {formatTime(currentTime)} / {formatTime(duration)}
                        </Text>
                    </View>

                    {/* Barra de Progreso Visual no interactiva */}
                    <View style={styles.progressBarBackground}>
                        <View style={[styles.progressBarFill, { width: `${progressPercent}%` }]} />
                    </View>

                    <View style={styles.noSeekNotice}>
                        <Text style={styles.noSeekNoticeText}>
                            🔒 No es posible adelantar el video. Debes verlo completo.
                        </Text>
                    </View>
                </View>
            )}

            <View style={styles.controlsBar}>
                <Pressable
                    style={styles.replayButton}
                    onPress={handleReplay}
                >
                    <Text style={styles.replayButtonText}>🔄 Volver a ver el video</Text>
                </Pressable>

                {completed ? (
                    <View style={styles.statusNoticeSuccess}>
                        <Text style={styles.statusNoticeSuccessText}>
                            ✅ Video completado. ¡Puedes presentar el cuestionario!
                        </Text>
                    </View>
                ) : (
                    <View style={styles.statusNoticePending}>
                        <Text style={styles.statusNoticePendingText}>
                            ℹ️ Mira el video completo para desbloquear el cuestionario.
                        </Text>
                    </View>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        alignItems: 'center',
    },
    videoWrapper: {
        width: '100%',
        aspectRatio: 16 / 9,
        backgroundColor: '#000000',
        borderRadius: 12,
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
    },
    videoPlayer: {
        width: '100%',
        height: '100%',
    },
    overlayLoading: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 10,
        color: '#FFFFFF',
        fontFamily: Fonts.$poppinsregular || 'sans-serif',
        fontSize: 13,
    },
    errorContainer: {
        padding: 20,
        alignItems: 'center',
    },
    errorIcon: {
        fontSize: 32,
        marginBottom: 6,
    },
    errorTitle: {
        color: '#FFFFFF',
        fontFamily: Fonts.$poppinsbold || 'sans-serif',
        fontSize: 16,
        marginBottom: 4,
    },
    errorMessage: {
        color: '#CCCCCC',
        fontFamily: Fonts.$poppinsregular || 'sans-serif',
        fontSize: 12,
        textAlign: 'center',
        marginBottom: 16,
        lineHeight: 18,
    },
    retryButton: {
        backgroundColor: Colors.$primario,
        paddingVertical: 8,
        paddingHorizontal: 18,
        borderRadius: 8,
    },
    retryButtonText: {
        color: '#FFFFFF',
        fontFamily: Fonts.$poppinsbold || 'sans-serif',
        fontSize: 13,
    },
    customControlsWrapper: {
        width: '100%',
        backgroundColor: '#F8FAFC',
        padding: 12,
        borderRadius: 10,
        marginTop: 8,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    customControlsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    playPauseBtn: {
        backgroundColor: Colors.$primario || '#2E7D32',
        paddingVertical: 6,
        paddingHorizontal: 14,
        borderRadius: 6,
    },
    playPauseBtnText: {
        color: '#FFFFFF',
        fontSize: 12,
        fontFamily: Fonts.$poppinsbold || 'sans-serif',
    },
    timeText: {
        fontSize: 12,
        fontFamily: Fonts.$poppinsbold || 'sans-serif',
        color: '#4A5568',
    },
    progressBarBackground: {
        width: '100%',
        height: 8,
        backgroundColor: '#E2E8F0',
        borderRadius: 4,
        overflow: 'hidden',
        marginBottom: 6,
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: Colors.$primario || '#2E7D32',
        borderRadius: 4,
    },
    noSeekNotice: {
        alignItems: 'center',
    },
    noSeekNoticeText: {
        fontSize: 11,
        fontFamily: Fonts.$poppinsregular || 'sans-serif',
        color: '#718096',
        fontStyle: 'italic',
    },
    controlsBar: {
        width: '100%',
        marginTop: 10,
        alignItems: 'center',
    },
    replayButton: {
        backgroundColor: '#EDF2F7',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 8,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#CBD5E0',
    },
    replayButtonText: {
        color: '#2D3748',
        fontSize: 12,
        fontFamily: Fonts.$poppinsbold || 'sans-serif',
    },
    statusNoticeSuccess: {
        backgroundColor: '#E8F5E9',
        paddingVertical: 8,
        paddingHorizontal: 14,
        borderRadius: 8,
        width: '100%',
        alignItems: 'center',
        borderLeftWidth: 4,
        borderLeftColor: '#2E7D32',
    },
    statusNoticeSuccessText: {
        color: '#1B5E20',
        fontSize: 12,
        fontFamily: Fonts.$poppinsbold || 'sans-serif',
    },
    statusNoticePending: {
        backgroundColor: '#FFF3E0',
        paddingVertical: 8,
        paddingHorizontal: 14,
        borderRadius: 8,
        width: '100%',
        alignItems: 'center',
        borderLeftWidth: 4,
        borderLeftColor: '#E65100',
    },
    statusNoticePendingText: {
        color: '#E65100',
        fontSize: 12,
        fontFamily: Fonts.$poppinsregular || 'sans-serif',
    },
});
