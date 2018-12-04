import Route from '@ember/routing/route';

export default class ForksPage extends Route {
    beforeModel() {
        const model = this.modelFor('overview') as any;
        this.transitionToExternal('guid-registration.forks', model.guid);
    }
}
