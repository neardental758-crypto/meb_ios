import React, { useState } from 'react';
import { Image, View, StyleSheet, Pressable } from 'react-native';
import Images from '../../Themes/Images';

export function Estrellas(props) {
  const { size = 25, calificacionSelect } = props;
  const [calificacion, setCalificacion] = useState(0); // Estado para la calificación seleccionada

  // Función para manejar la selección de una estrella
  const seleccionarEstrella = (index) => {
    setCalificacion(index + 1); // Actualiza la calificación basada en la estrella seleccionada
    calificacionSelect(index + 1);
  };

  return (
    <View style={estilos.cajaStarts}>
      {[...Array(5)].map((_, index) => (
        <Pressable key={index} onPress={() => seleccionarEstrella(index)}>
          <Image
            source={calificacion > index ? Images.vpcal1 : Images.vpcal2}
            style={{ width: size, height: size }}
          />
        </Pressable>
      ))}
    </View>
  );
}

const estilos = StyleSheet.create({
  cajaStarts: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
    marginBottom: 10,
  },
});