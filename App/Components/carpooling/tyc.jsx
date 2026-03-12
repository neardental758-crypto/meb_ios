import React from 'react';
import {
    Text,
    View,
    StyleSheet,
    ScrollView
} from 'react-native';
import Colors from '../../Themes/Colors';
import Fonts from '../../Themes/Fonts';

export function TYC(){
    return (
    <ScrollView style={estilos.contenedor}>
       
        <Text style={estilos.titulo}>
            TÉRMINOS Y CONDICIONES DE USO DEL MÓDULO DE CARRO COMPARTIDO
        </Text>
        
        <Text style={estilos.parrafo}>
            Bienvenido/a al módulo de carro compartido de la aplicación de movilidad sostenible RIDE/5G/TRIP, proporcionada por NEARDENTAL SAS. Antes de utilizar el Módulo, te pedimos que leas detenidamente estos términos y condiciones , ya que regulan tu acceso y uso del Módulo.
        </Text>

        <Text style={estilos.parrafo}>
            Al descargar, registrarte y/o utilizar el Módulo, aceptas cumplir con estos Términos en su totalidad. Si no estás de acuerdo con alguno de ellos, no puedes utilizar el Módulo.
        </Text>

        <Text style={estilos.subTitulo}>
            1. OBJETO Y USO DEL MÓDULO
        </Text>

        <Text style={estilos.parrafo}>
            1.1. El Módulo está diseñado para facilitar la conexión entre usuarios interesados en compartir viajes en vehículo particular. No somos un proveedor de transporte ni operamos como una empresa de transporte, sino que simplemente ponemos a disposición de los usuarios una herramienta tecnológica para la coordinación de viajes compartidos.
        </Text>

        <Text style={estilos.parrafo}>
            1.2. El uso del Módulo es voluntario y bajo la exclusiva responsabilidad del usuario.
        </Text>

        <Text style={estilos.parrafo}>
            1.3. La aplicación verificará que los usuarios sean estudiantes activos de la Universidad EAN mediante el uso de correos institucionales y otros mecanismos de validación que se definan conjuntamente con la Universidad.
        </Text>

        <Text style={estilos.subTitulo}>
            2. RESPONSABILIDAD DEL USUARIO
        </Text>

        <Text style={estilos.parrafo}>
            2.1. El usuario asume los riesgos inherentes al uso del Módulo para compartir vehículos, incluyendo, pero no limitándose a:
            {'\n'}• Accidentes de tránsito.
            {'\n'}• Lesiones personales o daños físicos.
            {'\n'}• Pérdida o daño de bienes personales.
            {'\n'}• Retrasos, cancelaciones o incumplimientos de viaje por parte de otros usuarios.
        </Text>

        <Text style={estilos.parrafo}>
            2.2. El usuario exonera completamente a NEARDENTAL SAS y la UNIVERSIDAD EAN y sus afiliados de cualquier responsabilidad legal o reclamo derivado del uso del Módulo de carro compartido.
        </Text>

        <Text style={estilos.parrafo}>
            2.3. Cada usuario es responsable de:
            {'\n'}• Cumplir con las leyes y regulaciones de tránsito en su jurisdicción.
            {'\n'}• Garantizar que su vehículo esté en condiciones seguras y cumpla con las regulaciones legales aplicables.
            {'\n'}• Seleccionar con criterio a los compañeros de viaje y tomar las precauciones necesarias para su seguridad.
        </Text>

        <Text style={estilos.subTitulo}>
            3. EXCLUSIÓN DE RESPONSABILIDAD DEL PROVEEDOR Y LA UNIVERSIDAD EAN
        </Text>

        <Text style={estilos.parrafo}>
            3.1. No realizamos verificaciones de antecedentes de los usuarios ni garantizamos la seguridad, confiabilidad o idoneidad de los vehículos o conductores registrados en el Módulo. Sin embargo, NEARDENTAL SAS podrá revisar registros públicos de conductores y vehículos registrados en términos de comparendos y vigencia del SOAT para su activación en el módulo, sin que esto implique garantía alguna sobre los usuarios. Lo anterior, deberá ser informado al usuario de forma previa y antes de hacer uso del Módulo de carro compartido.
        </Text>

        <Text style={estilos.parrafo}>
            3.2. No nos hacemos responsables de:
            {'\n'}• Comportamiento, acciones u omisiones de los usuarios durante los viajes compartidos.
            {'\n'}• Daños a personas o bienes causados por el uso del Módulo.
            {'\n'}• Incumplimientos en la coordinación de viajes entre usuarios.
        </Text>

        <Text style={estilos.parrafo}>
            3.3. No ofrecemos seguros ni coberturas para los usuarios. Cualquier accidente, incidente o pérdida derivada del uso del Módulo es responsabilidad exclusiva de los usuarios involucrados.
        </Text>

        <Text style={estilos.subTitulo}>
            4. CONDUCTA Y SANCIONES
        </Text>

        <Text style={estilos.parrafo}>
            4.1. NEARDENTAL SAS se reserva el derecho de suspender o eliminar cuentas de usuarios que incurran en:
            {'\n'}• Incumplimiento de estos términos u otros acordados.
            {'\n'}• Incumplimiento de normas de tránsito.
            {'\n'}• Reportes de mala conducta o comportamiento inapropiado.
            {'\n'}• Uso fraudulento o indebido del Módulo.
            {'\n'}• Cualquier acción que ponga en riesgo la seguridad de otros usuarios.
        </Text>

        <Text style={estilos.parrafo}>
            4.2. El uso del Módulo para fines distintos al compartimiento de vehículos podrá dar lugar a la suspensión inmediata del usuario.
        </Text>

        <Text style={estilos.subTitulo}>
            5. LIMITACIÓN DE RESPONSABILIDAD
        </Text>

        <Text style={estilos.parrafo}>
            5.1. El Módulo se proporciona "tal cual" y "según disponibilidad" sin garantía de ningún tipo, ya sea expresa o implícita.
        </Text>

        <Text style={estilos.parrafo}>
            5.2. En la medida máxima permitida por la ley, ni NEARDENTAL SAS ni la UNIVERSIDAD EAN serán responsables por ningún daño directo, indirecto, incidental, especial, consecuente o punitivo que surja del uso o la incapacidad de usar el Módulo.
        </Text>

        <Text style={estilos.parrafo}>
            5.3. No garantizamos que el Módulo funcionará sin interrupciones o que estará libre de errores.
        </Text>

        <Text style={estilos.subTitulo}>
            6. MODIFICACIONES DE LOS TÉRMINOS
        </Text>

        <Text style={estilos.parrafo}>
            6.1. Nos reservamos el derecho de modificar estos Términos en cualquier momento.
        </Text>

        <Text style={estilos.parrafo}>
            6.2. Las modificaciones entrarán en vigor una vez sean publicadas en la Aplicación. El uso continuado del Módulo constituye la aceptación de los nuevos términos.
        </Text>

        <Text style={estilos.subTitulo}>
            7. JURISDICCIÓN Y LEGISLACIÓN APLICABLE
        </Text>

        <Text style={estilos.parrafo}>
            7.1. Estos Términos se regirán e interpretarán bajo las leyes de Colombia.
        </Text>

        <Text style={estilos.parrafo}>
            7.2. Cualquier disputa derivada de estos Términos será resuelta ante los tribunales competentes de Bogotá, Colombia.
        </Text>

        <Text style={estilos.parrafo}>
            Fecha de entrada en vigor: 20-03-2025
        </Text>

        <Text style={estilos.titulo}>
            POLÍTICA DE PRIVACIDAD DE DATOS APP TRIP/RIDE
        </Text>

        <Text style={estilos.parrafo}>
            NEARDENTAL S.A.S. (en adelante la "Compañía") se preocupa por las cuestiones de privacidad y quiere que sus empleados, clientes, usuarios, colaboradores, patrocinadores, proveedores, aliados y todos los demás interesados, en adelante los "Usuarios", estén familiarizados con la forma en que recopilamos, utilizamos y/o divulgamos la información. Esta Política de Privacidad describe nuestras prácticas en relación con la información que nosotros o nuestros proveedores de servicios recopilamos a través de distintos medios. Al proporcionarnos información personal, usted acepta los términos y condiciones de la presente Política de Privacidad.
        </Text>

        <Text style={estilos.subTitulo}>
            ALCANCE
        </Text>

        <Text style={estilos.parrafo}>
            La Política de tratamiento de datos personales es realizada de conformidad con los lineamientos corporativos de NEARDENTAL S.A.S. y los parámetros legales locales bajo los cuales NEARDENTAL S.A.S. como desarrollador y operador de la APP Bicycle Capital 5G/RIDE/TRIP realiza el tratamiento de los Datos Personales.
        </Text>

        <Text style={estilos.parrafo}>
            La Política está diseñada para dar cumplimiento a las obligaciones jurídicas y/o legales impuestas por la legislación colombiana en la materia. Su contenido se aplica a la protección y tratamiento de toda la información contenida en base de datos con información de personas naturales con las que NEARDENTAL S.A.S. tenga o no relación contractual y sobre la cual se encuentre como responsable y/o encargado del tratamiento de dicha información.
        </Text>

        <Text style={estilos.subTitulo}>
            DEFINICIONES
        </Text>

        <Text style={estilos.parrafo}>
            Para la interpretación de esta Política, se deben tener en cuenta las siguientes definiciones:
            {'\n\n'}Dato(s) personal(es): Cualquier información vinculada o que pueda asociarse a una o varias personas naturales determinadas o determinables;
            {'\n\n'}Datos sensibles: Aquellos datos que afectan la intimidad del titular de la información o cuyo uso indebido puede generar su discriminación;
            {'\n\n'}Base de Datos: Conjunto organizado de datos personales que sea objeto de tratamiento;
            {'\n\n'}Titular: Persona natural cuyos datos personales sean objeto de Tratamiento en razón de una relación comercial o jurídica con NEARDENTAL S.A.S., sea cliente, proveedor, empleado, o cualquier tercero;
            {'\n\n'}Cliente: Toda persona para quien NEARDENTAL S.A.S. presta un servicio o con quien sostiene una relación contractual/obligacional;
            {'\n\n'}Proveedor: Toda persona natural o jurídica que preste algún servicio a NEARDENTAL S.A.S., en virtud de una relación contractual/obligacional;
            {'\n\n'}Tratamiento: Cualquier operación, o conjunto de operaciones, que se realice sobre datos personales, tales como recolección, almacenamiento, uso, circulación o supresión;
            {'\n\n'}Responsable del Tratamiento: Persona natural o jurídica, pública o privada, que por sí misma o en asocio con otros, decida sobre la base de datos y/o el tratamiento de los datos. (el "Responsable"); en este caso, NEARDENTAL S.A.S.;
            {'\n\n'}Encargado del Tratamiento: Persona natural o jurídica, pública o privada, que por sí misma o en asocio con otros, realice el tratamiento de datos personales, por cuenta de otro, como Responsable de los datos (el "Encargado"); en este caso NEARDENTAL S.A.S.;
            {'\n\n'}Transferencia: Se refiere al envío de una base de datos por parte del Responsable, o un Encargado de los datos, a un tercer agente o persona natural/jurídica (el "Receptor"), dentro o fuera del territorio nacional, para el tratamiento efectivo de datos personales;
            {'\n\n'}Trasmisión: Se refiere a la comunicación de datos personales por parte del Responsable al Encargado, ubicado dentro o fuera del territorio nacional, para que el Encargado, por cuenta del Responsable, trate datos personales;
            {'\n\n'}Autorización: Se refiere a todo acto o medio establecido por NEARDENTAL S.A.S., para comunicar al titular de la información sobre la obtención y tratamiento de su información y para alertar al titular que la compañía cuenta con los debidos procedimientos de protección bajo los lineamientos legales;
            {'\n\n'}Causahabiente: Beneficiario de una sucesión, por causa de la muerte del titular de la información.
        </Text>

        <Text style={estilos.parrafo}>
            Para el entendimiento de los términos que no se encuentran incluidos dentro del listado anterior, deberá remitirse a la legislación vigente, en especial a la Ley 1581 de 2012 y al Decreto 1377 de 2013.
        </Text>

        <Text style={estilos.subTitulo}>
            Información facilitada por usted
        </Text>

        <Text style={estilos.parrafo}>
            Para cumplir su objeto social, la Compañía ha recaudado, recauda y seguirá recaudando siempre y cuando medie consentimiento del titular, la siguiente información personal: nombre y apellido, NIT, fecha de nacimiento, género, dirección de correspondencia, dirección de correo electrónico, teléfono, número de documento de identificación, estudios realizados, medios de movilización, profesión, ocupación, idiomas, régimen aplicable a IVA, facturación. Régimen tributario aplicable a ICA y otros datos no sensibles. El titular de los datos acepta expresamente que la Compañía almacene, procese y utilice esta información personal, de forma parcial o total, para los fines expresados en la ley y en la presente política.
        </Text>

        <Text style={estilos.parrafo}>
            Adicionalmente, la Compañía cuenta con aplicaciones móviles y sitios web que podrán requerir que envíe información personal a fin de que se beneficie de los beneficios u opciones especificadas (como su ubicación, suscripciones a boletines, consejos/pautas o procesamiento de órdenes) o participe en una actividad particular (como concursos u otras promociones). Se le comunicará qué información es necesaria y cuál es opcional.
        </Text>

        <Text style={estilos.parrafo}>
            Podremos combinar la información que usted envíe con otra información que hemos recopilado de usted, ya sea a través de Internet o por fuera. También podremos combinarla con la información que recibimos de usted de otras fuentes, como las fuentes de información a disposición del público (incluida la información de sus perfiles de medios sociales disponible públicamente), y de otros terceros.
        </Text>

        <Text style={estilos.subTitulo}>
            Autorización
        </Text>

        <Text style={estilos.parrafo}>
            La recolección, almacenamiento, uso, circulación o supresión de datos personales requiere del consentimiento libre, previo, expreso e informado del titular de los mismos. NEARDENTAL SAS en su condición de responsable del tratamiento de datos personales, ha dispuesto de los mecanismos necesarios para obtener la autorización de los titulares garantizando en todo caso que sea posible verificar el otorgamiento de dicha autorización.
        </Text>

        <Text style={estilos.parrafo}>
            La autorización podrá constar en un documento físico, electrónico, en cualquier otro formato que permita garantizar su posterior consulta, o mediante un mecanismo técnico o tecnológico idóneo. Este se podrá dar vía aceptación de términos y condiciones en nuestras aplicaciones tecnológicas, registros e inscripciones, vía entrega verbal de datos en procesos de cotización, facturación, búsqueda de información, similares u otros.
        </Text>

        <Text style={estilos.parrafo}>
            Autorización tácita: También se entenderá que el Titular ha otorgado autorización para el tratamiento de sus datos personales cuando mediante su conducta permite concluir de forma razonable que otorgó la autorización.
        </Text>

        <Text style={estilos.parrafo}>
            La autorización no será necesaria en las excepciones previstas en la ley, a manera enunciativa y sin perjuicio de las normas modifiquen, adicionen o complementen.
        </Text>

        <Text style={estilos.parrafo}>
            Las políticas de privacidad y tratamiento de datos personales de NEARDENTAL SAS se podrán revisar en sus páginas web: www.eltomacorriente.com y www.bicyclecapital.co.
        </Text>

        <Text style={estilos.subTitulo}>
            Finalidad del Tratamiento de Datos
        </Text>

        <Text style={estilos.parrafo}>
            La Compañía requiere que la información personal de los Usuarios sea recolectada, almacenada, usada, circulada, compartida, procesada y/o se le de tratamiento con los siguientes propósitos: realizar estudios de investigación y de mercados, de generar valor en calidad de vida a sus clientes y usuarios, de dar a conocer información sobre los productos y servicios que comercializa, de hacer vigilancia y reportes de quejas de calidad de productos y servicios, de comercializar los productos y servicios, de gestionar la administración de los Recursos Humanos de la Compañía, de mejorar los servicios que presta, evaluar los niveles de satisfacción de sus clientes, de ejercer su objeto social dentro del marco de la ley, y de cumplir con sus obligaciones legales y contractuales.
        </Text>

        <Text style={estilos.parrafo}>
            También utilizamos su información:
            {'\n'}• Para responder a sus consultas y atender sus solicitudes, como enviarle los documentos que solicita o alertas por correo electrónico;
            {'\n'}• Utilizaremos su ubicación/locación y datos de georreferenciación para la georreferenciación de bicicletas, registro de recorridos, atención de emergencias, obtención de data operativa y, habilitación de puntos de parqueo exclusivamente.
            {'\n'}• Para enviarle información importante sobre nuestra relación con usted o sobre determinado Sitio web, las modificaciones de nuestros términos, condiciones, y políticas y/u otra información administrativa;
            {'\n'}• Permitir la participación de los Titulares en actividades de mercadeo y promocionales (incluyendo la participación en concursos, rifas y sorteos) realizados por LA COMPAÑÍA
            {'\n'}• Para el fortalecimiento de las relaciones con sus Consumidores y Clientes, mediante el envío de información relevante, la toma de pedidos y evaluación de la calidad del servicio
            {'\n'}• Para mejorar, promocionar y desarrollar sus productos y los de sus compañías vinculadas cuyo objeto se relacione directamente con la prestación del servicio de transporte.
            {'\n'}• Para monitorear a los usuarios de nuestros programas de movilidad, dar un servicio personalizado al cliente y velar por la calidad del servicio y el logro de objetivos.
        </Text>

        <Text style={estilos.subTitulo}>
            DERECHOS DEL TITULAR
        </Text>

        <Text style={estilos.parrafo}>
            De conformidad con el artículo 8 de la Ley 1581 de 2012, los derechos a los titulares de la información que le asisten en relación con sus datos personales son:
            {'\n'}a. Conocer, actualizar y rectificar sus datos personales, dentro de los parámetros legales;
            {'\n'}b. Solicitar prueba de la autorización otorgada por el Titular de la información a NEARDENTAL S.A.S., como Responsables del Tratamiento, salvo cuando expresamente se exceptúe como requisito para el Tratamiento;
            {'\n'}c. Solicitar a NEARDENTAL S.A.S., como Responsable o Encargado del Tratamiento, información sobre el uso que se les ha dado a los datos personales;
            {'\n'}d. Presentar quejas por infracciones a lo dispuesto en la presente ley y las demás normas que la modifiquen, adicionen o complementen, ante la Superintendencia de Industria y Comercio;
            {'\n'}e. Revocar la autorización y/o solicitar la supresión de datos, cuando en el Tratamiento no se respeten los principios, derechos y/o garantías constitucionales y legales; siempre que no exista una obligación legal de conservación de dichos datos.
            {'\n'}f. Acceder en forma gratuita exclusivamente a los datos personales que hayan sido objeto de Tratamiento, no a las distintas actividades ejecutadas en desarrollo de dicho tratamiento.
        </Text>

        <Text style={estilos.parrafo}>
            Si desea ejercer sus derechos o tiene alguna pregunta sobre estos Términos, contáctanos en servicio@bicyclecapital.co
        </Text>

        <Text style={estilos.parrafo}>
            Esta política ha sido redactada y aprobada el día uno (01) de enero de 2024, fecha a partir de la cual entra en vigencia.
        </Text>

    </ScrollView>
    )
}

const estilos = StyleSheet.create({
    contenedor: {
        flex: 1,
        position: 'relative',
        top: 0,
        zIndex: 10,
    },
    titulo: {
        width: "95%",
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 10,
        fontFamily: Fonts.$poppinsmedium
    },
    subTitulo: {
        width: "90%",
        fontSize: 16,
        marginBottom: 5,
        fontFamily: Fonts.$poppinsregular
    },
    parrafo: {
        width: "100%",
        fontSize: 14,
        color: Colors.$texto80,
        justifyContent: 'center',
        textAlign: 'justify',
        marginBottom: 10,
        fontFamily: Fonts.$poppinsregular
    }
})