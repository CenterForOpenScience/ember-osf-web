import Component from '@ember/component';
import { alias, not, or } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import PasswordStrength from 'ember-cli-password-strength/services/password-strength';
import { timeout } from 'ember-concurrency';
import { task } from 'ember-concurrency-decorators';
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

    @task
    submitTask = task(function *(this: ChangePasswordPane) {
        const errorMessage = this.intl.t('settings.account.changePassword.updateFail');
        const successMessage = this.intl.t('settings.account.changePassword.updateSuccess');
        const { validations } = yield this.userPassword.validate();
        this.set('didValidate', true);

        if (!validations.isValid) {
            return;
        }
        try {
            yield this.userPassword.save();
        } catch (e) {
            captureException(e);
            this.toast.error(getApiErrorMessage(e) || errorMessage);
            return;
        }
        this.userPassword.unloadRecord();
        this.toast.success(successMessage);
        const { timeOut, hideDuration } = window.toastr.options;
        if (typeof timeOut !== 'undefined' && typeof hideDuration !== 'undefined') {
            yield timeout(Number(timeOut) + Number(hideDuration));
        }
        this.currentUser.logout();
    });

    constructor(...args: any[]) {
        super(...args);

        // creates a fake id because ember data expects one
        const id = Math.floor(Math.random() * 1000000);
        this.userPassword = this.store.createRecord('user-password', { id });
    }
}
