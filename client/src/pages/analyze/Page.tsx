import { useState, useCallback, FC, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Input, Typography, Spin, Button, DatePicker, TimeRangePickerProps, Slider, Table } from "antd";
import { ColumnsType } from "antd/es/table";
import { ISensorData } from "@localtypes";

import { cn } from "@utils";
import { FilterInput, useGetListSensorDataQuery } from "@app/services/sensor-data";
import { SearchOutlined, UpOutlined, DownOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import qs from "qs";

import "./Page.scss";

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

const b = cn("analyze");

interface Filter {
    tab?: string;
    search?: string;
    temperatureRange?: [number | undefined, number | undefined];
    humidityRange?: [number | undefined, number | undefined];
    co2Range?: [number | undefined, number | undefined];
    createdAtRange?: [string | undefined, string | undefined];
    updatedAtRange?: [string | undefined, string | undefined];
}

const rangePresets: TimeRangePickerProps["presets"] = [
    { label: "Now", value: [dayjs(), dayjs().endOf("day")] },
    { label: "Last 7 Days", value: [dayjs().add(-7, "d"), dayjs()] },
    { label: "Last 14 Days", value: [dayjs().add(-14, "d"), dayjs()] },
    { label: "Last 30 Days", value: [dayjs().add(-30, "d"), dayjs()] },
    { label: "Last 90 Days", value: [dayjs().add(-90, "d"), dayjs()] },
];

const Analyze: FC = function () {
    const navigate = useNavigate();
    const location = useLocation();

    const queryObj = qs.parse(location.search.substring(1));
    const { tab } = queryObj as {
        tab: string;
    };
    const {
        search,
        temperatureFrom,
        temperatureTo,
        humidityFrom,
        humidityTo,
        co2From,
        co2To,
        createdAtFrom,
        createdAtTo,
        updatedAtFrom,
        updatedAtTo,
    } = queryObj as FilterInput;

    const { data, isLoading, refetch } = useGetListSensorDataQuery({
        search,
        temperatureFrom,
        temperatureTo,
        humidityFrom,
        humidityTo,
        co2From,
        co2To,
        createdAtFrom: createdAtFrom && dayjs(createdAtFrom).toISOString(),
        createdAtTo: createdAtTo && dayjs(createdAtTo).toISOString(),
        updatedAtFrom: updatedAtFrom && dayjs(updatedAtFrom).toISOString(),
        updatedAtTo: updatedAtTo && dayjs(updatedAtTo).toISOString(),
    });

    const dataSource = data?.payload.map(i => ({ ...i, key: i.id }));

    const column = useMemo<ColumnsType<ISensorData>>(
        () =>
            [
                {
                    title: "ID",
                    dataIndex: "id",
                    key: "id",
                },
                {
                    title: "Sensor ID",
                    dataIndex: "sensorId",
                    key: "sensorId",
                },
                {
                    title: "Temperature",
                    dataIndex: "temperature",
                    key: "temperature",
                },
                {
                    title: "Humidity",
                    dataIndex: "humidity",
                    key: "humidity",
                },
                {
                    title: "CO2",
                    dataIndex: "CO2",
                    key: "CO2",
                },
                {
                    title: "Location",
                    render: (_, record) => {
                        return (
                            <div style={{ display: "flex", flexDirection: "column" }}>
                                <Text>latitude: {record.latitude}</Text>
                                <Text>longitude: {record.longitude}</Text>
                            </div>
                        );
                    },
                },
                {
                    title: "Created",
                    dataIndex: "createdAt",
                    key: "createdAt",
                },
            ] as ColumnsType<ISensorData>,
        [],
    );

    const [filter, setFilter] = useState<Filter>({
        search,
        temperatureRange: [temperatureFrom, temperatureTo],
        humidityRange: [humidityFrom, humidityTo],
        co2Range: [co2From, co2To],
        createdAtRange: [createdAtFrom, createdAtTo],
        updatedAtRange: [updatedAtFrom, updatedAtTo],
    });

    const [isVisibleSubFilter, setIsVisibleSubFilter] = useState<boolean>(
        !![
            temperatureFrom,
            temperatureTo,
            humidityFrom,
            humidityTo,
            co2From,
            co2To,
            createdAtFrom,
            createdAtTo,
            updatedAtFrom,
            updatedAtTo,
        ].filter(Boolean).length,
    );

    const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(null);

    const handleSearchChange = (value: Filter["search"]) => {
        if (value && value.length) {
            setFilter(prevFilter => ({
                ...prevFilter,
                search: value,
            }));
        } else {
            setFilter(prevFilter => {
                delete prevFilter.search;

                return prevFilter;
            });
        }

        if (typingTimeout) {
            clearTimeout(typingTimeout);
        }

        setTypingTimeout(
            setTimeout(() => {
                // eslint-disable-next-line @typescript-eslint/no-use-before-define
                handleApplyFilterAndRefetch(value && value.length ? { search: value } : {});
            }, 900),
        );
    };

    const handleFiltersItemChange = <K extends keyof Filter>(key: K, value: Filter[K] | number[]) => {
        if (
            (key === "createdAtRange" || key === "updatedAtRange") &&
            !(Array.isArray(value) && (value as Array<any>).filter(Boolean).length)
        ) {
            setFilter(prevFilter => {
                delete prevFilter[key];

                return prevFilter;
            });
            return;
        }

        setFilter(prevFilter => ({
            ...prevFilter,
            [key]: value,
        }));
    };

    const handleApplyFilterAndRefetch = useCallback(
        (concatFilter?: FilterInput) => {
            const localFilter = { ...filter, ...concatFilter };

            let temperatureFrom;
            let temperatureTo;
            if (localFilter.temperatureRange) {
                [temperatureFrom, temperatureTo] = localFilter.temperatureRange;
                delete localFilter.temperatureRange;
            }

            let humidityFrom;
            let humidityTo;
            if (localFilter.humidityRange) {
                [humidityFrom, humidityTo] = localFilter.humidityRange;
                delete localFilter.humidityRange;
            }

            let co2From;
            let co2To;
            if (localFilter.co2Range) {
                [co2From, co2To] = localFilter.co2Range;
                delete localFilter.co2Range;
            }

            let createdAtFrom;
            let createdAtTo;
            if (localFilter.createdAtRange) {
                [createdAtFrom, createdAtTo] = localFilter.createdAtRange;
                delete localFilter.createdAtRange;
            }

            let updatedAtFrom;
            let updatedAtTo;
            if (localFilter.updatedAtRange) {
                [updatedAtFrom, updatedAtTo] = localFilter.updatedAtRange;
                delete localFilter.updatedAtRange;
            }

            const query: FilterInput = {
                ...localFilter,
                temperatureFrom,
                temperatureTo,
                humidityFrom,
                humidityTo,
                co2From,
                co2To,
                createdAtFrom,
                createdAtTo,
                updatedAtFrom,
                updatedAtTo,
            };

            navigate({
                pathname: location.pathname,
                search: qs.stringify({ ...query, tab }),
            });

            refetch();
        },
        [filter, location.pathname, navigate, refetch, tab],
    );

    if (isLoading) {
        return <Spin />;
    }

    return (
        <div className={b()}>
            <div className={b("inner")}>
                <div className={b("title")}>
                    <Title level={1}>Air Quality Analyze</Title>
                </div>
                <div className={b("filters")}>
                    <div className={b("main")}>
                        <Input
                            placeholder="Search"
                            value={filter.search || undefined}
                            onChange={e => handleSearchChange(e.target.value)}
                        />
                    </div>
                    <div className={b("sub", isVisibleSubFilter ? ["active"] : [])}>
                        <div className={b("sub_content")}>
                            <div className={b("sub_item")}>
                                <Text>Temperature</Text>
                                <Slider
                                    range
                                    min={-20}
                                    max={50}
                                    value={
                                        filter.temperatureRange && filter.temperatureRange.every(v => v !== undefined)
                                            ? filter.temperatureRange
                                            : undefined
                                    }
                                    onChange={value => handleFiltersItemChange("temperatureRange", value)}
                                />
                            </div>
                            <div className={b("sub_item")}>
                                <Text>Humidity</Text>
                                <Slider
                                    range
                                    min={0}
                                    max={100}
                                    value={
                                        filter.humidityRange && filter.humidityRange.every(v => v !== undefined)
                                            ? filter.humidityRange
                                            : undefined
                                    }
                                    onChange={value => handleFiltersItemChange("humidityRange", value)}
                                />
                            </div>
                            <div className={b("sub_item")}>
                                <Text>CO2</Text>
                                <Slider
                                    range
                                    min={0}
                                    max={2000}
                                    value={
                                        filter.co2Range && filter.co2Range.every(v => v !== undefined)
                                            ? filter.co2Range
                                            : undefined
                                    }
                                    onChange={value => handleFiltersItemChange("co2Range", value)}
                                />
                            </div>
                            <div className={b("sub_item")}>
                                <Text>For what period</Text>
                                <RangePicker
                                    presets={rangePresets}
                                    showTime
                                    format="YYYY-MM-DD HH:mm:ss"
                                    value={
                                        filter.createdAtRange && filter.createdAtRange.filter(Boolean).length
                                            ? [dayjs(filter.createdAtRange[0]), dayjs(filter.createdAtRange[1])]
                                            : undefined
                                    }
                                    onChange={(_, dateStrings) =>
                                        handleFiltersItemChange("createdAtRange", dateStrings)
                                    }
                                    placeholder={["Created From", "Created To"]}
                                />
                            </div>
                            <div className={b("sub_item")}>
                                <Text>Updated sensor data period</Text>
                                <RangePicker
                                    presets={rangePresets}
                                    showTime
                                    format="YYYY-MM-DD HH:mm:ss"
                                    value={
                                        filter.updatedAtRange && filter.updatedAtRange.filter(Boolean).length
                                            ? [dayjs(filter.updatedAtRange[0]), dayjs(filter.updatedAtRange[1])]
                                            : undefined
                                    }
                                    onChange={(_, dateStrings) =>
                                        handleFiltersItemChange("updatedAtRange", dateStrings)
                                    }
                                    placeholder={["Updated From", "Updated To"]}
                                />
                            </div>
                        </div>
                        <div className={b("sub_submit")}>
                            <Button icon={<SearchOutlined />} onClick={() => handleApplyFilterAndRefetch()}>
                                Search
                            </Button>
                        </div>
                    </div>
                    <div className={b("sub_show")}>
                        <Button
                            type="text"
                            onClick={() => setIsVisibleSubFilter(!isVisibleSubFilter)}
                            icon={isVisibleSubFilter ? <UpOutlined /> : <DownOutlined />}
                        >
                            Add more filters
                        </Button>
                    </div>
                </div>
                <div className={b("content")}>
                    {data?.payload?.length ? (
                        <div className={b("table")}>
                            <Table columns={column} dataSource={dataSource} />
                        </div>
                    ) : (
                        <div>
                            <Text>No data</Text>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export { Analyze };
