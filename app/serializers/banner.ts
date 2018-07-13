import DS from 'ember-data';

import OsfSerializer from './osf-serializer';

export default class BannerAdapter extends OsfSerializer {
    normalizeSingleResponse(
        store: DS.Store,
        primaryModelClass: any,
        payload: any,
        id: string,
        requestType: string,
    ): any {
        // The banner payload currently has an empty ID
        if (payload.data && payload.data.id === '') {
            payload.data.id = id; // eslint-disable-line no-param-reassign
        }
        return super.normalizeSingleResponse(store, primaryModelClass, payload, id, requestType);
    }
}

declare module 'ember-data' {
    interface SerializerRegistry {
        'banner': BannerAdapter;
    }
}
