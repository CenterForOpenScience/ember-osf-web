import { action } from '@ember/object';
import RouterService from '@ember/routing/router-service';
import { inject as service } from '@ember/service';
import GuidRoute from 'ember-osf-web/resolve-guid/guid-route';
import { notFoundURL } from 'ember-osf-web/utils/clean-url';

export default class GuidNode extends GuidRoute {
    @service router!: RouterService;
    modelName(): 'node' {
        return 'node';
    }

    @action
    error() {
        this.router.transitionTo('not-found', notFoundURL(window.location.pathname));
    }

    adapterOptions() {
        return {
            query: {
                related_counts: 'forks,registrations,draft_registrations',
                include: 'root',
            },
        };
    }
}
