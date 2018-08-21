import { Model, belongsTo } from 'ember-cli-mirage';
import config from 'ember-get-config';

const {
    featureFlagNames: {
        routes,
    },
} = config;

export default Model.extend({
    currentUser: belongsTo('user'),

    // Pretend all routes are flagged on
    activeFlags: Object.values(routes),
});
