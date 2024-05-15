interface IUser {
    id: string;
    email: string;
    name: string;
    surname: string;
    createdAt: string;
    updatedAt: string;
}

interface ISensor {
    id: string;
    sgid: string;
    name: string;
    description: string;
    latitude: number;
    longitude: number;
    createdAt: string;
    updatedAt: string;
}

interface ISensorData {
    id: string;
    sensorId: string;
    temperature: number;
    humidity: number;
    CO2: number;
    latitude: number;
    longitude: number;
    createdAt: string;
    updatedAt: string;
}

interface IWebsocketSensorData {
    sgid: string;
    temperature: number;
    humidity: number;
    CO2: number;
    timestamp: number;
}

export type { IUser, ISensor, ISensorData, IWebsocketSensorData };
