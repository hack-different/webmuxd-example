
const filters = [{ 'vendorId': 0x5ac, 'productId': 0x12A8 }]
const USBMuxClass = 255
const USBMuxSubclass = 254
const USBMuxProtocol = 2

export default class MobileDevice {
    usbDevice: USBDevice
    usbConfiguration: USBConfiguration | null
    usbInterface: USBInterface | null

    usbInputEndpoint: USBEndpoint | null
    usbOutputEndpoint: USBEndpoint | null

    dataCallback: ((data: ArrayBuffer) => void) | null

    constructor(device: USBDevice) {
        this.usbDevice = device
        this.usbInterface = null
        this.usbConfiguration = null
        this.usbOutputEndpoint = null
        this.usbInputEndpoint = null
        this.dataCallback = null
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

    async open(): Promise<void> {
        try {
            await this.usbDevice.open()

            for (let configuration of this.usbDevice.configurations) {
                for (let usbInterface of configuration.interfaces) {

                    console.log(`Interface ${usbInterface.interfaceNumber} (Claimed: ${usbInterface.claimed})`)
                    for (let alternate of usbInterface.alternates) {
                        console.log(`\tAlternate ${alternate.alternateSetting} ${alternate.interfaceName} Class ${alternate.interfaceClass} Subclass ${alternate.interfaceSubclass} Protocol ${alternate.interfaceProtocol}`)


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
                console.log(`Selecting Configuration ${this.usbConfiguration.configurationValue}`)
                await this.usbDevice.selectConfiguration(this.usbConfiguration.configurationValue)
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

            this.deviceReader()
        }
        catch (e) {
            console.error(e)
        }
    }

    deviceReader() {
        console.log("MobileDevice deviceReader loop")
        if (this.usbInputEndpoint === null) {
            throw new Error("No input endpoint")
        }

        let inputEndpoint = this.usbInputEndpoint.endpointNumber
        let device = this

        this.usbDevice.transferIn(inputEndpoint, 4096).then(result => {
            console.log(`Received USB data ${result.data?.byteLength} status ${result.status}`)
            if (device.dataCallback && result.data) {
                device.dataCallback(result.data.buffer)
            }
        }).then(() => { device.deviceReader.call(device) })
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