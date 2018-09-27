import { action, computed } from '@ember-decorators/object';
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

    activeService = OSFService.REGISTRIES;
    searchRoute = 'registries.discover';
    supportRoute = 'http://help.osf.io/m/registrations/';

    @computed(`features.${camelize(newStyle)}`)
    get newStyleEnabled(): boolean {
        return this.get('features').isEnabled(newStyle);
    }

    @action
    search(query: string) {
        this.transitionToRoute('discover', {
            queryParams: { query },
        });
    }
}
