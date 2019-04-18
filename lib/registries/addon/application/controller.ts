import { action } from '@ember-decorators/object';
import { alias } from '@ember-decorators/object/computed';
import { service } from '@ember-decorators/service';
import Controller from '@ember/controller';
import { camelize } from '@ember/string';
import Features from 'ember-feature-flags/services/features';
import config from 'ember-get-config';

import { OSFService } from 'osf-components/components/osf-navbar/component';

const {
    featureFlagNames: {
        routes: {
            'registries.overview': newStyleFlag,
        },
    },
} = config;

export default class Application extends Controller {
    @service features!: Features;
    @alias(`features.${camelize(newStyleFlag)}`) newStyleEnabled!: boolean;

    activeService = OSFService.REGISTRIES;
    searchRoute = 'registries.discover';
    supportRoute = 'https://openscience.zendesk.com/hc/en-us/categories/360001550953';

    @action
    search(query: string) {
        this.transitionToRoute('discover', {
            queryParams: { query },
        });
    }
}
