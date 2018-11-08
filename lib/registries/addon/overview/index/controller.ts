import { computed } from '@ember-decorators/object';
import Controller from '@ember/controller';
import { TaskInstance } from 'ember-concurrency';
import Registration from 'ember-osf-web/models/registration';

export default class Overview extends Controller {
    // Model could be a Registration from a transition or wrapped in a task
    // from the route
    model!: Registration | { taskInstance: TaskInstance<Registration> };

    @computed('model', 'model.taskInstance.value')
    get registration(): Registration {
        if (this.model instanceof Registration) {
            return this.model;
        }

        return this.model.taskInstance.value!;
    }
}
