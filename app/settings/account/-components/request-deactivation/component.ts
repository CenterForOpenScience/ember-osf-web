import { tagName } from '@ember-decorators/component';
import Component from '@ember/component';
import { action } from '@ember/object';
import { alias } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import { task } from 'ember-concurrency-decorators';
import config from 'ember-get-config';
import Intl from 'ember-intl/services/intl';
import Toast from 'ember-toastr/services/toast';

import User from 'ember-osf-web/models/user';
import UserSettingModel from 'ember-osf-web/models/user-setting';
import CurrentUser from 'ember-osf-web/services/current-user';
import captureException, { getApiErrorMessage } from 'ember-osf-web/utils/capture-exception';

@tagName('')
export default class DeactivationPane extends Component {
    @service currentUser!: CurrentUser;
    @service intl!: Intl;
    @service toast!: Toast;
    @alias('currentUser.user') user!: User;
    settings?: UserSettingModel;
    showRequestDialog = false;
    showUndoDialog = false;

    @task
    loadSettings = task(function *(this: DeactivationPane) {
        const { user } = this.currentUser;

        if (!user) {
            return;
        }
        this.settings = yield user.belongsTo('settings').reload();
    });

    @task
    saveSettings = task(function *(this: DeactivationPane, successMessage: string) {
        try {
            if (this.settings !== undefined) {
                yield this.settings.save();
                return this.toast.success(successMessage);
            }
            throw Error('No settings to save.');
        } catch (e) {
            const { supportEmail } = config.support;
            const saveErrorMessage = this.intl
                .t('settings.account.security.saveError', { supportEmail, htmlSafe: true });
            captureException(e);
            return this.toast.error(getApiErrorMessage(e), saveErrorMessage);
        }
    });

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
                this.intl.t('settings.account.deactivation.confirmationToastMessage'),
            );
        }
    }

    @action
    async confirmUndoDeactivation() {
        this.set('showUndoDialog', false);
        if (this.settings !== undefined) {
            this.settings.set('deactivationRequested', false);
            this.saveSettings.perform(
                this.intl.t('settings.account.deactivation.undoRequestToastMessage'),
            );
        }
    }

    @action
    closeDialogs() {
        this.set('showRequestDialog', false);
        this.set('showUndoDialog', false);
    }
}
