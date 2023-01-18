import JSONAPIAdapter from '@ember-data/adapter/json-api';
import DS from 'ember-data';
import ModelRegistry from 'ember-data/types/registries/model';
import config from 'ember-get-config';

const { support: { supportEmail } } = config;

export default class CrossrefAdapter extends JSONAPIAdapter {
    host = 'https://api.crossref.org';

    get headers() {
        return {
            Accept: '*/*',
        };
    }

    query(_: any, __: any, q: any) {
        return super.query(_, __, { ...q, mailto: supportEmail });
    }

    buildURL<K extends keyof ModelRegistry>(
        modelName?: K,
        id?: string | null,
        snapshot?: DS.Snapshot<K> | null,
        requestType?: string,
        query?: {},
    ): string {
        const url = super.buildURL(modelName, id, snapshot, requestType, query);
        return url;
    }
}
