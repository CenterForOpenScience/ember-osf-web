import { tagName } from '@ember-decorators/component';
import { action } from '@ember-decorators/object';
import { alias } from '@ember-decorators/object/computed';
import { service } from '@ember-decorators/service';
import Component from '@ember/component';
import { task } from 'ember-concurrency';
import DS from 'ember-data';
import config from 'ember-get-config';
import I18N from 'ember-i18n/services/i18n';
import Toast from 'ember-toastr/services/toast';

import User from 'ember-osf-web/models/user';
import UserSettingModel from 'ember-osf-web/models/user-setting';
import CurrentUser from 'ember-osf-web/services/current-user';

@tagName('')
export default class SecurityPane extends Component.extend({
    loadSettings: task(function *(this: SecurityPane) {
        const { user } = this.currentUser;

        if (!user) {
            return undefined;
        }
        this.settings = yield user.belongsTo('settings').reload();
    }),

    saveSettings: task(function *(this: SecurityPane) {
        try {
            if (this.settings !== undefined) {
                yield this.settings.save();
            } else {
                throw Error('No settings to save.');
            }
        } catch (e) {
            if (this.settings !== undefined) {
                this.settings.rollbackAttributes();
            }
            const { supportEmail } = config.support;
            const saveErrorMessage = this.i18n.t('settings.account.security.saveError', { supportEmail });
            return this.toast.error(saveErrorMessage);
        } finally {
            this.hideDialogs();
        }
    }),
}) {
    @service currentUser!: CurrentUser;
    @service i18n!: I18N;
    @service toast!: Toast;
    @alias('currentUser.user') user!: User;
    settings?: UserSettingModel;
    showError = false;
    showEnableWarning = false;
    showDisableWarning = false;

    init() {
        super.init();
        this.loadSettings.perform();
    }

    hideDialogs() {
        this.setProperties({
            showEnableWarning: false,
            showDisableWarning: false,
        });
    }

    @action
    enableTwoFactor() {
        this.set('showError', false);
        this.set('showEnableWarning', true);
    }

    @action
    confirmEnableTwoFactor() {
        if (this.settings !== undefined) {
            this.settings.set('twoFactorEnabled', true);
            this.saveSettings.perform();
        }
    }

    @action
    disableTwoFactor() {
        this.set('showDisableWarning', true);
    }

    @action
    confirmDisableTwoFactor() {
        this.set('showError', false);
        if (this.settings !== undefined) {
            this.settings.rollbackAttributes();
            this.settings.set('twoFactorEnabled', false);
            this.saveSettings.perform();
        }
    }

    @action
    verifySecret() {
        this.set('showError', false);
    }

    @action
    verificationError(error: DS.AdapterError) {
        if (error instanceof DS.ForbiddenError) {
            this.set('showError', true);
        } else {
            const { supportEmail } = config.support;
            const saveErrorMessage: string = this.i18n.t('settings.account.security.saveError', { supportEmail });
            return this.toast.error(saveErrorMessage);
        }
    }

    @action
    destroyForm() {
        if (this.settings !== undefined) {
            this.settings.rollbackAttributes();
        }
    }
}
