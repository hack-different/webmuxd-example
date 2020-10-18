
const filters = [{ 'vendorId': 0x5ac }]

export default class MobileDevice {
    device: USBDevice

    constructor(device: USBDevice) {
        this.device = device
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
        return this.device.productName as string
    }

    get serialNumber(): string {
        return this.device.serialNumber as string
    }

    open() {

        for (let configuration of this.device.configurations) {
            for (let usbInterface of configuration.interfaces) {

                console.log(`Interface ${usbInterface.interfaceNumber} (Claimed: ${usbInterface.claimed}`)
                for (let alternate of usbInterface.alternates) {
                    console.log(`\tAlternate ${alternate.alternateSetting} ${alternate.interfaceName} Class ${alternate.interfaceClass} Subclass ${alternate.interfaceSubclass} Protocol ${alternate.interfaceProtocol}`)
                }
            }
        }
    }
}