import React, { useEffect, useRef, useState } from 'react';
import { View, Animated, Easing, StyleSheet } from 'react-native';
import Images from '../../Themes/Images';
import Colors from '../../Themes/Colors';

export function IconoChat({ chatNotifications, id }) {
    const spinValue = useRef(new Animated.Value(0)).current;
    const animation = useRef(null);
    const isNotificationActive = chatNotifications?.[id] ?? false;

    useEffect(() => {
        if (isNotificationActive) {
            spinValue.setValue(0);
            animation.current = Animated.loop(
                Animated.sequence([
                    Animated.timing(spinValue, {
                        toValue: 1,
                        duration: 500,
                        easing: Easing.linear,
                        useNativeDriver: true,
                    }),
                    Animated.timing(spinValue, {
                        toValue: 0,
                        duration: 500,
                        easing: Easing.linear,
                        useNativeDriver: true,
                    })
                ])
            );
            animation.current.start();
        } else {
            if (animation.current) {
                animation.current.stop();
                spinValue.setValue(0);
            }
        }
        return () => {
            if (animation.current) {
                animation.current.stop();
            }
        };
    }, [isNotificationActive]);

    const spin = spinValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['-15deg', '15deg'],
    });

    return (
        <View style={estilos.caja}>
            <Animated.Image 
                source={Images.iconochatActivo} 
                style={{ 
                    width: 25, 
                    height: 25, 
                    tintColor: isNotificationActive ? Colors.$primario : 'black',
                    transform: [{ rotate: isNotificationActive ? spin : '0deg' }]
                }}
            />
        </View>
    );
}
const estilos = StyleSheet.create({
    caja: {
        width: 50,
        height: 50,
        flexDirection: "row",
        alignItems: 'center',
        justifyContent: 'center',
        margin: 5,
    }
});
