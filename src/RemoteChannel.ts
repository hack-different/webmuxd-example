import MobileDevice from './MobileDevice';
import {ClientMessage, ServerMessage} from "./transport";

const RemoteAddress = "ws://localhost:8080/v1/device"

export default class RemoteChannel {
    socket: WebSocket
    devices: {[deviceId: string]: MobileDevice}

    constructor() {
        this.socket = new WebSocket(RemoteAddress)
        this.socket.onopen = event => {
            console.log(`RemoteChannel Open`)
        }
        this.socket.onerror = event => {
            console.error(`RemoteChannel Error: ${event}`)
        }
        this.devices = {}

        let channel = this
        this.socket.onmessage = function(event) {
            channel.dataFromServer(this, event)
        }
    }

    dataFromServer(webSocket: WebSocket, dataEvent: MessageEvent): any {
        let clientMessage = ClientMessage.decode(dataEvent.data)

        if (clientMessage.toDevice) {
            let device = this.devices[clientMessage.toDevice.serialNumber]
            let correlationId = clientMessage.toDevice.correlationId

            if (!correlationId) {
                console.log("Message from server without correlation ID")
                return
            }


            device.sendData(clientMessage.toDevice.data).then(result => {
                if (result == null) {
                    console.error("Endpoint does not exist")
                }

                let toDeviceResultMessage = {
                    toDeviceResult: {
                        correlationId: correlationId,
                        success: (result?.status === "ok")
                    },
                    deviceConnected: undefined,
                    fromDevice: undefined
                }

                this.socket.send(ServerMessage.encode(toDeviceResultMessage).finish())
            })
        }
    }

    async bindDevice(device: MobileDevice) {
        this.devices[device.serialNumber] = device

        device.handleData(data => {
            let fromDeviceMessage = { fromDevice:
                    { serialNumber: device.serialNumber,
                        data: new Uint8Array(data)
                    },
                deviceConnected: undefined,
                toDeviceResult: undefined
            }

            this.socket.send(ServerMessage.encode(fromDeviceMessage).finish())
        })

        let connectMessage = { fromDevice: undefined,
            deviceConnected: { serialNumber: device.serialNumber },
            toDeviceResult: undefined
        }

        this.socket.send(ServerMessage.encode(connectMessage).finish())
    }
}