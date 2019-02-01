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
export default class ExportPane extends Component.extend({
    loadSettings: task(function *(this: ExportPane) {
        const { user } = this.currentUser;

        if (!user) {
            return undefined;
        }
        this.settings = yield user.belongsTo('settings').reload();
    }),
}) {
    @service currentUser!: CurrentUser;
    @service i18n!: I18N;
    @service toast!: Toast;
    @alias('currentUser.user') user!: User;
    settings?: UserSettingModel;
    showRequestDialog = false;
    toastOptions = {
        timeOut: 0,
        extendedTimeOut: 0,
        closeButton: true,
    };

    init() {
        super.init();
        this.loadSettings.perform();
    }

    @action
    async confirmRequestExport() {
        this.set('showRequestDialog', false);
        if (this.settings !== undefined) {
            await this.settings.requestExport();
            return this.toast.success(
                this.i18n.t('settings.account.export.confirmationToastMessage'),
                '',
                this.toastOptions,
            );
        }
        const { supportEmail } = config.support;
        return this.toast.error(
            this.i18n.t('settings.account.security.saveError', { supportEmail }),
            '',
            this.toastOptions,
        );
    }

    @action
    closeDialog() {
        this.set('showRequestDialog', false);
    }
}
