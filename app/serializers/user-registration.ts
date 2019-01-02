import { merge } from '@ember/polyfills';
import DS from 'ember-data';

import OsfModel from 'ember-osf-web/models/osf-model';

const { RESTSerializer } = DS;

export default class UserRegistrationSerializer extends RESTSerializer {
    attrs = {
        recaptchaResponse: 'g-recaptcha-response',
    };

    normalize(typeClass: OsfModel) {
        return {
            data: {
                id: 1,
                type: typeClass.modelName,
            },
        };
    }

    serializeIntoHash(data: {}, _: OsfModel, snapshot: DS.Snapshot, options: {}) {
        merge(data, this.serialize(snapshot, options));
    }

    normalizeSaveResponse(
        store: DS.Store,
        primaryModelClass: DS.Model,
        payload: {},
        id: string | number,
        requestType: string,
    ) {
        const updatedPayload = {
            userRegistration: payload,
        };

        return this.normalizeSingleResponse(store, primaryModelClass, updatedPayload, id, requestType);
    }
}

declare module 'ember-data/types/registries/serializer' {
    export default interface SerializerRegistry {
        'user-registration': UserRegistrationSerializer;
    } // eslint-disable-line semi
}
