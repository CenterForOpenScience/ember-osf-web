import Route from '@ember/routing/route';

export default class AnalyticsPage extends Route {
    beforeModel() {
        const model = this.modelFor('overview') as any;
        this.transitionToExternal('guid-registration.analytics', model.guid);
    }
}
