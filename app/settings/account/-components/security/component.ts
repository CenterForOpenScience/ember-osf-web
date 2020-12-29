import { tagName } from '@ember-decorators/component';
import Component from '@ember/component';
import { action, computed } from '@ember/object';
import { alias } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { ValidationObject } from 'ember-changeset-validations';
import { validateNumber, validatePresence } from 'ember-changeset-validations/validators';
import { ChangesetDef } from 'ember-changeset/types';
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
import buildChangeset from 'ember-osf-web/utils/build-changeset';
import captureException, { getApiErrorMessage } from 'ember-osf-web/utils/capture-exception';

interface SecurityValidation {
    twoFactorVerification: string;
}

const securityValidations: ValidationObject<SecurityValidation> = {
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
            translationArgs: { description: 'Verification code' },
        }),
    ],
};
@tagName('')
export default class SecurityPane extends Component {
    @service currentUser!: CurrentUser;
    @service intl!: Intl;
    @service toast!: Toast;
    @alias('currentUser.user') user!: User;
    settings?: UserSettingModel;
    primaryEmail?: UserEmail;
    changeset!: ChangesetDef;
    showEnableWarning = false;
    showDisableWarning = false;

    @tracked showError = false;

    @task({ withTestWaiter: true })
    loadSettings = task(function *(this: SecurityPane) {
        const { user } = this.currentUser;

        if (!user) {
            return;
        }
        const settings = yield user.belongsTo('settings').reload();
        this.set('settings', settings);
        this.changeset = buildChangeset(settings, securityValidations);
    });

    @task({ withTestWaiter: true })
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

    @task({ withTestWaiter: true })
    saveSettings = task(function *(this: SecurityPane) {
        try {
            if (this.settings !== undefined) {
                yield this.settings.save();
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
    });

    @task({ withTestWaiter: true })
    verifySecret = task(function *(this: SecurityPane) {
        this.changeset.validate();
        try {
            if (this.changeset.isValid) {
                yield this.changeset.save({});
                this.showError = false;
            }
        } catch (e) {
            if (e instanceof DS.ForbiddenError) {
                this.showError = true;
            } else {
                const { supportEmail } = config.support;
                const saveErrorMessage: string = this.intl
                    .t('settings.account.security.saveError', { supportEmail, htmlSafe: true });
                this.toast.error(saveErrorMessage);
            }
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
            this.settings.set('twoFactorEnabled', false);
            this.saveSettings.perform();
        }
    }
}
