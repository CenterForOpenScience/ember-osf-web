import Route from '@ember/routing/route';
import config from 'ember-get-config';
export default class BrandedRegistriesIndexRoute extends Route {
    beforeModel() {
        const params: { providerId?: string } = this.paramsFor('branded');
        if (params.providerId === config.defaultProvider) {
            return this.replaceWith('index');
        }

        return this.replaceWith('branded.discover', params.providerId);
    }
}
