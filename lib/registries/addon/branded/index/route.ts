import Route from '@ember/routing/route';

export default class BrandedRegistriesIndexRoute extends Route {
    beforeModel() {
        const params: { providerId?: string } = this.paramsFor('branded');
        return this.replaceWith('branded.discover', params.providerId);
    }
}
