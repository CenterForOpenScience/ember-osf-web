import Route from '@ember/routing/route';

export default class RegistrationFilesProviderRoute extends Route.extend({}) {
    model(params: { providerId: string }) {
        return { overview: this.modelFor('overview'), providerName: params.providerId };
    }
}
