import { computed } from '@ember-decorators/object';
import Controller from '@ember/controller';

export default class GuidRegistrationController extends Controller {
    @computed('model.taskInstance.value')
    get projectId(): string {
        const registration = this.model.taskInstance.value;
        return registration ? registration.belongsTo('registeredFrom').id() : '';
    }
}
