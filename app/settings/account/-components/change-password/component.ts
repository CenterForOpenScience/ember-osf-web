import Component from '@ember/component';
import { alias, not, or } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import { waitFor } from '@ember/test-waiters';
import PasswordStrength from 'ember-cli-password-strength/services/password-strength';
import { task, timeout } from 'ember-concurrency';
import DS from 'ember-data';
import Intl from 'ember-intl/services/intl';
import Toast from 'ember-toastr/services/toast';

import User from 'ember-osf-web/models/user';
import UserPassword from 'ember-osf-web/models/user-password';
import CurrentUser from 'ember-osf-web/services/current-user';
import captureException, { getApiErrorMessage } from 'ember-osf-web/utils/capture-exception';

export default class ChangePasswordPane extends Component {
    // Private properties
    @service currentUser!: CurrentUser;
    @service intl!: Intl;
    @service passwordStrength!: PasswordStrength;
    @service toast!: Toast;
    @service store!: DS.Store;

    userPassword: UserPassword;
    didValidate = false;
    @not('didValidate') didNotValidate!: boolean;

    @alias('currentUser.user') user!: User;

    @or(
        'didNotValidate',
        'userPassword.validations.attrs.newPassword.{message,isValidating}',
    )
    shouldHideStrengthBarMessage!: boolean;

    constructor(...args: any[]) {
        super(...args);

        // creates a fake id because ember data expects one
        const id = Math.floor(Math.random() * 1000000);
        this.userPassword = this.store.createRecord('user-password', { id });
    }

    @task
    @waitFor
    async submitTask() {
        const errorMessage = this.intl.t('settings.account.changePassword.updateFail');
        const successMessage = this.intl.t('settings.account.changePassword.updateSuccess');
        const { validations } = await this.userPassword.validate();
        this.set('didValidate', true);

        if (!validations.isValid) {
            return;
        }
        try {
            await this.userPassword.save();
        } catch (e) {
            captureException(e, { errorMessage });
            this.toast.error(getApiErrorMessage(e), errorMessage);
            return;
        }
        this.userPassword.unloadRecord();
        this.toast.success(successMessage);
        const { timeOut, hideDuration } = window.toastr.options;
        if (typeof timeOut !== 'undefined' && typeof hideDuration !== 'undefined') {
            await timeout(Number(timeOut) + Number(hideDuration));
        }
        this.currentUser.logout();
    }
}
