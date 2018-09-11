import config from 'ember-get-config';
import Registration from 'ember-osf-web/models/registration';
import ApplicationSerializer, { SerializedLinks } from './application';

const { OSF: { apiUrl } } = config;

export default class RegistrationSerializer extends ApplicationSerializer {
    links(model: Registration & { attrs: any }) {
        const returnValue: SerializedLinks<Registration> = {
            linkedNodes: {
                related: {
                    href: `${apiUrl}/v2/nodes/${model.id}/linked_nodes/`,
                    meta: this.buildRelatedLinkMeta(model, 'linkedNodes'),
                },
                self: {
                    href: `${apiUrl}/v2/nodes/${model.id}/relationships/linked_nodes/`,
                    meta: {},
                },
            },
            contributors: {
                related: {
                    href: `${apiUrl}/v2/nodes/${model.id}/contributors/`,
                    meta: this.buildRelatedLinkMeta(model, 'contributors'),
                },
            },
            forks: {
                related: {
                    href: `${apiUrl}/v2/nodes/${model.id}/forks/`,
                    meta: this.buildRelatedLinkMeta(model, 'forks'),
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
