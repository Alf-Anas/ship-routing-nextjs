import { XMarkIcon } from "@heroicons/react/24/solid";
import { AutoComplete, Spin } from "antd";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import API from "@/configs/api";
import useTermDebounce from "@/hooks/useTermDebounce";

export type DestinationProps = {
    feature?: any;
};

type Props = {
    onDelete: () => void;
    label: string;
    onSelect: (feature: any) => void;
};

export default function AddDestination({
    onDelete,
    label,
    onSelect: onSelectReturn,
}: Props) {
    const [value, setValue] = useState("");
    const [searchQuery, setSearchQuery] = useTermDebounce("");
    const [options, setOptions] = useState<{ value: string }[]>([]);

    const query = useQuery(["port", searchQuery], () =>
        API.getPort(searchQuery)
    );

    const onSelect = (data: string, option: any) => {
        setValue(data);
        onSelectReturn(option?.feature);
    };

    const onChange = (data: string) => {
        setValue(data);
        setSearchQuery(data);
    };

    useEffect(() => {
        if (!query.data && !Array.isArray(query.data?.features)) return;
        const features = query.data?.features;
        const mOptions = features.map((item: any) => {
            return { value: item?.properties?.name, feature: item };
        });
        setOptions(mOptions);
    }, [query.data]);

    return (
        <div className="flex mb-2 items-center justify-end text-start">
            <span className="mr-2 text-gray-400 text-sm">{label}</span>
            <AutoComplete
                size="middle"
                value={value}
                options={options}
                style={{ width: 180 }}
                onSelect={onSelect}
                onSearch={onChange}
                placeholder="Search port..."
            />
            <button
                className="ml-4 text-gray-100 bg-transparent hover:text-gray-900 rounded-lg text-sm w-6 h-6"
                onClick={query.isLoading ? undefined : onDelete}
            >
                {query.isLoading ? <Spin /> : <XMarkIcon />}
            </button>
        </div>
    );
}
