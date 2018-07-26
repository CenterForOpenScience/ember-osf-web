import config from 'ember-get-config';
import ApplicationSerializer from './application';

const { OSF: { apiUrl } } = config;

export default ApplicationSerializer.extend({
    links(model) {
        return {
            nodes: {
                related: {
                    href: `${apiUrl}/v2/users/${model.id}/nodes/`,
                    meta: {},
                },
            },
        };
    },
});
