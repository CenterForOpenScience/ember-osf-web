import config from 'ember-get-config';
import ApplicationSerializer from './application';

const { OSF: { apiUrl } } = config;


export default ApplicationSerializer.extend({
    links(model) {
        const returnValue = {
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
            registrations: {
                related: {
                    href: `${apiUrl}/v2/nodes/${model.id}/registrations/`,
                    meta: {
                        count: 10,
                    },
                },
            },
            draftRegistrations: {
                related: {
                    href: `${apiUrl}/v2/nodes/${model.id}/draft_registrations/`,
                    meta: {
                        count: 10,
                    },
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
    },
});
