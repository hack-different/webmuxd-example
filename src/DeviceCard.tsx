import React, {Component} from 'react';
import Card from 'react-bootstrap/Card'
import MobileDevice from "./MobileDevice";

type DeviceCardProps = {
    device: MobileDevice,
    selected: (device: MobileDevice) => void
}

export default class DeviceCard extends Component<DeviceCardProps, {}>{
    onSelected(state: any) {
        if (this.props.selected !== undefined) {
            this.props.selected(this.props.device)
        }
    }

    render() {
        return <Card className="deviceCard">
            <Card.Title>{this.props.device.name}</Card.Title>
            <Card.Body>
                <Card.Body>{this.props.device.serialNumber}</Card.Body>
            </Card.Body>
            <Card.Link href="#" onClick={this.onSelected.bind(this)}>Select</Card.Link>
        </Card>
    }
}