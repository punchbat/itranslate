/* eslint-disable jsx-a11y/anchor-is-valid */
import { useState, useEffect, FC } from "react";
import { Typography, Spin } from "antd";
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis } from "recharts";
import { IWebsocketSensorData } from "@localtypes";
import { format } from "date-fns";
import { cn } from "@utils";
import { useGetListSensorQuery } from "@app/services/sensor";

import "./Page.scss";

const { Title, Text } = Typography;

const b = cn("home");

const WebSocketURL = "ws://localhost:8000/api/sensor-data/v1/ws";
const MAX_DATA_POINTS = 50; // Максимальное количество точек данных для каждого сенсора

const Home: FC = function () {
    const [dataMap, setDataMap] = useState<Record<string, Array<IWebsocketSensorData>>>({});

    const { data: dataSensors, isLoading } = useGetListSensorQuery();

    useEffect(() => {
        const ws = new WebSocket(WebSocketURL);

        ws.onopen = () => {
            console.log("WebSocket Connected");
        };

        ws.onmessage = (event: { data: string }) => {
            console.log("Message from server ", event.data);
            if (event.data === "ping") {
                return;
            }

            try {
                let newData = JSON.parse(event.data);
                if (typeof newData === "string") {
                    newData = JSON.parse(newData);

                    if (typeof newData === "string") {
                        newData = JSON.parse(newData);
                    }
                }
                const timestamp = new Date().getTime();
                const dataWithTimestamp: IWebsocketSensorData = { ...newData, timestamp };
                setDataMap(currentDataMap => {
                    const currentData = currentDataMap[newData.sgid] || [];
                    const newDataArray = [...currentData, dataWithTimestamp].slice(-MAX_DATA_POINTS); // Оставляем только последние MAX_DATA_POINTS элементов

                    return {
                        ...currentDataMap,
                        [newData.sgid]: newDataArray,
                    };
                });
            } catch (e) {
                console.log(event.data, e);
            }
        };

        ws.onclose = event => {
            console.log("WebSocket Disconnected", event.reason);
        };

        ws.onerror = error => {
            console.error("WebSocket Error ", error);
        };

        return () => {
            ws.close();
        };
    }, []);

    if (isLoading) {
        return <Spin />;
    }

    return (
        <div className={b()}>
            <div className={b("inner")}>
                <div className={b("title")}>
                    <Title level={1}>Real-Time Air Quality</Title>
                </div>
                <div className={b("content")}>
                    <div className={b("items")}>
                        {dataSensors?.payload.map((sensor, index) => (
                            // eslint-disable-next-line react/no-array-index-key, @typescript-eslint/restrict-plus-operands
                            <div className={b("item")} key={sensor.id + index}>
                                <div className={b("item_title")} key={sensor.id}>
                                    <Text>
                                        sgid: {sensor.sgid}; Name: {sensor.name};
                                    </Text>
                                </div>
                                <div className={b("chart")} key={sensor.id}>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <LineChart data={dataMap[sensor.sgid]}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis
                                                dataKey="timestamp"
                                                tickFormatter={(unixTime: number | string | Date) =>
                                                    format(new Date(unixTime), "yyyy-MM-dd HH:mm:ss")
                                                }
                                            />
                                            <Tooltip />
                                            <Legend />
                                            <Line
                                                type="monotone"
                                                dataKey="temperature"
                                                stroke="#8884d8"
                                                activeDot={{ r: 8 }}
                                            />
                                            <Line type="monotone" dataKey="humidity" stroke="#82ca9d" />
                                            <Line type="monotone" dataKey="CO2" stroke="#ffc658" />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export { Home };
