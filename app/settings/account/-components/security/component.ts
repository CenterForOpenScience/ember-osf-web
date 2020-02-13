import { tagName } from '@ember-decorators/component';
import Component from '@ember/component';
import { action, computed } from '@ember/object';
import { alias } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import { task } from 'ember-concurrency-decorators';
import DS from 'ember-data';
import config from 'ember-get-config';
import Intl from 'ember-intl/services/intl';
import Toast from 'ember-toastr/services/toast';

import { QueryHasManyResult } from 'ember-osf-web/models/osf-model';
import User from 'ember-osf-web/models/user';
import UserEmail from 'ember-osf-web/models/user-email';
import UserSettingModel from 'ember-osf-web/models/user-setting';
import CurrentUser from 'ember-osf-web/services/current-user';

@tagName('')
export default class SecurityPane extends Component {
    @service currentUser!: CurrentUser;
    @service intl!: Intl;
    @service toast!: Toast;
    @alias('currentUser.user') user!: User;
    settings?: UserSettingModel;
    primaryEmail?: UserEmail;
    showError = false;
    showEnableWarning = false;
    showDisableWarning = false;

    @task
    loadSettings = task(function *(this: SecurityPane) {
        const { user } = this.currentUser;

        if (!user) {
            return;
        }
        this.set('settings', yield user.belongsTo('settings').reload());
    });

    @task
    loadPrimaryEmail = task(function *(this: SecurityPane) {
        const { user } = this.currentUser;

        if (!user) {
            return;
        }

        const emails: QueryHasManyResult<UserEmail> = yield user.queryHasMany(
            'emails',
            { 'filter[primary]': true },
        );
        this.set('primaryEmail', emails.length ? emails[0] : undefined);
    });

    @task
    saveSettings = task(function *(this: SecurityPane) {
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
            const saveErrorMessage = this.intl
                .t('settings.account.security.saveError', { supportEmail, htmlSafe: true });
            this.toast.error(saveErrorMessage);
        } finally {
            this.hideDialogs();
        }
    });

    init() {
        super.init();
        this.loadSettings.perform();
        this.loadPrimaryEmail.perform();
    }

    hideDialogs() {
        this.setProperties({
            showEnableWarning: false,
            showDisableWarning: false,
        });
    }

    @computed('primaryEmail', 'settings')
    get keyUri() {
        if (this.primaryEmail && this.settings) {
            const keyUri = `otpauth://totp/OSF:${this.primaryEmail.emailAddress}?secret=${this.settings.secret}`;
            return keyUri;
        }
        return undefined;
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
            const saveErrorMessage: string = this.intl
                .t('settings.account.security.saveError', { supportEmail, htmlSafe: true });
            this.toast.error(saveErrorMessage);
        }
    }

    @action
    destroyForm() {
        if (this.settings !== undefined) {
            this.settings.rollbackAttributes();
        }
    }
}
