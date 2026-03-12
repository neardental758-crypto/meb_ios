import  React,{ useState, useEffect, useContext } from 'react';
import { 
  Text,
  View,
  Pressable,
  StyleSheet,
  Image,
  Dimensions,
  ScrollView,
  ImageBackground,
  Modal
} from 'react-native';
import * as Progress from 'react-native-progress';
import { savePuntos, completar_progreso__logro } from '../../actions/actions3g';
//import LottieView from 'lottie-react-native';
import Fonts from '../../Themes/Fonts';
import { getPuntos, getLogrosProgreso } from '../../actions/actionPerfil';
import { trip_end } from '../../actions/actionCarpooling'
import { connect, useDispatch } from 'react-redux';
import Colors from '../../Themes/Colors';
import Images from '../../Themes/Images';
import * as RootNavigation from '../../RootNavigation';
import { AuthContext } from '../../AuthContext';
import { v4 as uuidv4 } from 'uuid';
import { useMemo } from 'react';
function Recompensas(props) {
    const { isLogin, token, infoUser } = useContext( AuthContext )
    const [progress, setProgress] = useState(0);
    const [reclamado, setReclamado] = useState(false)
    const dispatch = useDispatch();
    const [logrosReclamados, setLogrosReclamados] = useState([]);
    const goBack = () => { RootNavigation.navigate('PerfilHome') }
    const [viajesCarpooling, setViajesCarpooling] = useState(0);
    const [puntos, setPuntos] = useState(props.perfil.puntos)
    const [modalEditInfo, setModalEditInfo ] = useState(false)
    const ir_misViajes = () => {RootNavigation.navigate('MisViajes') }
    const [logrosListos, setLogrosListos] = useState(false);
    const [desafiosListos, setDesafiosListos] = useState(false);
    const [nivel, setNivel] = useState(0);
    const maxNivel = 3;

    const logrosCombinados = useMemo(() => {
    return props.perfil.dataLogros && props.perfil.dataProgresoLogros
      ? props.perfil.dataLogros.map(logro => {
          const progresoItem = props.perfil.dataProgresoLogros.find(
            p => p.logro_id === logro.idLogro
          );
          return {
            ...logro,
            progreso: progresoItem?.progreso ?? 0,
            estado: progresoItem?.estado ?? 'PENDIENTE',
          };
        })
      : [];
  }, [props.perfil.dataLogros, props.perfil.dataProgresoLogros]);
    
    useEffect(() => {
      if (logrosCombinados.length > 0) {
        setLogrosListos(true);
        console.log('MAPEO LOGROS COMPBINADOS', logrosCombinados)
      }
    }, [logrosCombinados]);
  
    const guardarPuntos = async (valorLogro, descripcion, logroId) => {
      console.log("valorLogro");
      console.log(valorLogro);
      console.log("descripcion");
      console.log(descripcion);
      console.log("logroId");
      console.log(logroId);
    
      console.log("Valor de la cédula");
      console.log(infoUser.DataUser.idNumber);
    
      const data = {
        pun_id: uuidv4(),
        pun_usuario: infoUser.DataUser.idNumber,
        pun_modulo: 'Recompensas',
        pun_fecha: new Date().toISOString(),
        pun_puntos: valorLogro.toString(), // Asigna el valor del logro dinámicamente
        pun_motivo: descripcion,
      };
    
      try {
        //await dispatch(savePuntos(data));
        await dispatch(completar_progreso__logro(logroId));
        console.log("Se guardaron los puntos correctamente");
      } catch (error) {
        console.error("Error al guardar los puntos:", error);
      }
    };

    const handleReclamar = async(logroId,valorLogro, descripcion) => {
      console.log('logroId',logroId)
      console.log('valorLogro',valorLogro)  
      console.log('descripcion',descripcion)
      await guardarPuntos(valorLogro, descripcion, logroId);
      //setLogrosReclamados([...logrosReclamados, logroId]);
      //setReclamado(true);
      // Oculta el botón al presionarlo
    };

    /*
    useEffect(() => {
            if (props.perfil.puntos >= 100) {
                if (nivel < maxNivel) {
                    setNivel(prevNivel => prevNivel + 1);
                    setPuntos(prevPuntos => prevPuntos - 100); // Restamos 100 puntos para el siguiente nivel
                } else {
                    setPuntos(100); // Asegura que no pasemos de 100 puntos si estamos en el nivel máximo
                }
            }
    }, [props.perfil.puntos]);
   

    useEffect(() => {
        if (props.dataCarpooling.tripEndCargada) {
            setViajesCarpooling(props.dataCarpooling.tripEnd);
        }
    },[props.dataCarpooling.tripEndCargada])*/

    useEffect(() => {
        dispatch(getPuntos())
        dispatch(trip_end())
        //dispatch(getLogrosProgreso(infoUser.idNumber));
        //dispatch(getDesafios('ACTIVO'));
        //dispatch(getProductos(1));
        console.log("valor de los logros reclamados")
        console.log(logrosReclamados)
        console.log('datos de dataLogrosProgreso')
        console.log(props.perfil.dataProgresoLogros)
        console.log("puntos en recompensas " + props.perfil.puntos)
    },[])

    useEffect(()=>{
      if (logrosListos) {
        console.log('los logros combinados son:', logrosCombinados)
      }
    },[logrosListos])

    const logrosImagenes = [
        Images.estrella,  // Imagen para el primer logro
        Images.estrella,     // Imagen para el segundo logro
        Images.solicitud, // Imagen para el tercer logro
        Images.solicitud,      // Imagen para el cuarto logro
      ];
      
    
return (
    <View style={estilos.contenedor}>
       
        <View style={estilos.cajaCabeza}>
            <Pressable  
                onPress={() => { goBack() }}
                style={ estilos.btnAtras }>
                <View>
                <Image source={Images.atras_Icon} style={[estilos.iconMenu]}/> 
                </View>
            </Pressable>
        </View>

        <View style={ estilos.logoBox }>
            <View style={ estilos.cajaA}>

            <View style={{width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                <Text style={ estilos.texto1}>
                    {infoUser.DataUser.name} {infoUser.DataUser.firstLastname}
                </Text>
            </View>    
            
            <Text style= {{fontFamily: Fonts.$poppinsregular}}> 
            {Number(
                    viajesCarpooling + 
                    props.dataRent.viajesTotal3G + 
                    props.dataRent.viajesTotalVP + 
                    props.dataRent.viajesTotal5G +
                    props.dataRent.viajesTotalCarpooling 
            )} viajes</Text>
            </View>

            <View style={ estilos.cajaB}>
           {<Image
            style={ estilos.logo }
            source={{ uri: infoUser.DataUser.documents }}
            />}
            </View> 
        </View>

        {
          props.perfil.puntosCargados ? 
          <View style={estilos.containerProgress}>
            <View style={estilos.cardPuntos}>
                <View style={{
                  flexDirection: 'row',
                  width: "100%",
                  alignItems: 'center',
                  justifyContent: 'space-around',
                  marginBottom: 10
                }}>
                  <Image source={Images.cycle_Icon} style={estilos.iconPuntos} />
                  <Image source={Images.patin_Icon} style={estilos.iconPuntos} />
                  <Image source={Images.vpEMoto} style={estilos.iconPuntos} />
                  <Image source={Images.vpECar} style={estilos.iconPuntos} />
                  <Image source={Images.vpEbike} style={estilos.iconPuntos} />
                </View>
                <View style={{
                  width: 100,
                  height: 100,
                  backgroundColor: Colors.$primario,
                  borderRadius: 50,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                  <Text style={estilos.puntos}>{puntos}</Text>
                </View>
                
                <Text style={estilos.textoPuntosTitulo}>Mis puntos acumulados</Text>
            </View>
          </View>
          :
          <></>
        }

        <View style={[estilos.cajaRecompensas, {marginBottom: 30}]}>
            <View style={{
              alignItems: 'center',
              justifyContent: 'flex-start', 
              width: "80%", 
              height: 'auto',
              flexDirection:'row', 
            }}>
                <Image style={{right:10, width: 60, height: 60}} source={Images.catalogo_img}/>
                <View style={{flexDirection:'column'}}>
                  <Text style={{ fontSize: 16, fontFamily: Fonts.$poppinsregular}}>Recompensas</Text>
                  <Text style={{ fontSize: 12, fontFamily: Fonts.$poppinsregular}}>Catálogo</Text>
                </View>
            </View>
            <View style={{
              alignItems: 'center',
              justifyContent: 'space-around', 
              width: "10%",
              flexDirection:'row', 
            }}>
                <Pressable
                  onPress={() =>{RootNavigation.navigate("Catalogo")} }       
                >
                    <Image style={ estilos.iconoCatalogo }source={Images.flecha_icon}/>   
                </Pressable>
            </View>
            
            
        </View>

      
        <ScrollView style={{ 
          width: Dimensions.get('window').width,
          backgroundColor: Colors.$blanco,
          textAlign: 'center'
        }}>

          <View style={{ alignItems: 'center'}}>
            <Text style={ estilos.textoLogros}>Logros</Text>
            <View style={estilos.cajaLogros}>            
              <View style={estilos.cuadricula}>
                {logrosListos ? (
                  logrosCombinados.map((data, index) => {
                    return (
                      <View
                        key={data.id}
                        style={[
                          estilos.cajaLogro,
                          { marginBottom: 30, marginRight: 0 },
                          data.progreso >= data.meta && estilos.cajaLogroCompletado,
                        ]}
                      >
                        <View key={data.id} style={{ justifyContent: 'center', width: '100%', flexDirection: 'row' }}>
                          <View key={data.id} style={{ flexDirection: 'column', width: '50%' }}>
                            <Image
                              style={
                                data.progreso >= data.meta
                                  ? estilos.imagenCarro
                                  : logrosImagenes[index] === Images.estrella
                                  ? estilos.imagenEstrella
                                  : estilos.imagenLogro
                              }
                              source={data.progreso >= data.meta ? Images.carro : logrosImagenes[index]}
                            />
                            <Text
                              style={{
                                fontSize: 14,
                                fontFamily: Fonts.$poppinsregular,
                                color: data.progreso >= data.meta ? 'white' : 'black',
                                flexShrink: 1,
                                flexWrap: 'nowrap',
                                top: 10,
                                right: 5,
                                width: 'auto',
                                textAlign: 'left',
                              }}
                            >
                              {data.logro.descripcion}
                            </Text>
                          </View>

                          <View style={{ flexDirection: 'column', width: '50%' }}>
                            <Text
                              style={{
                                fontSize: 20,
                                fontFamily: Fonts.$poppinsregular,
                                color: data.progreso >= data.meta ? 'white' : 'black',
                              }}
                            >
                              {data.progreso}/{data.meta}
                            </Text>
                            <Text
                              style={{
                                fontSize: 12,
                                fontFamily: Fonts.$poppinsregular,
                                color: data.progreso >= data.meta ? 'white' : 'black',
                              }}
                            >
                              + {data.valor} puntos
                            </Text>

                            {/* Mostrar el botón o barra de progreso, dependiendo del estado */}
                            {data.estado !== 'RECLAMADO' && data.progreso >= data.meta ? (
                              <Pressable
                                style={{
                                  backgroundColor: 'white',
                                  height: 'auto',
                                  width: '100%',
                                  borderRadius: 15,
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                }}
                                onPress={() => handleReclamar(data.id_logro, data.valor, data.descripcion)}
                              >
                                <Text
                                  style={{
                                    color: 'red',
                                    fontSize: 10,
                                    fontFamily: Fonts.$poppinsregular,
                                  }}
                                >
                                  Reclamar
                                </Text>
                              </Pressable>
                            ) : data.estado === 'RECLAMADO' ? null : (
                              <Progress.Bar
                                progress={
                                  data.meta && data.meta > 0 ? data.progreso / data.meta : 0
                                }
                                width={Dimensions.get('window').width * 0.15}
                                color="red"
                              />
                            )}
                          </View>
                        </View>
                      </View>
                    );
                  })
                ) : (
                  <Text>No hay logros disponibles</Text>
                )}
              </View>

            </View>
          </View>
        
          {/*<View style={{ alignItems: 'center'}}>
          <Text style={ estilos.textoLogros}>Desafios de la semana</Text>
          
          <View style={[estilos.cajaDesafios, {marginBottom: 200}]}>
            
              desafiosListos ?
              desafiosCombinados.map((data)=>
                  <View 
                  key={data.id}
                  style={{
                    justifyContent: 'flex-start', 
                    width: '100%', 
                    flexDirection:'row',
                    marginBottom: 20,
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: 10,
                    borderBottomColor: Colors.$texto,
                    borderBottomWidth: 5,
                  }}>
                    <Image style={{}} source={Images.like}/>
                    <View style={{flexDirection:'column'}}>
                      <Text style={{ fontSize: 14, fontFamily: Fonts.$poppinsregular, left:10}}>{data.descripcion}</Text>  
                      <Progress.Bar
                        progress={
                          data.meta && data.meta > 0
                            ? data.progreso / data.meta
                            : 0
                        }
                        width={Dimensions.get('window').width * 0.5} 
                        height={15} 
                        borderRadius={10} 
                        backgroundColor={Colors.$secundario}/>         
                    </View> 
                  </View>
              )
              :
              <></>
             
          </View>
          </View>*/}
        </ScrollView>
    </View>
    
)

}

const estilos = StyleSheet.create({
    containerProgress: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        width: Dimensions.get('window').width,
    },
    textoNivel: {
        width: Dimensions.get('window').width*.8,
        fontSize: 18,
        fontFamily: Fonts.$poppinsregular,
        color: Colors.$texto50,
    },
    textoNivel2: {
      fontSize: 14,
      fontFamily: Fonts.$poppinsregular,
      color: Colors.$texto50,
  },
    cajaHor: {
        width: Dimensions.get('window').width*.8,
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: Colors.$blanco,
        alignItems: 'center' ,
        borderRadius:10
    },
    imagenEstrella: {
        width: 30,  // Tamaño específico para la estrella
        height: 30,
      },
     
    
      imagenCarro: {
        width: 50,  // Tamaño específico para la estrella
        height: 30,
      },
    cajaRecompensas: {
        width: Dimensions.get('window').width*.8,
        height: Dimensions.get('window').width*.20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center' ,
        borderWidth:1,
        borderColor: Colors.$texto20,
        borderRadius:15,
        padding:20,
    },
    cajaDesafios: {
        width: Dimensions.get('window').width*.8,
        height: Dimensions.get('window').width*.4,
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center' ,
        borderWidth:1,
        borderColor: Colors.$texto20,
        borderRadius:15,
        padding:20
    },
    cajaLogros:{
        flex: 1,
        flexDirection:'row',
        padding:10,
        width: Dimensions.get('window').width,
        alignItems: 'space-around',
        justifyContent: 'center',
        padding: 20,
        shadowColor: 'black',
    },
    cuadricula: {
        // Contenedor de la cuadrícula
        flexDirection: 'row',
        flexWrap: 'wrap', // Hace que las tarjetas se acomoden en varias filas
        justifyContent: 'space-around', // Espacio entre las tarjetas
        alignItems: 'center',
        width: '100%'
      },
      cajaLogro: {
        width: Dimensions.get('window').width * 0.4,
        height: Dimensions.get('window').width * 0.3,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: Colors.$texto20,
        borderRadius: 15, // Bordes redondeados para complementar la sombra
        padding: 20,
        left: 2,
        backgroundColor: '#fff', // Fondo necesario para que la sombra sea visible
        shadowColor: 'black', // Color de la sombra (iOS)
        shadowOffset: { width: 0, height: 4 }, // Desplazamiento de la sombra (iOS)
        shadowOpacity: 0.25, // Opacidad de la sombra (iOS)
        shadowRadius: 10, // Difuminado de la sombra (iOS)
        elevation: 8, // Sombra en Android
    },
    
    cajaLogroCompletado: {
        width: Dimensions.get('window').width*.4,
        height: Dimensions.get('window').width*.3,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center' ,
        borderWidth:1,
        borderColor: Colors.$texto20,
        borderRadius:15,
        padding:20,
        left:2,
        backgroundColor: Colors.$primario 
    },

    cajaLogro2: {
        width: Dimensions.get('window').width*.4,
        height: Dimensions.get('window').width*.3,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center' ,
        borderWidth:1,
        borderColor: Colors.$texto20,
        borderRadius:15,
        padding:20,
        left:20
       
    },
    cajaLogro3: {
        width: Dimensions.get('window').width*.4,
        height: Dimensions.get('window').width*.3,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center' ,
        borderWidth:1,
        borderColor: Colors.$texto20,
        borderRadius:15,
        padding:20,
       
       
    },
    cajaLogro4: {
        width: Dimensions.get('window').width*.4,
        height: Dimensions.get('window').width*.3,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center' ,
        borderWidth:1,
        borderColor: Colors.$texto20,
        borderRadius:15,
        padding:20,
        left:20,
        backgroundColor: Colors.$primario 
    },
    contenedor: {
        flex: 1,
        flexDirection: 'column',
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: Colors.$blanco
    },
    icono: {
        width: 25,
        height: 25,
        marginRight: 10,
        transform: [{ rotate: '90deg' }]
    },
    iconoCatalogo: {
        width: 30,
        height: 30,
    },
    cajaCabeza: {
        backgroundColor: Colors.$primario,
        justifyContent: 'space-around',
        alignItems: 'center', 
        borderRadius: 1,
        width: Dimensions.get('window').width,
        position: 'absolute',
        top: 0
    },
    btnAtras:{
        position: 'absolute',
        top: 30, 
        left: 10,
        width: 50,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 25
    },
    iconMenu: {
        width: 25,
        height: 25,
    },
    logoBox: {
        width: Dimensions.get('window').width,
        flexDirection : 'row', 
        alignItems: 'center', 
        justifyContent : 'center', 
        marginTop: 80,
        marginBottom: 10,
    },
    cajaA: {
        width: Dimensions.get('window').width*.5,
        alignItems: 'flex-start', 
        justifyContent: 'center',
    },
    cajaB: {
        width: Dimensions.get('window').width*.3,
        alignItems: 'flex-end', 
        justifyContent: 'center',
    },
    cajaC: {
      flex: 1,
      flexDirection: 'row',
    },
    texto1: {
      fontSize: 22,
      color: Colors.$texto,
      fontFamily: Fonts.$poppinsmedium
    },
    textoLogros: {
      width: Dimensions.get('window').width*.8, 
      fontSize: 24,
      color: Colors.$texto,
      textAlign:'left',
      fontFamily: Fonts.$poppinsmedium, 
      },
    texto2: {
      width: 200,
      fontSize: 16,
      color: Colors.$texto,
      fontFamily: Fonts.$poppinslight
    },
    botonItem: {
      backgroundColor: Colors.$blanco,
      width: "100%",
      textAlign: "center",
      justifyContent: "center",
      padding: 10,
      flexDirection: 'row'
    },
    textBoton: {
      flex: 1,
      fontSize: 18,
      color: Colors.$texto,
      paddingTop: 5,
      paddingLeft: 10,
      fontFamily: Fonts.$poppinsregular
    },
    LineaVer: {
      width: 5,
      height: 40,
      backgroundColor: Colors.$texto
    },
    LineaHorizontal: {
      width: "150%",
      height: 5,
      backgroundColor: Colors.$texto,
      marginTop: 10,
      marginBottom: 30,
    },
    logo: {
      width: 100,
      height: 100,
      borderRadius: 50
    },
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
        height: Dimensions.get('window').width*.5
      },
      cajaModal2: { 
        flex: 1, 
        height: "100%",
        borderRadius: 6, 
        marginVertical: 1, 
        justifyContent: "space-around", 
        alignItems: "center", 
      },
      cardPuntos: {
        backgroundColor: Colors.$secundario20,
        marginHorizontal: 15,
        marginBottom: 20,
        padding: 20,
        borderRadius: 12,
        alignItems: 'center',
        width: "100%"
      },
      iconPuntos: { width: 50, height: 50, marginBottom: 10 },
      textoPuntosTitulo: {
        fontSize: 16,
        fontFamily: Fonts.$poppinsregular,
        marginBottom: 5,
      },
      puntos: {
        fontSize: 40,
        fontFamily: Fonts.$poppinsmedium,
        color: Colors.$blanco,
        paddingTop: 6
      },
})

function mapStateToProps(state) {
  return {
    dataUser: state.userReducer,
    dataRent: state.reducer3G,
    perfil: state.reducerPerfil,
    dataCarpooling: state.reducerCarpooling
  }
}

export default connect(mapStateToProps)(Recompensas);
