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
                    if (endpoint.direction === "in") {
                        this.usbInputEndpoint = endpoint
                    }
                    if (endpoint.direction === "out") {
                        this.usbOutputEndpoint = endpoint
                    }
                }
            }
        }
        catch (e) {
            console.error(e)
        }
    }

    async sendData(data: ArrayBuffer): Promise<void> {
        let outputEndpoint = this.usbOutputEndpoint?.endpointNumber

        if (outputEndpoint !== undefined) {
            console.log(`Outputting Data to Device on ${outputEndpoint}`)
            await this.usbDevice.transferOut(outputEndpoint, data)
        }
    }

    handleData(callback: (data: ArrayBuffer) => void) {
        this.dataCallback = callback
    }
}