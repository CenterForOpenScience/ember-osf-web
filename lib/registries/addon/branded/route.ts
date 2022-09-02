import Store from '@ember-data/store';
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

import RegistrationProviderModel from 'ember-osf-web/models/registration-provider';
import MetaTags, { HeadTagDef } from 'ember-osf-web/services/meta-tags';

export default class BrandedRegistriesRoute extends Route {
    @service store!: Store;
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
}
