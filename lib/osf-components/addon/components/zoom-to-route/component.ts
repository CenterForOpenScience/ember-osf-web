import { tagName } from '@ember-decorators/component';
import { action, computed } from '@ember-decorators/object';
import { service } from '@ember-decorators/service';
import Component from '@ember/component';
import { task, waitForQueue } from 'ember-concurrency';
import $ from 'jquery';

import layout from './template';

/**
 * Component to allow easily transitioning to any route without leaving the
 * Ember app. Intended for dev use, testing routes which are not yet
 * configured to use Ember in the OSF backend.
 *
 * Displays an icon link/button that pops up a modal form.
 * @class zoom-to-route
 */
@tagName('span')
export default class ZoomToRoute extends Component {
    layout = layout;

    @service router!: any;

    showModal: boolean = false;
    targetRoute?: string;

    routeArgs: { [k: string]: string } = {};

    setFocus = task(function *(this: ZoomToRoute, selector: string) {
        yield waitForQueue('afterRender');

        $(`#${this.modalBodyId} ${selector}`).focus();
    });

    @computed('elementId')
    get modalBodyId() {
        return `${this.elementId}-modal-body`;
    }

    @computed()
    get routeNames() {
        const { recognizer } = this.router._router._routerMicrolib;
        return Object.keys(recognizer.names).sort();
    }

    @computed('targetRoute')
    get routeParams() {
        const { recognizer } = this.router._router._routerMicrolib;
        const handlers = recognizer.handlersFor(this.targetRoute);
        return [].concat(...handlers.mapBy('names'));
    }

    @action
    modalShown(this: ZoomToRoute) {
        this.get('setFocus').perform('div.ember-power-select-trigger');
    }

    @action
    selectRoute(this: ZoomToRoute, targetRoute: string) {
        this.setProperties({
            targetRoute,
            routeArgs: {},
        });
        this.get('setFocus').perform('input.form-control');
    }

    @action
    zoom(this: ZoomToRoute): void {
        const routeArgs = this.routeParams.map(param => this.routeArgs[param]);
        this.router.transitionTo(this.targetRoute, ...routeArgs);
        this.set('showModal', false);
    }
}
