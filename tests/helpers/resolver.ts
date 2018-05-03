import config from 'ember-get-config';
import Resolver from 'ember-osf-web/resolver';

const resolver = Resolver.create();

const { modulePrefix } = config;

resolver.namespace = {
    modulePrefix,
};

export default resolver;
