import React from 'react';
import { ScrollView, Text, View, StyleSheet } from 'react-native';
import { Colors } from '../../Themes/Colors';

export function IntroduccionCarpooling() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>¡Bienvenido al módulo de Carpooling!</Text>
      <Text style={styles.text}>
        Conectamos conductores y pasajeros para viajes más económicos, eficientes y ecológicos. Descubre cómo funciona:
      </Text>

      <View style={styles.section}>
        <Text style={styles.subtitle}>🚗 Unirme</Text>
        <Text style={styles.description}>
          Busca viajes disponibles y únete a ellos con solo un clic. ¡Llega a tu destino compartiendo gastos!
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.subtitle}>🔄 Compartir</Text>
        <Text style={styles.description}>
          Publica tu viaje y ofrece asientos disponibles. ¡Ayuda a otros a llegar mientras reduces tus costos!
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.subtitle}>🗺️ Itinerario</Text>
        <Text style={styles.description}>
          Revisa todos tus viajes activos, ya sea como conductor o pasajero. Mantente organizado y al día.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.subtitle}>📜 Historial</Text>
        <Text style={styles.description}>
          Consulta tus viajes finalizados, califica a los participantes y deja comentarios para mejorar la comunidad.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.subtitle}>💬 Chat</Text>
        <Text style={styles.description}>
          La comunicación es clave. Usa el chat para hablar directamente con tu conductor o pasajeros según sea el caso. Coordina detalles, como puntos de encuentro y cualquier otra pregunta, de manera rápida y sencilla. ¡Así todos se sienten más seguros y cómodos durante el viaje!
        </Text>
      </View>

      <Text style={styles.footerText}>
        ¡Únete a la revolución del carpooling y haz que cada viaje cuente! 🌍
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '90%',
    marginTop: 70,
    borderRadius: 20,
    padding: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  title: {
    fontSize: 24,
    color: 'white',
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    color: '#C4C4C4',
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 20,
    color: 'white',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#C4C4C4',
    lineHeight: 21,
  },
  footerText: {
    fontSize: 14,
    color: '#C4C4C4',
    marginTop: 20,
    marginBottom: 50,
    fontStyle: 'italic',
  },
});
