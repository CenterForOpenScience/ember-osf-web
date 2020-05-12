import { ModelInstance } from 'ember-cli-mirage';
import config from 'ember-get-config';
import InstitutionUserModel from 'ember-osf-web/models/institution-user';
import OsfSerializer from './osf-serializer';

const { OSF: { apiUrl } } = config;

export default class InstitutionUserSerializer extends OsfSerializer {
    buildRelationships(model: ModelInstance<InstitutionUserModel>) {
        return {
            user: {
                links: {
                    related: {
                        href: `${apiUrl}/v2/users/${model.id}`,
                    },
                },
                data: {
                    id: model.id,
                    type: 'users',
                },
            },
        };
    }
}

declare module 'ember-data/types/registries/serializer' {
    export default interface SerializerRegistry {
        'institution-user': InstitutionUserSerializer;
    } // eslint-disable-line semi
}
