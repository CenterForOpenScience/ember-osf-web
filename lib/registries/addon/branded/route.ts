import { action } from '@ember/object';
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import DS from 'ember-data';

import RegistrationProviderModel from 'ember-osf-web/models/registration-provider';
import Analytics from 'ember-osf-web/services/analytics';
import MetaTags, { HeadTagDef } from 'ember-osf-web/services/meta-tags';

export default class BrandedRegistriesRoute extends Route {
    @service analytics!: Analytics;
    @service store!: DS.Store;
    @service metaTags!: MetaTags;
    headTags?: HeadTagDef[];

    model(params: { providerId: string }) {
        return this.store.findRecord('registration-provider', params.providerId, { include: 'brand' });
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

    @action
    didTransition() {
        this.analytics.trackPage();
    }
}
