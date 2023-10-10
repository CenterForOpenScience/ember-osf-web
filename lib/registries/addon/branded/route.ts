import Store from '@ember-data/store';
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

import RegistrationProviderModel from 'ember-osf-web/models/registration-provider';
import MetaTags, { HeadTagDef } from 'ember-osf-web/services/meta-tags';
import { notFoundURL } from 'ember-osf-web/utils/clean-url';

export default class BrandedRegistriesRoute extends Route {
    @service store!: Store;
    @service metaTags!: MetaTags;
    headTags?: HeadTagDef[];

    async model(params: { providerId: string }) {
        try {
            return await this.store.findRecord('registration-provider', params.providerId, { include: 'brand' });
        } catch (e) {
            this.transitionTo('page-not-found', notFoundURL(window.location.pathname));
            return null;
        }
    }

    afterModel(model: RegistrationProviderModel) {
        if (model && model.assets && model.assets.favicon) {
            const headTags = [{
                type: 'link',
                attrs: {
                    rel: 'icon',
                    href: model.assets.favicon,
                },
            }];
            this.set('headTags', headTags);
        }
    }

    buildRouteInfoMetadata() {
        return {
            osfMetrics: {
                providerId: this.controller.model.id,
            },
        };
    }
}
