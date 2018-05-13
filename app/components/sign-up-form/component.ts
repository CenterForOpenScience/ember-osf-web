import { computed } from '@ember-decorators/object';
import { service } from '@ember-decorators/service';
import Component from '@ember/component';
import PasswordStrength from 'ember-cli-password-strength/services/password-strength';
import { task, timeout } from 'ember-concurrency';
import { localClassNames } from 'ember-osf-web/decorators/css-modules';
import UserRegistration from 'ember-osf-web/models/user-registration';
import Analytics from 'ember-osf-web/services/analytics';

@localClassNames('SignUpForm')
export default class SignUpForm extends Component {
    hasSubmitted?: boolean;
    model?: UserRegistration;

    @service passwordStrength!: PasswordStrength;
    @service analytics!: Analytics;

    strength = task(function *(this: SignUpForm, value: string) {
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
