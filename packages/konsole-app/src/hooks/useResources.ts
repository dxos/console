import { Resource } from "@dxos/registry-api";
import {useEffect, useState} from "react";
import {useRegistryClient} from "./useRegistry";

export function useResources(): Resource[] {
    const [resources, setResources] = useState<Resource[]>([]);
    const registryClient = useRegistryClient();

    useEffect(function () {
        registryClient.registry.getResources().then(setResources);
    }, []);

    return resources;
}