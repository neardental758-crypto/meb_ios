import { Env } from "../Utils/enviroments";

const URLMysql = Env.apiUrlMysql;

const sendPush = async (tokenDispositivo, msn) => {
    console.log('📤 Enviando notificación a:', tokenDispositivo);
    console.log('📝 Mensaje:', msn);
    
    try {
        const API_URL = `${URLMysql}notificaciones/enviar`;
        console.log('🌐 URL:', API_URL);
        
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                token: tokenDispositivo,
                title: 'Ride - Carro compartido',
                body: msn,
                data: {
                    type: 'ride_request',
                    timestamp: new Date().toISOString()
                }
            }),
        });
        
        console.log('📊 Response status:', response.status);
        
        const responseData = await response.json();
        console.log('📦 Response data:', responseData);
        
        if (response.ok && responseData.success) {
            console.log('✅ Notificación enviada correctamente');
            return { success: true, data: responseData };
        } else {
            console.error('❌ Error en la respuesta:', responseData);
            return { 
                success: false, 
                error: responseData.error || 'Error al enviar notificación' 
            };
        }
    } catch (error) {
        console.error('❌ Error al enviar la notificación:', error);
        return { 
            success: false, 
            error: error.message 
        };
    }
};

export const push = {
    sendPush
};