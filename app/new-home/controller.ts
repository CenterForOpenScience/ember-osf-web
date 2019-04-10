import { action } from '@ember-decorators/object';
import { alias } from '@ember-decorators/object/computed';
import { service } from '@ember-decorators/service';
import Controller from '@ember/controller';
import { camelize } from '@ember/string';
import Features from 'ember-feature-flags/services/features';
import config from 'ember-get-config';

import { serviceLinks } from 'ember-osf-web/const/service-links';

const { featureFlagNames: { homePageVersionB } } = config;

export default class NewHome extends Controller {
    @service features!: Features;

    @alias(`features.${camelize(homePageVersionB)}`)
    shouldShowVersionB!: boolean;

    @action
    search(query: string) {
        const { search } = serviceLinks;
        window.location.href = `${search}?q=${query}&page=1`;
    }
}

declare module '@ember/controller' {
    interface Registry {
        'new-home': NewHome;
    }
}
