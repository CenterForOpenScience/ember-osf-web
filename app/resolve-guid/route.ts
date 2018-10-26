import { action, computed } from '@ember-decorators/object';
import { service } from '@ember-decorators/service';
import Route from '@ember/routing/route';
import Transition from '@ember/routing/transition';
import { camelize } from '@ember/string';
import Ember from 'ember';
import DS from 'ember-data';
import Features from 'ember-feature-flags/services/features';
import config from 'ember-get-config';
import param from 'ember-osf-web/utils/param';

interface RouterMicroLib {
    generate(routeName: string, ...args: any[]): string;
}

interface PrivateRouter {
    _routerMicrolib: RouterMicroLib;
    _engineInfoByRoute?: Record<string, any>;
    location: Ember.EmberLocation;
}

const GUID_REGEX = /^[23456789abcdefghjkmnpqrstuvwxyz]{5}$/;

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
            return this.replaceWith('not-found');
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

        let newTransition = this.replaceWith(url);

        if (transition.queryParams && Object.keys(transition.queryParams).length > 0) {
            url = `${url}?${param(transition.queryParams)}`;

            // Hack/work around this.replaceWith including query params will result
            // in query param hooks not being fired as they technically did not change.
            // So start a transition without query params and immediately transition into the same
            // route with the updated query params.
            newTransition = this.replaceWith(url);
        }

        return newTransition;
    }

    @action
    error(error: Error, transition: Transition) {
        this.replaceWith('not-found', (transition as any).intent.url.slice(1));

        throw error;
    }
}
