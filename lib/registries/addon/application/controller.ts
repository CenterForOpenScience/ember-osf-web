import Controller from '@ember/controller';
import { action } from '@ember/object';
import RouterService from '@ember/routing/router-service';
import { inject as service } from '@ember/service';
import Features from 'ember-feature-flags/services/features';

import { OSFService } from 'osf-components/components/osf-navbar/component';

export default class Application extends Controller {
    @service features!: Features;
    @service router!: RouterService;

    activeService = OSFService.REGISTRIES;

    @action
    search(query: string) {
        this.router.transitionTo('search', {
            queryParams: {
                q: query,
                resourceType: 'osf:Registration',
            },
        });
    }
}
