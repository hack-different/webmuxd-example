import 'bootstrap/dist/css/bootstrap.min.css';
import React, {ReactElement} from 'react';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import DeviceCard from "./DeviceCard";
import MobileDevice from './MobileDevice'
import './App.css';
import RemoteChannel from "./RemoteChannel";

type AppState = {
    devices: MobileDevice[],
    alerts: ReactElement[]
}

type MobileDeviceConnection = {
    device: MobileDevice
    connection: RemoteChannel
}

export default class App extends React.Component<{}, AppState> {
    remoteChannel: RemoteChannel

    constructor(props: object) {
        super(props);

        this.state = { devices: [], alerts: [] }
        this.remoteChannel = new RemoteChannel()
    }

    componentDidMount() {
        MobileDevice.getDevices().then(devices => {
            this.setState({devices: devices})
        })
    }

    render() {
        return (
            <div className="App">
                { this.state.alerts }
                <header className="App-header">Apple Mobile Device on the Web</header>
                { MobileDevice.supported() ? this.deviceBrowser() : App.unsupportedBrowser() }
            </div>
        );
    }

    deviceBrowser() {
        let deviceList = this.state.devices.map(device => {
            return <DeviceCard device={device} key={device.serialNumber} selected={this.selectDevice.bind(this)} />
        })

        return (<div>
            {deviceList}
            <Button onClick={this.addDevice}>Add Device</Button>
        </div>)
    }

    addDevice = () => {
        let app = this;
        MobileDevice.selectDevice().then(device => {
            app.setState(state => {
                state.devices.push(device)
            })
        })
    }

    selectDevice = (device: MobileDevice) => {
        console.log(`You selected ${device.serialNumber}`)

        device.open().then(() => {
            this.remoteChannel.bindDevice(device).then(() => {
                console.log("Device bound to server")
            })
        })
    }

    showAlert = (heading: string, content: string) => {
        let element = (<Alert key={'_' + Math.random().toString(36).substr(2, 9)}>
            <Alert.Heading>Device Selected</Alert.Heading>
            <p>
                {content}
            </p>
        </Alert>)

        this.setState((state) => {
            state.alerts.push(element)
            return {alerts: state.alerts}
        })
    }

    static unsupportedBrowser() {
        return (<label>This browser does not support WebUSB</label>)
    }
}