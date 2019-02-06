import { action, computed } from '@ember-decorators/object';
import { service } from '@ember-decorators/service';
import Component from '@ember/component';

import { layout } from 'ember-osf-web/decorators/component';
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

    showModal: boolean = false;
    targetRoute?: string;

    routeArgs: { [k: string]: string } = {};

    @computed()
    get routeNames() {
        const { recognizer } = this.router._router._routerMicrolib;
        return Object.keys(recognizer.names).sort().filter(name => !/(?:^|[_.])(?:error|loading|index)$/.test(name));
    }

    @computed('targetRoute')
    get routeParams() {
        const { recognizer } = this.router._router._routerMicrolib;
        const handlers = recognizer.handlersFor(this.targetRoute);
        return [].concat(...handlers.mapBy('names'));
    }

    @action
    selectRoute(this: ZoomToRoute, targetRoute: string) {
        this.setProperties({
            targetRoute,
            routeArgs: {},
        });
    }

    @action
    zoom(this: ZoomToRoute): void {
        const routeArgs = this.routeParams.map(param => this.routeArgs[param]);
        this.router.transitionTo(this.targetRoute, ...routeArgs);
        this.set('showModal', false);
    }
}
