import React, { useState, useEffect, useContext } from 'react';
import {
  Text,
  View,
  Pressable,
  StyleSheet,
  Image,
  Dimensions,
  ScrollView,
  ImageBackground,
  Alert
} from 'react-native';
import LottieView from 'lottie-react-native';
import Fonts from '../../Themes/Fonts';
import {
  reset_tyc,
  save_token_msn
} from '../../actions/actionCarpooling';
import {
  rentActive,
  getFallas,
  validateUser3g,
  validateHorarios,
  reserveActive,
  viewPenalizaciones,
  calcularDistancia,
  viewEstacion,
  viewVehiculo,
  saveReserva,
  changeVehiculo,
  validateRegister,
  savePenalization,
  cambiarEstadoReserva,
  decrementarSeg,
  saveStateBicicletero,
  cancelar__
} from '../../actions/actions3g';
import { connect, useDispatch } from 'react-redux';
import Colors from '../../Themes/Colors';
import Images from '../../Themes/Images';
import estilos from './styles/reservas4g';
import { AuthContext } from '../../AuthContext';
import { useFocusEffect } from '@react-navigation/native';
import * as RootNavigation from '../../RootNavigation';
import Bluetooth from './BluetoothClassicHome';
import { Env } from "../../Utils/enviroments";

function Home4G(props) {

  const dispatch = useDispatch();
  const { infoUser, logout } = useContext(AuthContext);
  const [segundos, setSegundos] = useState(props.dataRent.segundosResta);
  const [minutos, setMinutos] = useState(props.dataRent.minutosResta);
  const [horas, setHoras] = useState(props.dataRent.horasResta);
  const [diaRestante, setDiaRestante] = useState(props.dataRent.diaResta);
  const [mac, setMac] = useState(null);
  const [macCargado, setMacCargado] = useState(false);
  const [resArduino, setResArduino] = useState(null);
  const [claveHC05, setclaveHC05] = useState(null);
  const [claveHC05Cargada, setclaveHC05Cargada] = useState(false);
  const [numVehiculo, setNumVehiculo] = useState('');
  const [cancelar_, setCancelar_] = useState(false);
  const [prestamoHecho, setPrestamoHecho] = useState(false); //valor inicial false

  const conectarArduino = async (data) => {
    console.log('la data en conectarArduino', data)
    console.log('la mac', data.bc_bicicletero.bro_bluetooth)
    console.log('claveo', data.bc_bicicletero.bro_clave)
    console.log('props.dataRent.reservas home', props.dataRent.reservas)
    if (mac !== 'sin mac') {
      setMacCargado(true);
      setMac(data.bc_bicicletero.bro_bluetooth);
      setclaveHC05Cargada(true);
      setclaveHC05(data.bc_bicicletero.bro_clave);
      setNumVehiculo(data.bic_numero);
    }
  }

  const goBack = () => { RootNavigation.navigate('Home') }
  const vehiculos = async () => { await RootNavigation.navigate('Vehiculos4G') }
  const reservar = async () => { await RootNavigation.navigate('Reservar4G') }
  const iot = async () => { await RootNavigation.navigate('IoT') }

  const reservasActivas = async (cc) => {
    console.log('buscando reserva activa')
    const res = await dispatch(reserveActive(cc));
  }
  const prestamoActivo = async (cc) => {
    const res = await dispatch(rentActive(cc));
  }
  const liberar = async () => {
    console.log('liberar el vehículo');
  }

  useEffect(() => {
    const timer = setInterval(() => {
      if (segundos > 0) {
        setSegundos(segundos - 1);
      } else if (segundos == 0 && minutos > 0) {
        setMinutos(minutos - 1);
        setSegundos(59);
      } else if (segundos == 0 && minutos == 0 && horas > 0) {
        setHoras(horas - 1);
        setMinutos(59);
        setMinutos(59);
      } else if (segundos == 0 && minutos == 0 && horas == 0 && diaRestante > 0) {
        setDiaRestante(diaRestante - 1);
        setHoras(23);
        setMinutos(59);
        setMinutos(59);
      } else {
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [segundos])

  useEffect(() => {
    setSegundos(props.dataRent.segundosResta);
    setMinutos(props.dataRent.minutosResta);
    setHoras(props.dataRent.horasResta);
    setDiaRestante(props.dataRent.diaResta);
  }, [props.dataRent.segundosResta])

  const cancelarReserva = async () => {
    let vehiculo = props.dataRent.dataVehiculoReserva.bic_id;
    const data = { "res_id": props.dataRent.reservas.data[0].res_id, "estado": 'CANCELADA' }
    dispatch(cambiarEstadoReserva(data, vehiculo));
  }

  const refresh = async () => {
    await reservasActivas(infoUser.DataUser.idNumber);
    await prestamoActivo(infoUser.DataUser.idNumber);
  }

  const [conectado, setConectado] = useState(false);
  const conexion = async (valor) => {
    setConectado(valor);
  }

  useEffect(() => {
    refresh();
  }, [])

  useFocusEffect(
    React.useCallback(() => {
      refresh();
    }, [])
  );

  useEffect(() => {
    if (props.dataRent.vehiculoReservaCargada) {
      conectarArduino(props.dataRent.dataVehiculoReserva);
    }
  }, [props.dataRent.vehiculoReservaCargada])

  useEffect(() => {
    if (props.dataRent.resevaCancelada) {
      goBack();
    }
  }, [props.dataRent.resevaCancelada])

  useEffect(() => {
    console.log('props.dataRent.prestamoSave', props.dataRent.prestamoSave);
    if (props.dataRent.prestamoSave) {
      setPrestamoHecho(true);
    }
  }, [props.dataRent.prestamoSave])

  const cerrandoSesion = async () => {
    console.log('cerrando la sesion estamos en tablet');
    await dispatch(cancelar__());
    await logout();
  }

  useEffect(() => {
    if (props.dataRent.prestamoActivo) {
      if (Env.modo === 'tablet') {
        RootNavigation.navigate('FinalizarViaje')
        return
      }
      if (Env.modo === 'movil') {
        RootNavigation.navigate('ViajeActivo')
        return
      }
    }
  }, [props.dataRent.prestamoActivo])

  return (
    <ImageBackground source={Images.fondoMapa} style={styles.imgFondo}>
      <View style={{
        flex: 1,
        width: '100%',
        justifyContent: 'center',
      }}>
        <View style={styles.contenedor}>

          <View style={styles.cajaCabeza}>
            <Pressable
              onPress={() => { goBack() }}
              style={styles.btnAtras}>
              <View>
                <Image source={Images.menu_icon} style={[styles.iconMenu]} />
              </View>
            </Pressable>

          </View>

          {
            props.dataRent.vehiculoReservaCargada ?

              <View>
                {
                  props.dataRent.reservaVencida ?
                    <View style={{
                      width: Dimensions.get('window').width,
                      height: Dimensions.get('window').height * .8,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                      <Text style={[styles.textButton, { color: Colors.$prestada, marginTop: 50, marginBottom: 50 }]}>Tienes una reserva vencida.</Text>

                      <Pressable
                        onPress={() => { liberar() }}
                        style={{
                          width: 150,
                          height: 60,
                          backgroundColor: Colors.$taller,
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderRadius: 20
                        }}>
                        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                          <Text style={{
                            fontSize: 20,
                            fontFamily: Fonts.$poppinsregular,
                            color: Colors.$blanco
                          }}>
                            Liberar {props.dataRent.dataVehiculoReserva.bic_numero}
                          </Text>
                        </View>
                      </Pressable>
                    </View>
                    :
                    <View style={{
                      width: Dimensions.get('window').width * .9,
                      height: Dimensions.get('window').height * .8,
                      backgroundColor: Colors.$blanco,
                      alignItems: 'center',
                      justifyContent: 'space-around',
                      marginTop: 20,
                      marginBottom: 20,
                      padding: 20,
                      borderRadius: 30,
                      position: 'relative',
                    }}>
                      {
                        conectado ?
                          <View style={{
                            justifyContent: "center",
                            alignItems: "center",
                            width: Dimensions.get('window').width,
                            height: 'auto',
                            position: "absolute",
                            top: 0,
                            zIndex: -10
                          }}>
                            {
                              Env.modo === 'tablet' ?
                                ''
                                :
                                <LottieView source={require('../../Resources/Lotties/bicy_confetti.json')} autoPlay loop
                                  style={{
                                    width: Dimensions.get('window').width,
                                    height: Dimensions.get('window').width,
                                  }} />
                            }

                          </View>
                          :
                          <></>
                      }
                      <Text style={[styles.textButton, { color: Colors.$texto80 }]}>
                        {
                          prestamoHecho ?
                            'El préstamo se guardó correctamente.'
                            :
                            `Tienes el vehículo ${props.dataRent.dataVehiculoReserva.bic_numero} reservado`
                        }
                      </Text>
                      {
                        macCargado ?
                          <Bluetooth
                            mac={mac}
                            macCargado={macCargado}
                            claveHC05={claveHC05}
                            claveHC05Cargada={claveHC05Cargada}
                            numVehiculo={numVehiculo}
                            conexion={conexion}
                          //respuestaArduino={respuestaArduino}
                          />
                          :
                          <></>
                      }

                      {
                        cancelar_ ?
                          <View style={{
                            width: Dimensions.get('window').width,
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexDirection: 'column',
                          }}>
                            <Text style={{
                              fontSize: 20,
                              fontFamily: Fonts.$poppinsregular,
                              marginBottom: 5,
                              marginTop: 5,
                              color: Colors.$texto80
                            }}>Cancelar la reserva</Text>
                            <View style={{
                              width: Dimensions.get('window').width,
                              height: 100,
                              flexDirection: 'row',
                              alignItems: 'center',
                              justifyContent: 'space-around',
                            }}>
                              <Pressable
                                onPress={() => { cancelarReserva() }}
                                style={{
                                  width: 80,
                                  height: 80,
                                  backgroundColor: Colors.$taller,
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  borderRadius: 40
                                }}>
                                <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                                  <Text style={{
                                    fontSize: 18,
                                    fontFamily: Fonts.$poppinsregular,
                                    color: Colors.$blanco
                                  }}>
                                    SI
                                  </Text>
                                </View>
                              </Pressable>
                              <Pressable
                                onPress={() => { setCancelar_(false) }}
                                style={{
                                  width: 80,
                                  height: 80,
                                  backgroundColor: Colors.$taller,
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  borderRadius: 40
                                }}>
                                <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                                  <Text style={{
                                    fontSize: 18,
                                    fontFamily: Fonts.$poppinsregular,
                                    color: Colors.$blanco
                                  }}>
                                    NO
                                  </Text>
                                </View>
                              </Pressable>
                            </View>

                          </View>
                          :
                          <Pressable
                            onPress={() => { prestamoHecho ? Alert.alert('Ya se realizó el prestamo') : setCancelar_(true) }}
                            style={{
                              width: 250,
                              height: 50,
                              backgroundColor: Colors.$primario,
                              alignItems: 'center',
                              justifyContent: 'center',
                              borderRadius: 30,
                              marginTop: 50
                            }}>
                            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                              <Text style={{
                                fontSize: 18,
                                fontFamily: Fonts.$poppinsregular,
                                color: Colors.$blanco,
                                borderRadius: 20

                              }}>
                                {prestamoHecho ? 'Préstamo exitoso' : 'Cancelar Reserva'}
                              </Text>
                            </View>
                          </Pressable>
                      }

                      {
                        prestamoHecho ?
                          <></>
                          :
                          <View style={{
                            width: Dimensions.get('window').width,
                            flex: 1,
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginTop: 50
                          }}>

                            <Text style={[styles.textButton, { color: Colors.$texto50, marginBottom: 5 }]}>La reserva vence en:</Text>
                            <View style={estilos.cajaCuentaRegresiva}>
                              <View style={estilos.subcajaCuentaRegresiva}>
                                <Text style={estilos.numeroCuentaRegrasiva}>
                                  {(diaRestante < 10) ? '0' + diaRestante : diaRestante}
                                </Text>
                                <Text style={estilos.subtextoCuentaR}>dias</Text>
                              </View>
                              <Text>:</Text>
                              <View style={estilos.subcajaCuentaRegresiva}>
                                <Text style={estilos.numeroCuentaRegrasiva}>
                                  {(horas < 10) ? '0' + horas : horas}
                                </Text>
                                <Text style={estilos.subtextoCuentaR}>horas</Text>
                              </View>
                              <Text>:</Text>
                              <View style={estilos.subcajaCuentaRegresiva}>
                                <Text style={estilos.numeroCuentaRegrasiva}>
                                  {(minutos < 10) ? '0' + minutos : minutos}
                                </Text>
                                <Text style={estilos.subtextoCuentaR}>minutos</Text>
                              </View>
                              <Text>:</Text>
                              <View style={estilos.subcajaCuentaRegresiva}>
                                <Text style={estilos.numeroCuentaRegrasiva}>
                                  {(segundos < 10) ? '0' + segundos : segundos}
                                </Text>
                                <Text style={estilos.subtextoCuentaR}>segundos</Text>
                              </View>
                            </View>
                          </View>
                      }


                    </View>

                }
              </View>
              :
              <View style={{
                width: '100%',
                height: 'auto',
                alignItems: 'center',
                justifyContent: 'center',

              }}>
                <Text style={styles.titulo}>Movilidad 4G</Text>
                {
                  Env.modo === 'tablet' ?
                    ''
                    :
                    <View style={{
                      justifyContent: "center",
                      alignItems: "center",
                      width: Dimensions.get('window').width,
                      height: 'auto',
                    }}>
                      <LottieView source={require('../../Resources/Lotties/bicy_03.json')} autoPlay loop
                        style={{
                          width: Dimensions.get('window').width,
                          height: 350
                        }} />
                    </View>
                }



                {
                  Env.modo === 'tablet' ?
                    <></>
                    :
                    <View style={styles.containerButtons}>
                      <Pressable
                        onPress={() => { reservar() }}
                        style={styles.button}>
                        <Text style={styles.textButton}>Reservar</Text>
                      </Pressable>
                    </View>
                }


                {/*<View style={styles.containerButtons}>
              <Pressable 
                onPress={() => { vehiculos() }} 
                style={styles.button}>
                <Text style={styles.textButton}>Rentar</Text>
              </Pressable>
            </View>*/}
              </View>
          }

        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    alignItems: "center",
    justifyContent: "center",
    position: 'relative',
  },
  cajaAnimacion: {
    width: Dimensions.get('window').width,
    height: 250,
  },
  imgFondo: {
    flex: 1,
    width: '100%',
    justifyContent: 'center'
  },
  gif: {
    width: Dimensions.get('window').width,
    height: 250,
  },
  cajaCabeza: {
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 1,
    width: Dimensions.get('window').width,
    height: 80,
    zIndex: 10000,
    flexDirection: 'row',
    position: 'absolute',
    top: 0,
  },
  titulo: {
    fontFamily: Fonts.$poppinsmedium,
    fontSize: 22,
    color: Colors.$blanco,
    alignItems: 'center',
    textAlign: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  logoGif: {
    width: 120,
    height: 120,
    zIndex: 100
  },
  textTitle: {
    marginTop: 20,
    marginBottom: 20,
    fontSize: 25,
    fontFamily: Fonts.$poppinsmedium,
    alignSelf: "center",
    color: 'white',
  },
  btnAtras: {
    position: 'absolute',
    top: 15,
    left: 10,
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 25,
    zIndex: 100
  },
  iconMenu: {
    width: 50,
    height: 50,
  },
  containerButtons: {
    marginTop: 15,
    marginBottom: 15,
    alignSelf: 'center',
  },

  button: {
    width: Dimensions.get('window').width * .5,
    textAlignVertical: 'bottom',
    padding: 8,
    backgroundColor: Colors.$primario,
    borderRadius: 50,
    shadowColor: "#000",
    shadowOffset: {
      width: 5,
      height: 5,
    },
    shadowOpacity: 1,
    shadowRadius: 5,
    elevation: 8,
  },

  textButton: {
    fontFamily: Fonts.$poppinsregular,
    fontSize: 20,
    paddingTop: 'auto',
    paddingBottom: 'auto',
    color: 'white',
    color: Colors.$blanco,
    alignSelf: "center",
    width: '80%',
    textAlign: 'center',
  },
});

function mapStateToProps(state) {
  return {
    dataUser: state.userReducer,
    dataRent: state.reducer3G,
  }
}
export default connect(mapStateToProps)(Home4G);
