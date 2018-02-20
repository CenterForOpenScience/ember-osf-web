import Application from '@ember/application';
import loadInitializers from 'ember-load-initializers';
import config from './config/environment';
import Resolver from './resolver';

const { modulePrefix, podModulePrefix } = config;

const App = Application.extend({
    modulePrefix,
    podModulePrefix,

    Resolver,
});

loadInitializers(App, modulePrefix);

export default App;
