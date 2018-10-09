import DS from 'ember-data';

import Token from 'ember-osf-web/models/token';
import { Resource } from 'osf-api';
import OsfSerializer from './osf-serializer';

export default class TokenSerializer extends OsfSerializer {
    attrs: any = {
        // eslint-disable-next-line ember/no-attrs-in-components
        ...this.attrs, // from OsfSerializer
        scopes: {
            serialize: true, // always serialize, even when not dirty
        },

        // Because it's confusing to have both tokenId and token.id
        tokenValue: 'token_id',
    };

    normalize(typeClass: Token, hash: Resource) {
        // convert `scopes` from a space-delimited string to a relationship
        const { scopes } = hash.attributes!;
        let newHash = hash;
        if (scopes) {
            newHash = {
                ...hash,
                relationships: {
                    ...hash.relationships,
                    scopes: {
                        data: (scopes as string).split(' ').map(
                            s => ({ id: s, type: 'scopes' }),
                        ),
                    },
                },
            };
        }
        return super.normalize(typeClass, newHash);
    }

    serializeHasMany(snapshot: DS.Snapshot, json: Resource, relationship: { key: string }) {
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
