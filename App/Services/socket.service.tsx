import socketIO from 'socket.io-client';
import { connect } from 'react-redux';
import { Alert } from 'react-native';
import store from '../Services/configure';
import {getItem} from '../Services/storage.service';
import { updateStation } from '../actions/actions';
export default class SocketService {

    public socket: any;
    private conected: boolean = false;
    private props: any;

    public static socketInstance = new SocketService();

    async socketConection(props: any) {
        if (!this.conected) {
            let user = await getItem('user');
            /*this.socket = socketIO("https://admin.ruedaporibague.com:3001/socket/1?organizationId="+user.organizationId, {
                transports: ['websocket'],
                //jsonp: false //se comentó genera error
            });*/
            this.socket = socketIO("https://application.tuhuella.co/socket/1?organizationId="+user.organizationId, {
                transports: ['websocket'],
                //jsonp: false //se comentó genera error
            });
            this.socket.connect();
            console.log(this.socket);
            this.socket.on("connect", (socket: any) => {
                console.log("Un cliente se ha conectado");
            })
            this.socket.on("connect_error", (socket: any) => {
                console.log("ERROR SOCKET"+socket);
            })
            this.socket.on("updateStation", (msg: any) => {
                console.log("update station", msg)
                store.dispatch(updateStation(msg));
            });
            this.socket.on("showAlert", (msg: any) => {
                setTimeout(function(){ Alert.alert("showalert"); }, 100)
            });
            
            this.props = props;
            this.conected = true;
        }
    }


    async emitUpdateStations(stationId: String){
        console.log("action emit station", stationId)
        let station = {
            id: stationId
        }
        this.socket.emit('updateStation', station);
    }

    reconnectSocket() {
        this.socketDisconect();
        this.socketConection(this.props);

    }

    socketDisconect() {
        if (this.socket) {
            this.conected = false;
            this.socket.disconnect();
        }
    }
}

