import { action, computed } from '@ember/object';
import Transition from '@ember/routing/-private/transition';
import { EmberLocation } from '@ember/routing/api';
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { camelize } from '@ember/string';
import DS from 'ember-data';
import Features from 'ember-feature-flags/services/features';
import config from 'ember-get-config';

import { notFoundURL } from 'ember-osf-web/utils/clean-url';
import param from 'ember-osf-web/utils/param';
import transitionTargetURL from 'ember-osf-web/utils/transition-target-url';

interface RouterMicroLib {
    generate(routeName: string, ...args: any[]): string;
}

interface PrivateRouter {
    _routerMicrolib: RouterMicroLib;
    _engineInfoByRoute?: Record<string, any>;
    location: EmberLocation;
}

const { featureFlagNames: { routes } } = config;

export default class ResolveGuid extends Route {
    @service features!: Features;

    @service store!: DS.Store;

    _router!: PrivateRouter; // tslint:disable-line:variable-name

    @computed(`features.${camelize(routes['registries.overview'])}`)
    get routeMap(): Record<string, string> {
        return {
            file: 'guid-file',
            node: 'guid-node',
            preprint: 'guid-preprint',
            user: 'guid-user',
            registration: this.features.isEnabled(routes['registries.overview'])
                ? 'registries.overview'
                : 'guid-registration',
        };
    }

    isEngineRoute(route: string): boolean {
        return Boolean(this._router._engineInfoByRoute && route in this._router._engineInfoByRoute);
    }

    generateURL(route: string, ...args: any[]): string {
        // NOTE: The router's urlFor is skipped over here as it passes the result of generate into the location
        // implementation, which would rip out the "--PATH" which is used for routing here.
        return this._router._routerMicrolib.generate(route, ...args);
    }

    async beforeModel(transition: Transition) {
        const transitionKeys = Object.keys(transition);
        const paramsKey = transitionKeys.filter(key => key.match(/^__PARAMS__/))[0];

        const params = Object.assign(
            { guid: '', path: '' },
            ...Object.values(transition[paramsKey]),
        );

        let expanded: string;

        // If guid is an engine route, transition into it
        if (this.isEngineRoute(params.guid)) {
            expanded = this.generateURL(params.guid);
        } else {
            const guid = await this.store.findRecord('guid', params.guid);

            if (!guid.referentType || !(guid.referentType in this.routeMap)) {
                throw new Error(`Unknown GUID referentType: ${guid.referentType}`);
            }

            expanded = this.generateURL(this.routeMap[guid.referentType], params.guid);
        }

        let url = expanded;

        if (params.path) {
            url = `${url}/${params.path}`;
        }

        const qpsKey = transitionKeys.filter(key => key.match(/^__QPS__/))[0];
        const stateKey = transitionKeys.filter(key => key.match(/^__STATE__/))[0];
        if (transition[qpsKey] && Object.keys(transition[qpsKey]).length > 0) {
            // Remove query params from the existing transition's
            // state to force query param change hooks to fire.
            // The previous solution appears to have run into a
            // bug with how Ember handles queryParams only transitions.
            // The previous solution was to transition into the target
            // route without the QPs added and then again with the QPs.
            // eslint-disable-next-line no-param-reassign
            (transition[stateKey] as { queryParams: {} }).queryParams = {};

            url = `${url}?${param(transition[qpsKey])}`;
        }

        return this.replaceWith(url);
    }

    @action
    error(error: Error, transition: Transition) {
        this.replaceWith('not-found', notFoundURL(transitionTargetURL(transition)));

        throw error;
    }
}
