import { tagName } from '@ember-decorators/component';
import { action } from '@ember-decorators/object';
import { alias } from '@ember-decorators/object/computed';
import { service } from '@ember-decorators/service';
import Component from '@ember/component';
import { task } from 'ember-concurrency';
import config from 'ember-get-config';
import I18N from 'ember-i18n/services/i18n';
import Toast from 'ember-toastr/services/toast';

import User from 'ember-osf-web/models/user';
import UserSettingModel from 'ember-osf-web/models/user-setting';
import CurrentUser from 'ember-osf-web/services/current-user';

@tagName('')
export default class DeactivationPane extends Component.extend({
    loadSettings: task(function *(this: DeactivationPane) {
        const { user } = this.currentUser;

        if (!user) {
            return;
        }
        this.settings = yield user.belongsTo('settings').reload();
    }),

    saveSettings: task(function *(this: DeactivationPane, successMessage: string) {
        try {
            if (this.settings !== undefined) {
                yield this.settings.save();
                return this.toast.success(successMessage);
            }
            throw Error('No settings to save.');
        } catch (e) {
            const { supportEmail } = config.support;
            const saveErrorMessage = this.i18n.t('settings.account.security.saveError', { supportEmail });
            return this.toast.error(saveErrorMessage);
        }
    }),
}) {
    @service currentUser!: CurrentUser;
    @service i18n!: I18N;
    @service toast!: Toast;
    @alias('currentUser.user') user!: User;
    settings?: UserSettingModel;
    showRequestDialog = false;
    showUndoDialog = false;

    init() {
        super.init();
        this.loadSettings.perform();
    }

    @action
    async confirmRequestDeactivation() {
        this.set('showRequestDialog', false);
        if (this.settings !== undefined) {
            this.settings.set('deactivationRequested', true);
            this.saveSettings.perform(
                this.i18n.t('settings.account.deactivation.confirmationToastMessage'),
            );
        }
    }

    @action
    async confirmUndoDeactivation() {
        this.set('showUndoDialog', false);
        if (this.settings !== undefined) {
            this.settings.set('deactivationRequested', false);
            this.saveSettings.perform(
                this.i18n.t('settings.account.deactivation.undoRequestToastMessage'),
            );
        }
    }

    @action
    closeDialogs() {
        this.set('showRequestDialog', false);
        this.set('showUndoDialog', false);
    }
}
