import { service } from '@ember-decorators/service';
import Component from '@ember/component';
import { computed } from '@ember/object';
import { task, timeout } from 'ember-concurrency';
import UserRegistration from 'ember-osf-web/models/user-registration';

export default class SignUpForm extends Component.extend({
    strength: task(function* (this: SignUpForm, value) {
        if (!value) {
            return 0;
        }

        yield timeout(250);

        const passwordStrength = this.get('passwordStrength');

        return yield passwordStrength.strength(value);
    }).restartable(),
}) {
    hasSubmitted: boolean;
    model: UserRegistration;

    @service passwordStrength;
    @service analytics;

    progress = computed('model.password', 'strength.lastSuccessful.value.score', function (): number {
        return this.get('model.password') ? 1 + this.get('strength.lastSuccessful.value.score') : 0;
    });

    progressStyle = computed('progress', function (): string {
        switch (this.get('progress')) {
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
    });
}
