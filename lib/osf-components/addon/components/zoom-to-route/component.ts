import Component from '@ember/component';
import { action, computed } from '@ember/object';
import { inject as service } from '@ember/service';
import { BufferedChangeset } from 'ember-changeset/types';
import { tracked } from 'tracked-built-ins';

import { layout } from 'ember-osf-web/decorators/component';
import buildChangeset from 'ember-osf-web/utils/build-changeset';

import template from './template';

/**
 * Component to allow easily transitioning to any route without leaving the
 * Ember app. Intended for dev use, testing routes which are not yet
 * configured to use Ember in the OSF backend.
 *
 * Displays an icon link/button that pops up a modal form.
 * @class zoom-to-route
 */
@layout(template)
export default class ZoomToRoute extends Component {
    @service router!: any;

    @tracked targetRoute?: string;

    @tracked routeArgs: { [k: string]: string } = {};
    @tracked changeset?: BufferedChangeset;

    // eslint-disable-next-line ember/no-private-routing-service
    @computed('router._router._routerMicrolib')
    get routeNames() {
        // eslint-disable-next-line ember/no-private-routing-service
        const { recognizer } = this.router._router._routerMicrolib;
        return Object.keys(recognizer.names).sort().filter(name => !/(?:^|[_.])(?:error|loading|index)$/.test(name));
    }

    // eslint-disable-next-line ember/no-private-routing-service
    @computed('router._router._routerMicrolib', 'targetRoute')
    get routeParams() {
        // eslint-disable-next-line ember/no-private-routing-service
        const { recognizer } = this.router._router._routerMicrolib;
        const handlers = recognizer.handlersFor(this.targetRoute);
        return [].concat(...handlers.mapBy('names'));
    }

    @action
    selectRoute(targetRoute: string) {
        this.setProperties({
            targetRoute,
            routeArgs: {},
        });
        const changeset = buildChangeset(this.routeArgs, null);
        this.set('changeset', changeset);
    }

    @action
    zoom(): void {
        if (this.changeset) {
            this.changeset.execute();
        }
        const routeArgs = this.routeParams.map(param => this.routeArgs[param]);
        this.router.transitionTo(this.targetRoute, ...routeArgs);
    }
}
