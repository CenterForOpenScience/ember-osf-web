import { action } from '@ember-decorators/object';
import { alias } from '@ember-decorators/object/computed';
import { service } from '@ember-decorators/service';
import Controller from '@ember/controller';
import { camelize } from '@ember/string';
import Features from 'ember-feature-flags/services/features';
import { OSFService } from 'osf-components/components/osf-navbar/component';
import config from 'registries/config/environment';

const {
    featureFlagNames: { newStyle },
} = config;

export default class Application extends Controller {
    @service features!: Features;
    @alias(`features.${camelize(newStyle)}`) newStyleEnabled!: boolean;

    activeService = OSFService.REGISTRIES;
    searchRoute = 'registries.discover';
    supportRoute = 'http://help.osf.io/m/registrations/';

    @action
    search(query: string) {
        this.transitionToRoute('discover', {
            queryParams: { query },
        });
    }
}
