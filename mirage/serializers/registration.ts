import { RelationshipsFor } from 'ember-data';
import config from 'ember-get-config';
import { RelationshipLinks } from 'osf-api';

import Registration from 'ember-osf-web/models/registration';

// @ts-ignore
import ApplicationSerializer from './application';

const { OSF: { apiUrl } } = config;

type SerializedRegistrationLinks = {
    [relName in Exclude<RelationshipsFor<Registration>, 'toString'>]?: RelationshipLinks;
};

export default class RegistrationSerializer extends ApplicationSerializer {
    links(model: any) {
        const returnValue: SerializedRegistrationLinks = {
            linkedNodes: {
                related: {
                    href: `${apiUrl}/v2/nodes/${model.id}/linked_nodes/`,
                    meta: {},
                },
                self: {
                    href: `${apiUrl}/v2/nodes/${model.id}/relationships/linked_nodes/`,
                    meta: {},
                },
            },
            contributors: {
                related: {
                    href: `${apiUrl}/v2/nodes/${model.id}/contributors/`,
                    meta: {},
                },
            },
            registrationSchema: {
                related: {
                    href: `${apiUrl}/v2/schemas/registrations/${model.registrationSchema.id}`,
                    meta: {},
                },
            },
        };
        if (model.attrs.parentId !== null) {
            returnValue.parent = {
                related: {
                    href: `${apiUrl}/v2/nodes/${model.attrs.parentId}`,
                    meta: {},
                },
            };
        }
        if (model.attrs.rootId !== null) {
            returnValue.root = {
                related: {
                    href: `${apiUrl}/v2/nodes/${model.attrs.rootId}`,
                    meta: {},
                },
            };
        }
        return returnValue;
    }
}
