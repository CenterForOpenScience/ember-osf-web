import Route from '@ember/routing/route';

export default class EditableFieldRoute extends Route {
    model() {
        return this.store.findRecord('registration', 'editj');
    }
}
