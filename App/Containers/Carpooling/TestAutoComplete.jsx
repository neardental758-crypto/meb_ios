import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Alert,
  TextInput,
  TouchableOpacity,
  FlatList,
  Keyboard,
} from 'react-native';
import { Env } from "../../../keys";

const keyMap = Env.key_map_google;

function TestAutoComplete() {
  const [searchText, setSearchText] = useState('');
  const [predictions, setPredictions] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState('');
  const [coordinates, setCoordinates] = useState(null);
  const [showPredictions, setShowPredictions] = useState(false);

  // Buscar predicciones cuando el usuario escribe
  useEffect(() => {
    if (searchText.length > 2) {
      fetchPredictions(searchText);
    } else {
      setPredictions([]);
      setShowPredictions(false);
    }
  }, [searchText]);

  const fetchPredictions = async (input) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(input)}&key=${keyMap}&components=country:co&language=es`
      );
      const json = await response.json();
      
      console.log('📍 Predicciones recibidas:', json.predictions?.length || 0);
      
      if (json.status === 'OK' && json.predictions) {
        setPredictions(json.predictions);
        setShowPredictions(true);
        console.log('✅ showPredictions:', true);
        console.log('✅ Primera predicción:', json.predictions[0]?.description);
      } else {
        console.log('⚠️ Status:', json.status);
        setPredictions([]);
        setShowPredictions(false);
      }
    } catch (error) {
      console.error('❌ Error fetching predictions:', error);
    }
  };

  const fetchPlaceDetails = async (placeId) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${keyMap}&fields=geometry,name,formatted_address&language=es`
      );
      const json = await response.json();
      
      console.log('📌 Detalles recibidos:', json);
      
      if (json.status === 'OK' && json.result) {
        const { geometry, name, formatted_address } = json.result;
        const { lat, lng } = geometry.location;
        
        setSelectedPlace(name || formatted_address);
        setCoordinates({
          latitude: lat,
          longitude: lng,
        });
        
        console.log('✅ Lugar guardado:', {
          nombre: name || formatted_address,
          lat,
          lng
        });
      }
    } catch (error) {
      console.error('❌ Error fetching place details:', error);
    }
  };

  const handleSelectPrediction = (prediction) => {
    console.log('✅ Predicción seleccionada:', prediction.description);
    
    // Actualizar el texto del input
    setSearchText(prediction.description);
    
    // Limpiar y ocultar resultados
    setShowPredictions(false);
    setPredictions([]);
    
    // Cerrar el teclado
    Keyboard.dismiss();
    
    // Obtener detalles del lugar
    fetchPlaceDetails(prediction.place_id);
  };

  const renderPrediction = ({ item }) => (
    <TouchableOpacity
      style={styles.predictionItem}
      onPress={() => handleSelectPrediction(item)}
      activeOpacity={0.7}
    >
      <View>
        <Text style={styles.predictionMain}>
          {item.structured_formatting?.main_text || item.description}
        </Text>
        {item.structured_formatting?.secondary_text && (
          <Text style={styles.predictionSecondary}>
            {item.structured_formatting.secondary_text}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Test Google Places Autocomplete</Text>
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar dirección en Colombia..."
          placeholderTextColor="#999"
          value={searchText}
          onChangeText={(text) => {
            console.log('📝 Texto:', text);
            setSearchText(text);
          }}
          onFocus={() => {
            if (predictions.length > 0) {
              setShowPredictions(true);
            }
          }}
        />
        
        {searchText.length > 0 && (
          <TouchableOpacity
            style={styles.clearButton}
            onPress={() => {
              setSearchText('');
              setPredictions([]);
              setShowPredictions(false);
            }}
          >
            <Text style={styles.clearButtonText}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {showPredictions && predictions.length > 0 && (
        <View style={styles.predictionsContainer}>
          <View style={styles.debugHeader}>
            <Text style={styles.debugText}>
              🔍 {predictions.length} resultados
            </Text>
          </View>
          <FlatList
            data={predictions}
            renderItem={renderPrediction}
            keyExtractor={(item, index) => `${item.place_id}-${index}`}
            keyboardShouldPersistTaps="always"
            nestedScrollEnabled={true}
            scrollEnabled={true}
          />
        </View>
      )}

      {selectedPlace !== '' && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultTitle}>✅ Lugar seleccionado:</Text>
          <Text style={styles.resultText}>{selectedPlace}</Text>
          
          {coordinates && (
            <View style={styles.coordsContainer}>
              <Text style={styles.coordsText}>
                📍 Latitud: {coordinates.latitude}
              </Text>
              <Text style={styles.coordsText}>
                📍 Longitud: {coordinates.longitude}
              </Text>
            </View>
          )}
        </View>
      )}

      <View style={styles.instructions}>
        <Text style={styles.instructionText}>
          📍 Escribe al menos 3 letras
        </Text>
        <Text style={styles.instructionText}>
          ✅ Selecciona una opción de la lista
        </Text>
        <Text style={styles.instructionText}>
          👀 Revisa la consola para ver los logs
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    backgroundColor: '#4A90E2',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  searchContainer: {
    margin: 20,
    marginBottom: 0,
  },
  searchInput: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    color: 'black',
  },
  clearButton: {
    position: 'absolute',
    right: 10,
    top: 10,
    padding: 5,
  },
  clearButtonText: {
    fontSize: 20,
    color: '#999',
  },
  predictionsContainer: {
    marginHorizontal: 20,
    marginTop: 5,
    marginBottom: 10,
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#4A90E2',
    borderRadius: 8,
    maxHeight: 300,
    overflow: 'hidden',
  },
  debugHeader: {
    backgroundColor: '#4A90E2',
  },
  debugText: {
    padding: 8,
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 14,
  },
  predictionItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    backgroundColor: 'white',
  },
  predictionMain: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
    marginBottom: 4,
  },
  predictionSecondary: {
    fontSize: 13,
    color: '#666',
  },
  resultContainer: {
    margin: 20,
    padding: 15,
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  resultText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  coordsContainer: {
    marginTop: 5,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  coordsText: {
    fontSize: 12,
    color: '#999',
    marginBottom: 3,
  },
  instructions: {
    margin: 20,
    padding: 15,
    backgroundColor: '#fff3cd',
    borderRadius: 8,
  },
  instructionText: {
    fontSize: 14,
    color: '#856404',
    marginBottom: 5,
  },
});

export default TestAutoComplete;