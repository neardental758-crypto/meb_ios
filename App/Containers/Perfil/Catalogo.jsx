import React,{ useState, useEffect, useContext } from 'react';
import { 
  Text,
  View,
  Pressable,
  StyleSheet,
  Image,
  Dimensions,
  ScrollView,
  Modal,
  FlatList
} from 'react-native';
import Fonts from '../../Themes/Fonts';
import { getProductos, getPuntos } from '../../actions/actionPerfil';
import { restarPuntos } from '../../actions/actions3g';
import { connect, useDispatch } from 'react-redux';
import Colors from '../../Themes/Colors';
import Images from '../../Themes/Images';
import * as RootNavigation from '../../RootNavigation';
import { AuthContext } from '../../AuthContext';
import { v4 as uuidv4 } from 'uuid';

function Catalogo(props) {
    const { isLogin, token, infoUser } = useContext( AuthContext )
    const dispatch = useDispatch();
    const goBack = () => { RootNavigation.navigate('PerfilHome') };
   
    useEffect(() => {
        console.log('LA EMPRESA ES', props.perfil.empresa)
        dispatch(getProductos(props.perfil.empresa))
    },[])

    const [modalVisible, setModalVisible] = useState(false);
    const [productoSeleccionado, setProductoSeleccionado] = useState(null);

    const abrirModal = (producto) => {
        setProductoSeleccionado(producto);
        setModalVisible(true);
    };

    const cerrarModal = () => {
        setProductoSeleccionado(null);
        setModalVisible(false);
    };

    const restar_Puntos = async (producto) => {
        if (props.perfil.puntos < producto.valor) {
            alert("No tienes suficientes puntos para reclamar este producto.");
            return;
        }
        const data = {
            pun_id: uuidv4(),
            pun_usuario: infoUser.DataUser.idNumber,
            pun_modulo: 'RECOMPENSAS_PENDIENTE',
            pun_fecha: new Date().toISOString(),
            pun_puntos: Number(producto.valor * -1),
            pun_motivo: 'prod: ' + producto.nombre + ' id: ' + producto.id_producto,
        };
    
        try {
            await dispatch(restarPuntos(data));
            await dispatch(getPuntos());
            cerrarModal();
            RootNavigation.navigate('Recompensas');
        } catch (error) {
            console.error("Error al guardar los puntos:", error);
        }
    };

    const modalProducto = () => {
        if (!productoSeleccionado) return null;
        return (
            <Modal
                transparent={true}
                animationType="slide"
                visible={modalVisible}
                onRequestClose={cerrarModal}
            >
                <View style={estilos.contenedorModal}>
                    <View style={estilos.cajaModal}>
                        <Image
                            source={{ uri: productoSeleccionado.imagen }}
                            style={estilos.modalImagen}
                        />
                        <Text style={estilos.modalTitulo}>{productoSeleccionado.nombre}</Text>
                        
                        <View style={estilos.modalInfoRow}>
                            <Text style={estilos.modalDetalle}>Puntos: {productoSeleccionado.valor}</Text>
                        </View>

                        <View style={ estilos.LineaHorizontal } />
                        
                        <Text style={estilos.modalSubtitulo}>Información</Text>
                        <Text style={estilos.modalDescripcion}>{productoSeleccionado.descripcion}</Text>
                        
                        <View style={estilos.modalBotones}>
                            <Pressable onPress={cerrarModal} style={estilos.botonCerrar}>
                                <Text style={estilos.textoCerrar}>Cancelar</Text>
                            </Pressable>

                            <Pressable 
                                onPress={() => restar_Puntos(productoSeleccionado)} 
                                style={estilos.botonReclamar}>
                                <Text style={estilos.textoReclamar}>Reclamar</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </Modal>
        );
    };

    return (
        <View style={estilos.contenedor}>
            {modalVisible && modalProducto()} 
            
            {/* Header */}
            <View style={estilos.header}>
                <Pressable onPress={goBack} style={estilos.btnAtras}>
                    <Image source={Images.atras_Icon} style={estilos.iconMenu}/> 
                </Pressable>
                <View style={estilos.headerTextBox}>
                    <Text style={estilos.textoLogros}>Catálogo</Text>
                    <Text style={estilos.tituloNivel2}>Mis puntos: {props.perfil.puntos}</Text>
                </View>
                <Image style={estilos.logoCat} source={Images.atras_Icon}/>
            </View>

            {/* Lista de productos en grid */}
            <FlatList
                data={props.perfil.dataProducto || []}
                keyExtractor={(item, index) => `${item.id_producto}-${index}`}
                numColumns={2}
                columnWrapperStyle={estilos.filaProductos}
                contentContainerStyle={estilos.listaProductos}
                renderItem={({ item }) => (
                    <Pressable onPress={() => abrirModal(item)} style={estilos.itemContainer}>
                        <Image source={{ uri: item.imagen }} style={estilos.itemImagen}/>
                        <Text style={estilos.nombreProducto}>{item.nombre}</Text>
                        <Text style={estilos.puntosProducto}>{item.valor} pts</Text>
                    </Pressable>
                )}
            />
        </View>
    )
}

const estilos = StyleSheet.create({
    contenedor: {
        flex: 1,
        backgroundColor: Colors.$blanco,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 15,
        paddingVertical: 30,
        backgroundColor: Colors.$primario,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
    },
    headerTextBox: {
        flex: 1,
        alignItems: 'center',
    },
    textoLogros: {
        fontSize: 22,
        color: Colors.$blanco,
        fontFamily: Fonts.$poppinsmedium,
    },
    tituloNivel2: {
        fontSize: 14,
        fontFamily: Fonts.$poppinsregular,
        color: Colors.$blanco,
        marginTop: 4,
    },
    btnAtras:{
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.$blanco,
    },
    iconMenu: {
        width: 20,
        height: 20,
        tintColor: Colors.$primario,
    },
    logoCat: {
        width: 50,
        height: 50,
        borderRadius: 10,
        tintColor: Colors.$primario
    },

    listaProductos: {
        padding: 15,
    },
    filaProductos: {
        justifyContent: 'space-between',
    },
    itemContainer: {
        flex: 1,
        backgroundColor: '#fff',
        borderRadius: 15,
        padding: 10,
        marginBottom: 15,
        marginHorizontal: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
        alignItems: 'center',
    },
    itemImagen: {
        width: '100%',
        height: 120,
        borderRadius: 10,
        resizeMode: 'cover',
    },
    nombreProducto: {
        fontSize: 14,
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: 8,
        color: '#333',
    },
    puntosProducto: {
        fontSize: 13,
        color: Colors.$primario,
        marginTop: 4,
    },

    // MODAL
    contenedorModal: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    cajaModal: {
        width: '85%',
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 20,
        elevation: 10,
    },
    modalImagen: {
        width: '100%',
        height: 200,
        borderRadius: 15,
        resizeMode: 'cover',
        marginBottom: 15,
    },
    modalTitulo: {
        fontSize: 20,
        fontFamily: Fonts.$poppinsmedium,
        marginBottom: 10,
        color: '#333',
    },
    modalDetalle: {
        fontSize: 14,
        color: Colors.$texto,
        fontFamily: Fonts.$poppinsregular,
    },
    modalInfoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    LineaHorizontal: {
        width: "100%",
        height: 2,
        backgroundColor: Colors.$texto,
        marginVertical: 10,
    },
    modalSubtitulo: {
        fontSize: 16,
        fontFamily: Fonts.$poppinsmedium,
        marginBottom: 6,
        color: '#444',
    },
    modalDescripcion: {
        fontSize: 14,
        color: '#666',
        marginBottom: 20,
    },
    modalBotones: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    botonCerrar: {
        backgroundColor: '#eee',
        borderRadius: 30,
        paddingVertical: 10,
        paddingHorizontal: 20,
    },
    textoCerrar: {
        fontSize: 16,
        color: '#333',
    },
    botonReclamar: {
        backgroundColor: Colors.$primario,
        borderRadius: 30,
        paddingVertical: 10,
        paddingHorizontal: 20,
    },
    textoReclamar: {
        fontSize: 16,
        color: '#fff',
        fontWeight: 'bold',
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
export default connect(mapStateToProps)(Catalogo);
