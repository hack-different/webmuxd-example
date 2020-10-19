/* eslint-disable */
import { Writer, Reader } from 'protobufjs/minimal';


/**
 *  Direction is from Client to Server
 */
export interface DeviceConnected {
  serialNumber: string;
  vendorId: number;
  productId: number;
}

export interface DataFromDevice {
  serialNumber: string;
  data: Uint8Array;
}

export interface DataToDeviceResult {
  correlationId: string;
  success: boolean;
}

export interface DataToDevice {
  serialNumber: string;
  correlationId: string;
  data: Uint8Array;
}

export interface ServerMessage {
  deviceConnected: DeviceConnected | undefined;
  fromDevice: DataFromDevice | undefined;
  toDeviceResult: DataToDeviceResult | undefined;
}

export interface ClientMessage {
  toDevice: DataToDevice | undefined;
}

const baseDeviceConnected: object = {
  serialNumber: "",
  vendorId: 0,
  productId: 0,
};

const baseDataFromDevice: object = {
  serialNumber: "",
};

const baseDataToDeviceResult: object = {
  correlationId: "",
  success: false,
};

const baseDataToDevice: object = {
  serialNumber: "",
  correlationId: "",
};

const baseServerMessage: object = {
};

const baseClientMessage: object = {
};

export const protobufPackage = ''

export const DeviceConnected = {
  encode(message: DeviceConnected, writer: Writer = Writer.create()): Writer {
    writer.uint32(10).string(message.serialNumber);
    writer.uint32(16).int32(message.vendorId);
    writer.uint32(24).int32(message.productId);
    return writer;
  },
  decode(input: Uint8Array | Reader, length?: number): DeviceConnected {
    const reader = input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseDeviceConnected } as DeviceConnected;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.serialNumber = reader.string();
          break;
        case 2:
          message.vendorId = reader.int32();
          break;
        case 3:
          message.productId = reader.int32();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): DeviceConnected {
    const message = { ...baseDeviceConnected } as DeviceConnected;
    if (object.serialNumber !== undefined && object.serialNumber !== null) {
      message.serialNumber = String(object.serialNumber);
    } else {
      message.serialNumber = "";
    }
    if (object.vendorId !== undefined && object.vendorId !== null) {
      message.vendorId = Number(object.vendorId);
    } else {
      message.vendorId = 0;
    }
    if (object.productId !== undefined && object.productId !== null) {
      message.productId = Number(object.productId);
    } else {
      message.productId = 0;
    }
    return message;
  },
  fromPartial(object: DeepPartial<DeviceConnected>): DeviceConnected {
    const message = { ...baseDeviceConnected } as DeviceConnected;
    if (object.serialNumber !== undefined && object.serialNumber !== null) {
      message.serialNumber = object.serialNumber;
    } else {
      message.serialNumber = "";
    }
    if (object.vendorId !== undefined && object.vendorId !== null) {
      message.vendorId = object.vendorId;
    } else {
      message.vendorId = 0;
    }
    if (object.productId !== undefined && object.productId !== null) {
      message.productId = object.productId;
    } else {
      message.productId = 0;
    }
    return message;
  },
  toJSON(message: DeviceConnected): unknown {
    const obj: any = {};
    message.serialNumber !== undefined && (obj.serialNumber = message.serialNumber);
    message.vendorId !== undefined && (obj.vendorId = message.vendorId);
    message.productId !== undefined && (obj.productId = message.productId);
    return obj;
  },
};

export const DataFromDevice = {
  encode(message: DataFromDevice, writer: Writer = Writer.create()): Writer {
    writer.uint32(10).string(message.serialNumber);
    writer.uint32(18).bytes(message.data);
    return writer;
  },
  decode(input: Uint8Array | Reader, length?: number): DataFromDevice {
    const reader = input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseDataFromDevice } as DataFromDevice;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.serialNumber = reader.string();
          break;
        case 2:
          message.data = reader.bytes();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): DataFromDevice {
    const message = { ...baseDataFromDevice } as DataFromDevice;
    if (object.serialNumber !== undefined && object.serialNumber !== null) {
      message.serialNumber = String(object.serialNumber);
    } else {
      message.serialNumber = "";
    }
    if (object.data !== undefined && object.data !== null) {
      message.data = bytesFromBase64(object.data);
    }
    return message;
  },
  fromPartial(object: DeepPartial<DataFromDevice>): DataFromDevice {
    const message = { ...baseDataFromDevice } as DataFromDevice;
    if (object.serialNumber !== undefined && object.serialNumber !== null) {
      message.serialNumber = object.serialNumber;
    } else {
      message.serialNumber = "";
    }
    if (object.data !== undefined && object.data !== null) {
      message.data = object.data;
    } else {
      message.data = new Uint8Array();
    }
    return message;
  },
  toJSON(message: DataFromDevice): unknown {
    const obj: any = {};
    message.serialNumber !== undefined && (obj.serialNumber = message.serialNumber);
    message.data !== undefined && (obj.data = base64FromBytes(message.data !== undefined ? message.data : new Uint8Array()));
    return obj;
  },
};

export const DataToDeviceResult = {
  encode(message: DataToDeviceResult, writer: Writer = Writer.create()): Writer {
    writer.uint32(10).string(message.correlationId);
    writer.uint32(16).bool(message.success);
    return writer;
  },
  decode(input: Uint8Array | Reader, length?: number): DataToDeviceResult {
    const reader = input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseDataToDeviceResult } as DataToDeviceResult;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.correlationId = reader.string();
          break;
        case 2:
          message.success = reader.bool();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): DataToDeviceResult {
    const message = { ...baseDataToDeviceResult } as DataToDeviceResult;
    if (object.correlationId !== undefined && object.correlationId !== null) {
      message.correlationId = String(object.correlationId);
    } else {
      message.correlationId = "";
    }
    if (object.success !== undefined && object.success !== null) {
      message.success = Boolean(object.success);
    } else {
      message.success = false;
    }
    return message;
  },
  fromPartial(object: DeepPartial<DataToDeviceResult>): DataToDeviceResult {
    const message = { ...baseDataToDeviceResult } as DataToDeviceResult;
    if (object.correlationId !== undefined && object.correlationId !== null) {
      message.correlationId = object.correlationId;
    } else {
      message.correlationId = "";
    }
    if (object.success !== undefined && object.success !== null) {
      message.success = object.success;
    } else {
      message.success = false;
    }
    return message;
  },
  toJSON(message: DataToDeviceResult): unknown {
    const obj: any = {};
    message.correlationId !== undefined && (obj.correlationId = message.correlationId);
    message.success !== undefined && (obj.success = message.success);
    return obj;
  },
};

export const DataToDevice = {
  encode(message: DataToDevice, writer: Writer = Writer.create()): Writer {
    writer.uint32(10).string(message.serialNumber);
    writer.uint32(18).string(message.correlationId);
    writer.uint32(26).bytes(message.data);
    return writer;
  },
  decode(input: Uint8Array | Reader, length?: number): DataToDevice {
    const reader = input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseDataToDevice } as DataToDevice;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.serialNumber = reader.string();
          break;
        case 2:
          message.correlationId = reader.string();
          break;
        case 3:
          message.data = reader.bytes();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): DataToDevice {
    const message = { ...baseDataToDevice } as DataToDevice;
    if (object.serialNumber !== undefined && object.serialNumber !== null) {
      message.serialNumber = String(object.serialNumber);
    } else {
      message.serialNumber = "";
    }
    if (object.correlationId !== undefined && object.correlationId !== null) {
      message.correlationId = String(object.correlationId);
    } else {
      message.correlationId = "";
    }
    if (object.data !== undefined && object.data !== null) {
      message.data = bytesFromBase64(object.data);
    }
    return message;
  },
  fromPartial(object: DeepPartial<DataToDevice>): DataToDevice {
    const message = { ...baseDataToDevice } as DataToDevice;
    if (object.serialNumber !== undefined && object.serialNumber !== null) {
      message.serialNumber = object.serialNumber;
    } else {
      message.serialNumber = "";
    }
    if (object.correlationId !== undefined && object.correlationId !== null) {
      message.correlationId = object.correlationId;
    } else {
      message.correlationId = "";
    }
    if (object.data !== undefined && object.data !== null) {
      message.data = object.data;
    } else {
      message.data = new Uint8Array();
    }
    return message;
  },
  toJSON(message: DataToDevice): unknown {
    const obj: any = {};
    message.serialNumber !== undefined && (obj.serialNumber = message.serialNumber);
    message.correlationId !== undefined && (obj.correlationId = message.correlationId);
    message.data !== undefined && (obj.data = base64FromBytes(message.data !== undefined ? message.data : new Uint8Array()));
    return obj;
  },
};

export const ServerMessage = {
  encode(message: ServerMessage, writer: Writer = Writer.create()): Writer {
    if (message.deviceConnected !== undefined) {
      DeviceConnected.encode(message.deviceConnected, writer.uint32(10).fork()).ldelim();
    }
    if (message.fromDevice !== undefined) {
      DataFromDevice.encode(message.fromDevice, writer.uint32(18).fork()).ldelim();
    }
    if (message.toDeviceResult !== undefined) {
      DataToDeviceResult.encode(message.toDeviceResult, writer.uint32(26).fork()).ldelim();
    }
    return writer;
  },
  decode(input: Uint8Array | Reader, length?: number): ServerMessage {
    const reader = input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseServerMessage } as ServerMessage;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.deviceConnected = DeviceConnected.decode(reader, reader.uint32());
          break;
        case 2:
          message.fromDevice = DataFromDevice.decode(reader, reader.uint32());
          break;
        case 3:
          message.toDeviceResult = DataToDeviceResult.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): ServerMessage {
    const message = { ...baseServerMessage } as ServerMessage;
    if (object.deviceConnected !== undefined && object.deviceConnected !== null) {
      message.deviceConnected = DeviceConnected.fromJSON(object.deviceConnected);
    } else {
      message.deviceConnected = undefined;
    }
    if (object.fromDevice !== undefined && object.fromDevice !== null) {
      message.fromDevice = DataFromDevice.fromJSON(object.fromDevice);
    } else {
      message.fromDevice = undefined;
    }
    if (object.toDeviceResult !== undefined && object.toDeviceResult !== null) {
      message.toDeviceResult = DataToDeviceResult.fromJSON(object.toDeviceResult);
    } else {
      message.toDeviceResult = undefined;
    }
    return message;
  },
  fromPartial(object: DeepPartial<ServerMessage>): ServerMessage {
    const message = { ...baseServerMessage } as ServerMessage;
    if (object.deviceConnected !== undefined && object.deviceConnected !== null) {
      message.deviceConnected = DeviceConnected.fromPartial(object.deviceConnected);
    } else {
      message.deviceConnected = undefined;
    }
    if (object.fromDevice !== undefined && object.fromDevice !== null) {
      message.fromDevice = DataFromDevice.fromPartial(object.fromDevice);
    } else {
      message.fromDevice = undefined;
    }
    if (object.toDeviceResult !== undefined && object.toDeviceResult !== null) {
      message.toDeviceResult = DataToDeviceResult.fromPartial(object.toDeviceResult);
    } else {
      message.toDeviceResult = undefined;
    }
    return message;
  },
  toJSON(message: ServerMessage): unknown {
    const obj: any = {};
    message.deviceConnected !== undefined && (obj.deviceConnected = message.deviceConnected ? DeviceConnected.toJSON(message.deviceConnected) : undefined);
    message.fromDevice !== undefined && (obj.fromDevice = message.fromDevice ? DataFromDevice.toJSON(message.fromDevice) : undefined);
    message.toDeviceResult !== undefined && (obj.toDeviceResult = message.toDeviceResult ? DataToDeviceResult.toJSON(message.toDeviceResult) : undefined);
    return obj;
  },
};

export const ClientMessage = {
  encode(message: ClientMessage, writer: Writer = Writer.create()): Writer {
    if (message.toDevice !== undefined) {
      DataToDevice.encode(message.toDevice, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },
  decode(input: Uint8Array | Reader, length?: number): ClientMessage {
    const reader = input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseClientMessage } as ClientMessage;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.toDevice = DataToDevice.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): ClientMessage {
    const message = { ...baseClientMessage } as ClientMessage;
    if (object.toDevice !== undefined && object.toDevice !== null) {
      message.toDevice = DataToDevice.fromJSON(object.toDevice);
    } else {
      message.toDevice = undefined;
    }
    return message;
  },
  fromPartial(object: DeepPartial<ClientMessage>): ClientMessage {
    const message = { ...baseClientMessage } as ClientMessage;
    if (object.toDevice !== undefined && object.toDevice !== null) {
      message.toDevice = DataToDevice.fromPartial(object.toDevice);
    } else {
      message.toDevice = undefined;
    }
    return message;
  },
  toJSON(message: ClientMessage): unknown {
    const obj: any = {};
    message.toDevice !== undefined && (obj.toDevice = message.toDevice ? DataToDevice.toJSON(message.toDevice) : undefined);
    return obj;
  },
};

interface WindowBase64 {
  atob(b64: string): string;
  btoa(bin: string): string;
}

const windowBase64 = (globalThis as unknown as WindowBase64);
const atob = windowBase64.atob || ((b64: string) => Buffer.from(b64, 'base64').toString('binary'));
const btoa = windowBase64.btoa || ((bin: string) => Buffer.from(bin, 'binary').toString('base64'));

function bytesFromBase64(b64: string): Uint8Array {
  const bin = atob(b64);
  const arr = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; ++i) {
      arr[i] = bin.charCodeAt(i);
  }
  return arr;
}

function base64FromBytes(arr: Uint8Array): string {
  const bin: string[] = [];
  for (let i = 0; i < arr.byteLength; ++i) {
    bin.push(String.fromCharCode(arr[i]));
  }
  return btoa(bin.join(''));
}
type Builtin = Date | Function | Uint8Array | string | number | undefined;
type DeepPartial<T> = T extends Builtin
  ? T
  : T extends Array<infer U>
  ? Array<DeepPartial<U>>
  : T extends ReadonlyArray<infer U>
  ? ReadonlyArray<DeepPartial<U>>
  : T extends {}
  ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>;