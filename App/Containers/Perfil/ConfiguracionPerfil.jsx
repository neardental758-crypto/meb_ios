import React, { useState, useContext, useEffect } from 'react';
import {
  Text,
  View,
  Pressable,
  StyleSheet,
  Image,
  Dimensions,
  TextInput,
  Alert,
  Switch,
  ScrollView
} from 'react-native';
import { connect, useDispatch } from 'react-redux';
import Colors from '../../Themes/Colors';
import Images from '../../Themes/Images';
import Fonts from '../../Themes/Fonts';
import * as RootNavigation from '../../RootNavigation';
import { AuthContext } from '../../AuthContext';
import { moderateScale } from '../../Themes/Metrics';
import {
  updatePassword,
  reset__Profile
} from '../../actions/actions';
import {
  getDataPago,
  getVehicles_carpooling,
  patch_vehiculos_carpooling,
  reset__patch_veh,
  patch_conductor_carpooling,
  reset__patch_cond
} from '../../actions/actionCarpooling'

function ConfiguracionPerfil(props) {
  const { infoUser, logout } = useContext(AuthContext);
  const dispatch = useDispatch();

  const [claveActual, setClaveActual] = useState('');
  const [clave, setClave] = useState('');
  const [clave2, setClave2] = useState('');
  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showPagos, setShowPagos] = useState(false);
  const [showLugares, setShowLugares] = useState(false);
  const [showVehiculos, setShowVehiculos] = useState(false);

  const [daviplata, setDaviplata] = useState(false);
  const [nequi, setNequi] = useState(false);

  const [marca, setMarca] = useState('');
  const [modelo, setModelo] = useState('');
  const [placa, setPlaca] = useState('');
  const [color, setColor] = useState('');

  const goBack = () => RootNavigation.navigate('PerfilHome');

  useEffect(() => {
    dispatch(getDataPago(infoUser.DataUser.idNumber));
    dispatch(getVehicles_carpooling());
  }, [infoUser]);

  useEffect(() => {
    if (props.dataCarpooling.dataPagoCargada && props.dataCarpooling.dataPago) {
      setDaviplata(props.dataCarpooling.dataPago.daviplata);
      setNequi(props.dataCarpooling.dataPago.nequi);
    }
  }, [props.dataCarpooling.dataPagoCargada]);

  const handleChangePassword = () => {
    // Validar contra usu_password (MySQL)
    const claveGuardada = infoUser?.DataUser?.usu_password || infoUser?.DataUser?.password;
    if (claveActual !== claveGuardada) {
      Alert.alert("Error", "La contraseña actual no coincide.");
      return;
    }
    if (clave.length !== 4) {
      Alert.alert("Error", "La nueva contraseña debe tener 4 dígitos.");
      return;
    }
    if (clave !== clave2) {
      Alert.alert("Error", "Las contraseñas no coinciden.");
      return;
    }
    if (claveActual === clave) {
      Alert.alert("Error", "Debe ser diferente a la actual.");
      return;
    }

    dispatch(updatePassword(clave));
    setLoading(true);
  };

  useEffect(() => {
    if (props.dataUser.update_password_ok) {
      dispatch(reset__Profile());
      logout();
    }
  }, [props.dataUser.update_password_ok]);

  const onActualizarPagos = () => {
    const data = {
      _id: infoUser.DataUser.idNumber,
      nequi,
      daviplata,
    };
    dispatch(patch_conductor_carpooling(data));
  };

  const onActualizarVehiculo = (vehiculo) => {
    const vehiculoActualizado = {
      ...vehiculo,
      marca: marca || vehiculo.marca,
      modelo: modelo || vehiculo.modelo,
      placa: placa || vehiculo.placa,
      color: color || vehiculo.color,
    };
    dispatch(patch_vehiculos_carpooling(vehiculoActualizado));
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: Colors.$blanco }}>
      {/* Header */}
      <View style={estilos.header}>
        <Pressable onPress={goBack} style={estilos.btnAtras}>
          <Image source={Images.atras_Icon} style={estilos.iconMenu} />
        </Pressable>
        <Text style={estilos.titulo}>Configuración</Text>
      </View>

      <View style={estilos.contenido}>

        {/* Cambiar contraseña */}
        <Pressable style={estilos.acordeon} onPress={() => setShowPassword(!showPassword)}>
          <Text style={estilos.acordeonTexto}>Actualizar contraseña</Text>
          <Image
            source={Images.iconPickerYellow}
            style={[estilos.iconToggle, { transform: [{ rotate: showPassword ? '180deg' : '0deg' }] }]}
          />
        </Pressable>
        {showPassword && (
          <View style={estilos.card}>
            <TextInput
              style={estilos.input}
              placeholder="Contraseña actual"
              value={claveActual}
              onChangeText={setClaveActual}
              secureTextEntry
            />
            <TextInput
              style={estilos.input}
              placeholder="Nueva contraseña (4 dígitos)"
              value={clave}
              onChangeText={setClave}
              secureTextEntry
            />
            <TextInput
              style={estilos.input}
              placeholder="Repetir nueva contraseña"
              value={clave2}
              onChangeText={setClave2}
              secureTextEntry
            />
            <Pressable style={estilos.boton} onPress={handleChangePassword}>
              <Text style={estilos.botonTexto}>{loading ? "Actualizando..." : "Actualizar"}</Text>
            </Pressable>
          </View>
        )}

        {/* Medios de pago 
        <Pressable style={estilos.acordeon} onPress={() => setShowPagos(!showPagos)}>
          <Text style={estilos.acordeonTexto}>Medios de pago</Text>
          <Image
            source={Images.iconPickerYellow}
            style={[estilos.iconToggle, { transform: [{ rotate: showPagos ? '180deg' : '0deg' }] }]}
          />
        </Pressable>*/}
        {showPagos && (
          <View style={estilos.card}>
            <View style={estilos.switchRow}>
              <Text style={estilos.label}>Daviplata</Text>
              <Switch value={daviplata} onValueChange={setDaviplata} />
            </View>
            <View style={estilos.switchRow}>
              <Text style={estilos.label}>Nequi</Text>
              <Switch value={nequi} onValueChange={setNequi} />
            </View>
            <Pressable style={estilos.boton} onPress={onActualizarPagos}>
              <Text style={estilos.botonTexto}>Actualizar</Text>
            </Pressable>
          </View>
        )}

        {/* Vehículos */}
        {/*<Pressable style={estilos.acordeon} onPress={() => setShowVehiculos(!showVehiculos)}>
          <Text style={estilos.acordeonTexto}>Editar Vehículos</Text>
          <Image 
            source={Images.iconPickerYellow} 
            style={[estilos.iconToggle, { transform: [{ rotate: showVehiculos ? '180deg' : '0deg' }] }]}
          />
        </Pressable>*/}
        {/*showVehiculos && props.dataCarpooling.myVehiclesCPCargados && (
          props.dataCarpooling.myVehiclesCP.data.length > 0 ? (
            props.dataCarpooling.myVehiclesCP.data.map((data) => (
              <View key={data._id} style={estilos.card}>
                <View style={estilos.vehiculoRow}>
                  <Image source={data.tipo === 'Carro' ? Images.carrorojo : Images.moto} style={estilos.imgVehiculo}/>
                  <View style={{ flex: 1, marginLeft: 10 }}>
                    <Text style={estilos.label}>Marca actual: {data.marca}</Text>
                    <TextInput style={estilos.input} placeholder="Nueva marca" value={marca} onChangeText={setMarca}/>
                    
                    <Text style={estilos.label}>Modelo actual: {data.modelo}</Text>
                    <TextInput style={estilos.input} placeholder="Nuevo modelo" value={modelo} onChangeText={setModelo}/>
                    
                    <Text style={estilos.label}>Placa actual: {data.placa}</Text>
                    <TextInput style={estilos.input} placeholder="Nueva placa" value={placa} onChangeText={setPlaca}/>
                    
                    <Text style={estilos.label}>Color actual: {data.color}</Text>
                    <TextInput style={estilos.input} placeholder="Nuevo color" value={color} onChangeText={setColor}/>
                  </View>
                </View>
                <Pressable style={estilos.boton} onPress={() => onActualizarVehiculo(data)}>
                  <Text style={estilos.botonTexto}>Actualizar Vehículo</Text>
                </Pressable>
              </View>
            ))
          ) : (
            <Text style={estilos.noVehiculos}>No tienes vehículos registrados 😞</Text>
          )
        )*/}

      </View>
    </ScrollView>
  );
}

const estilos = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: Colors.$blanco,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingVertical: 30,
    marginTop: 20
  },
  btnAtras: { marginRight: 10 },
  iconMenu: { width: 25, height: 25 },
  titulo: {
    fontSize: 22,
    fontFamily: Fonts.$poppinsmedium,
    color: Colors.$texto,
    paddingLeft: 10
  },
  contenido: {
    padding: 15,
  },
  acordeon: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: Colors.$secundario20,
    borderRadius: 12,
    marginBottom: 10,
  },
  acordeonTexto: {
    fontSize: 18,
    fontFamily: Fonts.$poppinsregular,
    color: Colors.$texto,
  },
  iconToggle: {
    width: 20,
    height: 20,
    tintColor: Colors.$primario,
  },
  card: {
    backgroundColor: Colors.$blanco,
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    elevation: 2,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
    fontSize: 16,
    fontFamily: Fonts.$poppinsregular,
    color: Colors.$texto,
  },
  boton: {
    backgroundColor: Colors.$primario,
    padding: 12,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 10,
  },
  botonTexto: {
    color: Colors.$blanco,
    fontSize: 16,
    fontFamily: Fonts.$poppinsmedium,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    color: Colors.$texto50,
    fontFamily: Fonts.$poppinsregular,
  },
  vehiculoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  imgVehiculo: {
    width: 60,
    height: 60,
    resizeMode: 'contain',
  },
  noVehiculos: {
    textAlign: 'center',
    fontSize: 16,
    color: '#777',
    marginVertical: 15,
  },
});

function mapStateToProps(state) {
  return {
    dataUser: state.userReducer,
    dataCarpooling: state.reducerCarpooling,
  };
}
export default connect(mapStateToProps)(ConfiguracionPerfil);
