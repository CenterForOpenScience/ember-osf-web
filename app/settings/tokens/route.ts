import Route from '@ember/routing/route';

export default class SettingsTokensRoute extends Route {
    beforeModel() {
        return this.store.findAll('scope');
    }
}
