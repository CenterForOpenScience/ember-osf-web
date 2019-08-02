import { alias, not, or } from '@ember-decorators/object/computed';
import { service } from '@ember-decorators/service';
import Component from '@ember/component';
import PasswordStrength from 'ember-cli-password-strength/services/password-strength';
import { task, timeout } from 'ember-concurrency';
import DS from 'ember-data';
import I18N from 'ember-i18n/services/i18n';
import Toast from 'ember-toastr/services/toast';

import User from 'ember-osf-web/models/user';
import UserPassword from 'ember-osf-web/models/user-password';
import CurrentUser from 'ember-osf-web/services/current-user';

export default class ChangePasswordPane extends Component.extend({
    submitTask: task(function *(this: ChangePasswordPane) {
        const errorMessage = this.i18n.t('settings.account.changePassword.updateFail');
        const successMessage = this.i18n.t('settings.account.changePassword.updateSuccess');
        const { validations } = yield this.userPassword.validate();
        this.set('didValidate', true);

        if (!validations.isValid) {
            return;
        }
        try {
            yield this.userPassword.save();
        } catch (e) {
            this.toast.error(errorMessage);
            return;
        }
        this.userPassword.unloadRecord();
        this.toast.success(successMessage);
        const { timeOut, hideDuration } = window.toastr.options;
        if (typeof timeOut !== 'undefined' && typeof hideDuration !== 'undefined') {
            yield timeout(Number(timeOut) + Number(hideDuration));
        }
        this.currentUser.logout();
    }),
}) {
    // Private properties
    @service currentUser!: CurrentUser;
    @service i18n!: I18N;
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
}
