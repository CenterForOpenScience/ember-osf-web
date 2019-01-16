import DS from 'ember-data';

import { SingleResourceDocument } from 'osf-api';

import BannerModel from 'ember-osf-web/models/banner';

import OsfSerializer from './osf-serializer';

export default class BannerSerializer extends OsfSerializer {
    normalizeSingleResponse(
        store: DS.Store,
        primaryModelClass: BannerModel,
        payload: SingleResourceDocument,
        id: string,
        requestType: string,
    ) {
        // The banner payload currently has an empty ID
        if (payload.data && payload.data.id === '') {
            payload.data.id = id; // eslint-disable-line no-param-reassign
        }
        return super.normalizeSingleResponse(store, primaryModelClass, payload, id, requestType);
    }
}

declare module 'ember-data/types/registries/serializer' {
    export default interface SerializerRegistry {
        banner: BannerSerializer;
    } // eslint-disable-line semi
}
