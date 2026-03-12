import React, { useState, useEffect, useContext, useCallback, useMemo } from 'react';
import {
  Text,
  View,
  Pressable,
  StyleSheet,
  Image,
  Dimensions,
  Modal,
  FlatList,
  ActivityIndicator
} from 'react-native';
import { get_indicadores_trip } from '../../actions/actionPerfil';
import { connect, useDispatch } from 'react-redux';
import Colors from '../../Themes/Colors';
import Images from '../../Themes/Images';
import Fonts from '../../Themes/Fonts';
import * as RootNavigation from '../../RootNavigation';
import { AuthContext } from '../../AuthContext';
import RNPickerSelect from '@nejlyg/react-native-picker-select';
import { Tarjeta } from './Tarjeta';
import { Estrellas } from './Estrellas';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Constantes para los módulos
const MODULES = {
  '3g': 'Movilidad 3g',
  '4g': 'Movilidad 4g',
  '5g': 'Movilidad 5g',
  'carpooling': 'Carro Compartido',
  'vp': 'Vehículo particular',
  'parquadero': 'Parquedero',
  'electrohub': 'Electrohub',
  'ruta_corporativa': 'Ruta Corporativa'
};

// Estados de vehículos
const VEHICLE_STATES = {
  'DISPONIBLE': Colors.$disponible,
  'RESERVADA': Colors.$reservada,
  'PRESTADA': Colors.$prestada,
  'INACTIVA': Colors.$inactiva,
  'EN TALLER': Colors.$taller,
  'CAMBIAR CLAVE': Colors.$prestada
};

// Hook personalizado para módulos activos
const useActiveModules = (dataempresa) => {
  return useMemo(() => {
    if (!dataempresa?.[0]) return {};

    const empresa = dataempresa[0];
    return {
      '3g': ['ACTIVO', 'ACTIVO+RESERVAS', 'ACTIVO-RESERVAS'].includes(empresa._3G),
      '4g': empresa._4G === 'ACTIVO',
      '5g': empresa._5G === 'ACTIVO',
      'electrohub': ['ACTIVO', 'ACTIVO+SALDO'].includes(empresa._electrohub),
      'parquadero': empresa._parquadero === 'ACTIVO',
      'carpooling': ['ACTIVO', 'ACTIVO+PAGOS', 'ACTIVO-PAGOS'].includes(empresa._carro_compartido),
      'ruta_corporativa': empresa._ruta_corporativa === 'ACTIVO',
      'vp': empresa._vehiculo_particular === 'ACTIVO'
    };
  }, [dataempresa]);
};

// Componente para elementos vacíos
const EmptyState = ({ message }) => (
  <View style={estilos.emptyContainer}>
    <Text style={estilos.emptyText}>{message}</Text>
  </View>
);

// Componente para el item de viaje
const TripItem = ({ data, modulo, onPress, formatearFecha, getVehicleIcon, getVehicleStyle }) => {
  const renderVehicleInfo = () => {
    switch (modulo) {
      case '3g':
      case '4g':
        return (
          <>
            <View style={[estilos.vehicleContainer, { backgroundColor: Colors.$adicional }]}>
              <View style={getVehicleStyle(data.bc_bicicleta.bic_estado)}>
                {getVehicleIcon(data.bc_bicicleta.bic_nombre)}
                <Text style={estilos.vehicleNumber}>{data.bc_bicicleta.bic_numero}</Text>
              </View>
            </View>
            <View style={estilos.dateContainer}>
              <Text style={estilos.dateLabel}>Fecha</Text>
              <Text style={estilos.dateText}>{formatearFecha(data.pre_retiro_fecha)}</Text>
            </View>
          </>
        );

      case 'vp':
        return (
          <>
            <View style={estilos.vehicleImageContainer}>
              <Image source={{ uri: data.vehiculo.vus_img }} style={estilos.vehicleImage} />
            </View>
            <View style={estilos.dateContainer}>
              <Text style={estilos.dateLabel}>Fecha</Text>
              <Text style={estilos.dateText}>{formatearFecha(data.via_fecha_creacion)}</Text>
            </View>
          </>
        );

      case '5g':
        return (
          <>
            <View style={estilos.qrContainer}>
              <Image source={Images.qr_} style={estilos.qrIcon} />
              <Text style={estilos.qrNumber}>{data.pre_bicicleta}</Text>
            </View>
            <View style={estilos.dateContainer}>
              <Text style={estilos.dateLabel}>Fecha</Text>
              <Text style={estilos.dateText}>{formatearFecha(data.pre_retiro_fecha)}</Text>
            </View>
          </>
        );

      case 'carpooling':
        return (
          <>
            <View style={estilos.vehicleImageContainer}>
              <Image
                source={data.compartidoVehiculo.tipo === 'Carro' ? Images.carrorojo : Images.moto}
                style={estilos.vehicleImage}
              />
            </View>
            <View style={estilos.dateContainer}>
              <Text style={estilos.dateLabel}>Fecha</Text>
              <Text style={estilos.dateText}>{formatearFecha(data.fecha)}</Text>
            </View>
          </>
        );

      default:
        return null;
    }
  };

  const shouldShowArrow = () => {
    if (modulo === '3g' || modulo === '4g') {
      return data.pre_estado !== 'CANCELADA';
    }
    return true;
  };

  return (
    <View style={estilos.tripItem}>
      <View style={estilos.tripContent}>
        {renderVehicleInfo()}
      </View>

      {shouldShowArrow() && (
        <Pressable onPress={() => onPress(data)} style={estilos.arrowButton}>
          <Image source={Images.flecha_icon} style={estilos.arrowIcon} />
        </Pressable>
      )}
    </View>
  );
};

function MisViajes(props) {
  const { isLogin, token, infoUser } = useContext(AuthContext);
  const dispatch = useDispatch();

  // Estados
  const [modulo, setModulo] = useState('');
  const [modalDetalle, setModalDetalle] = useState(false);
  const [dataDetalle, setDataDetalle] = useState(null);
  const [calificacionViaje, setCalificacionViaje] = useState(0);
  const [calificacionCantidad, setCalificacionCantidad] = useState(0);
  const [loading, setLoading] = useState(false);

  // Estados para paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const itemsPerPage = 10;

  // Módulos activos
  const activeModules = useActiveModules(props.perfil.dataempresa);

  // Obtener datos filtrados y ordenados según el módulo
  const getFilteredData = useCallback(() => {
    if (!modulo) return [];

    let data = [];

    switch (modulo) {
      case '3g':
        // Viajes 3G: desde bc_prestamos con pre_modulo='3g'
        data = props.dataRent.viajes3G || [];
        data.sort((a, b) => new Date(b.pre_retiro_fecha) - new Date(a.pre_retiro_fecha));
        break;

      case '4g':
        // Viajes 4G: desde bc_prestamos con pre_modulo='4g'
        data = props.dataRent.viajes4G || [];
        data.sort((a, b) => new Date(b.pre_retiro_fecha) - new Date(a.pre_retiro_fecha));
        break;

      case 'vp':
        data = props.dataRent.viajesVP || [];
        data.sort((a, b) => new Date(b.via_fecha_creacion) - new Date(a.via_fecha_creacion));
        break;

      case '5g':
        // Viajes 5G: desde bc_prestamos con pre_modulo='5g'
        data = props.dataRent.viajes5G || [];
        data.sort((a, b) => new Date(b.pre_retiro_fecha) - new Date(a.pre_retiro_fecha));
        break;

      case 'carpooling':
        data = props.dataRent.viajesCarpooling || [];
        data.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
        break;

      default:
        return [];
    }

    return data;
  }, [modulo, props.dataRent]);

  const allFilteredData = useMemo(() => getFilteredData(), [getFilteredData]);

  // Datos paginados
  const paginatedData = useMemo(() => {
    const endIndex = currentPage * itemsPerPage;
    return allFilteredData.slice(0, endIndex);
  }, [allFilteredData, currentPage]);

  const hasMoreData = useMemo(() => {
    return allFilteredData.length > paginatedData.length;
  }, [allFilteredData.length, paginatedData.length]);

  // Opciones del picker
  const pickerItems = useMemo(() => {
    return Object.entries(activeModules)
      .filter(([key, isActive]) => isActive)
      .map(([key, _]) => ({
        label: MODULES[key],
        value: key
      }));
  }, [activeModules]);

  // Utilidades
  const formatearFecha = useCallback((fecha) => {
    const fechaF = new Date(fecha);
    const opciones = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      timeZone: 'UTC'
    };
    return fechaF.toLocaleDateString('es-CO', opciones);
  }, []);

  const getVehicleStyle = useCallback((estado) => ({
    ...estilos.vehicleStateBase,
    backgroundColor: VEHICLE_STATES[estado] || 'white'
  }), []);

  const getVehicleIcon = useCallback((tipo) => {
    const iconMap = {
      'electrica': Images.bicycle_Icon,
      'patineta': Images.patin_Icon,
      'mecanica': Images.cycle_Icon
    };

    const iconSource = iconMap[tipo];
    return iconSource ? (
      <Image source={iconSource} style={[estilos.vehicleIcon, { tintColor: Colors.$inactiva }]} />
    ) : null;
  }, []);

  // Handlers
  const goBack = useCallback(() => {
    RootNavigation.navigate('PerfilHome');
  }, []);

  const iraDetalle = useCallback(async (data) => {
    setLoading(true);
    try {
      setDataDetalle(data);
      setModalDetalle(true);

      // Reset calificaciones
      setCalificacionViaje(0);
      setCalificacionCantidad(0);

      if (modulo === '3g' || modulo === '4g') {
        await dispatch(get_indicadores_trip(data.pre_id));
      } else if (modulo === '5g') {
        await dispatch(get_indicadores_trip(data.pre_id));
      } else if (modulo === 'carpooling') {
        data.compartidoComentarios?.forEach((comentario) => {
          setCalificacionViaje(prev => prev + Number(comentario.calificacion));
          setCalificacionCantidad(prev => prev + 1);
        });
      }
    } catch (error) {
      console.error('Error al cargar detalles:', error);
    } finally {
      setLoading(false);
    }
  }, [modulo, dispatch]);

  const closeModal = useCallback(() => {
    setModalDetalle(false);
    setDataDetalle(null);
    setCalificacionViaje(0);
    setCalificacionCantidad(0);
  }, []);

  const onModuleChange = useCallback((value) => {
    setModulo(value);
    setCurrentPage(1); // Reset pagination when module changes
  }, []);

  // Función para cargar más elementos
  const loadMoreItems = useCallback(() => {
    if (hasMoreData && !isLoadingMore) {
      setIsLoadingMore(true);

      // Simular delay de red para una mejor UX
      setTimeout(() => {
        setCurrentPage(prev => prev + 1);
        setIsLoadingMore(false);
      }, 300);
    }
  }, [hasMoreData, isLoadingMore]);

  // Reset pagination when module changes
  useEffect(() => {
    setCurrentPage(1);
  }, [modulo]);

  // Render del modal
  const renderModal = () => (
    <Modal
      transparent={true}
      animationType="slide"
      visible={modalDetalle}
      onRequestClose={closeModal}
    >
      <View style={estilos.overlay}>
        <View style={estilos.modalContent}>
          <Pressable onPress={closeModal} style={estilos.closeButton}>
            <Image style={estilos.closeIcon} resizeMode='contain' source={Images.x_icon} />
          </Pressable>

          {loading && (
            <View style={estilos.loadingContainer}>
              <ActivityIndicator size="large" color={Colors.$primario} />
            </View>
          )}

          {/* Contenido completo del modal */}
          {dataDetalle && (
            <FlatList
              style={estilos.modalScrollView}
              contentContainerStyle={estilos.modalScrollContent}
              data={[{ key: 'content' }]}
              renderItem={() => (
                <View style={estilos.modalBody}>

                  {/* Indicadores para módulos 3g, 4g, 5g */}
                  {(modulo === '3g' || modulo === '4g' || modulo === '5g') && props.perfil.cargado_indicadores_trip && (
                    <View style={estilos.indicatorsContainer}>
                      <Tarjeta
                        icono={Images.vpTiempo}
                        titulo={'Tiempo (h:m:s)'}
                        texto1={props.perfil.indicadores_trip.ind_duracion}
                        texto2={'Min'}
                        elcolor={Colors.$adicional}
                      />
                      <Tarjeta
                        icono={Images.vpCalorias}
                        titulo={'Calorías (kcal)'}
                        texto1={props.perfil.indicadores_trip.ind_calorias}
                        texto2={'Kcal'}
                        elcolor={Colors.$primario}
                      />
                      <Tarjeta
                        icono={Images.distancia_}
                        titulo={'Distancia (Kms)'}
                        texto1={props.perfil.indicadores_trip.ind_distancia}
                        texto2={''}
                        elcolor={Colors.$adicional}
                      />
                      <Tarjeta
                        icono={Images.vpCo2}
                        titulo={'Co2 (Grs)'}
                        texto1={props.perfil.indicadores_trip.ind_co2}
                        texto2={'Co2'}
                        elcolor={Colors.$primario}
                      />
                    </View>
                  )}

                  {/* Detalles para módulos 3g y 4g */}
                  {(modulo === '3g' || modulo === '4g') && (
                    <View style={estilos.sectionContainer}>
                      <Tarjeta
                        icono={Images.bicycle_Icon}
                        titulo={'Vehículo'}
                        texto1={dataDetalle.bc_bicicleta.bic_numero}
                        texto2={dataDetalle.bc_bicicleta.bic_nombre}
                        elcolor={Colors.$adicional}
                      />
                      <View style={estilos.infoGroup}>
                        <Text style={estilos.infoText}>Inicio: {formatearFecha(dataDetalle.pre_retiro_fecha)}</Text>
                        <Text style={estilos.infoText}>Entrega: {formatearFecha(dataDetalle.pre_devolucion_fecha)}</Text>
                        <Text style={estilos.infoText}>Estado: {dataDetalle.pre_estado}</Text>
                      </View>
                    </View>
                  )}

                  {/* Detalles para módulo 5g */}
                  {modulo === '5g' && (
                    <View style={estilos.sectionContainer}>
                      <Tarjeta
                        icono={Images.qr_}
                        titulo={'Viaje 5G'}
                        texto1={dataDetalle.pre_bicicleta}
                        texto2={dataDetalle.pre_estado}
                        elcolor={Colors.$adicional}
                      />
                      <View style={estilos.infoGroup}>
                        <Text style={estilos.infoText}>Fecha inicio</Text>
                        <Text style={estilos.infoText}>{formatearFecha(dataDetalle.pre_retiro_fecha)}</Text>
                        <Text style={estilos.infoText}>Fecha Entrega</Text>
                        <Text style={estilos.infoText}>{formatearFecha(dataDetalle.pre_devolucion_fecha)}</Text>
                        <Text style={estilos.infoText}>Estado: {dataDetalle.pre_estado}</Text>
                      </View>
                    </View>
                  )}

                  {/* Detalles para carpooling */}
                  {modulo === 'carpooling' && (
                    <View style={estilos.sectionContainer}>
                      <Tarjeta
                        icono={dataDetalle.compartidoVehiculo.tipo === 'Carro' ? Images.carrorojo2 : Images.moto}
                        titulo={dataDetalle.compartidoVehiculo.marca}
                        texto1={dataDetalle.compartidoVehiculo.placa}
                        texto2={dataDetalle.compartidoVehiculo.tipo}
                        elcolor={''}
                      />
                      <Text style={estilos.infoText}>Fecha: {formatearFecha(dataDetalle.fecha)}</Text>
                      <View style={estilos.divider}></View>

                      {calificacionCantidad > 0 && (
                        <Estrellas calificacion={Number(calificacionViaje / calificacionCantidad)} />
                      )}

                      <Text style={estilos.tripTitle}>Viaje</Text>
                      <View style={estilos.locationContainer}>
                        <View style={estilos.locationDotPrimary}></View>
                        <Text style={estilos.locationText}>{dataDetalle.lSalida}</Text>
                      </View>

                      <View style={estilos.locationContainer}>
                        <View style={estilos.locationDotSecondary}></View>
                        <Text style={estilos.locationText}>{dataDetalle.llegada}</Text>
                      </View>

                      {calificacionCantidad === 1 && <Text style={estilos.passengerTitle}>Pasajero</Text>}
                      {calificacionCantidad > 1 && <Text style={estilos.passengerTitle}>Pasajeros</Text>}

                      {calificacionCantidad > 0 &&
                        dataDetalle.compartidoComentarios.map((data, index) => (
                          <View key={index} style={estilos.commentContainer}>
                            <Image
                              source={{ uri: data.usuarioEnviado.usu_img }}
                              style={estilos.commentAvatar}
                            />
                            <View style={estilos.commentTextContent}>
                              <Text style={estilos.commentName}>{data.usuarioEnviado.usu_nombre}</Text>
                              <Text style={estilos.commentBody}>{data.comentario}</Text>
                            </View>
                          </View>
                        ))
                      }
                      <Text style={estilos.infoText}>Estado: {dataDetalle.estado}</Text>
                    </View>
                  )}

                  {/* Detalles para vehículo particular */}
                  {modulo === 'vp' && (
                    <View style={estilos.sectionContainer}>
                      <View style={estilos.vehicleImageContainer}>
                        <Image source={{ uri: dataDetalle.vehiculo.vus_img }} style={estilos.vehicleImage} />
                      </View>
                      <View style={estilos.infoGroup}>
                        <Text style={estilos.infoText}>Fecha: {formatearFecha(dataDetalle.via_fecha_creacion)}</Text>
                        <Text style={estilos.infoText}>Vehículo: {dataDetalle.vehiculo.vus_marca} {dataDetalle.vehiculo.vus_modelo}</Text>
                        <Text style={estilos.infoText}>Placa: {dataDetalle.vehiculo.vus_placa}</Text>
                      </View>
                    </View>
                  )}

                </View>
              )}
              keyExtractor={(item) => item.key}
              showsVerticalScrollIndicator={false}
            />
          )}
        </View>
      </View>
    </Modal>
  );

  const renderTripItem = ({ item }) => (
    <TripItem
      data={item}
      modulo={modulo}
      onPress={iraDetalle}
      formatearFecha={formatearFecha}
      getVehicleIcon={getVehicleIcon}
      getVehicleStyle={getVehicleStyle}
    />
  );

  return (
    <View style={estilos.contenedor}>
      {renderModal()}

      {/* Header */}
      <View style={estilos.header}>
        <Pressable onPress={goBack} style={estilos.backButton}>
          <Image source={Images.atras_Icon} style={estilos.backIcon} />
        </Pressable>

        <RNPickerSelect
          style={pickerSelectStyles}
          placeholder={{ label: 'Selecciona un módulo', value: '' }}
          useNativeAndroidPickerStyle={false}
          value={modulo}
          onValueChange={onModuleChange}
          items={pickerItems}
          Icon={() => (
            <Image
              source={Images.iconPickerYellow}
              style={estilos.pickerIcon}
            />
          )}
        />
      </View>

      {/* Content */}
      <View style={estilos.content}>
        <Text style={estilos.title}>
          {modulo ? `Mis viajes ${MODULES[modulo]}` : 'Mis viajes'}
        </Text>
        <Text style={estilos.title}>
          {modulo && allFilteredData.length > 0 && (
            <Text style={estilos.totalCount}> ({allFilteredData.length} total{allFilteredData.length !== 1 ? 'es' : ''})</Text>
          )}
        </Text>

        {!modulo ? (
          <EmptyState message="Selecciona un módulo para ver tus viajes" />
        ) : allFilteredData.length === 0 ? (
          <EmptyState message="No tienes viajes en este módulo" />
        ) : (
          <FlatList
            data={paginatedData}
            renderItem={renderTripItem}
            keyExtractor={(item, index) => {
              // Key único según el módulo
              switch (modulo) {
                case '3g':
                case '4g':
                  return `${modulo}-${item.pre_id}`;
                case 'vp':
                  return `vp-${item.via_id}`;
                case '5g':
                  return `5g-${item.pre_id}`;
                case 'carpooling':
                  return `carpooling-${item._id}`;
                default:
                  return `${modulo}-${index}`;
              }
            }}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={estilos.listContent}
            onEndReached={loadMoreItems}
            onEndReachedThreshold={0.3}
            ListFooterComponent={() => (
              hasMoreData ? (
                <View style={estilos.loadMoreContainer}>
                  {isLoadingMore ? (
                    <ActivityIndicator size="small" color={Colors.$primario} />
                  ) : (
                    <Pressable onPress={loadMoreItems} style={estilos.loadMoreButton}>
                      <Text style={estilos.loadMoreText}>Cargar más viajes</Text>
                    </Pressable>
                  )}
                </View>
              ) : paginatedData.length > itemsPerPage ? (
                <View style={estilos.endOfListContainer}>
                  <Text style={estilos.endOfListText}>No hay más viajes</Text>
                </View>
              ) : null
            )}
            removeClippedSubviews={true}
            maxToRenderPerBatch={itemsPerPage}
            windowSize={10}
            initialNumToRender={itemsPerPage}
            getItemLayout={(data, index) => ({
              length: 85, // altura aproximada de cada item
              offset: 85 * index,
              index,
            })}
          />
        )}
      </View>
    </View>
  );
}

const estilos = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: Colors.$blanco,
  },
  header: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT * 0.15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    backgroundColor: Colors.$blanco,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  backButton: {
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 25,
    borderWidth: 1,
    borderColor: Colors.$texto50,
  },
  backIcon: {
    width: 25,
    height: 25,
  },
  content: {
    flex: 1,
    backgroundColor: Colors.$secundario20,
  },
  title: {
    fontSize: 24,
    fontFamily: Fonts.$poppinsmedium,
    color: Colors.$texto,
    backgroundColor: Colors.$blanco,
    padding: 20,
    paddingBottom: 15,
  },
  totalCount: {
    fontSize: 16,
    fontFamily: Fonts.$poppinsregular,
    color: Colors.$texto80,
  },
  listContent: {
    padding: 20,
  },
  tripItem: {
    backgroundColor: Colors.$blanco,
    borderRadius: 15,
    marginBottom: 15,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  tripContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  vehicleContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  vehicleStateBase: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  vehicleIcon: {
    width: 25,
    height: 25,
  },
  vehicleNumber: {
    fontSize: 12,
    color: Colors.$texto50,
    fontFamily: Fonts.$poppinsregular,
    marginTop: 2,
  },
  vehicleImageContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    overflow: 'hidden',
    marginRight: 15,
  },
  vehicleImage: {
    width: '100%',
    height: '100%',
  },
  qrContainer: {
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  qrIcon: {
    width: 30,
    height: 30,
    tintColor: Colors.$inactiva,
  },
  qrNumber: {
    fontSize: 12,
    fontFamily: Fonts.$poppinsmedium,
    color: Colors.$texto,
    marginTop: 2,
  },
  dateContainer: {
    flex: 1,
  },
  dateLabel: {
    fontSize: 14,
    color: Colors.$texto80,
    fontFamily: Fonts.$poppinsregular,
    marginBottom: 4,
  },
  dateText: {
    fontSize: 13,
    color: Colors.$texto,
    fontFamily: Fonts.$poppinslight,
  },
  arrowButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrowIcon: {
    width: 25,
    height: 25,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 16,
    color: Colors.$texto50,
    fontFamily: Fonts.$poppinsregular,
    textAlign: 'center',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: Colors.$blanco,
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 8,
  },
  closeButton: {
    position: 'absolute',
    top: 15,
    right: 15,
    zIndex: 1,
    backgroundColor: Colors.$secundario20,
    borderRadius: 20,
    padding: 8,
  },
  closeIcon: {
    width: 24,
    height: 24,
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
  },
  modalBody: {
    paddingTop: 50,
    alignItems: 'center',
  },
  modalScrollView: {
    width: '100%',
    maxHeight: '90%',
  },
  modalScrollContent: {
    paddingBottom: 20,
  },
  sectionContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 30,
    backgroundColor: Colors.$secundario20,
    borderRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  infoGroup: {
    marginTop: 20,
    alignItems: 'center',
    width: '100%',
  },
  infoText: {
    fontSize: 16,
    fontFamily: Fonts.$poppinsregular,
    color: Colors.$texto,
    marginBottom: 8,
    textAlign: 'center',
  },
  priceText: {
    fontSize: 24,
    fontFamily: Fonts.$poppinsmedium,
    color: Colors.$primario,
    marginTop: 15,
    marginBottom: 10,
  },
  divider: {
    width: '80%',
    height: 2,
    backgroundColor: Colors.$texto50,
    marginVertical: 20,
    borderRadius: 1,
  },
  tripTitle: {
    width: '80%',
    fontSize: 20,
    fontFamily: Fonts.$poppinsmedium,
    color: Colors.$texto,
    textAlign: 'left',
    marginBottom: 15,
  },
  locationContainer: {
    width: '90%',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  locationDotPrimary: {
    width: 15,
    height: 15,
    borderRadius: 7.5,
    backgroundColor: Colors.$adicional,
    marginRight: 15,
  },
  locationDotSecondary: {
    width: 15,
    height: 15,
    borderRadius: 4,
    backgroundColor: Colors.$primario,
    marginRight: 15,
  },
  locationText: {
    fontFamily: Fonts.$montserratRegular,
    color: Colors.$texto,
    paddingVertical: 10,
    paddingHorizontal: 15,
    fontSize: 15,
    backgroundColor: Colors.$secundario20,
    borderRadius: 25,
    flex: 1,
  },
  passengerTitle: {
    fontFamily: Fonts.$poppinsmedium,
    fontSize: 20,
    color: Colors.$texto,
    marginTop: 20,
    marginBottom: 15,
  },
  commentContainer: {
    marginBottom: 15,
    width: '95%',
    backgroundColor: Colors.$secundario20,
    borderRadius: 20,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  commentAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
    borderWidth: 1,
    borderColor: Colors.$primario,
  },
  commentTextContent: {
    flexDirection: 'column',
    flex: 1,
  },
  commentName: {
    fontSize: 16,
    fontFamily: Fonts.$poppinsmedium,
    color: Colors.$texto,
    marginBottom: 5,
  },
  commentBody: {
    fontSize: 14,
    fontFamily: Fonts.$poppinsregular,
    color: Colors.$texto80,
  },
  loadMoreContainer: {
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadMoreButton: {
    backgroundColor: Colors.$primario,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  loadMoreText: {
    color: Colors.$blanco,
    fontSize: 14,
    fontFamily: Fonts.$poppinsmedium,
  },
  endOfListContainer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  endOfListText: {
    color: Colors.$texto50,
    fontSize: 14,
    fontFamily: Fonts.$poppinsregular,
    fontStyle: 'italic',
  },
  indicatorsContainer: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    marginTop: 30,
    paddingHorizontal: 5,
    marginBottom: 20,
  },
  pickerIcon: {
    top: 15,
    right: 20,
    height: 20,
    left: -20,
    width: 20,
    resizeMode: 'contain',
    tintColor: Colors.$texto,
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 14,
    borderBottomWidth: 2,
    backgroundColor: 'transparent',
    paddingLeft: 15,
    marginLeft: 20,
    marginRight: 20,
    borderColor: Colors.$secundario,
    borderRadius: 25,
    color: Colors.$texto,
    height: 40,
    minWidth: 200,
  },
  placeholder: {
    color: Colors.$texto80,
  },
  inputAndroid: {
    paddingLeft: 20,
    borderColor: Colors.$secundario,
    borderWidth: 1,
    borderRadius: 25,
    color: Colors.$texto,
    backgroundColor: 'transparent',
    width: 250,
    fontSize: 14,
  },
});

function mapStateToProps(state) {
  return {
    dataUser: state.userReducer,
    dataRent: state.reducer3G,
    dataCarpooling: state.reducerCarpooling,
    perfil: state.reducerPerfil
  };
}

export default connect(mapStateToProps)(MisViajes);