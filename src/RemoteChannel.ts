import transport from './transport/transport_pb'
import MobileDevice from "./MobileDevice";

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
        transport.
    }

    async bindDevice(device: MobileDevice) {
        this.devices[device.serialNumber] = device

        device.handleData(data => {
            let dataFromDevice = new transport.DataFromDevice()
            dataFromDevice.setSerialnumber(device.serialNumber)
            dataFromDevice.setData(new Uint8Array(data))

            this.socket.send(dataFromDevice.serializeBinary())
        })

        let connectEvent = new transport.DeviceConnected()
        connectEvent.setSerialnumber(device.serialNumber)

        this.socket.send(connectEvent.serializeBinary())
    }
}