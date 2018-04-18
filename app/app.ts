import Application from '@ember/application';
import config from 'ember-get-config';
import loadInitializers from 'ember-load-initializers';
import Resolver from './resolver';

const { modulePrefix, podModulePrefix } = config;

const App = Application.extend({
    modulePrefix,
    podModulePrefix,

    Resolver,
});

loadInitializers(App, modulePrefix);

export default App;
