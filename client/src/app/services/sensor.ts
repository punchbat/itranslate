import { createApi } from "@reduxjs/toolkit/query/react";
import { ISensor, SuccessResponse } from "@localtypes";
import { baseQuery } from "./base";

export type SensorReponse = SuccessResponse<ISensor>;

export type SensorsReponse = SuccessResponse<Array<ISensor>>;

// * REQUESTS

export const sensorApi = createApi({
    reducerPath: "sensorApi",
    baseQuery,
    endpoints: builder => ({
        getListSensor: builder.query<SensorsReponse, void>({
            query: () => ({
                url: "/api/sensor/v1/list",
                method: "GET",
            }),
        }),
        getSensorBySGID: builder.query<SensorReponse, string>({
            query: (sgid: string) => `/api/sensor/v1/sensor/${sgid}`,
        }),
    }),
});

export const { useGetListSensorQuery, useGetSensorBySGIDQuery } = sensorApi;
