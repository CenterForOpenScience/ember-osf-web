import Controller from '@ember/controller';
import { alias } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import { camelize } from '@ember/string';
import Features from 'ember-feature-flags/services/features';
import config from 'ember-get-config';

const { featureFlagNames: { ABTesting } } = config;

export default class Home extends Controller {
    @service features!: Features;

    @alias(`features.${camelize(ABTesting.homePageHeroTextVersionB)}`)
    shouldShowVersionB!: boolean;


    registerKeyboard() {
        // TODO event listeners here
    }
}

declare module '@ember/controller' {
    interface Registry {
        home: Home;
    }
}
