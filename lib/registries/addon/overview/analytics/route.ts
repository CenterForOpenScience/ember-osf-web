import Route from '@ember/routing/route';

export default class AnalyticsPage extends Route {
    beforeModel() {
        const { registrationId: guid } = (this.modelFor('overview') as { registrationId: string });
        this.transitionToExternal('guid-registration.analytics', guid);
    }
}
