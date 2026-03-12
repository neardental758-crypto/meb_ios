import React, { useState, useEffect } from 'react';
import {
    Image,
    View,
    StyleSheet,
    Dimensions,
    Platform,
    Animated
} from 'react-native';
import Colors from '../../Themes/Colors';
import MapView, { Marker, PROVIDER_DEFAULT, PROVIDER_GOOGLE, Polyline } from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import MapViewDirections from 'react-native-maps-directions';
import { Env } from "../../../keys";


const keyMap = Env.key_map_google
const mapRef = React.createRef();
export function Mapa(props){
    const alturaFinal = props.alturaMapa.__getValue() === 0 ? Dimensions.get("window").height * 0.6 : props.alturaMapa;
    const { 
        coorSalida, 
        coorLlegada, 
        coorCargadas, 
        ruta, 
        coorSalidaSolicitud,
        coorLlegadaSolicitud,
        rutaSolicitud,
        valorDistancia,
        valorDuracionGoogle,
        sendMapConfirmation,
        setSendMapConfirmation
    } = props;
    const [ distance, setDistance ] = useState(null);
    
    const [region, setRegion] = useState({
        latitude: 4.7016,
        longitude: -74.1469,
        latitudeDelta: 0.04,
        longitudeDelta: 0.04,
      });

    const getPosition = () =>{
        Geolocation.getCurrentPosition(
            geoSuccess,
            geoFailed,
            geoSetup
        );
      }
    
      const geoSuccess = (positionActual) => {
          let { latitude, longitude } = positionActual.coords
          setRegion({
            ...region,
            latitude: latitude ,
            longitude: longitude ,
          })
      }
    
      const geoFailed = (error) => {
          console.log("error de ubicación", error)
      }
    
      geoSetup = Platform.OS == "android" ?
      {
          enableHighAccuracy: true,
          timeout: 100000
      } : 
      {
          enableHighAccuracy: true,
          timeout: 100000,
          maximumAge: 3600000
      }
      useEffect(() => {
        getPosition();
        if (ruta) {
           console.log('cordendas por props', coorSalida)
            console.log('cordendas por props', coorLlegada) 
        }
      },[])

      useEffect(() => {
        if(sendMapConfirmation == false){
            setRegion({
              ...region,
              latitude: coorSalidaSolicitud.lat ,
              longitude: coorSalidaSolicitud.lng ,
            })
            setSendMapConfirmation(true);
          }
      }, [sendMapConfirmation , region , setSendMapConfirmation]);

    return (
    <Animated.View style={[styles.contenedor, { height: alturaFinal }]}>
        <MapView
            ref={mapRef}
            loadingEnabled={true}
            showsMyLocationButton={true}
            showsCompass={true}
            showsScale={true}
            showsUserLocation={true}
            provider={Platform.OS == 'android' ? PROVIDER_GOOGLE : PROVIDER_DEFAULT}
            style={[styles.mapa, { height: props.altura || Dimensions.get("window").height * 0.6 }]}
            region={region}
        >   
            {
              (coorCargadas) ?
              <>
                <Marker
                    draggable
                    key='2'
                    coordinate={{
                        latitude: Number(coorSalida.lat),
                        longitude: Number(coorSalida.lng),
                    }}
                    description={"Salida"}
                    onDragEnd={(direction) => setMiPosicion(direction)}
                />
                <Marker
                    draggable
                    key='3'
                    coordinate={{
                        latitude: Number(coorLlegada.lat),
                        longitude: Number(coorLlegada.lng),
                    }}
                    description={"Destino"}
                    onDragEnd={(direction) => setMiPosicion(direction)}
                >
                    <Image style={{ height: 50, width: 50, resizeMode: "contain" }} source={require('../../Resources/Images/flag.png')} ></Image>
                </Marker>
                {ruta && (
                    <MapViewDirections
                    origin={{
                        latitude: Number(coorSalida.lat),
                        longitude: Number(coorSalida.lng),
                    }}
                    destination={{
                        latitude: Number(coorLlegada.lat),
                        longitude: Number(coorLlegada.lng),
                    }}
                    apikey={keyMap}
                    strokeColor={Colors.$primario}
                    strokeWidth={6}
                    onError={(error) => console.log('Error en MapViewDirections:', error)}
                    onReady={(result) => {
                        setDistance(result.distance);
                        valorDistancia(result.distance);
                        valorDuracionGoogle(result.duration);
                    }}
                    />
                )}
                { 
                    rutaSolicitud ?
                    <>
                    <Marker
                        draggable
                        key='2'
                        coordinate={{
                            latitude: Number(coorSalidaSolicitud.lat),
                            longitude: Number(coorSalidaSolicitud.lng),
                        }}
                        description={"Mi posicion"}
                        onDragEnd={(direction) => setMiPosicion(direction)}
                    />
                    <Marker
                        draggable
                        key='3'
                        coordinate={{
                            latitude: Number(coorLlegadaSolicitud.lat),
                            longitude: Number(coorLlegadaSolicitud.lng),
                        }}
                        description={"Mi posicion"}
                        onDragEnd={(direction) => setMiPosicion(direction)}
                    >
                        <Image style={{ height: 50, width: 50, resizeMode: "contain" }} source={require('../../Resources/Images/flag.png')} ></Image>
                    </Marker>
                    <MapViewDirections
                        origin={{
                            latitude: Number(coorSalidaSolicitud.lat),
                            longitude: Number(coorSalidaSolicitud.lng),
                        }}
                        destination={{
                            latitude: Number(coorLlegadaSolicitud.lat),
                            longitude: Number(coorLlegadaSolicitud.lng),
                        }}
                        apikey={keyMap} //key 
                        strokeColor={Colors.$adicional}
                        strokeWidth={6}
                        onReady={(result) => {
                            setDistance(result.distance); // Almacena la distancia calculada en el estado
                    }}/>
                    </>
                    :
                    <></>
                }
              </>
              :
              <></>
            }

        </MapView>
    </Animated.View>
    )
}

const styles = StyleSheet.create({
    contenedor: {
      flex: 1,
      width: Dimensions.get('window').width,
      height: Dimensions.get('window').height,
      backgroundColor: Colors.$blanco,
      alignItems: "center",
      position: "relative"
    },
    mapa: {
      flex: 1, 
      width: Dimensions.get("window").width,
    },
  });