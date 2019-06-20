import Route from '@ember/routing/route';

export default class InstitutionsWidgetRoute extends Route {
    model() {
        return this.store.findRecord('node', 'lacks');
    }
}
