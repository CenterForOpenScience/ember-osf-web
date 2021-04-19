import { ForbiddenError } from '@ember-data/adapter/error';
import { tagName } from '@ember-decorators/component';
import Component from '@ember/component';
import { action, computed } from '@ember/object';
import { alias } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import { waitFor } from '@ember/test-waiters';
import { tracked } from '@glimmer/tracking';
import { ValidationObject } from 'ember-changeset-validations';
import { validateNumber, validatePresence } from 'ember-changeset-validations/validators';
import { BufferedChangeset } from 'ember-changeset/types';
import { task } from 'ember-concurrency';
import { taskFor } from 'ember-concurrency-ts';
import config from 'ember-get-config';
import Intl from 'ember-intl/services/intl';
import Toast from 'ember-toastr/services/toast';

import User from 'ember-osf-web/models/user';
import UserEmail from 'ember-osf-web/models/user-email';
import UserSettingModel from 'ember-osf-web/models/user-setting';
import CurrentUser from 'ember-osf-web/services/current-user';
import buildChangeset from 'ember-osf-web/utils/build-changeset';
import captureException, { getApiErrorMessage } from 'ember-osf-web/utils/capture-exception';

interface SecurityValidation {
    twoFactorVerification: string;
}

@tagName('')
export default class SecurityPane extends Component {
    @service currentUser!: CurrentUser;
    @service intl!: Intl;
    @service toast!: Toast;
    @alias('currentUser.user') user!: User;
    settings?: UserSettingModel;
    primaryEmail?: UserEmail;
    changeset!: BufferedChangeset;
    showEnableWarning = false;
    showDisableWarning = false;

    @tracked showError = false;

    securityValidations: ValidationObject<SecurityValidation> = {
        twoFactorVerification: [
            validatePresence({
                presence: true,
                ignoreBlank: true,
                type: 'empty',
            }),
            validateNumber({
                allowBlank: false,
                allowNone: false,
                allowString: true,
                integer: true,
                positive: true,
                type: 'invalid',
                translationArgs: { description: this.intl.t('settings.account.security.verificationCode') },
            }),
        ],
    };

    @task
    @waitFor
    async verifySecret() {
        this.changeset.validate();
        try {
            if (this.changeset.get('isValid')) {
                await this.changeset.save({});
                this.showError = false;
            }
        } catch (e) {
            if (e instanceof ForbiddenError) {
                this.showError = true;
            } else {
                const { supportEmail } = config.support;
                const saveErrorMessage = this.intl
                    .t('settings.account.security.saveError', { supportEmail, htmlSafe: true });
                this.toast.error(saveErrorMessage);
            }
        }
    }

    @task
    @waitFor
    async loadSettings() {
        const { user } = this.currentUser;

        if (!user) {
            return;
        }
        const settings = await user.belongsTo('settings').reload();
        this.set('settings', settings);
        this.changeset = buildChangeset(settings, this.securityValidations, { skipValidate: true });
    }

    @task
    @waitFor
    async loadPrimaryEmail() {
        const { user } = this.currentUser;

        if (!user) {
            return;
        }

        const emails = await user.queryHasMany(
            'emails',
            { 'filter[primary]': true },
        );
        this.set('primaryEmail', emails.length ? emails[0] : undefined);
    }

    @task
    @waitFor
    async saveSettings() {
        try {
            if (this.settings !== undefined) {
                await this.settings.save();
            } else {
                throw Error('No settings to save.');
            }
        } catch (e) {
            const { supportEmail } = config.support;
            const errorMessage = this.intl
                .t('settings.account.security.saveError', { supportEmail, htmlSafe: true });
            captureException(e, { errorMessage });
            this.toast.error(getApiErrorMessage(e), errorMessage);
        } finally {
            this.hideDialogs();
        }
    }

    init() {
        super.init();
        taskFor(this.loadSettings).perform();
        taskFor(this.loadPrimaryEmail).perform();
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
            taskFor(this.saveSettings).perform();
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
            this.settings.set('twoFactorEnabled', false);
            taskFor(this.saveSettings).perform();
        }
    }
}
