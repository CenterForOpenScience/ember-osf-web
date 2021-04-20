import Model from '@ember-data/model';
import RESTSerializer from '@ember-data/serializer/rest';
import Store from '@ember-data/store';
import Ember from 'ember';
import DS from 'ember-data';

import OsfModel from 'ember-osf-web/models/osf-model';

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
        Ember.assign(data, this.serialize(snapshot, options));
    }

    normalizeSaveResponse(
        store: Store,
        primaryModelClass: Model,
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
