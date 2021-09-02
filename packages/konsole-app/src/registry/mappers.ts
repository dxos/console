import {IQuery, IRecord, IRecordType} from "./contract";
import {IConfig} from "../hooks";
import urlJoin from "proper-url-join";
import { Resource } from "@dxos/registry-api";

export function mapRecordsTypes(records: Resource[]): IRecordType[] {
    const mapped = records.map(apiRecord => ({
        type: apiRecord.messageFqn,
        label: apiRecord.messageFqn
    }));

    return Object.values(Object.fromEntries(mapped.map(record => [record.type, record])));
}

export function mapRecords(records: Resource[], query: IQuery | undefined, config: IConfig): IRecord[] {
    if (query) {
        records = records.filter(record => record.messageFqn === query.type);
    }

    return records.map(apiRecord => ({
        cid: apiRecord.cid.toB58String(),
        created: Date.now().toString(), // apiRecord.data?.attributes?.created, TODO (marcin): Fix date unwrapping from the DTO.
        name: `${apiRecord.id.domain}:${apiRecord.id.resource}`,
        type: apiRecord.messageFqn,
        title: apiRecord.data?.attributes?.name,
        url: urlJoin(
            config.services.app.server,
            config.services.app.prefix,
            `${apiRecord.id.domain}:${apiRecord.id.resource}`)
    }));
}