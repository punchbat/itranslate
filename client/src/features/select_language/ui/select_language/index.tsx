import { useEffect, FC, Dispatch, SetStateAction } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Typography, Select, Spin, Button } from "antd";
import { SwapOutlined } from "@ant-design/icons";

import { cn } from "@utils";
import { HomePageParams, QueryLanguageKeyEnum } from "@localtypes";
import { useGetListLanguageQuery } from "@app/services/language";
import qs from "qs";

import "./index.scss";

const { Text } = Typography;
const { Option } = Select;

const b = cn("selectlanguage");

interface Props {
    sourceLanguage: string;
    setSourceLanguage: Dispatch<SetStateAction<string>>;
    targetLanguage: string;
    setTargetLanguage: Dispatch<SetStateAction<string>>;
}

const SelectLanguage: FC<Props> = ({ sourceLanguage, setSourceLanguage, targetLanguage, setTargetLanguage }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const { data, isLoading } = useGetListLanguageQuery();

    const queryObj = qs.parse(location.search.substring(1));

    useEffect(() => {
        const { sourceLanguage: querySourceLanguage, targetLanguage: queryTargetLanguage } = queryObj as HomePageParams;

        if (querySourceLanguage?.length) {
            setSourceLanguage(querySourceLanguage);
        }

        if (queryTargetLanguage?.length) {
            setTargetLanguage(queryTargetLanguage);
        }
    }, [queryObj, setSourceLanguage, setTargetLanguage]);

    const handleLanguageChange = (key: QueryLanguageKeyEnum, value: string) => {
        if (
            (key === QueryLanguageKeyEnum.SOURCE_LANGUAGE && value === targetLanguage) ||
            (key === QueryLanguageKeyEnum.TARGET_LANGUAGE && value === sourceLanguage)
        ) {
            return;
        }

        const newQueryObj = { ...queryObj, [key]: value };
        navigate({ search: qs.stringify(newQueryObj) });

        if (key === QueryLanguageKeyEnum.SOURCE_LANGUAGE) {
            setSourceLanguage(value);
        }
        if (key === QueryLanguageKeyEnum.TARGET_LANGUAGE) {
            setTargetLanguage(value);
        }
    };

    const handleSwapLanguages = () => {
        setSourceLanguage(targetLanguage);
        setTargetLanguage(sourceLanguage);
        navigate({
            search: qs.stringify({
                ...queryObj,
                sourceLanguage: targetLanguage,
                targetLanguage: sourceLanguage,
            }),
        });
    };

    const languagesMap = data?.payload || [];

    return (
        <div className={b()}>
            {isLoading ? (
                <Spin />
            ) : Object.keys(languagesMap).length ? (
                <div className={b("inner")}>
                    <Select
                        size="large"
                        showSearch
                        value={sourceLanguage}
                        style={{ width: 200 }}
                        placeholder="Select source language"
                        onChange={value => handleLanguageChange(QueryLanguageKeyEnum.SOURCE_LANGUAGE, value)}
                        optionFilterProp="children"
                        filterOption={(input, option: any) =>
                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                    >
                        {Object.entries(languagesMap).map(([short, long]) => {
                            return (
                                <Option key={short} value={short}>
                                    {long}
                                </Option>
                            );
                        })}
                    </Select>
                    <Button size="large" icon={<SwapOutlined />} onClick={handleSwapLanguages} />
                    <Select
                        size="large"
                        showSearch
                        value={targetLanguage}
                        style={{ width: 200 }}
                        placeholder="Select target language"
                        onChange={value => handleLanguageChange(QueryLanguageKeyEnum.TARGET_LANGUAGE, value)}
                        optionFilterProp="children"
                        filterOption={(input, option: any) =>
                            option.children?.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                    >
                        {Object.entries(languagesMap).map(([short, long]) => {
                            return (
                                <Option key={short} value={short}>
                                    {long}
                                </Option>
                            );
                        })}
                    </Select>
                </div>
            ) : (
                <Text>Cant find languages</Text>
            )}
        </div>
    );
};

export { SelectLanguage };
