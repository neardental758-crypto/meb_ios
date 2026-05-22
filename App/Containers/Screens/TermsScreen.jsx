import { Image, ImageBackground, SafeAreaView, ScrollView, Text, Pressable, View } from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import Colors from '../../Themes/Colors';
import Fonts from '../../Themes/Fonts';
import Images from '../../Themes/Images';
import React, { useState } from 'react';
import { acceptTerms } from '../../actions/actions';
import { connect } from 'react-redux';
import styles from './Styles/TermsScreen.style';
import { Dimensions } from 'react-native';
import * as RootNavigation from '../../RootNavigation';
import { horizontalScale, moderateScale, verticalScale } from '../../Themes/Metrics';

function TermsScreen(props) {
  const goBack = () => {
    RootNavigation.navigate("RegisterScreen")
  }
  return (
    <View style={{ flex: 1, backgroundColor: '#fff', height: Dimensions.get("window").height }}>
      <View style={{ flexDirection: 'row', justifyContent: 'flex-start', padding: 20, paddingBottom: 5, backgroundColor: 'white' }}>
        <Pressable onPress={() => { goBack() }}
          style={{
            backgroundColor: 'white',
            justifyContent: 'center',
            alignItems: 'center',
            width: horizontalScale(40),
            height: verticalScale(40),
            borderRadius: moderateScale(40),
            borderColor: 'black',
            overflow: 'hidden',
            shadowColor: 'black',
            shadowOffset: { width: horizontalScale(40), height: verticalScale(40), },
            shadowOpacity: 1,
            shadowRadius: moderateScale(60),
            elevation: 5,
          }}>
          <Image style={{ width: horizontalScale(25), height: verticalScale(25), borderRadius: horizontalScale(30), }} source={Images.atras_Icon} />
        </Pressable>
      </View>
      <SafeAreaView style={{ flex: 1, backgroundColor: 'rgba(255, 255, 255, 0.8)', margin: 10 }}>
        <Image source={Images.logoMeb} style={{ width: 230, height: 80, alignSelf: 'center', marginBottom: 30 }} />
        {/*<View style={[styles.margin, { flex: 0.2, marginBottom: 2, alignItems: 'center' }]}>
              <Text style={{ marginBottom: 10, fontFamily:Fonts.$montserratMedium,color:Colors.$texto,fontSize:25, }}>Términos y condiciones</Text>
              <View style={{ height: 5, width: 150, backgroundColor: Colors.$primario, alignSelf: 'center', borderRadius: 10, marginBottom: 20 }} />
            </View>*/}
        <ScrollView style={{
          height: Dimensions.get("window").height * .60,
        }}>
          <View style={[styles.margin, { flex: 0.2, marginBottom: 5, alignItems: 'center' }]}>
            <Text style={{ marginBottom: 10, fontFamily: Fonts.$montserratMedium, color: Colors.$texto, fontSize: 25, }}>Términos y condiciones</Text>
            <View style={{ height: 5, width: 250, backgroundColor: Colors.$texto, alignSelf: 'center', borderRadius: 10, marginBottom: 20 }} />
            <Text style={styles.subtitle}>MOVILIDAD EN BICICLETA S.A.S</Text>
            <Text style={styles.subtitle}>Acuerdo Integral de Uso del Programa</Text>
          </View>
          <View style={[styles.margin, { flex: 0.2 }]}>
            <Text style={[styles.text, { textAlign: 'center', fontWeight: 'bold' }]}>
              Comodato Precario · Reglamento de Uso · Declaración de Riesgos{"\n"}
              Autorización de Datos Personales · Política de Privacidad{"\n"}
              MOVILIDAD EN BICICLETA S.A.S · NIT 900.342.482-9{"\n"}
              admon@mejorenbici.com · 3245658543 · www.mejorenbici.com{"\n"}
              Versión 2.0 · Mayo 2026 · Empresa aliada: [●]
            </Text>
            <Text style={styles.text}>
              Léalo completo antes de aceptar. Su aceptación digital tiene plena validez legal conforme a la Ley 527 de 1999 — mensajes de datos y firma electrónica.
            </Text>
          </View>

          <View style={[styles.margin, { flex: 0.2 }]}>
            <Text style={styles.subtitle}>1. PARTES, OBJETO Y NATURALEZA DEL PROGRAMA</Text>

            <Text style={styles.text}><Text style={{ fontWeight: 'bold' }}>Partes:</Text></Text>
            <Text style={styles.text}>• <Text style={{ fontWeight: 'bold' }}>Operador:</Text> Movilidad en Bicicleta (Mejor en Bici) — NIT 900.342.482-9, Bogotá D.C. Administra el programa bajo la plataforma Mejor en Bici.</Text>
            <Text style={styles.text}>• <Text style={{ fontWeight: 'bold' }}>Empresa Aliada:</Text> Habilita el programa para sus empleados, contratistas o colaboradores.</Text>
            <Text style={styles.text}>• <Text style={{ fontWeight: 'bold' }}>Usuario:</Text> Persona natural mayor de 18 años, autorizada por la Empresa Aliada y habilitada por el Operador para acceder al programa.</Text>

            <Text style={styles.text}><Text style={{ fontWeight: 'bold' }}>Objeto:</Text></Text>
            <Text style={styles.text}>El Operador entrega al Usuario, a título de comodato precario (Código Civil colombiano, art. 2200 y ss.), el uso temporal, gratuito, personal e intransferible de bicicletas mecánicas, eléctricas, patinetas eléctricas, cascos, baterías, cargadores, candados y demás accesorios del programa (en adelante, los Equipos).</Text>

            <Text style={styles.text}><Text style={{ fontWeight: 'bold' }}>Uso voluntario y no misional:</Text></Text>
            <Text style={styles.text}>El uso es estrictamente voluntario, autónomo y gratuito. No constituye herramienta de trabajo, dotación laboral ni instrucción del empleador. Queda prohibido usar los Equipos para domicilios, mensajería, transporte remunerado o funciones laborales sin autorización previa y escrita del Operador.</Text>

            <Text style={styles.text}><Text style={{ fontWeight: 'bold' }}>Propiedad de los Equipos:</Text></Text>
            <Text style={styles.text}>Los Equipos son propiedad exclusiva del Operador o de la Empresa Aliada. El Usuario no adquiere posesión, derecho de retención ni ningún derecho real. Expresamente renuncia al derecho de retención. Está prohibido vender, prestar, ceder, modificar, gravar o abandonar los Equipos.</Text>

            <Text style={styles.text}><Text style={{ fontWeight: 'bold' }}>Clasificación legal — Ley 2486 de 2025:</Text></Text>
            <Text style={styles.text}>Los Equipos eléctricos del programa son Vehículos Eléctricos Livianos de Movilidad Personal Urbana (VELMPU) conforme a la Ley 2486 de 2025 (vigente desde julio 16 de 2025). Están exentos de SOAT, matrícula y licencia siempre que cumplan ≤1.000 W y ≤60 kg. El incumplimiento de normas viales genera infracciones tipo G (~$360.000 COP en 2026) e inmovilización del vehículo — de exclusiva responsabilidad del Usuario.</Text>
          </View>

          <View style={[styles.margin, { flex: 0.2 }]}>
            <Text style={styles.subtitle}>2. REGISTRO, FORMACIÓN Y HABILITACIÓN</Text>
            <Text style={styles.text}>Para acceder al Programa, el Usuario debe completar íntegramente:</Text>
            <Text style={styles.text}>1. Descargar la App RIDE/TRIP y crear su cuenta.</Text>
            <Text style={styles.text}>2. Leer, entender y aceptar expresamente este Acuerdo y la Política de Datos.</Text>
            <Text style={styles.text}>3. Declarar que es mayor de edad, tiene autorización de la Empresa Aliada, está en condiciones físicas para conducir de forma segura y cuenta con afiliación vigente a una EPS.</Text>
            <Text style={styles.text}>4. Aprobar el test teórico y el test práctico (cuando aplique).</Text>
            <Text style={styles.text}>5. Ser validado y habilitado por el Operador.</Text>
            <Text style={styles.text}>El proceso de formación y aceptación del Acuerdo debe renovarse cada año, o antes si el Operador lo requiere.</Text>
            <Text style={styles.text}>La sola descarga de la App no otorga derecho de uso. El Operador puede negar o revocar el acceso en cualquier momento.</Text>
          </View>

          <View style={[styles.margin, { flex: 0.2 }]}>
            <Text style={styles.subtitle}>3. ENTREGA, USO Y DEVOLUCIÓN</Text>
            <Text style={styles.text}>Los Equipos se entregan en puntos y horarios autorizados (por horas, jornada o hasta 24 horas repetitivas). Al recibirlo, el Usuario debe verificar su estado — sin anotación de anomalías, se entiende recibido en perfecto estado.</Text>
            <Text style={styles.text}>La responsabilidad del Usuario inicia al recibir el Equipo y termina únicamente cuando es devuelto, bloqueado y registrado correctamente en el punto autorizado. Si no devuelve el Equipo o lo deja mal asegurado, continúa siendo responsable por daño, pérdida o hurto.</Text>
          </View>

          <View style={[styles.margin, { flex: 0.2 }]}>
            <Text style={styles.subtitle}>4. REVISIÓN PREOPERACIONAL OBLIGATORIA</Text>
            <Text style={styles.text}>Antes de cada uso el Usuario debe confirmar en la App el estado de:</Text>
            <Text style={styles.text}>• Frenos — funcionan correctamente.</Text>
            <Text style={styles.text}>• Llantas — sin pinchazo ni pérdida de aire.</Text>
            <Text style={styles.text}>• Luces delantera (blanca) y trasera (roja) — operativas.</Text>
            <Text style={styles.text}>• Batería — sin calentamiento, deformación ni olor extraño (si aplica).</Text>
            <Text style={styles.text}>• Cables — sin exposición ni ruptura.</Text>
            <Text style={styles.text}>• Candado / guaya / bloqueo — en buen estado.</Text>
            <Text style={styles.text}>• Casco — disponible; lo usará durante todo el recorrido.</Text>
            <Text style={styles.text}>• Sin ruidos, humo ni señales de riesgo.</Text>
            <Text style={[styles.text, { fontWeight: 'bold', color: 'red' }]}>⚠️ Si detecta cualquier anomalía: NO use el Equipo.</Text>
            <Text style={styles.text}>Reporte inmediatamente al Operador and espere instrucciones. Omitir la revisión o usar el Equipo con falla conocida genera responsabilidad exclusiva del Usuario.</Text>
          </View>

          <View style={[styles.margin, { flex: 0.2 }]}>
            <Text style={styles.subtitle}>5. REGLAS DE CIRCULACIÓN Y SEGURIDAD VIAL</Text>

            <Text style={styles.text}><Text style={{ fontWeight: 'bold' }}>5.1 Infraestructura y velocidad:</Text></Text>
            <Text style={styles.text}>• Usar siempre cicloinfraestructura segura (ciclorrutas, bicicarriles, vías habilitadas).</Text>
            <Text style={styles.text}>• Velocidad máxima interna del Programa: 20 km/h (más estricta que la Ley 2486/2025 que permite 25 km/h en ciclorruta — regla contractual de seguridad operativa).</Text>
            <Text style={styles.text}>• No circular por vías principales, arterias, andenes, zonas peatonales ni carriles exclusivos de transporte público.</Text>
            <Text style={styles.text}>• Reducir velocidad en intersecciones, cruces, zonas peatonales, curvas y descensos.</Text>

            <Text style={styles.text}><Text style={{ fontWeight: 'bold' }}>5.2 Clima y estado de la vía:</Text></Text>
            <Text style={styles.text}>• No usar el Equipo en lluvia fuerte, tormentas, vías anegadas, barro ni charcos.</Text>
            <Text style={styles.text}>• En lluvia o superficie irregular: bajarse y desplazar el equipo caminando.</Text>
            <Text style={styles.text}>• La sumersión de componentes eléctricos en agua es responsabilidad del Usuario.</Text>

            <Text style={styles.text}><Text style={{ fontWeight: 'bold' }}>5.3 Conducción segura:</Text></Text>
            <Text style={styles.text}>• Usar casco homologado o certificado en todo momento (Ley 2486/2025, infracción G.10 — inmovilización).</Text>
            <Text style={styles.text}>• Portar prendas retrorreflectivas visibles entre las 18:00 y las 6:00 horas (Ley 2486/2025, infracción G.11 — inmovilización).</Text>
            <Text style={styles.text}>• Verificar luz blanca delantera y roja trasera antes de salir (Ley 2486/2025, infracción G.12).</Text>
            <Text style={styles.text}>• Mantener ambas manos disponibles. No usar celular, audífonos ni elementos distractores.</Text>
            <Text style={styles.text}>• No transportar acompañantes ni carga que afecte equilibrio, visibilidad o frenado.</Text>
            <Text style={styles.text}>• No conducir bajo efectos de alcohol, drogas o medicamentos.</Text>
            <Text style={styles.text}>• Respetar señales, semáforos, peatones y demás actores viales.</Text>

            <Text style={[styles.text, { fontWeight: 'bold', color: 'red', marginTop: 10 }]}>REGLAS CRÍTICAS — INCUMPLIMIENTO GENERA SUSPENSIÓN INMEDIATA DEL PROGRAMA:</Text>
            <Text style={styles.text}>1. Casco homologado en todo momento.</Text>
            <Text style={styles.text}>2. Nunca usar vías principales.</Text>
            <Text style={styles.text}>3. Máximo 20 km/h.</Text>
            <Text style={styles.text}>4. Prendas retrorreflectivas entre 18:00 y 6:00.</Text>
            <Text style={styles.text}>5. No usar en lluvia fuerte ni charcos.</Text>
            <Text style={styles.text}>6. No usar celular al conducir.</Text>
            <Text style={styles.text}>7. Nunca prestar el Equipo.</Text>
            <Text style={styles.text}>8. Reportar cualquier falla antes de usar.</Text>
          </View>

          <View style={[styles.margin, { flex: 0.2 }]}>
            <Text style={styles.subtitle}>6. BATERÍAS, CARGADORES Y COMPONENTES ELÉCTRICOS</Text>
            <Text style={styles.text}>La manipulación indebida de baterías puede causar incendio, quemaduras y daños a terceros. El Usuario se obliga a:</Text>
            <Text style={styles.text}>• Usar solo cargadores y accesorios entregados o autorizados expresamente por el Operador.</Text>
            <Text style={styles.text}>• No abrir, perforar, mojar, golpear, modificar ni sumergir la batería o el cargador.</Text>
            <Text style={styles.text}>• Cargar únicamente en puntos autorizados, con ventilación y alejado de materiales inflamables.</Text>

            <Text style={[styles.text, { fontWeight: 'bold', marginTop: 10 }]}>En caso de Evento Eléctrico (humo, calentamiento, chispas, olor a quemado):</Text>
            <Text style={styles.text}>6. Suspender el uso o carga inmediatamente.</Text>
            <Text style={styles.text}>7. Alejarse — no manipular la batería.</Text>
            <Text style={styles.text}>8. Llamar a emergencias 123 / Bomberos si hay humo o fuego.</Text>
            <Text style={styles.text}>9. Reportar al Operador de inmediato.</Text>
            <Text style={styles.text}>10. No aplicar agua sobre componentes energizados.</Text>
          </View>

          <View style={[styles.margin, { flex: 0.2 }]}>
            <Text style={styles.subtitle}>7. PROHIBICIONES ESPECIALES</Text>
            <Text style={styles.text}>Está expresamente prohibido al Usuario:</Text>
            <Text style={styles.text}>• Prestar, ceder o permitir el uso del Equipo a terceros.</Text>
            <Text style={styles.text}>• Circular por vías principales, arterias, andenes o zonas peatonales.</Text>
            <Text style={styles.text}>• Superar 20 km/h.</Text>
            <Text style={styles.text}>• Usar el Equipo sin casco.</Text>
            <Text style={styles.text}>• Usar sin prendas retrorreflectivas entre 18:00 y 6:00.</Text>
            <Text style={styles.text}>• Circular sin luz blanca delantera y luz roja trasera operativas.</Text>
            <Text style={styles.text}>• Usar en lluvia fuerte, inundaciones, barro o charcos.</Text>
            <Text style={styles.text}>• Usar celular, audífonos u objetos distractores al conducir.</Text>
            <Text style={styles.text}>• Transportar acompañantes.</Text>
            <Text style={styles.text}>• Usar bajo efectos de alcohol, drogas o medicamentos.</Text>
            <Text style={styles.text}>• Manipular batería, motor, GPS, candados, cables o cargadores.</Text>
            <Text style={styles.text}>• Usar cargadores, cables o accesorios no autorizados por el Operador.</Text>
            <Text style={styles.text}>• Usar para domicilios, mensajería, transporte remunerado o funciones laborales.</Text>
            <Text style={styles.text}>• Continuar usando el Equipo tras detectar falla, calentamiento, ruido o condición insegura.</Text>
            <Text style={styles.text}>• Abandonar, ocultar o retener indebidamente el Equipo.</Text>
          </View>

          <View style={[styles.margin, { flex: 0.2 }]}>
            <Text style={styles.subtitle}>8. PÓLIZA, DAÑOS Y DEDUCIBLES</Text>
            <Text style={styles.text}>Los Equipos pueden contar con póliza que cubre hasta el 70% del valor en caso de robo calificado o daños totales, con deducible del 30% a cargo del Usuario (porcentajes pueden variar según equipo y empresa aliada).</Text>
            <Text style={styles.text}>El Usuario responde por daños, pérdidas, deducibles y gastos de reparación o reposición derivados de su culpa, negligencia o incumplimiento. El valor se determina por diagnóstico técnico del Operador.</Text>

            <Text style={[styles.text, { fontWeight: 'bold', marginTop: 10 }]}>En caso de pérdida o hurto — pasos obligatorios:</Text>
            <Text style={styles.text}>11. Reportar al Operador inmediatamente.</Text>
            <Text style={styles.text}>12. Contactar a la Policía Nacional.</Text>
            <Text style={styles.text}>13. Presentar denuncia ante la Fiscalía dentro de las 12 horas siguientes.</Text>
            <Text style={styles.text}>14. Entregar copia de la denuncia al Operador.</Text>
            <Text style={[styles.text, { fontWeight: 'bold', color: 'red', marginTop: 5 }]}>No seguir estos pasos puede resultar en no aplicación de la póliza e imputación total del valor del Equipo al Usuario.</Text>
          </View>

          <View style={[styles.margin, { flex: 0.2 }]}>
            <Text style={styles.subtitle}>9. PROTOCOLO DE INCIDENTES</Text>
            <Text style={styles.text}>Ante cualquier incidente (accidente, falla, evento eléctrico, hurto):</Text>
            <Text style={styles.text}>15. Detener el uso del Equipo. Ubicarse en lugar seguro.</Text>
            <Text style={styles.text}>16. Llamar a emergencias 123 / Bomberos si hay lesión, humo o fuego.</Text>
            <Text style={styles.text}>17. Reportar al Operador dentro de la primera hora — incluir fecha, hora, ubicación, fotos y datos de terceros involucrados.</Text>
            <Text style={styles.text}>18. No manipular, reparar ni mover el Equipo salvo para evitar riesgo mayor.</Text>
            <Text style={styles.text}>19. En caso de hurto: denunciar ante la Fiscalía (máximo 12 horas) y entregar copia al Operador.</Text>
            <Text style={[styles.text, { fontWeight: 'bold', marginTop: 5 }]}>Ocultar información, reportar falsamente o no colaborar con el Operador es incumplimiento grave del Acuerdo.</Text>
          </View>

          <View style={[styles.margin, { flex: 0.2 }]}>
            <Text style={styles.subtitle}>10. RESPONSABILIDAD, RIESGOS Y EXONERACIÓN</Text>

            <Text style={styles.text}><Text style={{ fontWeight: 'bold' }}>Declaración de riesgos:</Text></Text>
            <Text style={styles.text}>El Usuario reconoce y acepta libre, voluntaria e informadamente que el uso de bicicletas, bicicletas eléctricas y patinetas implica riesgos inherentes: caídas, lesiones, accidentes, condiciones adversas de vía y clima. Asume dichos riesgos cuando se deriven de su decisión autónoma de uso o de su conducta.</Text>

            <Text style={styles.text}><Text style={{ fontWeight: 'bold' }}>Exoneración del Operador y la Empresa Aliada:</Text></Text>
            <Text style={styles.text}>El Operador y la Empresa Aliada no asumen responsabilidad civil, laboral, penal ni de ningún tipo por accidentes, lesiones o daños derivados del uso de los Equipos cuando sean consecuencia de: (i) la decisión voluntaria del Usuario; (ii) incumplimiento de este Acuerdo; (iii) infracción de normas de tránsito; (iv) uso en condiciones climáticas adversas o zonas no autorizadas; (v) omisión de la revisión preoperacional; (vi) uso bajo efectos de alcohol o drogas; (vii) hechos de terceros o fuerza mayor no imputables al Operador; (viii) manipulación indebida del Equipo.</Text>
            <Text style={styles.text}>Esta exoneración opera en la mayor extensión que permita la ley colombiana y no excluye la responsabilidad del Operador por fallas directas, comprobadas e imputables exclusivamente a este.</Text>

            <Text style={styles.text}><Text style={{ fontWeight: 'bold' }}>Indemnidad:</Text></Text>
            <Text style={styles.text}>El Usuario se obliga a mantener indemnes al Operador, la Empresa Aliada y sus representantes frente a cualquier reclamación, demanda o gasto de terceros derivado de hechos imputables al Usuario, incluyendo honorarios de abogados.</Text>

            <Text style={styles.text}><Text style={{ fontWeight: 'bold' }}>Fuerza mayor:</Text></Text>
            <Text style={styles.text}>El Usuario no puede excusarse del pago de sus obligaciones dinerarias ni de indemnidad por fuerza mayor.</Text>
          </View>

          <View style={[styles.margin, { flex: 0.2 }]}>
            <Text style={styles.subtitle}>11. SUSPENSIÓN Y TERMINACIÓN DEL ACCESO</Text>
            <Text style={styles.text}>El Operador puede suspender, bloquear o terminar el acceso sin indemnización cuando el Usuario: incumpla este Acuerdo; use el Equipo de forma insegura; omita la revisión preoperacional; use sin casco o sin retrorreflectivos; circule por vías prohibidas; exceda 20 km/h; preste el Equipo; manipule componentes; use cargadores no autorizados; entregue información falsa; no renueve su formación anual; pierda su condición de usuario autorizado; o por razones operativas o de seguridad del Operador.</Text>
            <Text style={styles.text}>La terminación no extingue obligaciones previas de restitución, pago o indemnidad.</Text>
          </View>

          <View style={[styles.margin, { flex: 0.2 }]}>
            <Text style={styles.subtitle}>12. DATOS PERSONALES Y POLÍTICA DE PRIVACIDAD</Text>
            <Text style={styles.text}><Text style={{ fontWeight: 'bold' }}>Responsable:</Text> MOVILIDAD EN BICICLETA S.A.S. · NIT 900.342.482-9 · admon@mejorenbici.com · 3245658543 · www.mejorenbici.com</Text>

            <Text style={styles.text}><Text style={{ fontWeight: 'bold' }}>Datos que se recolectan:</Text></Text>
            <Text style={styles.text}>Identificación (nombre, documento, fecha de nacimiento), contacto (correo corporativo, teléfono), datos laborales (empresa aliada, cargo), afiliación a EPS, historial de uso del Programa (préstamos, recorridos, incidentes, tests), geolocalización (para georeferenciación de equipos y emergencias), datos técnicos del dispositivo y registro de aceptación de este Acuerdo.</Text>

            <Text style={styles.text}><Text style={{ fontWeight: 'bold' }}>Para qué se usan:</Text></Text>
            <Text style={styles.text}>• Registrar, verificar y gestionar el acceso al Programa.</Text>
            <Text style={styles.text}>• Controlar y monitorear el uso de los Equipos.</Text>
            <Text style={styles.text}>• Atender emergencias, incidentes y reclamaciones.</Text>
            <Text style={styles.text}>• Cumplir obligaciones legales y contractuales.</Text>
            <Text style={styles.text}>• Comunicaciones operativas, de servicio, de seguridad y mejora del servicio.</Text>
            <Text style={styles.text}>• Métricas agregadas de movilidad sostenible.</Text>

            <Text style={styles.text}><Text style={{ fontWeight: 'bold' }}>Compartición con terceros:</Text></Text>
            <Text style={styles.text}>El Operador puede compartir datos con la Empresa Aliada (efectos operativos), proveedores tecnológicos, aseguradoras y autoridades (Policía, Fiscalía, juzgados) cuando sea legalmente requerido. No venderá ni cederá datos a terceros con fines comerciales sin consentimiento previo.</Text>

            <Text style={styles.text}><Text style={{ fontWeight: 'bold' }}>Sus derechos (ARCO) — Ley 1581 de 2012:</Text></Text>
            <Text style={styles.text}>Puede conocer, actualizar, rectificar, solicitar supresión o revocar la autorización de sus datos escribiendo a admon@mejorenbici.com. Consultas: 10 días hábiles. Reclamos: 15 días hábiles. También puede presentar quejas ante la Superintendencia de Industria y Comercio (SIC).</Text>

            <Text style={styles.text}><Text style={{ fontWeight: 'bold' }}>Conservación:</Text></Text>
            <Text style={styles.text}>Los datos se conservarán mientras sea necesario para los fines descritos o por hasta 10 años adicionales, salvo solicitud de supresión sin obligación legal de conservación.</Text>
          </View>

          <View style={[styles.margin, { flex: 0.2 }]}>
            <Text style={styles.subtitle}>13. DISPOSICIONES FINALES</Text>

            <Text style={styles.text}><Text style={{ fontWeight: 'bold' }}>Marco normativo:</Text></Text>
            <Text style={styles.text}>Este Acuerdo se rige por: Código Civil (comodato precario), Ley 769/2002 (tránsito), Ley 1811/2016 (bicicletas), Resolución 160/2017 (MinTransporte), Ley 2486/2025 (VELMPU — vigente desde jul. 2025), Ley 1581/2012 + Decreto 1377/2013 (datos personales), Ley 527/1999 (firma electrónica), Ley 1563/2012 (arbitraje) y normas locales de movilidad aplicables. Las disposiciones reglamentarias de la Ley 2486/2025 se incorporan de pleno derecho a este Acuerdo desde su vigencia.</Text>

            <Text style={styles.text}><Text style={{ fontWeight: 'bold' }}>Controversias:</Text></Text>
            <Text style={styles.text}>Las diferencias se resolverán primero de manera directa (30 días). De no lograrse acuerdo, mediante Tribunal de Arbitramento ante la Cámara de Comercio de Bogotá, conforme a la Ley 1563 de 2012, sin perjuicio del derecho del Operador de acudir a la justicia ordinaria para restitución de Equipos o cobro de daños.</Text>

            <Text style={styles.text}><Text style={{ fontWeight: 'bold' }}>Actualización del Acuerdo:</Text></Text>
            <Text style={styles.text}>El Operador puede actualizar este Acuerdo. Cuando la actualización sea sustancial, el Usuario deberá aceptarla para continuar usando el Programa. Los cambios exclusivamente normativos se incorporan de pleno derecho sin nueva aceptación.</Text>

            <Text style={styles.text}><Text style={{ fontWeight: 'bold' }}>Validez e integralidad:</Text></Text>
            <Text style={styles.text}>Este Acuerdo reemplaza cualquier acuerdo anterior sobre el mismo objeto. El Usuario no puede ceder sus derechos ni obligaciones. La aceptación digital (checkbox, botón, firma electrónica) tiene plena validez conforme a la Ley 527 de 1999.</Text>

            <Text style={styles.text}><Text style={{ fontWeight: 'bold' }}>Canales oficiales:</Text></Text>
            <Text style={styles.text}>
              App Mejor en Bici: [●] | WhatsApp: [●]{"\n"}
              Teléfono: 3245658543 | Correo: admon@mejorenbici.com{"\n"}
              Web: www.mejorenbici.com | Punto físico / estación: [●]
            </Text>
          </View>

          <View style={[styles.margin, { flex: 0.2 }]}>
            <Text style={styles.subtitle}>14. DECLARACIÓN FINAL Y ACEPTACIÓN EXPRESA</Text>
            <Text style={styles.text}>Al aceptar este Acuerdo, declaro expresamente que:</Text>
            <Text style={styles.text}>20. Leí, entendí y acepto en su totalidad este Acuerdo Integral de Uso.</Text>
            <Text style={styles.text}>21. El uso del Equipo es voluntario, autónomo, gratuito y no misional.</Text>
            <Text style={styles.text}>22. Conozco y acepto los riesgos inherentes al uso de bicicletas y patinetas en vías públicas.</Text>
            <Text style={styles.text}>23. Soy mayor de edad y cuento con autorización de la Empresa Aliada.</Text>
            <Text style={styles.text}>24. No tengo patología que me impida conducir de forma segura.</Text>
            <Text style={styles.text}>25. Cuento con afiliación vigente a una EPS.</Text>
            <Text style={styles.text}>26. Usaré casco homologado en todo momento (Ley 2486/2025, G.10).</Text>
            <Text style={styles.text}>27. Portaré prendas retrorreflectivas entre las 18:00 y las 6:00 (Ley 2486/2025, G.11).</Text>
            <Text style={styles.text}>28. Verificaré luz blanca delantera y roja trasera antes de cada uso (Ley 2486/2025, G.12).</Text>
            <Text style={styles.text}>29. Respetaré la velocidad máxima de 20 km/h y usaré solo cicloinfraestructura segura.</Text>
            <Text style={styles.text}>30. No usaré el Equipo en lluvia fuerte ni condiciones climáticas peligrosas.</Text>
            <Text style={styles.text}>31. Realizaré la revisión preoperacional antes de cada uso y la confirmaré en la App.</Text>
            <Text style={styles.text}>32. Reportaré inmediatamente cualquier falla, incidente, daño, pérdida o condición insegura.</Text>
            <Text style={styles.text}>33. Acepto el tratamiento de mis datos personales y geolocalización para operar el Programa.</Text>
            <Text style={styles.text}>34. Acepto que el Operador y la Empresa Aliada no asumen responsabilidad por accidentes derivados del uso voluntario de los Equipos, conforme a la Sección 10.</Text>
            <Text style={styles.text}>35. El incumplimiento puede generar suspensión del acceso y responsabilidad por daños.</Text>

            <Text style={[styles.text, { fontWeight: 'bold', marginTop: 15, textAlign: 'center' }]}>✅ ACEPTO EXPRESAMENTE EL ACUERDO INTEGRAL DE USO — MEJOR EN BICI</Text>
            <Text style={[styles.text, { fontStyle: 'italic', textAlign: 'center' }]}>Al presionar el botón de aceptación en la App confirmo que he leído, entendido y acepto en su totalidad este Acuerdo and sus anexos.</Text>
          </View>

          <View style={[styles.margin, { flex: 0.2 }]}>
            <Text style={styles.subtitle}>ANEXO 1 — Checklist de Revisión Preoperacional</Text>
            <Text style={[styles.text, { fontStyle: 'italic', marginBottom: 5 }]}>Confirmar en la App antes de cada uso. Obligatorio para iniciar el préstamo.</Text>
            <Text style={styles.text}>• ☐ Frenos — funcionan.</Text>
            <Text style={styles.text}>• ☐ Llantas — sin pinchazo ni pérdida de aire.</Text>
            <Text style={styles.text}>• ☐ Luces blanca delantera y roja trasera — operativas.</Text>
            <Text style={styles.text}>• ☐ Batería — sin calentamiento, deformación ni olor (si aplica).</Text>
            <Text style={styles.text}>• ☐ Cables — sin exposición ni ruptura.</Text>
            <Text style={styles.text}>• ☐ Candado / guaya — en buen estado.</Text>
            <Text style={styles.text}>• ☐ Casco — disponible; lo usaré en todo el recorrido.</Text>
            <Text style={styles.text}>• ☐ Sin ruidos, humo, olor extraño ni señales de riesgo.</Text>
            <Text style={styles.text}>• ☐ No usaré el Equipo en vías principales, andenes, lluvia fuerte ni charcos.</Text>
            <Text style={styles.text}>• ☐ Cumpliré normas de tránsito e instrucciones del Programa.</Text>
            <Text style={[styles.text, { fontWeight: 'bold', color: 'green', marginTop: 10, textAlign: 'center' }]}>✅ Equipo en condiciones. Iniciar recorrido.</Text>
            <Text style={[styles.text, { fontWeight: 'bold', color: 'red', textAlign: 'center' }]}>🔴 Reportar novedad. No usar el Equipo.</Text>
          </View>

          <View style={[styles.margin, { flex: 0.2 }]}>
            <Text style={styles.subtitle}>ANEXO 2 — Reglas Rápidas de Uso Seguro</Text>
            <Text style={[styles.text, { fontWeight: 'bold' }]}>Siempre:</Text>
            <Text style={styles.text}>• ✅ Casco homologado en todo momento (G.10 — inmovilización si no lo usas).</Text>
            <Text style={styles.text}>• ✅ Cicloinfraestructura segura (ciclorrutas, bicicarriles).</Text>
            <Text style={styles.text}>• ✅ Máximo 20 km/h.</Text>
            <Text style={styles.text}>• ✅ Revisión preoperacional antes de salir.</Text>
            <Text style={styles.text}>• ✅ Prendas retrorreflectivas entre 18:00 y 6:00 (G.11 — inmovilización).</Text>
            <Text style={styles.text}>• ✅ Luz blanca delantera y roja trasera operativas (G.12).</Text>
            <Text style={styles.text}>• ✅ Reportar cualquier falla o incidente de inmediato.</Text>

            <Text style={[styles.text, { fontWeight: 'bold', marginTop: 10 }]}>Nunca:</Text>
            <Text style={styles.text}>• 🔴 Vías principales ni arterias.</Text>
            <Text style={styles.text}>• 🔴 Lluvia fuerte ni charcos.</Text>
            <Text style={styles.text}>• 🔴 Prestar el Equipo a terceros.</Text>
            <Text style={styles.text}>• 🔴 Celular ni audífonos al conducir.</Text>
            <Text style={styles.text}>• 🔴 Acompañantes.</Text>
            <Text style={styles.text}>• 🔴 Manipular batería, cargador, GPS ni frenos.</Text>
            <Text style={styles.text}>• 🔴 Alcohol ni sustancias psicoactivas.</Text>
            <Text style={styles.text}>• 🔴 Si ves humo, calor o chispa: detente, aléjate, llama al 123 y reporta.</Text>
          </View>

          <View style={[styles.margin, { flex: 0.2 }]}>
            <Text style={styles.subtitle}>ANEXO 3 — Protocolo Corto de Incidentes</Text>
            <Text style={styles.text}>36. Detener el uso. Ubicarse en lugar seguro.</Text>
            <Text style={styles.text}>37. Llamar a 123 / Bomberos si hay lesión, humo o fuego.</Text>
            <Text style={styles.text}>38. Reportar al Operador dentro de la primera hora.</Text>
            <Text style={styles.text}>39. No manipular ni reparar el Equipo.</Text>
            <Text style={styles.text}>40. Conservar evidencia (fotos, video) si es seguro.</Text>
            <Text style={styles.text}>41. Hurto o pérdida: denunciar en Fiscalía (máx. 12 h) y entregar copia al Operador.</Text>
            <Text style={[styles.text, { fontWeight: 'bold', marginTop: 10 }]}>Emergencias: 123 / Bomberos</Text>
            <Text style={styles.text}>Operador (WhatsApp): [●] | Teléfono: 316 812 7343</Text>
            <Text style={styles.text}>Correo: admon@mejorenbici.com</Text>
          </View>

          {/*<View style={[styles.margin, { flex: 0.2, flexDirection: 'row', marginTop: 20 }]}>
                <CheckBox
                  value={true}
                  tintColors={{ true: 'yellow', false: '#8ac43f' }}
                />
                <Text style={[{maxWidth:220,fontFamily:Fonts.$poppinsregular,fontSize:13,lineHeight: 21,		color:Colors.$textogray,		textAlign:'justify',}]}>
                  De lo contrario, por favor haga click en “Aceptar” y empiece a disfrutar de todos los beneficios de la movilidad sotenible.</Text>
              </View>

              <View style={[{ flex: 0.1, height: 39, backgroundColor: Colors.$texto, borderRadius: 15, justifyContent: 'center', marginHorizontal:25, marginTop: 20, marginBottom:5 }]}>
                <Text style={{ color: 'white', textDecorationLine: 'none', textAlign: 'center' }}
                  onPress={() => membershipTermsAcepted()}>
                  Aceptar Terminos y Condiciones
                </Text>
              </View>

              <View style={[{ flex: 0.1, height: 39, backgroundColor: Colors.$primario, borderRadius: 15, justifyContent: 'center', marginRight: 25, marginLeft: 25}]}>
              <View style={[{ flex: 0.1, height: 39, backgroundColor: Colors.$primario, borderRadius: 15, justifyContent: 'center', marginRight: 25, marginLeft: 25}]}>
                <Text style={{ color: 'white', textDecorationLine: 'none', textAlign: 'center' }}
                  onPress={() => goBack()}>
                  Cancelar
                </Text>
              </View>
              </View>*/}
        </ScrollView>
        {/* <View style={{ 
              height: Dimensions.get("window").height*.35
            }}>
              <View style={[styles.margin, { flex: 0.4, flexDirection: 'row', marginTop: 20 }]}>
                <CheckBox
                  value={true}
                  tintColors={{ true: 'black', false: '#8ac43f' }}
                />
                <Text style={[{maxWidth:280,fontFamily:Fonts.$poppinsregular,fontSize:13,lineHeight: 21,		color:Colors.$textogray,		textAlign:'justify',}]}>
                  De lo contrario, por favor haga click en “Aceptar” y empiece a disfrutar de todos los beneficios de la movilidad sotenible.</Text>
              </View>

              <View style={[{ flex: 0.25, height: 50, backgroundColor: Colors.$primario, borderRadius: 15, justifyContent: 'center', marginHorizontal:25, marginTop: 20, marginBottom:20 }]}>
                <Text style={{ color: Colors.$blanco, textDecorationLine: 'none', textAlign: 'center', fontSize: 18 }}
                  onPress={() => membershipTermsAcepted()}>
                  Aceptar Terminos y Condiciones
                </Text>
              </View>

              <View style={[{ flex: 0.25, height: 50, backgroundColor: Colors.$tercer, borderRadius: 15, justifyContent: 'center', marginRight: 25, marginLeft: 25}]}>
              <View style={[{ height: 50, backgroundColor: Colors.$tercer, borderRadius: 15, justifyContent: 'center', marginRight: 25, marginLeft: 25}]}>
                <Text style={{ color: 'black', textDecorationLine: 'none', textAlign: 'center', fontSize: 18 }}
                  onPress={() => goBack()}>
                  Cancelar
                </Text>
              </View>
              </View>
            </View> */}
      </SafeAreaView>
    </View>
  );
}

function mapStateToProps(state) {
  return {
    membershipTermsAccepted: state.othersReducer.membershipTermsAccepted
  }
}

function mapDispatchToProps(dispatch) {
  return {
    acceptTerms: () => dispatch(acceptTerms()),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(TermsScreen);
