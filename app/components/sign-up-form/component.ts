import { computed } from '@ember-decorators/object';
import { service } from '@ember-decorators/service';
import Component from '@ember/component';
import { task, timeout } from 'ember-concurrency';
import UserRegistration from 'ember-osf-web/models/user-registration';

export default class SignUpForm extends Component {
    hasSubmitted: boolean;
    model: UserRegistration;

    @service passwordStrength;
    @service analytics;

    strength = task(function* (this: SignUpForm, value) {
        if (!value) {
            return 0;
        }

        yield timeout(250);

        return yield this.passwordStrength.strength(value);
    }).restartable();

    @computed('model.password', 'strength.lastSuccessful.value.score')
    get progress(this: SignUpForm): number {
        const { lastSuccessful } = this.get('strength');
        return this.model && this.model.password && lastSuccessful ? 1 + lastSuccessful.value.score : 0;
    }

    @computed('progress')
    get progressStyle(): string {
        switch (this.progress) {
        case 1:
        case 2:
            return 'danger';
        case 3:
            return 'warning';
        case 4:
        case 5:
            return 'success';
        default:
            return 'none';
        }
    }
}
