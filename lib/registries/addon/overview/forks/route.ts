import Route from '@ember/routing/route';

export default class ForksPage extends Route {
    beforeModel() {
        const { registrationId: guid } = (this.modelFor('overview') as { registrationId: string });
        this.transitionToExternal('guid-registration.forks', guid);
    }
}
