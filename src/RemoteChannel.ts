import MobileDevice from './MobileDevice';
import {ClientMessage, ServerMessage} from "./transport";

const RemoteAddress = `wss://${window.location.host}/v1/device`

export default class RemoteChannel {
    socket: WebSocket
    devices: {[deviceId: string]: MobileDevice}

    constructor() {
        this.socket = new WebSocket(RemoteAddress)
        this.socket.binaryType = 'arraybuffer';
        this.socket.onopen = () => {
            console.log(`RemoteChannel Open`)
        }
        this.socket.onerror = event => {
            console.error(`RemoteChannel Error: ${event}`)
        }
        this.devices = {}

        let handler = this.dataFromServer.bind(this)
        this.socket.onmessage = function(event) {
            handler(event.data)
        }
    }

    dataFromServer(data: ArrayBuffer): any {
        let clientMessage = ClientMessage.decode(new Uint8Array(data))
        console.log(`ClientMessage:`, clientMessage)

        if (clientMessage.toDevice) {
            let device = this.devices[clientMessage.toDevice.serialNumber]
            let correlationId = clientMessage.toDevice.correlationId

            if (!correlationId) {
                console.log("Message from server without correlation ID")
                return
            }

            console.log(`About to send ${clientMessage.toDevice.data.byteLength} bytes`)

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

        device.handleData.call(device, data => {
            let fromDeviceMessage = { fromDevice:
                    { serialNumber: device.serialNumber,
                        data: new Uint8Array(data)
                    },
                deviceConnected: undefined,
                toDeviceResult: undefined
            }
            let messageData = ServerMessage.encode(fromDeviceMessage).finish()
            console.log(`Sending fromDevice message to server ${messageData.byteLength} bytes`)
            this.socket.send(messageData)
        })

        let connectMessage = { fromDevice: undefined,
            deviceConnected: {
                serialNumber: device.serialNumber,
                vendorId: device.usbDevice.vendorId,
                productId: device.usbDevice.productId
            },
            toDeviceResult: undefined
        }

        this.socket.send(ServerMessage.encode(connectMessage).finish())
    }
}