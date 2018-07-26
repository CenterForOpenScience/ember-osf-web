import config from 'ember-get-config';
import ApplicationSerializer from './application';

const { OSF: { apiUrl } } = config;

export default ApplicationSerializer.extend({
    links(model) {
        return {
            users: {
                related: {
                    href: `${apiUrl}/v2/users/${model.users.id}/`,
                    meta: {},
                },
            },
            node: {
                related: {
                    href: `${apiUrl}/v2/nodes/${model.node.id}`,
                    meta: {},
                },
            },
        };
    },
});
