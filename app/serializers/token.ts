import DS from 'ember-data';

import Token from 'ember-osf-web/models/token';
import OsfSerializer from './osf-serializer';

export default class TokenSerializer extends OsfSerializer {
    normalize(typeClass: Token, hash: any) {
        // convert `scopes` from a space-delimited string to a relationship
        const { scopes } = hash.attributes;
        let newHash = hash;
        if (scopes) {
            newHash = {
                ...hash,
                relationships: {
                    ...hash.relationships,
                    scopes: {
                        data: scopes.split(' ').map((s: string) => ({ id: s, type: 'scopes' })),
                    },
                },
            };
        }
        return super.normalize(typeClass, newHash);
    }

    serializeHasMany(snapshot: DS.Snapshot, json: any, relationship: any) {
        // convert `scopes` from a relationship to a space-delimited string
        const { key } = relationship;
        if (key === 'scopes') {
            const scopes = snapshot.hasMany('scopes');
            if (scopes) {
                // eslint-disable-next-line no-param-reassign
                json.attributes = {
                    ...json.attributes,
                    scopes: scopes.mapBy('id').join(' '),
                };
            }
        } else {
            super.serializeHasMany(snapshot, json, relationship);
        }
    }
}

declare module 'ember-data' {
    interface SerializerRegistry {
        'token': TokenSerializer;
    }
}
