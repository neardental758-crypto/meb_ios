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

function TermsScreen (props){
  const goBack = () => {
    RootNavigation.navigate("RegisterScreen")
  }
    return (
      <View style={{ flex: 1, backgroundColor: '#fff', height: Dimensions.get("window").height }}>
      <View style={{flexDirection : 'row', justifyContent : 'flex-start', padding: 20, paddingBottom : 5, backgroundColor : 'white'}}>
        <Pressable onPress={() => { goBack() }} 
        style={{    
          backgroundColor : 'white',
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
          elevation: 5, }}>
            <Image style={{ width: horizontalScale(25), height: verticalScale(25), borderRadius: horizontalScale(30), }} source={Images.atras_Icon} />
        </Pressable>
      </View>
          <SafeAreaView style={{ flex: 1, backgroundColor: 'rgba(255, 255, 255, 0.8)', margin: 10 }}>
            <Image source={Images.logoDaviRide} style={{ width: 230, height: 80, alignSelf: 'center', marginBottom: 30 }} />
            {/*<View style={[styles.margin, { flex: 0.2, marginBottom: 2, alignItems: 'center' }]}>
              <Text style={{ marginBottom: 10, fontFamily:Fonts.$montserratMedium,color:Colors.$texto,fontSize:25, }}>Términos y condiciones</Text>
              <View style={{ height: 5, width: 150, backgroundColor: Colors.$primario, alignSelf: 'center', borderRadius: 10, marginBottom: 20 }} />
            </View>*/}
            <ScrollView style={{ 
              height: Dimensions.get("window").height*.60,  
            }}>
              <View style={[styles.margin, { flex: 0.2, marginBottom: 2, alignItems: 'center' }]}>
              <Text style={{ marginBottom: 10, fontFamily:Fonts.$montserratMedium,color:Colors.$texto,fontSize:25, }}>Términos y condiciones</Text>
              <View style={{ height: 5, width: 250, backgroundColor: Colors.$texto, alignSelf: 'center', borderRadius: 10, marginBottom: 20 }} />
            </View>
              <View style={[styles.margin, { flex: 0.2 }]}>
                <Text style={styles.subtitle}>CONTRATO DE COMODATO SUSCRITO ENTRE NEARDENTAL S.A.S. Y USUARIO</Text>
                <Text style={styles.text}>Entre NEARDENTAL S.A.S (COMODANTE) y el suscrito (COMODATARIO), han convenido celebrar mediante el
                presente documento, un CONTRATO DE COMODATO PRECARIO, regido por las siguientes cláusulas y en lo no
                previsto por ellas, se regirá por el Código Civil y de Comercio colombianos:
                </Text>
              </View>
              <View style={[styles.margin, {flex:0.1}]}>
                <Text style={styles.text}>PRIMERA.- OBJETO. El COMODANTE
Dentro de las diferentes herramientas de promoción de bienestar y movilidad el usuario puede hacer uso (bajo su
total autonomía) de vehículos sostenibles. Por medio de este documento se entrega a título de comodato precario a
EL COMODATARIO y éste recibe al mismo título, los siguientes Equipos: (en adelante LOS EQUIPOS)
</Text>
              </View>
              <View style={[styles.marginNumbe, {flex:0.1}]}>
                <Text style={styles.text}>LOS EQUIPOS:
1. Bicicleta eléctrica tipo urbano BICYCLE CAPITAL 5g (Guardabarros delantero y trasero, sistema de
cambios, Parilla, Luz delantera, Luz Trasera, guaya y Batería
2. Bicicleta mecánica Urbana Flota CLARO (Guardabarros delantero y trasero, stop trasero, campana de timón,
cambios)
Los EQUIPOS se entregarán luego de una aceptación y verificación en el proceso de registro del programa Bicycle
Capital y según disponibilidad.
LOS EQUIPOS son de propiedad del COMODANTE y, por ende, no pueden ser utilizados por EL COMODATARIO
como prenda de garantía, ni ser reputados como propiedad del COMODATARIO en ninguna circunstancia.</Text>
              </View>
              <View style={[styles.margin, {flex:0.1}]}>
                <Text style={styles.text}>SEGUNDA.-ENTREGA. El COMODANTE entregará LOS EQUIPOS a EL COMODATARIO, según disponibilidad, ya sea
por su sistema de entrega virtual o personal, siguiendo los procesos de renta o reserva establecidos de manera
diaria por un periodo máximo de 24 horas. El COMODATARIO está en la obligación de revisar LOS EQUIPOS en el
momento de la entrega. De no realizar anotación alguna sobre el estado de LOS EQUIPOS, se dará por entendido
que los recibe en perfecto estado de funcionamiento. </Text>
              </View>
              <View style={[styles.margin, {flex:0.1}]}>
                <Text style={styles.text}>TERCERA.- LUGAR DE ENTREGA. El COMODANTE entregará y recibirá LOS EQUIPOS en los parqueaderos de
bicicletas y patinetas correspondientes a las estaciones de la EMPRESA ALIADA..
EL COMODATARIO se obliga a regresar LOS EQUIPOS al mismo punto de entrega, dentro del término establecido.</Text>
              </View>
              
              <View style={[styles.margin, {flex:0.1}]}>
                <Text style={styles.text}>CUARTA.- OBLIGACIONES DEL COMODATARIO: Son obligaciones especiales del COMODATARIO las siguientes: a)
Usar la BICICLETA para su exclusivo uso personal de acuerdo al “Instructivo de Uso”, así como abstenerse de permitir
su uso a terceras personas. b) Cuidar y mantener LA BICICLETA, respondiendo por daño o deterioro que sufra, con
límite a la buena fe y debida diligencia del COMODATARIO. La calificación queda a criterio del COMODANTE. c)
Responder por los daños que LA BICICLETA cause a terceros. d) Restituir LA BICICLETA en perfecto estado de
funcionamiento cuando termine el presente contrato o cuando el COMODANTE le solicite su restitución por cualquier
causa. En consecuencia, EL COMODATARIO renuncia expresamente a ejercer el derecho de retención por cualquier
causa. e) Las demás obligaciones propias de los comodatarios de acuerdo con las disposiciones. f) El valor de
reposición de LOS EQUIPOS será el precio comercial vigente del EQUIPO para el momento de la reposición, aplicando
la devaluación correspondiente. Se revisará cada caso en particular para determinar responsabilidades, reclamación
de póliza y pago de deducibles y posible parte del costo. g) El COMODATARIO acepta haber leído y entendido el
Documento de Exoneración de Responsabilidad Anexo. h) No emplear los EQUIPOS sino en el uso convenido, o a
falta de convención en el uso ordinario de los de su clase. i) Restituir la misma especie después de terminar su uso,
en las mismas condiciones en las cuales las recibió, salvo el deterioro normal por el uso. j) Emplear el mayor cuidado
en la conservación de LOS EQUIPOS y responder por daños y/o pérdida en los términos de las cláusulas precedentes.
k) Dar estricto cumplimiento a todas las obligaciones generales del contrato. l) tener una afiliación vigente a una
compañía de EPS. M) Cumplir con lo estipulado en la circular 006, emitida por la secretaria de movilidad en el que
debe transitarse a una velocidad máxima de 20km/h, así mismo según la ley 769 del código nacional de tránsito
terrestre, en donde especifica las restricciones con respecto al estacionamiento del vehículo, la
movilización o tránsito con el vehículo sobre ciclorrutas en vía y fuera de la vía, circular por la calzada en aquellos
casos que no exista ciclo rutas, y no transitar por andenes y vías arteriales
</Text>
              </View>
              <View style={[styles.margin, {flex:0.1}]}>
                <Text style={styles.text}>QUINTA.- CAPACITACIÓN. El COMODATARIO asistirá a una capacitación previa, por medio de talleres de inducción
o herramientas digitales antes de ser permitido el uso de LOS EQUIPOS. Se realizará al momento de registro en el
sistema.
</Text>
              </View>
              <View style={[styles.margin, {flex:0.1}]}>
                <Text style={styles.text}>SEXTA.- RESTITUCIÓN. En atención a la naturaleza de comodato precario del presente contrato, el COMODANTE se
reserva la facultad de pedir la restitución de los bienes entregados en comodato a EL COMODATARIO en cualquier
momento
</Text>
              </View>
              <View style={[styles.margin, {flex:0.1}]}>
                <Text style={styles.text}>SEPTIMA- SERVICIO. Durante la vigencia del presente contrato de comodato precario, el COMODANTE asumirá los
costos necesarios de las piezas que deban ser reemplazadas como consecuencia del desgaste y/o uso normal de
LOS EQUIPOS, a juicio exclusivo y razonable del COMODANTE. El COMODANTE brindara los servicios
exclusivamente para desplazamientos NO MISIONALES por parte de EL COMODATARIO, es decir, no podrá realizar
ningún desplazamiento asociado al cumplimiento de sus funciones como colaborador de LA EMPRESA ALIADA.
Parágrafo 1: Este servicio no cubre daños ocasionados por culpa o mal manejo de LOS EQUIPOS que haga EL
COMODATARIO, a juicio exclusivo y razonable del COMODANTE, caso en el cual EL COMODATARIO asumirá los
costos de la reparación incluyendo mano de obra y repuestos a los precios vigentes en el momento del daño.
Los daños por los cuales EL COMODATARIO responderá incluyen, pero no se limitan a ello, pérdidas de partes
(incluido robo), daños generados por culpa o negligencia, daños en el marco, Stem, tenedor, y accesorios de las
bicicletas y patinetas, que no se causen por el desgaste normal de LOS EQUIPOS, a juicio exclusivo del
COMODANTE. En ciertos casos aplicará la póliza expuesta en la cláusula octava</Text>
              </View>
              <View style={[styles.margin, {flex:0.1}]}>
                <Text style={styles.text}>OCTAVA- RESPONSABILIDAD POR DAÑOS Y/O PÉRDIDA. EL COMODATARIO por este medio asume y se hace
responsable de todos los riesgos por pérdida, robo o daño de LOS EQUIPOS por negligencia o culpa grave durante
el término de tiempo que el EQUIPO se encuentre en su tenencia. Las bicicletas y patinetas se encuentran en una
cobertura con póliza del 70% contra robo calificado y daños totales con un deducible del 30%, los cuales estarán a
cargo del comodatario y serán pagados por medio de un acuerdo de pago con el COMODANTE o descontados por
nómina.
El COMODATARIO saldrá al saneamiento e indemnizará integralmente al COMODANTE, por cualquier eventual
reclamación, o demandas que le fueren hechas por terceros en relación con el uso de las bicicletas y patinetas En
consecuencia, EL COMODATARIO será responsable cuando ocurra cualquier daño o pérdida de LOS EQUIPOS, por
negligencia o culpa grave en el uso o custodia del mismo, con excepción de aquellos daños causados por
obsolescencia, desgaste o deterioro de los materiales. En caso de pérdida, robo o daños de cualquier índole EL
COMODATARIO notificará por escrito al COMODANTE en un plazo no mayor de doce (12) horas de tal pérdida, robo
o daño, y EL COMODATARIO deberá:
Presentar denuncia respectiva ante la Fiscalía y presentarla ante el COMODANTE. Se analizará el caso para
presentación de reclamo ante el seguro correspondiente.
</Text>
              </View>
              <View style={[styles.margin, {flex:0.1}]}>
                <Text style={styles.text}>NOVENA- OBLIGACIONES DEL COMODANTE: Entrega gratuitamente para su uso LOS EQUIPOS en perfecto
estado de funcionamiento. (2) Asumir los costos necesarios de las piezas que deban ser reemplazadas como
consecuencia del desgaste normal de LOS EQUIPOS, según lo especificado. (3) Capacitar a los COMODATARIOS
para que se adiestren en el funcionamiento y uso responsable de LOS EQUIPOS.</Text>
              </View>
              <View style={[styles.margin, {flex:0.1}]}>
                <Text style={styles.text}>DÉCIMA: VIGENCIA. El derecho de uso que por este contrato se otorga al comodatario sobre LOS EQUIPOS se
encuentra limitado a la disponibilidad de los mismos, a los horarios y los periodos establecidos por el COMODANTE.
El término de vigencia del presente contrato será por el mismo término de duración del contrato que EL
COMODANTE tenga suscrito y vigente con LA EMPRESA ALIADA. LOS EQUIPOS se entregarán por periodos de doce
a veinticuatro horas aproximadamente de manera repetitiva.</Text>
              </View>
              <View style={[styles.margin, {flex:0.1}]}>
                <Text style={styles.text}>DÉCIMA PRIMERA– CAUSALES DE TERMINACIÓN DEL PRESENTE CONTRATO. Serán causales de terminación
del presente contrato las siguientes.
Si EL COMODATARIO incumple el instructivo de uso y responsabilidades del programa.
Por decisión unilateral del COMODANTE, sin que exista posibilidad para EL COMODATARIO de reclamar daño,
perjuicio, o indemnización alguna. Por mutuo acuerdo de los contratantes, manifestado expresamente y por escrito.
Por no pertenecer a la institución.</Text>
              </View>
              <View style={[styles.margin, {flex:0.1}]}>
                <Text style={styles.text}>DÉCIMA SEGUNDA- FUERZA MAYOR. EL COMODATARIO no podrá excusarse del pago de sus obligaciones
dinerarias, contraídas con la suscripción de este contrato, por causa alguna, ni siquiera en los eventos en que
hubiere ocurrido algún evento que pudiere catalogarse como fuerza mayor.</Text>
              </View>
              <View style={[styles.margin, {flex:0.1}]}>
                <Text style={styles.text}>DÉCIMA TERCERA. – CLÁUSULA COMPROMISORIA. En los eventos en que surjan diferencias en la interpretación
y/o ejecución del presente contrato, las partes de común acuerdo aceptan que antes de acudir ante la justicia
tribunal de arbitramento, intentarán una amigable composición para resolver las diferencias. Si las Partes no
llegaren a un acuerdo dentro de los treinta (30) días comunes de haberse presentado la situación de conflicto, de
mutuo acuerdo acudirán a un tribunal de arbitramento designado por la Cámara de Comercio de Cali, el cual una
vez constituido se sujetará a lo dispuesto en la Ley 1563 de 2012.
</Text>
              </View>
              <View style={[styles.margin, {flex:0.1}]}>
                <Text style={styles.text}>DÉCIMA CUARTA.- NO CESIÓN. EL COMODATARIO no podrá ceder y/o traspasar, parcial o totalmente a ningún
título, ninguno de los derechos y/u obligaciones que ha adquirido en virtud del presente contrato.
</Text>
              </View>
              <View style={[styles.margin, {flex:0.1}]}>
                <Text style={styles.text}>DÉCIMA QUINTA.– MODIFICACIONES. Cualquier modificación al presente contrato deberá constar por escrito
firmado por el representante legal del COMITENTE.
</Text>
              </View>
              <View style={[styles.margin, {flex:0.1}]}>
                <Text style={styles.text}>DÉCIMA SEXTA.– LIBERACIONES DE RESPONSABILIDAD: Ni El COMODANTE, ni LA EMPRESA ALIADA, se hacen
responsables por ningún accidente, daño y/o perjuicio causado al COMODATARIO, ni a terceros por usos del EQUIPO. En
consecuencia EL COMODATARIO declara aceptar y entender que la utilización de LOS EQUIPOS se hace bajo su propio
riesgo y responsabilidad, por lo que con la firma del presente Contrato y documento de exoneración de responsabilidad
anexo se compromete a mantener indemne al COMODANTE y a la EMPRESA ALIADA, y a cualquiera de sus filiales,
representantes, sucesores y cesionarios y los directores, administradores, empleados y agentes de los mismos contra
todas las reclamaciones, pérdidas, daños, responsabilidades y gastos, incluyendo honorarios razonables de abogados,
incurridos por ellos por concepto de o como resultado de cualquier reclamación que cualquier tercero pueda presentar
contra EL COMODANTE por el uso de LOS EQUIPOS objeto del presente Contrato por parte del COMODATARIO.
</Text>
              </View>
              <View style={[styles.margin, {flex:0.1}]}>
                <Text style={styles.text}>DECIMA SEPTIMA: Contrato integral: Este Contrato reemplaza y deja sin efecto cualquier contrato anterior que
puedan haber suscrito las partes con objeto igual o similar. Asimismo, hace parte del Contrato de Prestación de
Servicios firmado entre el COMODANTE y LA EMPRESA ALIADA.</Text>
              </View>
              <View style={[styles.margin, {flex:0.1}]}>
                <Text style={styles.text}>DÉCIMA OCTAVA: Notificaciones: Todas las notificaciones y avisos que deban otorgarse de conformidad con el
presente Contrato deberán hacerse por escrito, debiendo obtener la parte que la realice, evidencia de que la
comunicación ha sido recibida por la otra parte. Para los efectos anteriores y hasta tanto no se notifiquen nuevos
domicilios en la forma antes indicada, las partes señalan sus domicilios al final de este documento
</Text>
              </View>
              <View style={[styles.margin, {flex:0.1}]}>
                <Text style={styles.text}>DÉCIMA NOVENA: DECLARACIÓN DE SALUD: EL COMODATARIO declara que no tiene ninguna patología o
enfermedad que haya sido diagnosticada médicamente, que conlleve a limitaciones para la conducción segura de
vehículos tipo bicicleta y patineta.
</Text>
              </View>
              <View style={[styles.margin, {flex:0.1}]}>
                <Text style={styles.text}>VIGÉSIMA: EL COMODATARIO declara que conoce y acepta las políticas de tratamiento de datos personales del
COMODATARIO y de LA EMPRESA ALIADA para su uso exclusivo de ser parte y utilizar los beneficios del programa
de movilidad sostenible y la ejecución de este contrato. Las políticas se encuentran en www.davibici.co. </Text>
              </View>
              <View style={[styles.marginNumbe, {flex:0.1}]}>
                <Text style={styles.text}>ANEXO 1
Documento de Exoneración de Responsabilidad Programa Bicycle Capital – USUARIO
Por medio del presente documento, declaro bajo mi voluntad libre, responsabilidad y conocimiento, qué:
1. Conozco los riesgos derivados del uso de los Equipos objeto del programa.
2. Actualmente me encuentro afiliado a una E.P.S legalmente constituida en riesgos comunes de salud, todo lo
cual consta en la copia de los certificados de afiliación que adjunto al presente documento.
3. Mi estado físico actual me permite participar del programa sin riesgo previsible para mi salud.
4. El uso de las bicicletas y/o patineta recibida será personal e intransferible y no podrá ser usada por otra persona
distinta a mi.
5. Declaro conocer que el programa se realizará por carreteras públicas abiertas al tráfico.
6. Me comprometo a asistir a los talleres pedagógicos, cumplir las normas que establece la normatividad vial,
velando por su propia seguridad, de los demás participantes y usuarios de la vía pública. Bajo mi responsabilidad
estará el uso responsable de las bicicletas y patinetas.
7. Acepto y entiendo que existe la posibilidad de sufrir un accidente inherente al uso de las bicicletas y la práctica
del ciclismo, asumiendo personalmente la responsabilidad de los accidentes que pueda causar a mi mismo o a
terceros, EXCLUYENDO A LAS EMPRESAS NEARDENTAL S.A.S. Y LA EMPRESA ALIADA de cualquier
responsabilidad civil y/o penal derivado del uso de las bicicletas y patinetas. requerida por mi parte.
8. A la mayor extensión autorizada por la ley, estoy de acuerdo en exonerar de cualquier responsabilidad
contractual, extracontractual, civil y/o penal y mantener absolutamente indemne A LA EMPRESA ALIADA Y
NEARDENTAL S.A.S como operador del servicio, de cualquier y toda responsabilidad con respecto a, o en
cualquier forma resultante de, heridas personales, muerte o daño de propiedad propia y/o de terceros, en
cualquier forma conectada al desarrollo de esta actividad. Además, acuerdo no hacer ningún reclamo o demanda
por heridas o daños relacionados con esta actividad, en contra de NEARDENTAL S.A.S. y/o A LA EMPRESA
ALIADA, dado que la facilidad de movilidad la he requerido estrictamente bajo mi propia responsabilidad.
9. Eximo a LA EMPRESA ALIADA como patrocinador del proyecto y a Neardental S.A.S. como operador del
programa de movilidad y/o cualquier persona física o Jurídica vinculada con estas dos entidades, de cualquier
daño físico o material causado a mi o a terceros, por el uso de las bicicletas y/o patinetas. efectuado por su
parte, así como de las responsabilidades derivadas de cualquier accidente acaecido durante su participación en el
programa.
Acepto en mi propio nombre bajo la autonomía de decisión libre, que LA EMPRESA ALIADA y Neardental S.A.S.
no asumen responsabilidad civil ni de ninguna clase por los resultados del desarrollo del programa de facilidad
de movilidad.</Text>
              </View>
              <View style={[styles.marginNumbe, {flex:0.1}]}>
                <Text style={styles.text}>ANEXO 2
Términos y Condiciones/Código de Buen Uso Programa Bicycle Capital – EMPRESA
ALIADA
Estos términos y condiciones crean un contrato entre usted y NEARDENTAL SAS (el "Acuerdo"). Lea el Acuerdo
detenidamente. Para confirmar que entiende y acepta el Acuerdo.
Este Acuerdo gobierna su acceso y uso de los servicios de Bicycle Capital (NEARDENTAL SAS) mediante los cuales
puede tomar en préstamo, en alquiler, comprar, suscribirse y otros servicios alrededor de la movilidad sostenible
como: Alquiler de bicicletas y/o patinetas, servicio técnico, asistencia a eventos entre otros. Nuestros servicios
están disponibles para su uso en las instalaciones determinadas. Contiene derechos y obligaciones que se deberán
cumplir plenamente.
Teniendo en cuenta el privilegio de hacer parte del programa, el incumplimiento de dichas normas hará
responsable al usuario de cualquier riesgo, daño o accidente y penalización.
1. Para acceder a las bicicletas y/o patinetas se deberá registrar en la plataforma, (o en el medio que se
disponga) leer, entender y aceptar el contrato de comodato, los términos y condiciones, política de privacidad
y el documento de responsabilidad.
2. Se deberá asistir y poner en práctica todo lo visto y aprendido por medio de las piezas de concientización y
en los talleres inductivos y pedagógicos, así como asistir a los eventos que se programen.
3. Las bicicletas y/o patinetas se deberán solicitar directamente en la estación, APP o según se indique.
4. Siempre se realizará el chequeo técnico de las bicicletas y/o patinetas antes de usarlas y se aceptará en la
planilla de préstamo.
5. Los préstamos se pueden realizar dentro del horario de: 7:00am a 5:00pm, de lunes a viernes.
6. Las bicicletas y/o patinetas se deberán recoger y entregar de manera organizada siguiendo las instrucciones del
programa.
7. El uso de casco es obligatorio en todo momento. Se deberán usar reflectivos y luces en horas de poca
iluminación.
8. Las bicicletas y/o patinetas son para uso personal e intransferible. Solo para una persona.
9. Se dará un uso responsable y diligente a las bicicletas y/o patinetas Siempre se deberá estar atento a la vía
y sus alrededores.
10. Siempre se deberá buscar trayectos con bici-infraestructura y minimizar la utilización de carriles compartidos
con transporte motorizado. El BC amigo podrá asesorarlo.
11. Deberá conocer y respetar las normas de tránsito y de señalización pública.
12. No se permite el uso de celulares, radios, o manipular cualquier objeto mientras se conduce la bicicleta
y/o patineta
13. No se permite el uso de las bicicletas y/o patinetas después de las 7:00 pm.
14. No se permite el uso de las bicicletas y/o patinetas en vías ni arterías principales.
15. Siempre que haya dificultades en el terreno, lluvias, barro-lodo o alta congestión en la vía se deberá llevar la
bicicleta y/o patineta caminando y por el andén. El vehículo no puede usarse en días de lluvias fuertes y no se
puede pasar por charcos. Omitir esta instrucción pone en riesgo su seguridad y el funcionamiento del vehículo.
En caso de sumersión de los componentes eléctricos en agua, el usuario deberá responder por los daños
ocasionados.
16. Dado que las bicicletas y patinetas son para uso en vías en buen estado, al encontrarse con cualquier desnivel,
andén o irregularidad (huecos) en la vía, se deben bajar y pasarla caminando. En caso de daño-accidente de la
bicicleta y/o patineta se deberá contactar inmediatamente al operador del programa vía celular al 316
7792746.
17. En caso de pérdida o robo se deberá comunicar inmediatamente con la policía, y seguidamente con el operador
(#316 7792746). Se deberá realizar el denuncio en la Fiscalía y entregar dicho documento al operador.
18. Se deberá asistir de manera obligatoria a los talleres y eventos pedagógicos.
19. Se deberán seguir las instrucciones y obedecer las indicaciones del programa.
20. Este programa es exclusivamente para funcionarios activos de LA EMPRESA ALIADA, mayores de edad, aptos
para montar en bicicleta y/o patineta en términos de salud y conocimiento.
21. El usuario reconoce, entiende y acepta el documento de exoneración de responsabilidad y hace uso del sistema
bajo su propio riesgo.
22. Se conducirá a una velocidad MÁXIMA DE 20KM/H, respetando el entorno, los peatones y automóviles
Este documento hace parte integral del Contrato de Comodato aceptado por las partes y son los términos y
condiciones para acceder al mismo.</Text>
              </View>
              <View style={[styles.marginNumbe, {flex:0.1}]}>
                <Text style={styles.text}>ANEXO 3
Política de Privacidad--Neardental SAS
NEARDENTAL S.A.S. (en adelante la “Compañía) se preocupa por las cuestiones de privacidad y quiere que sus empleados, clientes,usuarios, colaboradores,patrocinadores,proveedores,aliadosytodoslosdemásinteresados,enadelantelos“Usuarios”, estén familiarizados con la forma en que recopilamos, utilizamos y/o divulgamos la información. Esta Política de Privacidad describe nuestras prácticas en relación con la información que nosotros o nuestros proveedores de servicios recopilamos a través de distintos medios. Al proporcionarnos información personal, usted acepta los términos y condiciones de la presente Política de Privacidad.
El usuario debe aceptar estos términos al descargar y registrarse en la app y antes de hacer uso de ella.

</Text>
              </View>

              <View style={[styles.margin, {flex:0.1}]}>
                <Text style={styles.text}>ALCANCE
La Política de tratamiento de datos personales es realizada de conformidad con los lineamientos corporativos de NEARDENTAL S.A.S. y los parámetros legales locales bajo los cuales NEARDENTAL S.A.S. como desarrollador y operador de la APP RIDE/TRIP (en adelanta la APP) realiza el tratamiento de los Datos Personales.
La Política está diseñada para dar cumplimiento a las obligaciones jurídicas y/o legales impuestas por la legislación colombiana en la materia. Su contenido se aplica a la protección y tratamiento de toda la información contenida en base de datos con información de personas naturales con las que NEARDENTAL S.A.S. tenga o no relación contractual y sobre la cual se encuentre como responsable y/o encargado del tratamiento de dicha información.
</Text>
              </View>

              <View style={[styles.margin, {flex:0.1}]}>
                <Text style={styles.text}>DEFINICIONES
Para la interpretación de esta Política, se deben tener en cuenta las siguientes definiciones:
Dato(s) personal(es): Cualquier información vinculada o que pueda asociarse a una o varias personas naturales determinadas o determinables;
Datos sensibles: Aquellos datos que afectan la intimidad del titular de la información o cuyo uso indebido puede generar su discriminación;
Base de Datos: Conjunto organizado de datos personales que sea objeto de tratamiento;
Titular: Persona natural cuyos datos personales sean objeto de Tratamiento en razón de una relación comercial o jurídica con
NEARDENTAL S.A.S., sea cliente, proveedor, empleado, o cualquier tercero;
Cliente: Toda persona para quien NEARDENTAL S.A.S. presta un servicio o con quien sostiene una relación contractual/obligacional;
Proveedor: Toda persona natural o jurídica que preste algún servicio a NEARDENTAL S.A.S. , en virtud de una relación contractual/obligacional;
Tratamiento: Cualquier operación, o conjunto de operaciones, que se realice sobre datos personales, tales como recolección, almacenamiento, uso, circulación o supresión;
Responsable del Tratamiento: Persona natural o jurídica, pública o privada, que por sí misma o en asocio con otros, decida sobre la base de datos y/o el tratamiento de los datos. (el “Responsable”); en este caso, NEARDENTAL S.A.S. ;
Encargado del Tratamiento: Persona natural o jurídica, pública o privada, que por sí misma o en asocio con otros, realice el tratamiento de datos personales, por cuenta de otro, como Responsable de los datos (el “Encargado”); en este caso NEARDENTAL S.A.S. .;
Transferencia: Se refiere al envío de una base de datos por parte del Responsable, o un Encargado de los datos, a un tercer agente o persona natural/jurídica (el “Receptor”), dentro o fuera del territorio nacional, para el tratamiento efectivo de datos personales;
Trasmisión: Se refiere a la comunicación de datos personales por parte del Responsable al Encargado, ubicado dentro o fuera del territorio nacional, para que el Encargado, por cuenta del Responsable, trate datos personales;
Autorización: Se refiere a todo acto o medio establecido por NEARDENTAL S.A.S., para comunicar al titular de la información sobre la obtención y tratamiento de su información y para alertar al titular que la compañía cuenta con los debidos procedimientos de protección bajo los lineamientos legales;Causahabiente: Beneficiario de una sucesión, por causa de la muerte del titular de la información.
Para el entendimiento de los términos que no se encuentran incluidos dentro del listado anterior, deberá remitirse a la legislación
vigente, en especial a la Ley 1581 de 2012 y al Decreto 1377 de 2013.</Text>
              </View>

              <View style={[styles.margin, {flex:0.1}]}>
                <Text style={styles.text}>INFORMACIÓN FACILITADA POR USTED
Para cumplir su objeto social, la Compañía ha recaudado, recauda y seguirá recaudando siempre y cuando medie consentimiento del titular, la siguiente información personal: nombre y apellido, NIT, fecha de nacimiento, género, dirección de correspondencia, dirección de correo electrónico, teléfono, número de documento de identificación, estudios realizados, medios de movilización, profesión, ocupación, idiomas, régimen aplicable a IVA, facturación. Régimen tributario aplicable a ICA y otros datos no sensibles. El titular de los datos acepta expresamente que la Compañía almacene, procese y utilice esta información personal, de forma parcial o total, para los fines expresados en la ley y en la presente política.
Adicionalmente, la Compañía cuenta con aplicaciones móviles y sitios web que podrán requerir que envíe información personal a fin de que se beneficie de los beneficios u opciones especificadas (como su ubicación, suscripciones a boletines, consejos/pautas o procesamiento de órdenes) o participe en una actividad particular (como concursos u otras promociones). Se le comunicará qué información es necesaria y cuál es opcional.
Podremos combinar la información que usted envíe con otra información que hemos recopilado de usted, ya sea a través de Internet o por fuera. También podremos combinarla con la información que recibimos de usted de otras fuentes, como las fuentes de información a disposición del público (incluida la información de sus perfiles de medios sociales disponible públicamente), y de otros terceros.
</Text>
              </View>

              <View style={[styles.margin, {flex:0.1}]}>
                <Text style={styles.text}>AUTORIZACIÓN
La recolección, almacenamiento, uso, circulación o supresión de datos personales requiere del consentimiento libre, previo, expreso e informado del titular de los mismos. NEARDENTAL SAS en su condición de responsable del tratamiento de datos personales, ha dispuesto de los mecanismos necesarios para obtener la autorización de los titulares garantizando en todo caso que sea posible verificar el otorgamiento de dicha autorización.
La autorización podrá constar en un documento físico, electrónico, en cualquier otro formato que permita garantizar su posterior consulta, o mediante un mecanismo técnico o tecnológico idóneo. Este se podrá dar vía aceptación de términos y condiciones en nuestras aplicaciones tecnológicas, registros e inscripciones, vía entrega verbal de datos en procesos de cotización, facturación, búsqueda de información, similares u otros.
Autorización tácita: También se entenderá que el Titular ha otorgado autorización para el tratamiento de sus datos personales cuando mediante su conducta permite concluir de forma razonable que otorgó la autorización.
La autorización no será necesaria en las excepciones previstas en la ley, a manera enunciativa y sin perjuicio de las normas modifiquen, adicionen o complementen
Las políticas de privacidad y tratamiento de datos personales de NEARDENTAL SAS se podrán revisar en sus paginas web: www.eltomacorriente.com y www.bicyclecapital.co.
</Text>
              </View>

              <View style={[styles.margin, {flex:0.1}]}>
                <Text style={styles.text}>Finalidad del Tratamiento de Datos
La Compañía requiere que la información personal de los Usuarios sea recolectada, almacenada, usada, circulada, compartida,
procesada y/o se le de tratamiento con los siguientes propósitos: realizar estudios de investigación y de mercados, de dar a conocer
información sobre los productos y servicios que comercializa, de hacer vigilancia y reportes de quejas de calidad de productos y
servicios, de comercializar los productos y servicios, de gestionar la administración de los Recursos Humanos de la Compañía, de
mejorar los servicios que presta, evaluar los niveles de satisfacción de sus clientes, de ejercer su objeto social dentro del marco de la
ley, y de cumplir con sus obligaciones legales y contractuales.</Text>
              </View>

              <View style={[styles.margin, {flex:0.1}]}>
                <Text style={styles.text}>También utilizamos su información:
Para responder a sus consultas y atender sus solicitudes, como enviarle los documentos que solicita o alertas por correo electrónico;
Para enviarle información importante sobre nuestra relación con usted o sobre determinado Sitio web, las modificaciones de nuestros
términos, condiciones, y políticas y/u otra información administrativa; y
Permitir la participación de los Titulares en actividades de mercadeo y promocionales (incluyendo la participación en concursos, rifas
y sorteos) realizados por LA COMPAÑIA
Para el fortalecimiento de las relaciones con sus Consumidores y Clientes, mediante el envío de información relevante, la toma de
pedidos y evaluación de la calidad del servicio
Para mejorar, promocionar y desarrollar sus productos y los de sus compañías vinculadas
Para monitorear a los usuarios de nuestros programas de movilidad, dar un servicio personalizado al cliente y velar por la calidad del
servicio y el logro de objetivos.
Comunicación directa con los usuarios de nuestros programas de movilidad y alquiler, así como nuestros clientes de puntos de
venta, sitio web y servicio técnico.
Utilizar los distintos servicios a través de los sitios web de LA COMPAÑÍA, incluyendo descargas de contenidos y formatos
Desarrollar las actividades propias de la gestión de Recursos Humanos dentro de LA COMPAÑIA, tales como nómina, afiliaciones a
entidades del sistema general de seguridad social, actividades de bienestar y salud ocupacional, ejercicio de la potestad
sancionatoria del empleador, entre otras.
La Compañía podrá utilizar sistemas de video vigilancia para fines de seguridad de las personas, bienes e instalaciones. Esta
información podrá ser empleada como prueba en cualquier clase de proceso interno y/o ante cualquier tipo de autoridad, entidad y/u
organización. La Compañía también podrá realizar toma de imágenes fotográficas para: Reconocimiento de los empleados en los
diferentes medios, tales como, periódico corporativo, web interna y/o externa entre otros. Publicaciones informativas internas y/o
externas. Presentaciones corporativas internas y externas para lo cual ubicará un aviso de privacidad en el que se consulten las
condiciones en las cuales se efectuará el tratamiento de los datos personales correspondientes.</Text>
              </View>

              <View style={[styles.margin, {flex:0.1}]}>
                <Text style={styles.text}>Asimismo, divulgamos información recopilada:
Para nuestros proveedores de servicios externos que prestan servicios como el alojamiento y moderación de sitios web, el
alojamiento de aplicaciones móviles, el análisis de datos, el procesamiento de pagos, la realización de pedidos, la provisión de
infraestructura, los servicios de TI, el servicio al cliente, los servicios de entrega de correo electrónico y correo directo, el
procesamiento de tarjetas de crédito, los servicios de auditoría y otros servicios, con el fin de facultarlos a prestar los servicios; y
Para un tercero en caso de una reorganización, fusión, venta, sociedad conjunta, cesión, transferencia u otra enajenación de la
totalidad o parte de nuestra actividad comercial, activos o acciones (incluidos los actos relacionados con cualquier proceso de
quiebra o similar).
Cualquier otra actividad de naturaleza similar a las anteriormente descritas que sean necesarias para desarrollar el objeto social de
LA COMPAÑÍA. Además, utilizamos y divulgamos la información recopilada, según lo consideremos necesario o apropiado: (a) en
virtud de la ley aplicable, lo que incluye las leyes vigentes fuera de su país de residencia; (b) para cumplir con un proceso legal
conforme lo establecido por ley; (c) para responder a solicitudes de autoridades públicas y gubernamentales, incluidas las
autoridades públicas y gubernamentales fuera de su país de residencia; (d) para hacer cumplir nuestros términos y condiciones; (e)
para proteger nuestras operaciones; (f) para proteger nuestros derechos, privacidad, seguridad o bienes, y/o la suya u otras; y (g)
para permitirnos hacer uso de los recursos disponibles o limitar los daños y perjuicios que podamos sufrir. También podremos
utilizar y divulgar la información recopilada a través del Sitio de otras maneras, con su consentimiento.</Text>
              </View>
              <View style={[styles.margin, {flex:0.1}]}>
                <Text style={styles.text}>Desactivación de Cookies:
El usuario tiene la opción de habilitar o desactivar el uso de cookies a través de la configuración de su dispositivo o del navegador. Sin embargo, debe tener en cuenta que desactivar las cookies puede afectar la funcionalidad de ciertas partes de la app y limitar su experiencia.
Consentimiento del Usuario:
Al descargar y utilizar la APP, el usuario acepta el uso de cookies y tecnologías de seguimiento según lo descrito en esta política. En algunos casos, cuando la legislación aplicable lo requiera, solicitaremos el consentimiento explícito del usuario para utilizar cookies no esenciales o aquellas destinadas al análisis avanzado.
</Text>
              </View>

              <View style={[styles.margin, {flex:0.1}]}>
                <Text style={styles.text}>SITIOS Y SERVICIOS DE TERCEROS
Esta Política de Privacidad no se refiere a la privacidad, la información u otras prácticas de terceros, ni tampoco nos
responsabilizamos al respecto, incluido por cualquier tercero que opere cualquier sitio web o propiedad web (incluyendo, sin
limitación, cualquier aplicación) que esté disponible a través de Sitios web de la Compañía, a través de un link o enlace del Sitio web
de la Compañía. La disponibilidad o la inclusión de un enlace a cualquier sitio o propiedad en el Sitio web de la Compañía no
implican nuestra aprobación.
SEGURIDAD
Para garantizar la mejor protección de privacidad y confidencialidad de la información, la Compañía cuenta con funcionarios
competentes, debidamente capacitados, y tecnología necesaria para el cuidado de esta información. Estas medidas tecnológicas
sumadas a la seguridad física que protege los edificios de la Compañía, brindan protección razonable según el estado de la ciencia
y el presupuesto anual, pero no son infalibles. Cualquier Violación a la confidencialidad o atentado contra la misma será reportada a
las autoridades competentes.
Empleamos medidas de organización, técnicas y administrativas razonables para proteger la información personal que está bajo
nuestro control. Lamentablemente, no es posible garantizar la seguridad total de todos los sistemas de almacenamiento de datos o
sistema de transmisión de datos por Internet. Si tiene motivos para creer que su interacción con nosotros ya no es segura (por
ejemplo, si siente que se ha comprometido la seguridad de alguna cuenta que tiene con nosotros), notifíquenos el problema de
inmediato a través de la sección “Contáctenos” en nuestra página web, por teléfono o visítenos en alguna de nuestras sedes.
</Text>
              </View>

              <View style={[styles.margin, {flex:0.1}]}>
                <Text style={styles.text}>OPCIONES Y ACCESO
Sus opciones con respecto a nuestro uso y divulgación de su información personal. Le damos opciones con respecto a nuestro uso y
divulgación de su información personal para fines de comercialización. Usted podrá optar por no: Recibir comunicaciones de
comercialización nuestras: Si ya no desea recibir comunicaciones de comercialización nuestras a futuro, podrá optar por no recibirlas
enviando un correo electrónico a contacto@eltomacorriente.com. En su comunicación, proporcione su nombre, identifique el(los)
formulario(s) de las comunicaciones de comercialización que ya no desea recibir, e incluya la(s) dirección (direcciones) a la(s) que
este (estos) son enviado(s)]. Por ejemplo, si ya no desea recibir correos electrónicos de comercialización o correo directo nuestro,
infórmenos, y proporcione su nombre y correo electrónico o dirección postal.
Nuestra divulgación de su información personal con socios externos: Si prefiere que no compartamos su información personal a
futuro con nuestros socios externos con fines de comercialización, podrá optar por no compartir esta información enviando un
correo electrónico a servicio@davibici.co. En su comunicación, indique que ya no debemos compartir su información personal
con nuestros afiliados y/o socios externos con fines de comercialización, e incluya su nombre y dirección de correo electrónico.
Intentaremos cumplir con su(s) solicitud(es) tan pronto como sea razonablemente posible. Tenga también en cuenta que si opta por
no recibir mensajes nuestros relacionados con la comercialización, todavía podremos enviarle importantes mensajes transaccionales
y administrativos, de los que no puede optar por no participar.
Cómo puede acceder, modificar o eliminar su información personal
Si desea revisar, corregir, actualizar o eliminar la información personal que nos ha proporcionado a través de cualquier medio, envíe
un correo electrónico a contacto@eltomacorriente.com.. Intentaremos cumplir con su solicitud tan pronto como sea razonablemente
posible.
Las solicitudes serán atendidas en orden cronológico de recibo, y en los plazos de ley. La respuesta será remitida usando el mismo
método de contacto, salvo que otro medio resulte más expedito y seguro en el caso concreto.
Procedimiento de Consulta de la Información.
Para realizar consultas de información sometida a tratamiento por NEARDENTAL S.A.S., el titular de dicha información deberá:
Remitir al correo servicio@davibici.co una solicitud escrita y firmada por el titular de la información o por los causahabientes,
con copia del documento de identificación del solicitante; también podrá el titular de la información presentar la solicitud escrita en
las instalaciones de NEARDENTAL S.A.S. junto con la presentación original de su cédula de Ciudadanía.
En caso de ser los causahabientes del titular quienes soliciten la información, deberán anexar copia del registro civil de nacimiento
o matrimonio, escritura pública de sucesión o copia auténtica de sentencia judicial de sucesión, según corresponda, junto con el
registro civil de defunción del titular.
La solicitud o petición en relación con datos personales será atendida en un término máximo de diez (10) días hábiles desde el recibo
de la solicitud o petición.
Si la solicitud o petición no tiene los datos y/o la información suficientes que permita a NEARDENTAL S.A.S. atenderla de forma
correcta, lo faltante se le requerirá al solicitante dentro de los cinco (5) días calendario, siguientes a la recepción de la solicitud o
petición.
Una vez transcurridos treinta (30) días calendario desde la fecha del requerimiento, si el solicitante no ha subsanado según lo
requerido, NEARDENTAL S.A.S. entenderá que se ha desistido de la solicitud, según lo establecido en el artículo 15 de la Ley 1581
de 2012.
</Text>
              </View>

              <View style={[styles.margin, {flex:0.1}]}>
                <Text style={styles.text}>Procedimiento de Reclamación.
Remitir al correo contacto@eltomacorriente.com., la queja o reclamo de manera escrita y firmada por el titular de la información o por
los causahabientes junto con la copia de la cédula del solicitante; también podrá el titular de la información presentar la solicitud
escrita en las instalaciones de NEARDENTAL SAS o a servicio@davibici.co. junto con la presentación original de su cédula de
Ciudadanía.
En caso de ser los causahabientes del titular quienes soliciten la información, deberán anexar copia del registro civil de nacimiento o
matrimonio, según corresponda, junto con el registro civil de defunción del titular.
Si NEARDENTAL S.A.S. es el Encargado de la información, procederá a registrar en la base de datos la leyenda “reclamación en
trámite” y de inmediato notificará al responsable de la información.
La petición y/o reclamación será atendida en un término máximo de quince (15) días hábiles desde el recibo de la solicitud o
petición.
Si la petición y/o reclamación no tiene los datos y/o la información suficiente que permita a NEARDENTAL S.A.S. atenderla de forma
correcta, se le requerirá dentro de los cinco (5) días calendario, siguientes a la recepción de la solicitud, petición o reclamo para que
subsane sus fallas. En este caso, los quince (15) días hábiles de respuesta a la solicitud sólo empezarán a correr a partir de la fecha
de recibo de la aclaración o ampliación de la información.
Una vez transcurridos treinta (30) días calendario desde la fecha del requerimiento, si el solicitante no ha aclarado o ampliado la
información según lo requerido, NEARDENTAL S.A.S. entenderá que se ha desistido de la reclamación.</Text>
              </View>

              <View style={[styles.margin, {flex:0.1}]}>
                <Text style={styles.text}>DERECHOS DEL TITULAR
De conformidad con el artículo 8 de la Ley 1581 de 2012, los derechos a los titulares de la información que le asisten en relación con
sus datos personales son:
Conocer, actualizar y rectificar sus datos personales, dentro de los parámetros legales;
Solicitar prueba de la autorización otorgada por el Titular de la información a NEARDENTAL S.A.S., como Responsables del
Tratamiento, salvo cuando expresamente se exceptúe como requisito para el Tratamiento;
Solicitar a NEARDENTAL S.A.S., como Responsable o Encargado del Tratamiento, información sobre el uso que se le ha dado a los
datos personales;
Presentar quejas por infracciones a lo dispuesto en la presente ley y las demás normas que la modifiquen, adicionen o
complementen, ante la Superintendencia de Industria y Comercio;
Revocar la autorización y/o solicitar la supresión de datos, cuando en el Tratamiento no se respeten los principios, derechos y/o
garantías constitucionales y legales; siempre que no exista una obligación legal de conservación de dichos datos.
Acceder en forma gratuita exclusivamente a los datos personales que hayan sido objeto de Tratamiento, no a las distintas
actividades ejecutadas en desarrollo de dicho tratamiento.
</Text>
              </View>

              <View style={[styles.margin, {flex:0.1}]}>
                <Text style={styles.text}>PERÍODO DE CONSERVACIÓN
La Compañía conservará la información de cada usuario durante todo el tiempo en que ésta se requiera dentro de los fines descritos
en esta política, o hasta diez años adicionales, a menos que medie solicitud de supresión del interesado.
Niños, Niñas y Adolescentes Menores de 18 Años
Eventualmente la Compañía puede llegar a requerir datos personales de niños, niñas y adolescentes menores de 18 años, como por
ejemplo para aquellos que decidan participar en algún sorteo, o en algún evento o proceso de facturación. La Compañía velará por el
uso adecuado de los datos personales de los niños, niñas y adolescentes menores de 18 años, garantizando que respetan en su
tratamiento el interés superior de aquellos.
</Text>
              </View>

              <View style={[styles.margin, {flex:0.1}]}>
                <Text style={styles.text}>TRANSFERENCIA ENTRE PAÍSES
Su información personal podrá almacenarse y procesarse en cualquier país donde tengamos instalaciones o proveedores de servicios,
y al usar nuestros Sitios web o darnos su consentimiento (donde lo exija la ley), usted acuerda transferir la información a países
distintos de su país de residencia, los cuales podrán tener normas diferentes sobre la protección de datos que las vigentes en su
país.
</Text>
              </View>

              <View style={[styles.margin, {flex:0.1}]}>
                <Text style={styles.text}>INFORMACIÓN CONFIDENCIAL O SENSIBLE
A menos que lo solicitemos o invitemos de manera específica, le pedimos que no nos envíe y que no divulgue información
confidencial o sensible alguna (por ejemplo, la información relacionada con el origen racial o étnico, las opiniones políticas, la religión
u otras creencias, la salud, los antecedentes penales o la afiliación sindical). En los casos en los que podamos solicitar o invitarle a
que proporcione información confidencial o sensible, lo haremos con su consentimiento expreso.
</Text>
              </View>

              <View style={[styles.margin, {flex:0.1}]}>
                <Text style={styles.text}>ACTUALIZACIONES DE ESTA POLÍTICA DE PRIVACIDAD
Podremos cambiar esta Política de Privacidad. Mire la leyenda “Última actualización” que aparece en la parte inferior de esta página
para consultar cuándo se revisó por última vez la presente Política de Privacidad. Toda modificación de nuestra Política de
Privacidad entrará en vigencia después de la publicación de la Política de Privacidad revisada en el Sitio correspondiente. La
información personal proporcionada a la Compañía con posterioridad a estas modificaciones implica su aceptación de la Política de
Privacidad revisada.
Otras políticas concordantes
Esta política se rige por la ley colombiana. Especialmente es aplicable la Ley 1581 de 2012, el Decreto 1377 de 2013, decreto 1074
del 2015 y disposiciones concordantes y complementarias. En caso de vacío, también serán aplicables las otras políticas
institucionales de la Compañía relacionadas con la protección de los datos personales.
Entrada en vigencia y plazo
De conformidad con lo dispuesto en el numeral 3 del artículo 10 del Decreto Reglamentario 1377 de 2013 NEARDENTAL SAS
procederá a publicar un aviso en su página web oficial www.eltomacorriente.com y www.davibici.co dirigido a los titulares de
datos personales para efectos de dar a conocer la presente política de tratamiento de información y el modo de ejercer sus derechos
como titulares de datos personales alojados en las bases de datos de NEARDENTAL SAS.
La presente política estará vigente hasta que la Compañía deje de ejercer su objeto social.
Esta política ha sido redactada y aprobada el día veintinueve (29) mayo de 2017, fecha a partir de la cual entra en vigencia.
</Text>
              </View>

              <View style={[styles.margin, {flex:0.1}]}>
                <Text style={styles.text}>Este documento hace parte integral del Contrato de Comodato aceptado por las partes y son los términos y condiciones para
acceder al mismo.</Text>
              </View>
              
              <View style={[styles.margin, {flex:0.1}]}>
                <Text style={styles.text}></Text>
              </View>

              <View style={[styles.margin, { flex: 0.2 }]}>
                <Text style={styles.subtitle}>POLÍTICA DE PRIVACIDAD
APP BICYCLE CAPITAL - NEARDENTAL SAS
</Text>
                <Text style={styles.text}>NEARDENTAL S.A.S. (en adelante la “Compañía) se preocupa por las cuestiones de privacidad y quiere que  sus empleados, clientes, colaboradores, patrocinadores, proveedores, aliados y todos los demás interesados, en adelante los “Usuarios”, estén familiarizados con la forma en que recopilamos, utilizamos y/o divulgamos la información. Esta Política de Privacidad describe nuestras prácticas en relación con la información que nosotros o nuestros proveedores de servicios recopilamos a través de distintos medios. Al proporcionarnos información personal, usted acepta los términos  y condiciones de la presente Política de Privacidad.</Text>
              </View>

              <View style={[styles.margin, {flex:0.1}]}>
                <Text style={styles.text}>ALCANCE

La Política de tratamiento de datos personales es realizada de conformidad con los lineamientos corporativos de NEARDENTAL S.A.S. y los parámetros legales locales bajo los cuales NEARDENTAL S.A.S. realiza el tratamiento de los Datos Personales.

La Política está diseñada para dar cumplimiento a las obligaciones jurídicas y/o legales impuestas por la legislación colombiana en la materia. Su contenido se aplica a la protección y tratamiento de toda la información contenida en base de datos con información de personas naturales con las que NEARDENTAL S.A.S. tenga o no relación contractual y sobre la cual se encuentre como responsable y/o encargado del tratamiento de dicha información.

</Text>
              </View>

              <View style={[styles.margin, {flex:0.1}]}>
                <Text style={styles.text}>DEFINICIONES: Para la interpretación de esta Política, se deben tener en cuenta las siguientes deﬁniciones:</Text>
                <Text style={styles.text}>Dato(s) personal(es): Cualquier información vinculada o que pueda asociarse a una o varias personas naturales determinadas o determinables;</Text>
                <Text style={styles.text}>Datos sensibles: Aquellos datos que afectan la intimidad del titular de la información o cuyo uso indebido puede generar su discriminación;</Text>
                <Text style={styles.text}>Base de Datos: Conjunto organizado de datos personales que sea objeto de tratamiento;</Text>
                <Text style={styles.text}>Titular: Persona natural cuyos datos personales sean objeto de Tratamiento en razón de una relación comercial o jurídica con NEARDENTAL S.A.S., sea cliente, proveedor, empleado, o cualquier  tercero;</Text>
                <Text style={styles.text}>Cliente: Toda persona para quien NEARDENTAL S.A.S. presta un servicio o con quien sostiene una relación contractual/obligacional;</Text>
                <Text style={styles.text}>Proveedor: Toda persona natural o jurídica que preste algún servicio a NEARDENTAL S.A.S. , en virtud de una relación contractual/obligacional;</Text>
                <Text style={styles.text}>Tratamiento: Cualquier operación, o conjunto de operaciones, que se realice sobre datos personales, tales como recolección, almacenamiento, uso, circulación o supresión;</Text>
                <Text style={styles.text}>Responsable del Tratamiento: Persona natural o jurídica, pública o privada, que por sí misma o en asocio con otros, decida sobre la base de datos y/o el tratamiento de los datos. (el “Responsable”); en este caso, NEARDENTAL S.A.S.  ;</Text>
                <Text style={styles.text}>Encargado del Tratamiento: Persona natural o jurídica, pública o privada, que por sí misma o en asocio con otros, realice el tratamiento de datos personales, por cuenta de otro, como Responsable de los datos (el “Encargado”); en este caso NEARDENTAL S.A.S. .;</Text>
                <Text style={styles.text}>Transferencia: Se reﬁere al envío de una base de datos por parte del Responsable, o un Encargado de los datos, a un tercer agente o persona natural/jurídica (el “Receptor”), dentro o fuera del territorio nacional, para el tratamiento efectivo de datos personales;

</Text>
                <Text style={styles.text}>Trasmisión: Se reﬁere a la comunicación de datos personales por parte del Responsable al Encargado, ubicado dentro o fuera del territorio nacional, para que el Encargado, por cuenta del Responsable, trate datos personales;</Text>
                <Text style={styles.text}>Autorización: Se reﬁere a todo acto o medio establecido por NEARDENTAL S.A.S., para comunicar al titular de la información sobre la obtención y tratamiento de su información y para alertar al titular que la compañía cuenta con los debidos procedimientos de protección bajo los lineamientos legales;</Text>
                <Text style={styles.text}>Causahabiente: Beneﬁciario de una sucesión, por causa de la muerte del titular de la información.</Text>
                <Text style={styles.text}>Para el entendimiento de los términos que no se encuentran incluidos dentro del listado anterior, deberá remitirse a la legislación vigente, en especial a la Ley 1581 de 2012 y al Decreto 1377 de 2013.</Text>
              </View>

              <View style={[styles.margin, {flex:0.1}]}>
                <Text style={styles.text}>RECOPILACIÓN DE INFORMACIÓN

Infor mación facilitada por usted 

Para cumplir su objeto social, la Compañía ha recaudado, recauda y seguirá recaudando siempre y cuando medie consentimiento del titular, la siguiente información personal: nombre y apellido, NIT, fecha de nacimiento,  género, dirección de correspondencia, dirección de correo electrónico, teléfono, número de documento de identiﬁcación, estudios realizados, medios de movilización, profesión, ocupación, idiomas, régimen aplicable a IVA, facturación. Régimen tributario aplicable a ICA y otros datos no sensibles. El titular de los datos acepta expresamente que la Compañía almacene, procese y utilice esta información personal, de forma parcial o total, para los ﬁnes expresados en la ley y en la presente  política.

Adicionalmente, la Compañía cuenta con aplicaciones móviles y sitios web que podrán requerir que envíe información personal a ﬁn de que se beneﬁcie de los beneﬁcios u opciones especiﬁcadas (como su ubicación,  suscripciones  a boletines, consejos/pautas o procesamiento de órdenes) o participe en una actividad particular (como concursos u otras promociones). Se le comunicará qué información es necesaria y cuál es opcional.

Podremos combinar la información que usted envíe con otra información que hemos recopilado de usted, ya sea a través de Internet o por fuera. También podremos combinarla con la información que recibimos de usted de otras fuentes, como las fuentes de información a disposición del público (incluida la información de sus perﬁles de medios sociales disponible públicamente), y de otros terceros.

</Text>
              </View>

              <View style={[styles.margin, {flex:0.1}]}>
                <Text style={styles.text}>Authorization

La recolección, almacenamiento, uso, circulación o supresión de datos personales requiere del  consentimiento libre, previo, expreso e informado del titular de los mismos. NEARDENTAL SAS en su condición de responsable del tratamiento de datos personales, ha dispuesto de los mecanismos necesarios para obtener la autorización de los titulares garantizando en todo caso que sea posible veriﬁcar el otorgamiento de dicha autorización.

La autorización podrá constar en un documento físico, electrónico, en cualquier otro formato que permita garantizar su posterior consulta, o mediante un mecanismo técnico o tecnológico idóneo. Este se podrá dar vía aceptación de términos y condiciones en nuestras aplicaciones tecnológicas, registros e inscripciones, vía entrega verbal de datos en procesos de cotización, facturación, búsqueda de información, similares u otros.

Autorización tácita: También se entenderá que el Titular ha otorgado autorización para el tratamiento de sus datos personales cuando mediante su conducta permita concluir de forma razonable que otorgó la autorización.

La autorización no será necesaria en las excepciones previstas en la ley, a manera enunciativa y sin perjuicio de las normas modiﬁquen, adicionen o complementen

Las políticas de privacidad y tratamiento de datos personales de NEARDENTAL SAS se podrán revisar en sus paginas   web:
 www.eltomacorriente.com y w ww.davibici.co.
</Text>
              </View>

              <View style={[styles.margin, {flex:0.1}]}>
                <Text style={styles.text}>Finalidad del Tratamiento de Datos

La Compañía requiere que la información personal de los Usuarios sea recolectada, almacenada, usada, circulada, compartida, procesada y/o se le de tratamiento con los siguientes propósitos: realizar estudios de investigación y de mercados, de generar valor en calidad de vida a sus clientes y usuarios, de dar a conocer información sobre los productos y servicios que comercializa, de hacer vigilancia y reportes de quejas de calidad de productos y servicios, de comercializar los productos y servicios, de gestionar la administración de los Recursos Humanos de la Compañía, de mejorar los  servicios
 



que presta, evaluar los niveles de satisfacción de sus clientes, de ejercer su objeto social dentro del marco de la ley, y de cumplir con sus obligaciones legales y contractuales.

 También utilizamos su infor mación:
</Text>
<Text style={styles.text}>●	Para responder a sus consultas y atender sus solicitudes, como enviarle los documentos que solicita o alertas por correo electrónico;</Text>
<Text style={styles.text}>●	Utilizaremos su ubicación/locación para la georeferenciación de bicicletas, registro de recorridos y obtención de data, habilitación de puntos de parqueo, entre otros.</Text>
<Text style={styles.text}>●	Para enviarle información importante sobre nuestra relación con usted o sobre determinado Sitio web, las modiﬁcaciones de nuestros términos, condiciones, y políticas y/u otra información administrativa; y</Text>
<Text style={styles.text}>●	Permitir la participación de los Titulares en actividades de mercadeo y promocionales (incluyendo la participación en concursos, rifas y sorteos) realizados por LA COMPAÑIA</Text>
<Text style={styles.text}>●	Para el fortalecimiento de las relaciones con sus Consumidores y Clientes, mediante el envío de información relevante, la toma de pedidos y evaluación de la calidad del servicio</Text>
<Text style={styles.text}>●	Para mejorar, promocionar y desarrollar sus productos y los de sus compañías vinculadas</Text>
<Text style={styles.text}>●	Para monitorear a los usuarios de nuestros programas  de  movilidad, dar un servicio personalizado al cliente y velar por la calidad del servicio y el logro de objetivos.</Text>
<Text style={styles.text}>●	Comunicación directa con los usuarios de nuestros programas de movilidad y alquiler, así como nuestros clientes de puntos de venta, sitio web y servicio técnico.</Text>
<Text style={styles.text}>●	Utilizar los distintos servicios a través de los sitios web de LA COMPAÑIA, incluyendo descargas de contenidos y formatos</Text>
<Text style={styles.text}>●	Desarrollar las actividades propias de la gestión de Recursos Humanos dentro de LA COMPAÑIA, tales como nómina, aﬁliaciones a entidades del sistema general de seguridad social, actividades de bienestar y salud ocupacional, ejercicio de la potestad sancionatoria del empleador, entre otras.</Text>
<Text style={styles.text}>●	La Compañía podrá utilizar sistemas de video vigilancia para ﬁnes de seguridad de las personas, bienes e instalaciones. Esta información podrá ser empleada como prueba en cualquier clase de proceso interno y/o ante cualquier tipo de autoridad, entidad y/u organización. La Compañía también podrá realizar toma de imágenes fotográﬁcas para: Reconocimiento de los empleados en los diferentes medios, tales como, periódico corporativo, web interna y/o externa entre otros. Publicaciones informativas internas y/o externas. Presentaciones corporativas internas y externas para lo cual ubicará un aviso de privacidad en el que se consulten las condiciones en las cuales se efectuará el tratamiento de los datos personales correspondientes.</Text>
<Text style={styles.text}>●	Para nuestros proveedores de servicios externos que prestan servicios como el alojamiento y moderación de sitios web, el alojamiento de aplicaciones móviles, el análisis de datos, el procesamiento de pagos, la realización de pedidos, la provisión de infraestructura, los servicios de TI, el servicio al cliente, los servicios de entrega de correo electrónico y correo directo, el procesamiento de tarjetas de crédito, los servicios de auditoría y otros servicios, con el ﬁn de facultarlos a prestar los servicios; y</Text>
<Text style={styles.text}>●	Para un tercero en caso de una reorganización, fusión, venta, sociedad conjunta, cesión, transferencia u otra enajenación de la totalidad o parte de nuestra actividad comercial, activos o acciones (incluidos los actos relacionados con cualquier proceso de quiebra o similar).</Text>
<Text style={styles.text}>●	Cualquier otra actividad de naturaleza similar a las anteriormente descritas que sean necesarias para desarrollar el objeto social de LA COMPAÑÍA.</Text>
<Text style={styles.text}>Además, utilizamos y divulgamos la información recopilada, según lo consideremos necesario o apropiado: (a) en virtud de la ley aplicable, lo que incluye las leyes vigentes fuera de su país de residencia; (b) para cumplir con un proceso legal conforme lo establecido por ley; (c) para responder a solicitudes de autoridades públicas y gubernamentales, incluidas las autoridades públicas y gubernamentales fuera de su país de residencia; (d) para hacer cumplir nuestros términos y condiciones; (e) para proteger nuestras operaciones; (f) para proteger nuestros derechos, privacidad, seguridad o bienes, y/o la suya u otras; y (g) para permitirnos hacer uso de los recursos disponibles o limitar los daños y perjuicios que podamos sufrir. También podremos utilizar y divulgar la información recopilada a través del Sitio de otras maneras, con su consentimiento.</Text>
              </View>

              <View style={[styles.margin, {flex:0.1}]}>
                <Text style={styles.text}>SITIOS Y SERVICIOS DE TERCEROS

Esta Política de Privacidad no se reﬁere a la privacidad, la información u otras prácticas de terceros, ni tampoco nos responsabilizamos al respecto, incluido por cualquier tercero que opere cualquier sitio web o propiedad web (incluyendo, sin limitación, cualquier aplicación) que esté disponible a través de Sitios web de la Compañía, a través de un link o enlace del Sitio web de la Compañía. La disponibilidad o la inclusión de un enlace a cualquier sitio o propiedad en el Sitio web de la Compañía no implican nuestra aprobación.
 




 Seguridad 

Para garantizar la mejor protección de privacidad y conﬁdencialidad de la información, la Compañía cuenta  con funcionarios competentes, debidamente capacitados, y tecnología necesaria para el cuidado de esta información. Estas medidas tecnológicas sumadas a la seguridad física que protege los ediﬁcios de la Compañía, brindan  protección razonable según el estado de la ciencia y el presupuesto anual, pero no son infalibles. Cualquier Violación a la conﬁdencialidad o atentado contra la misma será reportada a las autoridades competentes.

Empleamos medidas de organización, técnicas y administrativas razonables para proteger la información personal que está bajo nuestro control. Lamentablemente, no es posible garantizar la seguridad total de todos los sistemas de almacenamiento de datos o sistema de transmisión de datos por Internet. Si tiene motivos para creer que su interacción con nosotros ya no es segura (por ejemplo, si siente que se ha comprometido la seguridad de alguna cuenta que tiene con nosotros), notifíquenos el problema de inmediato a través de la sección “Contáctenos” en nuestra  página  web, por telefono o visitenos en alguna de nuestras sedes.

</Text>
              </View>

              <View style={[styles.margin, {flex:0.1}]}>
                <Text style={styles.text}>OPCIONES Y ACCESO

Sus opciones con respecto a nuestro uso y divulgación de su infor mación personal

Le damos opciones con respecto a nuestro uso y divulgación de su información personal para ﬁnes de comercialización. Usted podrá optar por no:
</Text>
                <Text style={styles.text}>●	Recibir comunicaciones de comercialización nuestras: Si ya no desea recibir comunicaciones de comercialización nuestras a futuro, podrá optar por no recibirlas enviando un correo electrónico a contacto@davibici.coo salir de la lista en la comunicación recibida. En su comunicación, proporcione su nombre, identiﬁque el(los) formulario(s) de las comunicaciones de comercialización que ya no desea recibir, e incluya la(s) dirección (direcciones) a la(s) que este (estos) son enviado(s)]. Por ejemplo, si ya no desea recibir correos electrónicos de comercialización o correo directo nuestro, comuniquelo y proporcione su nombre y correo electrónico o dirección postal.</Text>
                <Text style={styles.text}>●	Nuestra divulgación de su información personal con socios externos: Si preﬁere que no compartamos su información personal a futuro con nuestros socios externos con ﬁnes de comercialización, podrá optar por no compartir esta información enviando un correo electrónico a contacto@eltomacorriente.com. . En su comunicación, indique que ya no debemos compartir su información personal con nuestros aﬁliados y/o socios externos con ﬁnes de comercialización, e incluya su nombre y dirección de correo electrónico.</Text>
                <Text style={styles.text}>Intentaremos cumplir con su(s) solicitud(es) tan pronto como sea razonablemente posible. Tenga también en cuenta que si opta por no recibir mensajes nuestros relacionados con la comercialización, todavía podremos enviarle importantes mensajes transaccionales y administrativos, de los que no puede optar por no participar.

Cómo puede acceder, modiﬁcar o eliminar su infor mación personal 

Si desea revisar, corregir, actualizar o eliminar la información personal que nos ha proporcionado a través de cualquier medio, envíe un correo electrónico a contacto@eltomacorriente.com. Intentaremos cumplir con su solicitud tan pronto como sea razonablemente posible.

Las solicitudes serán atendidas en orden cronológico de recibo, y en los plazos de ley. La respuesta será remitida usando el mismo método de contacto, salvo que otro medio resulte más expedito y seguro en el caso concreto.

Procedimiento de Consulta de la Información.
</Text>
                <Text style={styles.text}>Para realizar consultas de información sometida a tratamiento por NEARDENTAL S.A.S., el titular de dicha información deberá:</Text>
                <Text style={styles.text}>1)	Remitir al correo contacto@davibici.co solicitud escrita por el titular de la información  o  por los causahabientes, con copia del documento de identiﬁcación del solicitante; también podrá el titular de la información presentar la solicitud escrita en las instalaciones de NEARDENTAL S.A.S. junto con la presentación original de su cédula de Ciudadanía.
 



 En caso de ser los causahabientes del titular quienes soliciten la información, deberán anexar copia del registro civil de nacimiento o matrimonio, escritura pública de sucesión o copia auténtica de sentencia judicial  de sucesión, según corresponda, junto con el registro civil de defunción del titular.
 </Text>
                <Text style={styles.text}>2)	La solicitud o petición en relación con datos personales será atendida en un término máximo de diez (10) días hábiles desde el recibo de la solicitud o petición.</Text>
                <Text style={styles.text}>3)	Si la solicitud o petición no tiene los datos y/o la información suﬁcientes que permita a NEARDENTAL S.A.S. atenderla de forma correcta, lo faltante se le requerirá al solicitante dentro de los cinco (5) días calendario, siguientes a la recepción de la solicitud o petición.</Text>
                <Text style={styles.text}>4)	Una vez transcurridos treinta (30) días calendario desde la fecha del requerimiento, si el solicitante no ha subsanado según lo requerido, NEARDENTAL S.A.S. entenderá que se ha desistido de la solicitud, según lo establecido en el artículo 15 de la Ley 1581 de 2012.</Text>
                <Text style={styles.text}>Procedimiento de Reclamación.</Text>
                <Text style={styles.text}>1)	Remitir al correo contacto@eltomacorriente.com., la queja o reclamo de manera escrita y ﬁrmada por el titular de la información o por los causahabientes junto con la copia de la cédula del solicitante; también podrá el titular de la información presentar la solicitud escrita en las instalaciones de NEARDENTAL SAS junto con la presentación original de su cédula de Ciudadanía.
En caso de ser los causahabientes del titular quienes soliciten la información, deberán anexar copia del registro civil de nacimiento o matrimonio, según corresponda, junto con el registro civil de defunción del titular.
</Text>
                <Text style={styles.text}>2)	Si NEARDENTAL S.A.S. es el Encargado de la información, procederá a registrar en la base de datos la leyenda “reclamación en trámite” y de inmediato notiﬁcará al responsable de la información.</Text>
                <Text style={styles.text}>3)	La petición y/o reclamación será atendida en un término máximo de quince (15) días hábiles desde el recibo de la solicitud o petición.</Text>
                <Text style={styles.text}>4)	Si la petición y/o reclamación no tiene los datos y/o la información suﬁciente que permita a NEARDENTAL S.A.S. atenderla de forma correcta, se le requerirá dentro de los cinco (5) días calendario, siguientes a la recepción de la solicitud, petición o reclamo para que subsane sus fallas. En este caso, los quince (15) días hábiles de respuesta a la solicitud sólo empezarán a corren a partir de la fecha de recibo de la aclaración o ampliación de la información.</Text>
                <Text style={styles.text}>5)	Una vez transcurridos treinta (30) días calendario desde la fecha del requerimiento, si el solicitante no ha aclarado o ampliado la información según lo requerido, NEARDENTAL S.A.S. entenderá que se ha desistido de la reclamación.</Text>
                <Text style={styles.text}>DERECHOS DEL TITULAR

De conformidad con el artículo 8 de la Ley 1581 de 2012, los derechos a los titulares de la información que le asisten en relación con sus datos personales son:
</Text>
                <Text style={styles.text}>a.	Conocer, actualizar y rectiﬁcar sus datos personales, dentro de los parámetros legales;</Text>
                <Text style={styles.text}>b.	Solicitar prueba de la autorización otorgada por el Titular de la información a NEARDENTAL S.A.S., como Responsables del Tratamiento, salvo cuando expresamente se exceptúe como requisito para el Tratamiento;</Text>
                <Text style={styles.text}>c.	Solicitar a NEARDENTAL S.A.S., como Responsable o Encargado del Tratamiento, información sobre el uso que se le ha dado a los datos personales;</Text>
                <Text style={styles.text}>d.	Presentar quejas por infracciones a lo dispuesto en la presente ley y las demás normas que la modiﬁquen, adicionen o complementen, ante la Superintendencia de Industria y Comercio;</Text>
                <Text style={styles.text}>e.	Revocar la autorización y/o solicitar la supresión de datos, cuando en el Tratamiento no se respeten los principios, derechos y/o garantías constitucionales y legales; siempre que no exista una obligación legal de conservación de dichos datos.</Text>
                <Text style={styles.text}>f.	Acceder en forma gratuita exclusivamente a los datos personales que hayan sido objeto de Tratamiento, no a las distintas actividades ejecutadas en desarrollo de dicho tratamiento.</Text>
              </View>

              <View style={[styles.margin, {flex:0.1}]}>
                <Text style={styles.text}>PERÍODO DE CONSERVACIÓN

La Compañía conservará la información de cada usuario durante todo el tiempo en que ésta se requiera dentro de los ﬁnes descritos en esta política, o hasta diez años adicionales, a menos que medie solicitud de supresión del  interesado.
</Text>
              </View>

              <View style={[styles.margin, {flex:0.1}]}>
                <Text style={styles.text}>Niños, Niñas y Adolescentes Menores de 18 Años

Eventualmente la Compañía puede llegar a requerir datos personales de niños, niñas y adolescentes menores de 18 años, como por ejemplo para aquellos que decidan participar en algún sorteo, o en algún evento o proceso de facturación. La Compañía velará por el uso adecuado de los datos personales de los niños, niñas y adolescentes menores de 18 años, garantizando que respetan en su tratamiento el interés superior de aquellos.
</Text>
              </View>

              <View style={[styles.margin, {flex:0.1}]}>
                <Text style={styles.text}>TRANSFERENCIA ENTRE PAÍSES

Su información personal podrá almacenarse y procesarse en cualquier país donde tengamos instalaciones o proveedores de servicios, y al usar nuestros Sitios web o darnos su consentimiento (donde lo exija la ley), usted acuerda transferir la información a países distintos de su país de residencia, los cuales podrán tener normas diferentes sobre la protección de datos que las vigentes en su país.

</Text>
              </View>

              <View style={[styles.margin, {flex:0.1}]}>
                <Text style={styles.text}>INFORMACIÓN CONFIDENCIAL O SENSIBLE

A menos que lo solicitemos o invitemos de manera especíﬁca, le pedimos que no nos envíe y que no  divulgue información conﬁdencial o sensible alguna (por ejemplo, la información relacionada con el origen racial o étnico, las opiniones políticas, la religión u otras creencias, la salud, los antecedentes penales o la aﬁliación sindical). En los casos en los que podamos solicitar o invitarle a que proporcione información conﬁdencial o sensible, lo haremos con su consentimiento expreso.
</Text>
              </View>

              <View style={[styles.margin, {flex:0.1}]}>
                <Text style={styles.text}>ACTUALIZACIONES DE ESTA POLÍTICA DE PRIVACIDAD

Podremos cambiar esta Política de Privacidad. Mire la leyenda “Última actualización” que aparece en la parte inferior de esta página para consultar cuándo se revisó por última vez la presente Política de Privacidad. Toda modiﬁcación de nuestra Política de Privacidad entrará en vigencia después de la publicación de la Política de Privacidad revisada en el Sitio correspondiente. La información personal proporcionada a la Compañía con posterioridad a estas modiﬁcaciones implica su aceptación de la Política de Privacidad revisada.
</Text>
              </View>

              <View style={[styles.margin, {flex:0.1}]}>
                <Text style={styles.text}>Otras políticas concordantes

                Esta política se rige por la ley colombiana. Especialmente es aplicable la Ley 1581 de 2012, el Decreto 1377 de 2013, decreto 1074 del 2015 y disposiciones concordantes y complementarias. En caso de vacío, también serán aplicables las otras políticas institucionales de la Compañía relacionadas con la protección de los datos personales.
</Text>
              </View>
              
              <View style={[styles.margin, {flex:0.1}]}>
                <Text style={styles.text}>Entrada en vigencia y plazo

De conformidad con lo dispuesto en el numeral 3 del artículo 10 del Decreto Reglamentario 1377 de 2013 NEARDENTAL SAS procederá a publicar un aviso en su página web oﬁcial w ww.eltomacorriente.com y www.davibici.co dirigido a los titulares de datos personales para efectos de dar a  conocer la presente política de tratamiento de información y el modo de ejercer sus derechos como titulares de datos personales alojados en las bases de datos de NEARDENTAL SAS:
Política de Privacidad Apps y Neardental SAS 

La presente política estará vigente hasta que la Compañía deje de ejercer su objeto social.

Esta política ha sido redactada y aprobada el día uno  (01)  de enero  de 2022, fecha a partir de la cual entra en   vigencia.
De conformidad con lo dispuesto en el numeral 3 del artículo 10 del Decreto Reglamentario 1377 de 2013 NEARDENTAL SAS procederá a publicar un aviso en su página web oficial www.eltomacorriente.com y www.bicyclecapital.co dirigido a los titulares de datos personales para efectos de dar a conocer la presente política de tratamiento de información y el modo de ejercer sus derechos como titulares de datos personales alojados en las bases de datos de NEARDENTAL SAS: Política de Privacidad Apps y Neardental SAS
La presente política estará vigente hasta que la Compañía deje de ejercer su objeto social.
Esta política ha sido redactada y aprobada el día uno (01) de enero de 2024, fecha a partir de la cual entra en vigencia.
</Text>
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
