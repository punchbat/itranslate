import { createApi } from "@reduxjs/toolkit/query/react";
import { ISensorData, SuccessResponse } from "@localtypes";
import { baseQuery } from "./base";

export type SensorDataReponse = SuccessResponse<ISensorData>;

export type SensorDatasReponse = SuccessResponse<Array<ISensorData>>;

// * REQUESTS
export interface FilterInput {
    search?: string;
    temperatureFrom?: number;
    temperatureTo?: number;
    humidityFrom?: number;
    humidityTo?: number;
    co2From?: number;
    co2To?: number;
    createdAtFrom?: string;
    createdAtTo?: string;
    updatedAtFrom?: string;
    updatedAtTo?: string;
}

export const sensorDataApi = createApi({
    reducerPath: "sensorDataApi",
    baseQuery,
    endpoints: builder => ({
        getListSensorData: builder.query<SensorDatasReponse, FilterInput>({
            query: (filters = {}) => ({
                url: "/api/sensor-data/v1/list",
                method: "GET",
                params: filters,
            }),
        }),
        getSensorDataByID: builder.query<SensorDataReponse, string>({
            query: (id: string) => `/api/sensor-data/v1/${id}`,
        }),
    }),
});

export const { useGetListSensorDataQuery, useGetSensorDataByIDQuery } = sensorDataApi;
