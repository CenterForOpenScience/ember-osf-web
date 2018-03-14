import { merge } from '@ember/polyfills';
import DS from 'ember-data';

const { RESTSerializer } = DS;

export default class UserRegistration extends RESTSerializer.extend({
    normalize({ modelName }) {
        return {
            data: {
                id: 1,
                type: modelName,
            },
        };
    },
}) {
    serializeIntoHash(data, type, record, options) {
        merge(data, this.serialize(record, options));
    }

    normalizeSaveResponse(store, primaryModelClass, payload, id, requestType) {
        const updatedPayload = {
            userRegistration: payload,
        };

        return this.normalizeSingleResponse(store, primaryModelClass, updatedPayload, id, requestType);
    }
}

declare module 'ember-data' {
    interface SerializerRegistry {
        'user-registration': UserRegistration;
    }
}
