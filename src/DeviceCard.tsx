import React, {Component} from 'react';
import Card from 'react-bootstrap/Card'
import MobileDevice from "./MobileDevice";

type DeviceCardProps = {
    device: MobileDevice
}

export default class DeviceCard extends Component<DeviceCardProps, {}>{


    render() {
        return <Card className="deviceCard">
            <Card.Title>{this.props.device.name}</Card.Title>
            <Card.Body>
                <Card.Body>{this.props.device.serialNumber}</Card.Body>
            </Card.Body>
        </Card>
    }
}