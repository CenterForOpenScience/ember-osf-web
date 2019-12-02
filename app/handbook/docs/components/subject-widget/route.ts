import Route from '@ember/routing/route';

export default class SubjectWidgetDemo extends Route {
    model() {
        return this.store.findRecord('registration', 'subj');
    }
}
