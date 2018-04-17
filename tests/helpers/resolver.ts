import config from 'ember-get-config';
import Resolver from 'ember-osf-web/resolver';

const resolver = Resolver.create();

const { modulePrefix, podModulePrefix } = config;

resolver.namespace = {
    modulePrefix,
    podModulePrefix,
};

export default resolver;
