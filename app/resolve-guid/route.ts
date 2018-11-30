import { action, computed } from '@ember-decorators/object';
import { service } from '@ember-decorators/service';
import Route from '@ember/routing/route';
import Transition from '@ember/routing/transition';
import { camelize } from '@ember/string';
import Ember from 'ember';
import DS from 'ember-data';
import Features from 'ember-feature-flags/services/features';
import config from 'ember-get-config';

import { GUID_REGEX } from 'ember-osf-web/const/guid-alphabet';
import param from 'ember-osf-web/utils/param';
import transitionTargetURL from 'ember-osf-web/utils/transition-target-url';

interface RouterMicroLib {
    generate(routeName: string, ...args: any[]): string;
}

interface PrivateRouter {
    _routerMicrolib: RouterMicroLib;
    _engineInfoByRoute?: Record<string, any>;
    location: Ember.EmberLocation;
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

    looksLikeGUID(guid: string): boolean {
        return GUID_REGEX.test(guid);
    }

    generateURL(route: string, ...args: any[]): string {
        // NOTE: The router's urlFor is skipped over here as it passes the result of generate into the location
        // implementation, which would rip out the "--PATH" which is used for routing here.
        return this._router._routerMicrolib.generate(route, ...args);
    }

    async beforeModel(transition: Transition) {
        const params = Object.assign(
            { guid: '', path: '' },
            ...Object.values(transition.params),
        );

        if (!this.isEngineRoute(params.guid) && !this.looksLikeGUID(params.guid)) {
            throw new Error(`Invalid GUID and no matching engine: ${params.guid}`);
        }

        let expanded: string;

        // If guid is an engine route, transition into it
        if (this.isEngineRoute(params.guid)) {
            expanded = this.generateURL(params.guid);
        } else {
            const guid = await this.store.findRecord('guid', params.guid);

            if (!(guid.referentType in this.routeMap)) {
                throw new Error(`Unknown GUID referentType: ${guid.referentType}`);
            }

            expanded = this.generateURL(this.routeMap[guid.referentType], params.guid);
        }

        let url = expanded;

        if (params.path) {
            url = `${url}/${params.path}`;
        }

        if (transition.queryParams && Object.keys(transition.queryParams).length > 0) {
            // Remove query params from the existing transition's
            // state to force query param change hooks to fire.
            // The previous solution appears to have run into a
            // bug with how Ember handles queryParams only transitions.
            // The previous solution was to transition into the target
            // route without the QPs added and then again with the QPs.
            // eslint-disable-next-line no-param-reassign
            transition.state.queryParams = {};

            url = `${url}?${param(transition.queryParams)}`;
        }

        return this.replaceWith(url);
    }

    @action
    error(error: Error, transition: Transition) {
        this.replaceWith('not-found', transitionTargetURL(transition).slice(1));

        throw error;
    }
}
