import { merge } from '@ember/polyfills';
import DS from 'ember-data';

const { RESTSerializer } = DS;

export default class UserRegistration extends RESTSerializer.extend({
    attrs: {
        recaptchaResponse: 'g-recaptcha-response',
    },

    normalize({ modelName }: { modelName: string }) {
        return {
            data: {
                id: 1,
                type: modelName,
            },
        };
    },
}) {
    serializeIntoHash(data: any, _: any, record: any, options: any) {
        merge(data, this.serialize(record, options));
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

declare module 'ember-data' {
    interface SerializerRegistry {
        'user-registration': UserRegistration;
    }
}
