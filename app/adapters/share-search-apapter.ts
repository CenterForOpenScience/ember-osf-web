import JSONAPIAdapter from '@ember-data/adapter/json-api';
import DS from 'ember-data';
import ModelRegistry from 'ember-data/types/registries/model';
import config from 'ember-get-config';

const { OSF: { shareApiUrl } } = config;

export default class ShareSearchAdapter extends JSONAPIAdapter {
    host = shareApiUrl;

    get headers() {
        return {
            Accept: '*/*',
        };
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
