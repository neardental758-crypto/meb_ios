import  React,{ useState, useEffect, useContext } from 'react';
import { 
  Text,
  View,
  Pressable,
  StyleSheet,
  Image,
  Dimensions,
  Modal
} from 'react-native';
import { get_indicadores_trip } from '../../actions/actionPerfil'
import { connect, useDispatch } from 'react-redux';
import Colors from '../../Themes/Colors';
import Images from '../../Themes/Images';
import Fonts from '../../Themes/Fonts';
import * as RootNavigation from '../../RootNavigation';
import { AuthContext } from '../../AuthContext';
import RNPickerSelect from '@nejlyg/react-native-picker-select';
import { ScrollView } from 'react-native-gesture-handler';
import { Tarjeta } from './Tarjeta';
import { Estrellas } from './Estrellas'

function MisViajes(props) {
    const { isLogin, token, infoUser } = useContext( AuthContext )
    const dispatch = useDispatch();
    const [ modulo, setModulo ] = useState('');
    const [ sum3g, setSum3g ] = useState(0);
    const [ sum4g, setSum4g ] = useState(0);
    const [ sum5g, setSum5g ] = useState(0);
    const [ sumVP, setSumVP ] = useState(0);
    const [ sumCr, setSumCr ] = useState(0);
    const [ calificacionViaje, setCalificacionViaje ] = useState(0);
    const [ calificacionCantidad, setCalificacionCantidad ] = useState(0);
    const [ modalDetalle, setModalDetalle ] = useState(false);
    const [ dataDetalle, setDataDetalle ] = useState(null);
    const [ _3G, set_3G] = useState(false);
    const [ _4G, set_4G] = useState(false);
    const [ _5G, set_5G] = useState(false);
    const [ _parquadero, set_parquadero] = useState(false);
    const [ _electrohub, set_electrohub] = useState(false);
    const [ _carro_compartido, set_carro_compartido] = useState(false);
    const [ _ruta_corporativa, set_ruta_corporativa] = useState(false);
    const [ _vehiculo_particular, set_vehiculo_particular] = useState(false);

    useEffect(() => {
        if (props.perfil.empresaCargadas) {
            console.log('modulos empresa', props.perfil.dataempresa[0])
            set_3G(
                props.perfil.dataempresa[0]._3G === 'ACTIVO' || 
                props.perfil.dataempresa[0]._3G === 'ACTIVO+RESERVAS' ||
                props.perfil.dataempresa[0]._3G === 'ACTIVO-RESERVAS' ? 
                true : false
            );
            set_4G(props.perfil.dataempresa[0]._4G === 'ACTIVO' ? true : false)
            set_5G(props.perfil.dataempresa[0]._5G === 'ACTIVO' ? true : false)
            set_electrohub(props.perfil.dataempresa[0]._electrohub === 'ACTIVO' || props.perfil.dataempresa[0]._electrohub === 'ACTIVO+SALDO'? true : false);
            set_parquadero(props.perfil.dataempresa[0]._parquadero === 'ACTIVO' ? true : false)
            set_carro_compartido(props.perfil.dataempresa[0]._carro_compartido === 'ACTIVO' ? true : false)
            set_ruta_corporativa(props.perfil.dataempresa[0]._ruta_corporativa === 'ACTIVO' ? true : false)
            set_vehiculo_particular(props.perfil.dataempresa[0]._vehiculo_particular === 'ACTIVO' ? true : false)
        }
    },[props.perfil.empresaCargadas])
  
    const goBack = () => { RootNavigation.navigate('PerfilHome') }
    const iraDetalle = async (data) => {
        await setDataDetalle(data);
        await setModalDetalle(true);
        console.log('data del detalle del viaje ',dataDetalle);
        console.log('id viaje ',data.pre_id);
        if (modulo === '3g' || modulo === '4g') {
            await dispatch(get_indicadores_trip(data.pre_id));
        }else if (modulo === '5g') {
            await dispatch(get_indicadores_trip(data.id));
        }else if (modulo === 'carpooling'){
            console.log('en detalles del modulo de carpooling');
            data.compartidoComentarios.forEach((comentario) => {
                setCalificacionViaje((prevCalificacionViaje) => prevCalificacionViaje + Number(comentario.calificacion));
                setCalificacionCantidad((prevCalificacionCantidad) => prevCalificacionCantidad + 1);
            });
        }
        
    }

    useEffect(() => {
        if (props.perfil.cargado_indicadores_trip) {
            console.log('indicadores trip: ',props.perfil.indicadores_trip);
        }
    },[props.perfil.cargado_indicadores_trip])

    const detalleModal = () => {
        return (
            <View style={estilos.contenedorModal}>
                <Modal transparent={true} animationType="slide" visible={modalDetalle}> {/* Asegúrate de que `visible` esté ligado a tu estado */}
                    <View style={estilos.overlay}>
                        <View style={estilos.modalContent}>
                            <ScrollView contentContainerStyle={estilos.scrollViewContent}>
                                <Pressable
                                    onPress={() => {
                                        setModalDetalle(false);
                                        setDataDetalle(null);
                                        setCalificacionViaje(0);
                                        setCalificacionCantidad(0);
                                    }}
                                    style={estilos.closeButton}
                                >
                                    <Image style={estilos.closeIcon} resizeMode='contain' source={Images.x_icon} />
                                </Pressable>

                                {(modulo === '3g' || modulo === '4g' || modulo === '5g') && props.perfil.cargado_indicadores_trip ? (
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
                                ) : null}

                                {modulo === '3g' || modulo === '4g' ? (
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
                                ) : null}

                                {modulo === '5g' ? (
                                    <View style={estilos.sectionContainer}>
                                        <Tarjeta
                                            icono={Images.qr_}
                                            titulo={'QR'}
                                            texto1={dataDetalle.qrNumber}
                                            texto2={''}
                                            elcolor={Colors.$adicional}
                                        />
                                        <View style={estilos.infoGroup}>
                                            <Text style={estilos.infoText}>Fecha inicio</Text>
                                            <Text style={estilos.infoText}>{formatearFecha(dataDetalle.startDate)}</Text>
                                            <Text style={estilos.infoText}>Fecha Entrega</Text>
                                            <Text style={estilos.infoText}>{formatearFecha(dataDetalle.endDate)}</Text>
                                            <Text style={estilos.infoText}>Estado: {dataDetalle.state}</Text>
                                        </View>
                                    </View>
                                ) : null}

                                {modulo === 'carpooling' ? (
                                    <View style={estilos.sectionContainer}>
                                        <Tarjeta
                                            icono={dataDetalle.compartidoVehiculo.tipo === 'Carro' ? Images.carrorojo : Images.moto}
                                            titulo={dataDetalle.compartidoVehiculo.marca}
                                            texto1={dataDetalle.compartidoVehiculo.placa}
                                            texto2={dataDetalle.compartidoVehiculo.tipo}
                                            elcolor={''}
                                        />
                                        <Text style={estilos.priceText}>{dataDetalle.precio}</Text>
                                        <Text style={estilos.infoText}>Fecha inicio: {formatearFecha(dataDetalle.fecha)}</Text>
                                        <View style={estilos.divider}></View>

                                        {<Estrellas calificacion={Number(calificacionViaje / calificacionCantidad)} />}

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

                                        {calificacionCantidad !== 0 ?
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
                                            : null
                                        }
                                        <Text style={estilos.infoText}>Estado: {dataDetalle.estado}</Text>
                                    </View>
                                ) : null}

                                
                            </ScrollView>
                        </View>
                    </View>
                </Modal>
            </View>
        );
    };

    const formatearFecha =  (fecha) => { 
        let fechaF = new Date(fecha); 
        const opciones = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', timeZone: 'UTC' };
        const fechaFormateada = fechaF.toLocaleDateString('es-CO', opciones); 
        return(fechaFormateada);
    }

    const treaeViajes = async (value) => {
        await setModulo(value)
        await console.log('se seleccionó este módulo:', value); 
        let sum = 0;
        if (value === '3g') {
            console.log('entrando a calcular el length de 3g');
            props.dataRent.viajes3G.filter((data) => 
                data.bc_bicicletero.bro_bluetooth === 'null' ? 
                sum = sum + 1 : sum
            ); 
            await setSum3g(sum);
            sum = 0;
            await console.log('la suma de datos en 3g', sum3g)
        }else if(value === '4g'){
            console.log('entrando a calcular el length de 4g');
            props.dataRent.viajes3G.filter((data) => 
                data.bc_bicicletero.bro_bluetooth !== 'null' ? 
                sum = sum + 1 : sum
            ); 
            await setSum4g(sum);
            sum = 0;
            await console.log('la suma de datos en 4g', sum4g)
        }else if(value === 'vp'){
            console.log('entrando a calcular el length de VP', props.dataRent.viajesVP.vehiculo);
            props.dataRent.viajesVP.filter((data) => 
                sum = sum + 1 
            ); 
            await setSumVP(sum);
            sum = 0;
            await console.log('la suma de datos en 4g', sumVP)
        }else if(value === '5g'){
            props.dataRent.viajes5G.filter((data) => 
                sum = sum + 1 
            ); 
            await setSum5g(sum);
            sum = 0;
            await console.log('la suma de datos en 5g', sum5g)
        }else if(value === 'carpooling'){
            props.dataRent.viajesCarpooling.filter((data) => 
                sum = sum + 1 
            ); 
            await setSumCr(sum);
            sum = 0;
            await console.log('la suma de datos en carpoling', sumCr)
        }
        
    }

    const getVehicleStyle = (estado) => {
        switch (estado) {
          case 'DISPONIBLE':
            return styles.cajaTextVehiuclosDisponible;
          case 'RESERVADA':
            return styles.cajaTextVehiuclosReservada;
          case 'PRESTADA':
            return styles.cajaTextVehiuclosPrestada;
          case 'INACTIVA':
            return styles.cajaTextVehiuclosInactiva;
          case 'EN TALLER':
            return styles.cajaTextVehiuclosTaller;
          case 'CAMBIAR CLAVE':
            return styles.cajaTextVehiuclosPrestada;
          default:
            return styles.cajaTextVehiuclosSinEstado;
        }
    };

return (
    <View style={estilos.contenedor}>
        {modalDetalle ? detalleModal() : <></>}
        <View style={estilos.cajaTop}>
            <Pressable  
                onPress={() => { goBack() }}
                style={ estilos.btnAtras }>
                <View>
                <Image source={Images.atras_Icon} style={[estilos.iconMenu]}/> 
                </View>
            </Pressable>
            <RNPickerSelect
                  style={pickerSelectStyles}
                  placeholder={{ label: 'Módulo', value: '' }}
                  useNativeAndroidPickerStyle={false}
                  value={modulo}
                  onValueChange={(value) => { 
                    treaeViajes(value)
                  }}
                  
                  items={[
                    ...(_3G ? [{ label: 'Movilidad 3g', value: '3g' }] : []),
                    ...(_4G ? [{ label: 'Movilidad 4g', value: '4g' }] : []),
                    ...(_5G ? [{ label: 'Movilidad 5g', value: '5g' }] : []),
                    //...(_carro_compartido ? [{ label: 'Carro Compartido', value: 'carpooling' }] : []),
                    //...(_vehiculo_particular ? [{ label: 'Vehículo particular', value: 'vp' }] : []),
                    //...(_parquadero ? [{ label: 'Parquedero', value: 'parquedero' }] : []),
                    //...(_electrohub ? [{ label: 'Elecrtohub', value: 'Electrohub' }] : []),
                    //...(_ruta_corporativa ? [{ label: 'Ruta Corporativa', value: 'ruta_corporativa' }] : []),
                  ]}

                  Icon={() => {
                    return (
                      <Image source={Images.iconPickerYellow} style={{ top: 25, right: 20, height: 20, left:-20, width: 20, resizeMode: 'contain', tintColor: Colors.$texto, transform:[{ rotate:'0deg'}] }} />
                    );
                  }}
            />
        </View>

        <View style={estilos.cajaContenido}>
            <Text style={estilos.titulo}>Mis viajes {modulo}</Text>
            <ScrollView>
                {
                    modulo === '3g' ?
                    <>
                    {
                    sum3g > 0 ?(
                    props.dataRent.viajes3G.map((data)=>
                    <View key={data.pre_id}>
                        {
                            data.bc_bicicletero.bro_bluetooth === 'null'  ?
                            <View style={estilos.btnViaje} key={data.pre_id}>
                                <View style={estilos.cajaRowVA}>
                                    <View style={{
                                        backgroundColor: Colors.$adicional,
                                        width: 50,
                                        height: 80,
                                        borderRadius: 10,
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}>
                                        
                                        <View style={getVehicleStyle(data.bc_bicicleta.bic_estado)}>
                                        {
                                            data.bc_bicicleta.bic_nombre === 'electrica' 
                                            ? 
                                            <Image source={Images.bicycle_Icon} style={[estilos.iconBici, {tintColor : Colors.$inactiva}]}/> 
                                            :
                                            <></>
                                        }
                                        {
                                            data.bc_bicicleta.bic_nombre === 'patineta' 
                                            ? 
                                            <Image source={Images.patin_Icon} style={[estilos.iconBici, {tintColor : Colors.$inactiva}]}/> 
                                            :
                                            <></>
                                        }
                                        {
                                            data.bc_bicicleta.bic_nombre === 'mecanica' 
                                            ? 
                                            <Image source={Images.cycle_Icon} style={[estilos.iconBici, {tintColor : Colors.$inactiva}]}/> 
                                            :
                                            <></>
                                        }
                                            <Text style={{ 
                                                fontSize: 25,  
                                                color: Colors.$texto50, 
                                                fontFamily: Fonts.$poppinsregular,
                                            }}>
                                                {data.bc_bicicleta.bic_numero}
                                            </Text> 
                                        </View>
                                    </View>
                                    
                                    <View style={{ width: '60%'}}>
                                        <Text style={{ fontSize: 18, color: Colors.$texto80,  fontFamily: Fonts.$poppinsregular }}>Fecha</Text>
                                        <Text style={estilos.textFecha}>
                                            { formatearFecha(data.pre_retiro_fecha) }
                                        </Text>                        
                                    </View>            
                                </View>

                                <View style={{ 
                                        width: "10%", 
                                        height: "auto", 
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}>
                                        {
                                        data.pre_estado === 'CANCELADA' ?  
                                        <></>
                                        :
                                        <Pressable 
                                            onPress={() => iraDetalle(data)}
                                            style={{
                                                width:30,
                                                height:30,
                                                borderRadius:15,
                                                alignContent: 'center',
                                                justifyContent: 'center',
                                                textAlign: 'center',}}>
                                            <Image style={{width:30, height:30, alignItems: 'center', justifyContent: 'center', flex: 1}} source={Images.flecha_icon}/>
                                        </Pressable>
                                        }
                                </View> 
                            </View>
                            :
                            <></>
                        }
                    </View>
                    ))
                    : 
                    <View style={{ alignItems: 'center', justifyContent: 'center', padding: 20 }}>
                        <Text style={{ fontSize: 16, color: Colors.$texto80, fontFamily: Fonts.$poppinsregular }}>Sin datos en 3g</Text>
                    </View>
                    }
                    </>
                    :
                    <></>
                }

                {
                    modulo === '4g' ?
                    <>
                    {
                    sum4g > 0 ?(
                    props.dataRent.viajes3G.map((data)=>
                    <View key={data.pre_id}>
                        {
                            data.bc_bicicletero.bro_bluetooth !== 'null'  ?
                            <View style={estilos.btnViaje} key={data.pre_id}>
                                <View style={estilos.cajaRowVA}>
                                    <View style={{
                                        backgroundColor: Colors.$adicional,
                                        width: 50,
                                        height: 80,
                                        borderRadius: 10,
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}>
                                        
                                        <View style={getVehicleStyle(data.bc_bicicleta.bic_estado)}>
                                        {
                                            data.bc_bicicleta.bic_nombre === 'electrica' 
                                            ? 
                                            <Image source={Images.bicycle_Icon} style={[estilos.iconBici, {tintColor : Colors.$inactiva}]}/> 
                                            :
                                            <></>
                                        }
                                        {
                                            data.bc_bicicleta.bic_nombre === 'patineta' 
                                            ? 
                                            <Image source={Images.patin_Icon} style={[estilos.iconBici, {tintColor : Colors.$inactiva}]}/> 
                                            :
                                            <></>
                                        }
                                        {
                                            data.bc_bicicleta.bic_nombre === 'mecanica' 
                                            ? 
                                            <Image source={Images.cycle_Icon} style={[estilos.iconBici, {tintColor : Colors.$inactiva}]}/> 
                                            :
                                            <></>
                                        }
                                            <Text style={{ 
                                                fontSize: 25,  
                                                color: Colors.$texto50, 
                                                fontFamily: Fonts.$poppinsregular,
                                            }}>
                                                {data.bc_bicicleta.bic_numero}
                                            </Text> 
                                        </View>
                                    </View>
                                    
                                    <View style={{ width: '60%'}}>
                                        <Text style={{ fontSize: 18, color: Colors.$texto80,  fontFamily: Fonts.$poppinsregular }}>Fecha</Text>
                                        <Text style={estilos.textFecha}>
                                            { formatearFecha(data.pre_retiro_fecha) }
                                        </Text>                        
                                    </View>            
                                </View>

                                <View style={{ 
                                        width: "10%", 
                                        height: "auto", 
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}>
                                        {
                                        data.pre_estado === 'CANCELADA' ?  
                                        <></>
                                        :
                                        <Pressable 
                                            onPress={() => iraDetalle(data)}
                                            style={{
                                                width:30,
                                                height:30,
                                                borderRadius:15,
                                                alignContent: 'center',
                                                justifyContent: 'center',
                                                textAlign: 'center',}}>
                                            <Image style={{width:30, height:30, alignItems: 'center', justifyContent: 'center', flex: 1}} source={Images.flecha_icon}/>
                                        </Pressable>
                                        }
                                </View> 
                            </View>
                            :
                            <></>
                        }
                    </View>
                    ))
                    : 
                    <View style={{ alignItems: 'center', justifyContent: 'center', padding: 20 }}>
                        <Text style={{ fontSize: 16, color: Colors.$texto80, fontFamily: Fonts.$poppinsregular }}>Sin datos</Text>
                    </View>
                    }
                    </>
                    :
                    <></>
                }

                {
                    modulo === 'vp' ?
                    <>
                    {
                    sumVP > 0 ?(
                    props.dataRent.viajesVP.map((data)=>
                    <View key={data.via_id}>
                        <View style={estilos.btnViaje}>
                            <View style={estilos.cajaRowVA}>
                                <View style={{
                                    width: 80,
                                    height: 80,
                                    borderRadius: 40,
                                    alignItems: "center",
                                    justifyContent: "center",
                                    overflow: "hidden"
                                }}>                                
                                    <Image 
                                        source={{uri: data.vehiculo.vus_img}} 
                                        style={[estilos.iconBiciVP]}/> 
                                </View>
                                
                                <View style={{ width: '60%'}}>
                                    <Text style={{ fontSize: 18, color: Colors.$texto80,  fontFamily: Fonts.$poppinsregular }}>Fecha</Text>
                                    <Text style={estilos.textFecha}>
                                        { formatearFecha(data.via_fecha_creacion) }
                                    </Text>                        
                                </View>            
                            </View>

                            <View style={{ 
                                width: "10%", 
                                height: "auto", 
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}>
                                <Pressable 
                                    onPress={() => iraDetalle(data)}
                                    style={{
                                        width:30,
                                        height:30,
                                        borderRadius:15,
                                        alignContent: 'center',
                                        justifyContent: 'center',
                                        textAlign: 'center',}}>
                                    <Image style={{width:30, height:30, alignItems: 'center', justifyContent: 'center', flex: 1}} source={Images.flecha_icon}/>
                                </Pressable>     
                            </View> 
                        </View>
                    </View>
                    ))
                    : 
                    <View style={{ alignItems: 'center', justifyContent: 'center', padding: 20 }}>
                        <Text style={{ fontSize: 16, color: Colors.$texto80, fontFamily: Fonts.$poppinsregular }}>Sin datos</Text>
                    </View>
                    }
                    </>
                    :
                    <></>
                }

                {
                    modulo === '5g' ?
                    <>
                    {
                    sum5g > 0 ?(
                    props.dataRent.viajes5G.map((data)=>
                    <View key={data.id}>
                        <View style={estilos.btnViaje}>
                            <View style={estilos.cajaRowVA}>
                                <View style={{
                                    width: 100,
                                    height: 100,
                                    borderRadius: 40,
                                    alignItems: "center",
                                    justifyContent: "center",
                                    overflow: "hidden"
                                }}>
                                    <Image source={Images.qr_} style={{ width: 50, height: 50,tintColor : Colors.$inactiva}}/>  
                                    <Text style={{
                                        fontSize: 18,
                                        fontFamily: Fonts.$poppinsmedium
                                    }}>{data.qrNumber}</Text>
                                </View>
                                
                                <View style={{ width: '60%'}}>
                                    <Text style={{ fontSize: 18, color: Colors.$texto80,  fontFamily: Fonts.$poppinsregular }}>Fecha</Text>
                                    <Text style={estilos.textFecha}>
                                        { formatearFecha(data.startDate) }
                                    </Text>                        
                                </View>            
                            </View>

                            <View style={{ 
                                width: "10%", 
                                height: "auto", 
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}>
                                <Pressable 
                                    onPress={() => iraDetalle(data)}
                                    style={{
                                        width:30,
                                        height:30,
                                        borderRadius:15,
                                        alignContent: 'center',
                                        justifyContent: 'center',
                                        textAlign: 'center',}}>
                                    <Image style={{width:30, height:30, alignItems: 'center', justifyContent: 'center', flex: 1}} source={Images.flecha_icon}/>
                                </Pressable>     
                            </View> 
                        </View>
                    </View>
                    ))
                    : 
                    <View style={{ alignItems: 'center', justifyContent: 'center', padding: 20 }}>
                        <Text style={{ fontSize: 16, color: Colors.$texto80, fontFamily: Fonts.$poppinsregular }}>Sin datos</Text>
                    </View>
                    }
                    </>
                    :
                    <></>
                }

                {
                    modulo === 'carpooling' ?
                    <>
                    {
                    sumCr > 0 ?(
                    props.dataRent.viajesCarpooling.map((data)=>
                    <View key={data._id}>
                        <View style={estilos.btnViaje}>
                            <View style={estilos.cajaRowVA}>
                                <View style={{
                                    width: 80,
                                    height: 80,
                                    borderRadius: 40,
                                    alignItems: "center",
                                    justifyContent: "center",
                                    overflow: "hidden"
                                }}>    
                                    {
                                        data.compartidoVehiculo.tipo == 'Carro' ?  
                                        <Image 
                                            source={Images.carrorojo} 
                                            style={{width: 80, height: 80}}/> 
                                        : 
                                        <Image source={Images.moto} style={{width: 80,
                                            height: 80,}}/>
                                    }                            
                                     
                                </View>
                                
                                <View style={{ width: '60%'}}>
                                    <Text style={{ fontSize: 18, color: Colors.$texto80,  fontFamily: Fonts.$poppinsregular }}>Fecha</Text>
                                    <Text style={estilos.textFecha}>
                                        { formatearFecha(data.fecha) }
                                    </Text>                        
                                </View>            
                            </View>

                            <View style={{ 
                                width: "10%", 
                                height: "auto", 
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}>
                                <Pressable 
                                    onPress={() => iraDetalle(data)}
                                    style={{
                                        width:30,
                                        height:30,
                                        borderRadius:15,
                                        alignContent: 'center',
                                        justifyContent: 'center',
                                        textAlign: 'center',}}>
                                    <Image style={{width:30, height:30, alignItems: 'center', justifyContent: 'center', flex: 1}} source={Images.flecha_icon}/>
                                </Pressable>     
                            </View> 
                        </View>
                    </View>
                    ))
                    : 
                    <View style={{ alignItems: 'center', justifyContent: 'center', padding: 20 }}>
                        <Text style={{ fontSize: 16, color: Colors.$texto80, fontFamily: Fonts.$poppinsregular }}>Sin datos</Text>
                    </View>
                    }
                    </>
                    :
                    <></>
                }

                {
                    modulo === '' ?
                    <View style={{
                        width: Dimensions.get('window').width,
                        height: Dimensions.get('window').height*.6,
                        flex: 1,
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <Text style={{
                            fontFamily: Fonts.$poppinsregular,
                            fontSize: 18,
                            color: Colors.$texto50,
                            width: "50%",
                            textAlign: 'center',
                        }}>No se ha seleccionado un módulo</Text>
                    </View>
                    :
                    <></>
                }
            </ScrollView>
        </View>
        
    </View>
)
}

const styles = StyleSheet.create({
    cajaTextVehiuclosDisponible: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: 80,
        height: 80,
        borderRadius: 10,
        backgroundColor: Colors.$disponible
    },
    cajaTextVehiuclosReservada: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: 80,
        height: 80,
        borderRadius: 10,
        backgroundColor: Colors.$reservada
    },
    cajaTextVehiuclosPrestada: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: 80,
        height: 80,
        borderRadius: 10,
        backgroundColor: Colors.$prestada
    },
    cajaTextVehiuclosInactiva: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: 80,
        height: 80,
        borderRadius: 10,
        backgroundColor: Colors.$inactiva
    },
    cajaTextVehiuclosTaller: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: 80,
        height: 80,
        borderRadius: 10,
        backgroundColor: Colors.$taller
    },
    cajaTextVehiuclosSinEstado: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: 80,
        height: 80,
        borderRadius: 10,
        backgroundColor: 'white'
    },
})

const estilos = StyleSheet.create({
    contenedor: {
        flex: 1,
        flexDirection: 'column',
        alignItems: "center",
        justifyContent: "start",
        position: 'relative',
        backgroundColor: Colors.$blanco,
    },
    estado:{
        width:20,
        height:20,
        borderRadius:25,
        backgroundColor:'red',
        bottom:30
    },
    cajaTop: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height*.15,
        flexDirection: 'row',
        alignItems: "center",
        justifyContent: "space-between",
        paddingLeft: 20,
        paddingRight: 20
    },
    btnAtras:{
        width: 50,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 25,
        borderWidth: 1,
        borderColor: Colors.$texto50,
    },
    iconMenu: {
        width: 25,
        height: 25,
    },
    cajaContenido: {
        backgroundColor: Colors.$secundario20, 
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height*.8,
        zIndex: 1,
        alignItems: 'center',
    },
    titulo: {
        width: Dimensions.get('window').width,
        paddingLeft: 30,
        fontFamily: Fonts.$poppinsmedium,
        fontSize: 24,
        fontFamily:Fonts.$poppinsregular,
        backgroundColor: Colors.$blanco,
        padding: 10
    },
    btnViaje: {
        width: Dimensions.get('window').width*.8,
        minHeight: 120,
        backgroundColor: Colors.$blanco,
        marginBottom: 25,
        padding: 10,
        borderRadius: 10,
        position: 'relative',
        flexDirection: 'row',
        justifyContent: 'center',
        borderRadius: 15,
        borderWidth: 1,
        borderColor: Colors.$texto20,
        zIndex: 100
    },
    cajaRowVA: {
        flex: 1,
        width: '70%',
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: 'center',
    },
    textFecha: {
        width: "100%",
        fontSize: 16,
        color: Colors.$texto80,
        fontFamily: Fonts.$poppinslight,
    },
    iconBici: {
        width: 30,
        height: 30,
    },
    iconBiciVP: {
        width: "100%",
        height: "100%",
    },
    contenedorModal: {
        justifyContent: "center",
        alignItems: "center",
    },
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.7)", // Oscurece más el fondo
        justifyContent: "center",
        alignItems: "center",
    },
    modalContent: {
        width: '90%', // Ancho del modal, ajusta según necesidad
        maxHeight: '80%', // Altura máxima para que no ocupe toda la pantalla
        backgroundColor: Colors.$blanco,
        borderRadius: 20, // Bordes más redondeados
        padding: 20,
        alignItems: 'center',
        shadowColor: "#000", // Sombra para dar profundidad
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    scrollViewContent: {
        alignItems: 'center', // Centra el contenido dentro del ScrollView
        paddingBottom: 20, // Espacio al final del scroll para que el contenido no quede pegado
        paddingTop: 50, // Espacio para el botón de cerrar
    },
    closeButton: {
        position: 'absolute',
        top: 15,
        right: 15,
        zIndex: 1, // Asegura que el botón esté por encima de otros elementos
        backgroundColor: Colors.$secundario20, // Un fondo para el botón de cerrar
        borderRadius: 25,
        padding: 5,
    },
    closeIcon: {
        width: 40, // Icono más pequeño para el botón de cerrar
        height: 40,// Color del icono
    },
    sectionContainer: {
        width: '100%',
        alignItems: 'center',
        marginBottom: 30,
        backgroundColor: Colors.$secundario20, // Un fondo ligeramente diferente para agrupar secciones
        borderRadius: 20,
        paddingVertical: 20,
        paddingHorizontal: 10,
    },
    infoGroup: {
        marginTop: 20,
        alignItems: 'flex-start',
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
        color: Colors.$primario, // Un color más prominente para el precio
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
        color: Colors.$texto, // Color de texto principal para ubicaciones
        paddingVertical: 10,
        paddingHorizontal: 15,
        fontSize: 15,
        backgroundColor: Colors.$secundario20,
        borderRadius: 25,
        flex: 1, // Permite que el texto ocupe el espacio restante
    },
    passengerTitle: {
        fontFamily: Fonts.$poppinsmedium, // Texto más grueso para los títulos
        fontSize: 20,
        color: Colors.$texto,
        marginTop: 20,
        marginBottom: 15,
    },
    commentContainer: {
        marginBottom: 15,
        width: '95%', // Más ancho para los comentarios
        backgroundColor: Colors.$secundario20,
        borderRadius: 20, // Bordes más redondeados
        padding: 15,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start', // Alinea el contenido a la izquierda
    },
    commentAvatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 15,
        borderWidth: 1,
        borderColor: Colors.$primario, // Borde para el avatar
    },
    commentTextContent: {
        flexDirection: 'column',
        flex: 1, // Permite que el texto ocupe el espacio restante
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
    indicatorsContainer: {
        width: '100%',
        flexDirection: 'row',
        flexWrap: 'wrap', // Permite que las tarjetas se envuelvan a la siguiente línea
        justifyContent: 'space-around', // Espacio entre las tarjetas
        marginTop: 30,
        paddingHorizontal: 5,
    },
})

const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
      fontSize: 13,
      borderBottomWidth: 2,
      backgroundColor: "transparent",
      paddingLeft: 15,
      marginLeft: 20,
      marginRight: 20,
      marginBottom: 10,
      borderColor: Colors.$secundario,
      borderRadius: 25,
      marginTop: 15,
      color: Colors.$texto,
      height: 40,
    },
    placeholder: {
      color: 'black',
    },
    inputAndroid: {
      paddingLeft: 20,
      borderColor: Colors.$secundario,
      borderWidth: 1,
      borderRadius: 25,
      color: Colors.$texto,
      backgroundColor: "transparent",
      width: 220,
      fontSize: 16,
      marginTop: 10
    },
  });

function mapStateToProps(state) {
  return {
    dataUser: state.userReducer,
    dataRent: state.reducer3G,
    dataCarpooling: state.reducerCarpooling,
    perfil: state.reducerPerfil
  }
}
export default connect(mapStateToProps)(MisViajes);
