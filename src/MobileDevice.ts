
const filters = [{ 'vendorId': 0x5ac, 'productId': 0x12A8 }]
const USBMuxClass = 255
const USBMuxSubclass = 254
const USBMuxProtocol = 2

export default class MobileDevice {
    usbDevice: USBDevice
    usbConfiguration: USBConfiguration | null
    usbInterface: USBInterface | null

    _closing: boolean
    _readInterval: number

    usbInputEndpoint: USBEndpoint | null
    usbOutputEndpoint: USBEndpoint | null

    dataCallback: ((data: ArrayBuffer) => void) | null
    inputTransfer: Promise<USBInTransferResult> | null

    constructor(device: USBDevice) {
        this._closing = false
        this.usbDevice = device
        this.usbInterface = null
        this.usbConfiguration = null
        this.usbOutputEndpoint = null
        this.usbInputEndpoint = null
        this.dataCallback = null
        this.inputTransfer = null

        let mobileDevice = this
        this._readInterval = window.setInterval(() => { mobileDevice.deviceReader() }, 1000)
    }

    static supported(): boolean {
        return ("usb" in window.navigator)
    }

    static async selectDevice() {
        let device = await navigator.usb.requestDevice({ 'filters': filters })
        return new MobileDevice(device)
    }

    static async getDevices() {
        let devices = await navigator.usb.getDevices()

        return devices.map((device) => {
            return new MobileDevice(device)
        })
    }

    get name(): string {
        return this.usbDevice.productName as string
    }

    get serialNumber(): string {
        return this.usbDevice.serialNumber as string
    }

    async close() {
        if (!this._closing) {
            window.clearInterval(this._readInterval)
        }

        this._closing = true

        if (this.usbDevice && this.usbDevice.opened) {
            if (this.usbInterface && this.usbInterface.claimed) {
                console.log(`Closing interface ${this.usbInterface.interfaceNumber} for ${this.usbDevice.serialNumber}`)
                await this.usbDevice.releaseInterface(this.usbInterface.interfaceNumber)
            }

            await this.usbDevice.selectConfiguration(1)

            try {
                console.log(`Resetting device ${this.usbDevice.serialNumber}`)
                await this.usbDevice.reset()
            }
            finally {
                console.log(`Closing device ${this.usbDevice.serialNumber}`)
                await this.usbDevice.close()

                console.log(`Closed ${this.serialNumber}`)
            }
        }
    }

    async open(): Promise<void> {
        try {
            for (let configuration of this.usbDevice.configurations) {
                for (let usbInterface of configuration.interfaces) {

                   //console.debug(`Interface ${usbInterface.interfaceNumber} (Claimed: ${usbInterface.claimed})`)
                    for (let alternate of usbInterface.alternates) {
                        //console.debug(`\tAlternate ${alternate.alternateSetting} ${alternate.interfaceName} Class ${alternate.interfaceClass} Subclass ${alternate.interfaceSubclass} Protocol ${alternate.interfaceProtocol}`)

                        if (alternate.interfaceClass === USBMuxClass &&
                            alternate.interfaceSubclass === USBMuxSubclass &&
                            alternate.interfaceProtocol === USBMuxProtocol) {
                            this.usbInterface = usbInterface
                            this.usbConfiguration = configuration
                        }
                    }
                }
            }

            if (this.usbConfiguration && this.usbInterface) {
                console.log(`Opening device ${this.usbDevice.serialNumber}`)
                await this.usbDevice.open()

                if (this.usbDevice.configuration?.configurationValue !== this.usbConfiguration.configurationValue) {
                    console.log(`Selecting Configuration ${this.usbConfiguration.configurationValue} from ${this.usbDevice.configuration?.configurationValue}`)
                    await this.usbDevice.selectConfiguration(this.usbConfiguration.configurationValue)
                }

                console.log(`Claiming Interface ${this.usbInterface.interfaceNumber}`)
                await this.usbDevice.claimInterface(this.usbInterface.interfaceNumber)

                for (let endpoint of this.usbInterface.alternates[0].endpoints) {
                    console.log(`Endpoint ${endpoint.endpointNumber} ${endpoint.direction}`)
                    if (endpoint.direction === "in") {
                        this.usbInputEndpoint = endpoint
                    }
                    if (endpoint.direction === "out") {
                        this.usbOutputEndpoint = endpoint
                    }
                }
            } else {
                console.error(`No configuration ${this.usbConfiguration} or interface ${this.usbInterface}`)
            }
        }
        catch (e) {
            console.error(e)
        }
    }

    deviceReader() {
        if (!this || !this.usbDevice || !this.usbDevice.opened || !this.usbInterface) {
            console.log("deviceReader not in ready state")
            return
        }

        if (this.inputTransfer && !this._closing) {
            return
        }

        console.log("MobileDevice deviceReader loop")
        if (this.usbInputEndpoint === null) {
            throw new Error("No input endpoint")
        }

        let inputEndpoint = this.usbInputEndpoint.endpointNumber
        let device = this

        this.inputTransfer = this.usbDevice.transferIn(inputEndpoint, 4096)

        this.inputTransfer.then(result => {
            console.log(`Received USB data ${result.data?.byteLength} status ${result.status}`)
            if (device.dataCallback && result.data) {
                device.dataCallback(result.data.buffer)
            }
            this.inputTransfer = null
            this.deviceReader()
        }).catch(reason => {
            console.log(`InputTransfer exception`)
            console.error(reason)
        })
    }

    async sendData(data: ArrayBuffer): Promise<USBOutTransferResult | null> {
        let outputEndpoint = this.usbOutputEndpoint?.endpointNumber

        if (outputEndpoint !== undefined) {
            console.log(`Outputting Data to Device on ${outputEndpoint}`)
            return await this.usbDevice.transferOut(outputEndpoint, data)
        } else {
            console.error(`Undefined output interface ${outputEndpoint}`)
        }

        return null
    }

    handleData(callback: (data: ArrayBuffer) => void) {
        this.dataCallback = callback
    }
}