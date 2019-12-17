import { alias } from '@ember-decorators/object/computed';
import { service } from '@ember-decorators/service';
import Controller from '@ember/controller';
import { camelize } from '@ember/string';
import Features from 'ember-feature-flags/services/features';
import config from 'ember-get-config';

const { featureFlagNames: { ABTesting } } = config;

export default class Home extends Controller {
    @service features!: Features;

    @alias(`features.${camelize(ABTesting.homePageHeroTextVersionB)}`)
    shouldShowVersionB!: boolean;
}

declare module '@ember/controller' {
    interface Registry {
        home: Home;
    }
}
