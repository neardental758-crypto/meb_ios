import React, { useState, useEffect, useContext } from 'react';
import {
  Text,
  View,
  Pressable,
  StyleSheet,
  Image,
  Dimensions,
  ScrollView,
  Modal,
} from 'react-native';
import {
  collection,
  orderBy,
  query,
  onSnapshot,
  where,
} from 'firebase/firestore';
import { database } from '../../Services/firebase';
import { useFocusEffect } from '@react-navigation/native';
import {
  driver_carpooling_exit,
  trip_select,
  trip_select_reset,
  get_trip_carpooling,
  resetDataPasajeros,
  end_trip_carpooling,
  trip_for_edit,
  trip_select_solicitudes,
  trip_select_solicitud_reset,
  save_state_trip_rider,
  end_solicitud_carpooling
} from '../../actions/actionCarpooling'
import Fonts from '../../Themes/Fonts';
import { connect, useDispatch } from 'react-redux';
import Colors from '../../Themes/Colors';
import Images from '../../Themes/Images';
import { IconoNotificaciones } from '../../Components/carpooling/IconoNotificaciones';
import { IconoChat } from '../../Components/carpooling/IconoChat';
import { CarpoolingChatNotification } from './CarpolingChatNotification';
import * as RootNavigation from '../../RootNavigation';
import DrawerComponent from './CarpoolingDrawer';
import LottieView from 'lottie-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

function CarpoolingDriverTrips(props) {
  const dispatch = useDispatch();
  const [loadedTrips, setLoadedTrips] = useState(true);
  const [modalDeleteDriver, setModalDeleteDriver] = useState(false);
  const [modalDeleteRider, setModalDeleteRider] = useState(false);
  const [viajeDel, setViajeDel] = useState('');
  const [solicitudDel, setSolicitudDel] = useState('');
  const [showItinerario, setShowItinerario] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [modalChat, setModalChat] = useState(false);
  const [idChat, setIdChat] = useState('');
  const [showNotification, setShowNotification] = useState({});
  const [prevApplications, setPrevApplications] = useState({});
  const [chatNotifications, setChatNotifications] = useState({});
  const [messagesCount, setMessagesCount] = useState({});
  const prevMessagesCount = React.useRef({});
  const { dataCarpooling } = props;

  useFocusEffect(
    React.useCallback(() => {
      let isActive = true;

      const cargarViajes = async () => {
        setShowItinerario(null);
        setLoadedTrips(true);
        await dispatch(resetDataPasajeros());
        await dispatch(driver_carpooling_exit('Conductor', 1));
        await dispatch(get_trip_carpooling());

      };

      cargarViajes();

      return () => {
        isActive = false;
      };
    }, [])
  );

  const buscandoData = async () => {
    setLoadedTrips(true);
    setShowItinerario([]); // ← limpiás para evitar datos viejos momentáneamente

    await dispatch(driver_carpooling_exit('Conductor', currentPage));
    await dispatch(get_trip_carpooling());
  };

  const goToPage = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setShowItinerario(null);
      setLoadedTrips(true);
      dispatch(driver_carpooling_exit('Conductor', pageNumber));
      setCurrentPage(pageNumber);
    }
  };

  useEffect(() => {
    if (!showItinerario || showItinerario.length === 0) return;

    const chatIds = showItinerario.map(item => {
      if (item.tipo === 'driver') return item.data._id;
      if (item.tipo === 'rider') return item.data.idViajeSolicitado;
      return null;
    }).filter(id => id !== null);

    if (chatIds.length === 0) return;

    const uniqueChatIds = [...new Set(chatIds)];
    const unsubscribes = uniqueChatIds.map(chatId => {
      const collectionRef = collection(database, 'chats');
      const q = query(
        collectionRef,
        where('chat', '==', chatId),
        orderBy('createdAt', 'desc')
      );

      return onSnapshot(q, (querySnapshot) => {
        const currentCount = querySnapshot.size;
        const previousCount = prevMessagesCount.current[chatId] || 0;

        if (currentCount > previousCount && previousCount !== 0) {
          setChatNotifications((prev) => ({
            ...prev,
            [chatId]: true,
          }));
        }

        prevMessagesCount.current[chatId] = currentCount;
        setMessagesCount(prev => ({ ...prev, [chatId]: currentCount }));
      }, (error) => {
        console.warn(`Error en snapshot para chat ${chatId}:`, error);
      });
    });

    return () => unsubscribes.forEach(unsub => unsub());
  }, [showItinerario]);

  // Ocultar el modal cuando llegan los datos
  useEffect(() => {
    const data = dataCarpooling?.activeTrips?.data;
    if (Array.isArray(data)) {
      setShowItinerario(data);
      const delay = setTimeout(() => {
        setLoadedTrips(false);
      }, 500);
      return () => clearTimeout(delay);
    }
  }, [dataCarpooling?.activeTrips?.data]);

  // Manejar los estados de las notificaciones
  useEffect(() => {
    const data = dataCarpooling?.activeTrips?.data;
    if (!data || data.length === 0) return;

    const totalPages = dataCarpooling.activeTrips.pagination?.totalPages || 1;
    setTotalPages(totalPages);

    const newShowNotification = { ...showNotification };
    const newPrevApplications = { ...prevApplications };

    data.forEach((trip) => {
      if (trip.tipo === 'driver') {
        const tripId = trip.data._id;
        const applicationsCount = trip.data.viajeSolicitado.length;

        if (applicationsCount > (prevApplications[tripId] || 0)) {
          newShowNotification[tripId] = true;
        }

        newPrevApplications[tripId] = applicationsCount;
      }
    });

    setShowNotification(newShowNotification);
    setPrevApplications(newPrevApplications);
  }, [dataCarpooling?.activeTrips?.data]);


  const irViajeDriver = async (data) => {
    setLoadedTrips(true);
    await dispatch(trip_select_reset());
    await dispatch(trip_select(data, 'Conductor'));
    setLoadedTrips(false);
    RootNavigation.navigate('CarpoolingTripInProcess');
  };

  const irViajeRider = async (data) => {
    try {
      setLoadedTrips(true);
      await dispatch(save_state_trip_rider(data));
      // Convierte el objeto a string antes de guardarlo
      await AsyncStorage.setItem('viajePasajero', JSON.stringify(data));
      setLoadedTrips(false);
      RootNavigation.navigate('CarpoolingDetallesTrip');
    } catch (error) {
      console.error('Error al guardar viaje:', error);
      setLoadedTrips(false);
    }
  };

  useEffect(() => {
    const verificarViajeActivo = async () => {
      try {
        const viajeGuardado = await AsyncStorage.getItem('viajePasajero');

        if (viajeGuardado !== null) {
          // Convierte el string de vuelta a objeto
          const dataViaje = JSON.parse(viajeGuardado);

          // Despacha la información al store
          await dispatch(save_state_trip_rider(dataViaje));

          // Navega automáticamente a la pantalla del viaje
          RootNavigation.navigate('CarpoolingTripInProcessPasajero');
        }
      } catch (error) {
        console.error('Error al verificar viaje activo:', error);
      }
    };

    verificarViajeActivo();
  }, []);

  const editViaje = async (data) => {
    setLoadedTrips(true);
    await dispatch(trip_for_edit(data, 'Conductor'));
    setLoadedTrips(false);
    RootNavigation.navigate('CarpoolingEditTrip');
  };

  const irNotificaciones = async (data) => {
    await dispatch(trip_select_solicitud_reset());
    desactivarNotificacion(data._id);
    dispatch(trip_select_solicitudes(data));
    RootNavigation.navigate('CarpoolingSolicitudesViaje');
  };

  const desactivarNotificacion = (id) => {
    setShowNotification((prev) => ({
      ...prev,
      [id]: false,
    }));
  };

  const updateMessageCount = (chatId, count) => {
    setMessagesCount(prevState => ({
      ...prevState,
      [chatId]: count,
    }));
  };

  const irChat = (data, tipo) => {
    if (tipo === 'driver') {
      setIdChat(data._id);
      setModalChat(true);
      setChatNotifications(prev => ({
        ...prev,
        [data._id]: false
      }));
    } else {
      setIdChat(data.idViajeSolicitado);
      setModalChat(true);
      setChatNotifications(prev => ({
        ...prev,
        [data.idViajeSolicitado]: false
      }));
    }
  }

  const formatearFecha = (fecha) => {
    let fechaF = new Date(fecha);
    const opciones = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', timeZone: 'UTC' };
    const fechaFormateada = fechaF.toLocaleDateString('es-CO', opciones);
    return (fechaFormateada);
  }

  const eliminarViaje = async () => {
    const estado = { estado: 'CANCELADA' };

    await dispatch(end_trip_carpooling(viajeDel, estado));
    setModalDeleteDriver(false);
    setViajeDel('');

    await buscandoData();
  };

  const cancelarSolicitud = async () => {
    let estado = { "estadoSolicitud": "CANCELADA" }
    await setLoadedTrips(true);
    await dispatch(end_solicitud_carpooling(solicitudDel, estado));
    await setModalDeleteRider(false);
    await setSolicitudDel('');
    const timeoutId = setTimeout(() => {
      dispatch(driver_carpooling_exit('Conductor'));
      setLoadedTrips(false);
    }, 500);
    return () => clearTimeout(timeoutId);
  }

  const ModalEliminarViajeDriver = () => {
    return (
      <View style={stylesModalDel.contenedorModal}>
        <Modal transparent={true} animationType="slide">
          <View style={stylesModalDel.contenedor}>
            <View style={stylesModalDel.cajaA}>

              <View style={stylesModalDel.cajaAnimacion}>
                <Image
                  source={require('../../Resources/gif/stop.gif')}
                  style={{ width: "100%", height: "100%" }}
                />
              </View>

              <Text style={stylesModalDel.texto}>
                ¿Estás seguro de eliminar este viaje en el que eres conductor?
              </Text>
              <View style={stylesModalDel.cajaRow}>
                <Pressable
                  onPress={() => setModalDeleteDriver(false)}
                  style={[stylesModalDel.boton, { backgroundColor: Colors.$primario }]}
                >
                  <Text style={{ color: Colors.$blanco, fontFamily: Fonts.$poppinsregular }}>Cancelar</Text>
                </Pressable>
                <Pressable
                  onPress={() => eliminarViaje()}
                  style={[stylesModalDel.boton, { backgroundColor: Colors.$secundario }]}
                >
                  <Text style={{ fontFamily: Fonts.$poppinsregular }}>Si, Eliminar</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    )
  }

  const ModalEliminarViajeRider = () => {
    return (
      <View style={stylesModalDel.contenedorModal}>
        <Modal transparent={true} animationType="slide">
          <View style={stylesModalDel.contenedor}>
            <View style={stylesModalDel.cajaA}>
              <View style={stylesModalDel.cajaAnimacion}>
                <Image
                  source={require('../../Resources/gif/stop.gif')}
                  style={{ width: "100%", height: "100%" }}
                />
              </View>

              <Text style={stylesModalDel.texto}>
                ¿Estás seguro de eliminar este viaje en el que eres pasajero?
              </Text>
              <View style={stylesModalDel.cajaRow}>
                <Pressable
                  onPress={() => setModalDeleteRider(false)}
                  style={[stylesModalDel.boton, { backgroundColor: Colors.$primario }]}
                >
                  <Text style={{ color: Colors.$blanco }}>Cancelar</Text>
                </Pressable>
                <Pressable
                  onPress={() => cancelarSolicitud()}
                  style={[stylesModalDel.boton, { backgroundColor: Colors.$secundario }]}
                >
                  <Text>Si, Eliminar</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    )
  }

  const cajaModalChat = () => {
    return (
      <View style={stylesModal.contenedorModal}>
        <Modal transparent={true} animationType="slide">
          <View style={stylesModal.cajaModal}>
            <View style={stylesModal.cajaModal2}>
              <CarpoolingChatNotification
                idChat={idChat}
                updateMessageCount={updateMessageCount}
                chatNotifications={chatNotifications}
                setChatNotifications={setChatNotifications}
              />
              <View style={stylesModal.cabezaModal}>
                <Pressable
                  onPress={() => setModalChat(false)}
                  style={{ position: 'absolute', top: 10, left: 10 }}>
                  <Image style={{ width: 50, height: 50 }} resizeMode='contain' source={Images.iconoatras} />
                </Pressable>
                <Text style={stylesModal.titulo}>Chat Grupal carpooling</Text>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    )
  }


  if (loadedTrips || showItinerario === null) {
    return (
      <Modal transparent={true} visible={true}>
        <View style={{ backgroundColor: Colors.$secundario80, flexDirection: "column", flex: 1 }}>
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <LottieView
              source={require('../../Resources/Lotties/loading_carpooling.json')} autoPlay loop
              style={{
                width: Dimensions.get('window').width,
                height: Dimensions.get('window').height,
                backgroundColor: Colors.$blanco
              }}
            />
          </View>
        </View>
      </Modal>
    )
  }
  return (
    <View style={styles.contenedor}>
      {modalDeleteDriver ? ModalEliminarViajeDriver() : <></>}
      {modalDeleteRider ? ModalEliminarViajeRider() : <></>}
      {modalChat ? cajaModalChat() : <></>}
      <View style={{ flex: 1 }}>
        {/* Drawer component */}
        <View
          style={{
            flex: 1,
            position: 'absolute',
            width: '100%',
            height: '10%',
            bottom: 0,
            alignItems: 'center',
            backgroundColor: Colors.$texto50,
            zIndex: 5,
          }}
        >
          <DrawerComponent navigation={props.navigation} />
        </View>

        {/* Títulos de las vistas */}
        <View style={styles.cajaCabeza}>
          <View style={[styles.circle, { backgroundColor: Colors.$primario }]} />
          <Text style={[styles.textTitle, { color: Colors.$primario }]}>Conductor</Text>
          <Text style={[styles.textTitle, { color: Colors.$adicional }]}>Pasajero</Text>
          <View style={[styles.circle, { backgroundColor: Colors.$adicional }]} />
        </View>

        {/* Mostrar viajes activos */}
        <View style={styles.cards}>
          {showItinerario.length > 0 ? (
            <View style={styles.cajaTrips}>
              <ScrollView>
                {showItinerario.map((register) => {
                  const containerStyle =
                    register.tipo === 'driver' ? styles.driverContainer : styles.riderContainer;
                  return (
                    <View key={register.data?._id || register._id} style={[styles.tripCard, containerStyle]}>
                      {register.tipo === 'driver' ? (
                        <View style={styles.btnDriver}>
                          {/* Vista para 'driver' */}
                          <View style={styles.cajaRowVA}>
                            <View style={{ width: '80%' }}>
                              <Text
                                style={{
                                  fontSize: 16,
                                  color: Colors.$texto80,
                                  fontFamily: Fonts.$poppinsregular,
                                }}
                              >
                                Destino : {register.data.llegada}
                              </Text>
                              <Text style={styles.textFecha}>{formatearFecha(register.data.fecha)}</Text>
                            </View>
                            <View
                              style={{
                                width: 40,
                                height: 40,
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: 20,
                              }}
                            >
                              <Pressable onPress={() => irNotificaciones(register.data)}>
                                <IconoNotificaciones
                                  showNotification={showNotification}
                                  id={register.data._id}
                                />
                              </Pressable>
                              <Pressable onPress={() => irChat(register.data, 'driver')}>
                                <IconoChat
                                  chatNotifications={chatNotifications}
                                  setChatNotifications={setChatNotifications}
                                  id={register.data._id}
                                />
                              </Pressable>
                            </View>
                          </View>

                          <View style={styles.LineaHorizontal} />

                          <View style={styles.cajaRowIconos}>
                            <Text
                              style={{
                                fontSize: 14,
                                color: Colors.$texto50,
                                fontFamily: Fonts.$poppinslight,
                              }}
                            >
                              Asientos disponibles: {Number(register.data.asientosIda)}
                            </Text>
                            <View style={styles.cajaIcon}>
                              {/* <Pressable onPress={() => editViaje(register.data)}>
                                    <Image source={Images.e_icon} style={styles.iconBici2} />
                                  </Pressable> */}
                              <Pressable
                                onPress={() => {
                                  setViajeDel(register.data._id);
                                  setModalDeleteDriver(true);
                                }}
                              >
                                <Image source={Images.d_icon} style={[styles.iconBici2, { marginRight: 15 }]} />
                              </Pressable>

                              <Pressable onPress={() => irViajeDriver(register.data._id)}>
                                <Image source={Images.v_icon} style={styles.iconVerMas} />
                              </Pressable>
                            </View>
                          </View>
                        </View>
                      ) : register.tipo === 'rider' ? (
                        <View style={styles.btnRider}>
                          {/* Vista para 'rider' */}
                          <View style={styles.cajaRowVA}>
                            <View style={{ width: '75%' }}>
                              <Text
                                style={{
                                  fontSize: 16,
                                  color: Colors.$texto80,
                                  fontFamily: Fonts.$poppinsregular,
                                }}
                              >
                                Destino : {register.data.viajeSolicitado.llegada}
                              </Text>
                              <Text style={styles.textFecha}>{formatearFecha(register.data.viajeSolicitado.fecha)}</Text>
                            </View>
                            <View style={styles.cajaPartidaImg}>
                              {register.data.viajeSolicitado.compartidoVehiculo.tipo == 'Carro' ? <Image source={Images.carrorojo} style={styles.imgCarro} /> : <Image source={Images.moto} style={styles.imgMoto} />}
                            </View>
                          </View>

                          <View style={styles.LineaHorizontal} />

                          <View style={styles.cajaRowIconos}>
                            <Text
                              style={{
                                fontSize: 14,
                                color: Colors.$texto50,
                                fontFamily: Fonts.$poppinslight,
                              }}
                            >
                              {register.data.estadoSolicitud === "PENDIENTE" ? "Pendiente" : register.data.estadoSolicitud === "APROBADA" ? "Aprobado" : register.data.estadoSolicitud}
                            </Text>
                            <View style={styles.cajaIcon}>
                              <Pressable
                                onPress={() => {
                                  setModalDeleteRider(true),
                                    setSolicitudDel(register.data._id)
                                }}
                              >
                                <Image source={Images.d_icon} style={styles.iconBici2} />
                              </Pressable>
                              {
                                register.data.estadoSolicitud === "APROBADA" && (
                                  <>
                                    <Pressable onPress={() => irChat(register.data, 'rider')}>
                                      <IconoChat
                                        chatNotifications={chatNotifications}
                                        setChatNotifications={setChatNotifications}
                                        id={register.data.idViajeSolicitado}
                                      />
                                    </Pressable>
                                    <Pressable onPress={() => irViajeRider(register.data)}>
                                      <Image source={Images.v_icon} style={styles.iconVerMas} />
                                    </Pressable>
                                  </>
                                )
                              }
                            </View>
                          </View>
                        </View>
                      ) : null}
                    </View>
                  );
                })}
              </ScrollView>
              {/* Botones de paginación */}
              <View style={styles.paginationContainer}>
                <Pressable
                  onPress={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  style={[styles.paginationButton, currentPage === 1 && styles.disabledButton]}
                >
                  <Text style={styles.paginationText}>Anterior</Text>
                </Pressable>

                <Text style={styles.pageNumber}>
                  Página {currentPage} de {totalPages}
                </Text>

                <Pressable
                  onPress={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  style={[styles.paginationButton, currentPage === totalPages && styles.disabledButton]}
                >
                  <Text style={styles.paginationText}>Siguiente</Text>
                </Pressable>
              </View>
            </View>
          ) : <Text style={{ margin: 'auto', textAlign: 'center', fontSize: 22, color: 'gray' }}>No has agendado ningún viaje 😞</Text>}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    margin: 12,
    paddingLeft: 20,
    borderRadius: 20,
    fontSize: 16,
    backgroundColor: Colors.$secundario50,
    marginBottom: 10,
    fontFamily: Fonts.$poppinsregular
  },
  contenedor: {
    flex: 1,
    paddingTop: 50,
    backgroundColor: Colors.$blanco,
  },
  gif: {
    width: Dimensions.get('window').width * .8,
    height: 250,
  },
  iconMenu: {
    width: 50,
    height: 50,
  },
  cajaRow: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cajaRowVA: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: 'center',
    paddingLeft: 5,
    paddingRight: 5
  },
  cajaTrips: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height * .8,
  },
  textId: {
    textAlign: 'right',
    fontFamily: Fonts.$poppinsregular,
    fontSize: 12,
    marginBottom: 5,
    color: Colors.$overlayTranslucid,
  },
  textFecha: {
    width: Dimensions.get('window').width * .5,
    textAlign: 'left',
    fontSize: 14,
    color: Colors.$texto80,
    fontFamily: Fonts.$poppinslight
  },
  driverContainer: {
    marginLeft: 10,
    alignItems: 'flex-start', // Alinea a la derecha para los conductores
  },
  riderContainer: {
    marginRight: 10,
    alignItems: 'flex-end', // Alinea a la izquierda para los pasajeros
  },
  cajaCabeza: {
    paddingTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: Dimensions.get('window').width,
    backgroundColor: 'rgba(255, 255, 255, 0.6)'
  },
  cajaTituloCerrar: {
    width: "90%",
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cajaAceptarContinuar: {
    width: "90%",
    flexDirection: 'column',
    alignItems: 'left',
    justifyContent: 'space-between',
    padding: 10,
    marginTop: 20
  },
  CajaHorCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  cajaContinuar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10
  },
  btnAtras: {
    position: 'absolute',
    top: 30,
    left: 5,
    width: 50,
    height: 50,
    backgroundColor: Colors.$blanco,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 25
  },
  btnCheck: {
    width: 20,
    height: 20,
    borderWidth: 3,
    borderColor: Colors.$texto,
    borderRadius: 1,
    marginRight: 5
  },
  btnCheckOK: {
    width: 20,
    height: 20,
    borderWidth: 3,
    borderColor: Colors.$texto,
    borderRadius: 1,
    backgroundColor: Colors.$adicional,
    marginRight: 5
  },
  btnRefresh: {
    position: 'absolute',
    top: 50,
    right: 5,
    width: 50,
    height: 50,
    backgroundColor: Colors.$blanco,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 25
  },
  cards: {
    flex: 1,
    width: Dimensions.get('window').width,
    marginTop: 20,
    marginBottom: 20,
  },
  iconBici: {
    width: 40,
    height: 40,
  },
  iconBici2: {
    width: 30,
    height: 30,
  },
  iconVerMas: {
    width: 35,
    height: 35,
  },
  containerButtons: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height * .1,
    position: 'absolute',
    bottom: 0,
    backgroundColor: Colors.$primario,
  },
  textTitle: {
    fontSize: 18,
    color: Colors.$texto80,
    fontFamily: Fonts.$poppinsmedium,
  },
  textTitleTyC: {
    textAlign: 'center',
    fontSize: 18,
    fontFamily: Fonts.$poppinsregular,
    color: Colors.$texto,
  },
  buttonTouchableGray: {
    width: Dimensions.get('window').width * .8,
    height: 40,
    alignContent: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.$primario,
    position: 'absolute',
    bottom: 20,
    zIndex: 100,
    borderRadius: 20
  },
  buttonTyC: {
    width: "60%",
    height: 30,
    alignContent: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.$primario,
    zIndex: 100,
    borderRadius: 15,
    fontFamily: Fonts.$poppinsregular
  },
  textButton: {
    fontFamily: Fonts.$poppinsregular,
    textAlign: "center",
    fontSize: 20,
    paddingTop: 'auto',
    paddingBottom: 'auto',
    color: 'white',
    color: Colors.$blanco,
    alignSelf: "center",
  },
  textoTyC: {
    fontFamily: Fonts.$poppinsregular,
    textAlign: "center",
    justifyContent: "center",
    fontSize: 20,
    paddingTop: 'auto',
    paddingBottom: 'auto',
    color: Colors.$blanco,
  },
  cajaTyC: {
    backgroundColor: Colors.$blanco,
    width: Dimensions.get('window').width * .8,
    height: Dimensions.get('window').height * .7,
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingTop: 10,
    paddingBottom: 20,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 5,
      height: 5,
    },
    shadowOpacity: 1,
    shadowRadius: 5,
    elevation: 8,
  },
  cajaScrool: {
    width: "100%",
    height: "40%",
  },
  margin: {
    marginHorizontal: 30,
    // marginRight:35,
    // marginLeft:39,
  },
  marginNumbe: {
    marginHorizontal: 20,
    marginRight: 35,
    marginLeft: 55,
  },
  button: {
    border: 'none',
    marginHorizontal: 20,
    marginRight: 70,
    marginLeft: 71,
  },
  title: {
    fontFamily: Fonts.$montserratMedium,
    color: '#878787',
    fontSize: 20,
    // fontWeight:Platform.OS == 'ios'? '800:'',
  },
  subtitle: {
    fontFamily: Fonts.$montserratExtraBold,
    fontSize: 18,
    lineHeight: 31,
    color: Colors.$texto80,
  },
  text: {
    fontFamily: Fonts.$poppinsregular,
    fontSize: 15,
    lineHeight: 21,
    color: Colors.$texto80,
    textAlign: 'justify',
    marginTop: 10,
  },
  text2: {
    fontFamily: Fonts.$poppinsregular,
    fontSize: 12,
    lineHeight: 21,
    color: Colors.$texto80,
    textAlign: 'justify',
  },
  btnDriver: {
    flexDirection: "column",
    justifyContent: "flex-start",
    width: Dimensions.get('window').width * .8,
    minHeight: 100,
    marginBottom: 25,
    padding: 20,
    borderRadius: 10,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: Colors.$texto20,
    backgroundColor: Colors.$primario20,
  },
  btnRider: {
    flexDirection: "column",
    justifyContent: "flex-end",
    width: Dimensions.get('window').width * .8,
    minHeight: 100,
    marginBottom: 25,
    padding: 20,
    borderRadius: 10,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: Colors.$texto20,
    backgroundColor: Colors.$adicional20,
  },
  cajaRowIconos: {
    flex: 1,
    height: 40,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: 'space-between'
  },
  cajaIcon: {
    flexDirection: "row",
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: "40%",
    padding: 10
  },
  LineaHorizontal: {
    width: "100%",
    height: 3,
    backgroundColor: Colors.$texto,
    marginTop: 10,
    marginBottom: 10
  },
  circle: {
    width: 20,
    height: 20,
    borderRadius: 75,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    padding: 10,
  },
  paginationButton: {
    backgroundColor: Colors.$primario,
    fontFamily: Fonts.$poppinsregular,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginHorizontal: 5,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,  // Sombra para Android
    shadowColor: '#000',  // Sombra para iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  paginationText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
    fontFamily: Fonts.$poppinsregular,
  },
  disabledButton: {
    backgroundColor: Colors.$secundario,  // Color gris cuando está deshabilitado
    fontFamily: Fonts.$poppinsregular,
  },
  pageNumber: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginHorizontal: 10,
  },
  imgCarro: {
    width: 80,
    height: 80,
  },
  imgMoto: {
    width: 80,
    height: 50,
    marginTop: 15,
    marginBottom: 15
  },
});

const stylesModalDel = StyleSheet.create({
  contenedorModal: {
    position: 'absolute',
    top: 0,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
  },
  contenedor: {
    backgroundColor: "rgba(52, 52, 52, 0.9)",
    flexDirection: "column",
    flex: 1
  },
  cajaA: {
    flex: 3,
    borderRadius: 20,
    marginVertical: 200,
    marginHorizontal: 50,
    backgroundColor: Colors.$blanco,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 25
  },
  imagen: {
    width: 200,
    height: 200,
  },
  texto: {
    textAlign: "center",
    color: Colors.$cuarto,
    fontSize: 22,
    fontWeight: "400",
    marginTop: 20,
    marginBottom: 20,
    fontFamily: Fonts.$poppinsregular
  },
  cajaRow: {
    width: "100%",
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  boton: {
    width: 120,
    borderRadius: 15,
    alignItems: 'center',
    padding: 5
  },
  cajaAnimacion: {
    width: "100%",
    height: 250,
    alignItems: 'center',
  },
})

const stylesModal = StyleSheet.create({
  contenedorModal: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
  },
  cajaModal: {
    backgroundColor: "rgba(52, 52, 52, 0.9)",
    flexDirection: "column",
    flex: 1,
    height: Dimensions.get('window').width * .5
  },
  cajaModal2: {
    flex: 1,
    borderRadius: 20,
    marginVertical: 1,
    marginHorizontal: 1,
    backgroundColor: Colors.$blanco,
    position: 'relative'
  },
  cabezaModal: {
    position: 'absolute',
    top: 0,
    width: "100%",
    height: 100,
    backgroundColor: Colors.$blanco,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titulo: {
    fontSize: 20,

  }
})

function mapStateToProps(state) {
  return {
    dataUser: state.userReducer,
    dataRent: state.reducer3G,
    dataCarpooling: state.reducerCarpooling
  }
}
export default connect(mapStateToProps)(CarpoolingDriverTrips);
