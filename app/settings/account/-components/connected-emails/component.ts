import Store from '@ember-data/store';
import Component from '@ember/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { waitFor } from '@ember/test-waiters';
import { ValidationObject } from 'ember-changeset-validations';
import { validateFormat } from 'ember-changeset-validations/validators';
import { BufferedChangeset } from 'ember-changeset/types';
import { restartableTask, task } from 'ember-concurrency';
import { taskFor } from 'ember-concurrency-ts';
import Intl from 'ember-intl/services/intl';
import Toast from 'ember-toastr/services/toast';

import UserEmail from 'ember-osf-web/models/user-email';
import CurrentUser from 'ember-osf-web/services/current-user';
import buildChangeset from 'ember-osf-web/utils/build-changeset';
import captureException, { getApiErrorMessage } from 'ember-osf-web/utils/capture-exception';
import getHref from 'ember-osf-web/utils/get-href';

import config from 'ember-get';

interface EmailValidation {
    emailAddress: string;
}

export default class ConnectedEmails extends Component {
    // Private properties
    @service currentUser!: CurrentUser;
    @service store!: Store;
    @service intl!: Intl;
    @service toast!: Toast;
    showAddModal = false;
    showMergeModal = false;
    didValidate = false;
    lastUserEmail = '';
    changeset!: BufferedChangeset;
    reloadAlternateList!: (page?: number) => void; // bound by paginated-list
    reloadUnconfirmedList!: (page?: number) => void; // bound by paginated-list
    alternateQueryParams = { 'filter[primary]': false, 'filter[confirmed]': true };
    unconfirmedQueryParams = { 'filter[primary]': false, 'filter[confirmed]': false };

    emailValidations: ValidationObject<EmailValidation> = {
        emailAddress: [
            validateFormat({
                allowBlank: false,
                type: 'email',
                translationArgs: { description: this.intl.t('settings.account.connected_emails.email_address') },
            }),
        ],
    };

    @task
    @waitFor
    async onSave() {
        let newEmail;
        try {
            this.changeset.validate();
            if (this.changeset.get('isValid') && this.changeset.get('emailAddress')) {
                this.set('lastUserEmail', this.changeset.get('emailAddress'));
                newEmail = this.store.createRecord('user-email', {
                    emailAddress: this.changeset.get('emailAddress'),
                    user: this.currentUser.user,
                });
                await newEmail.save();
                this.set('showAddModal', true);
                this.reloadUnconfirmedList();
                this.toast.success(this.intl.t('settings.account.connected_emails.save_success'));
                this.changeset.set('emailAddress', '');
            }
        } catch (e) {
            if (newEmail) {
                newEmail.unloadRecord();
            }
            captureException(e);
            this.toast.error(getApiErrorMessage(e), this.intl.t('settings.account.connected_emails.save_fail'));
        }
    }

    @restartableTask
    @waitFor
    async loadPrimaryEmail() {
        const { user } = this.currentUser;

        if (!user) {
            return undefined;
        }
        try {
            const emails = await user.queryHasMany(
                'emails',
                { 'filter[primary]': true },
            );
            return emails.length ? emails[0] : undefined;
        } catch (e) {
            return this.intl.t('settings.account.connected_emails.load_fail');
        }
    }

    @task
    @waitFor
    async deleteEmail(email: UserEmail) {
        const errorMessage = this.intl.t('settings.account.connected_emails.delete_fail');
        const successMessage = this.intl.t('settings.account.connected_emails.delete_success');

        if (!email) {
            return undefined;
        }

        try {
            await email.destroyRecord();
        } catch (e) {
            captureException(e, { errorMessage });
            return this.toast.error(getApiErrorMessage(e), errorMessage);
        }
        if (email.isConfirmed) {
            this.reloadAlternateList();
        } else {
            this.reloadUnconfirmedList();
        }
        return this.toast.success(successMessage);
    }

    @task
    @waitFor
    async updatePrimaryEmail(email: UserEmail) {
        const errorMessage = this.intl.t('settings.account.connected_emails.update_fail',
            { supportEmail: config.support.supportEmail, htmlSafe: true });
        const successMessage = this.intl.t('settings.account.connected_emails.update_success');

        if (!email) {
            return undefined;
        }

        email.set('primary', true);

        try {
            await email.save();
        } catch (e) {
            captureException(e, { errorMessage });
            return this.toast.error(getApiErrorMessage(e), errorMessage);
        }

        taskFor(this.loadPrimaryEmail).perform();

        this.reloadAlternateList();

        return this.toast.success(successMessage);
    }

    @task
    @waitFor
    async resendEmail(email: UserEmail) {
        const errorMessage = this.intl.t('settings.account.connected_emails.resend_fail');
        const successMessage = this.intl.t('settings.account.connected_emails.resend_success');

        if (!email) {
            return this.toast.error(errorMessage);
        }

        const url = getHref(email.links.resend_confirmation);

        try {
            await this.currentUser.authenticatedAJAX({
                url,
                type: 'GET',
            });
        } catch (e) {
            captureException(e, { errorMessage });
            return this.toast.error(getApiErrorMessage(e), errorMessage);
        }

        return this.toast.success(successMessage);
    }

    init() {
        super.init();
        taskFor(this.loadPrimaryEmail).perform();
        this.changeset = buildChangeset({ emailAddress: '' }, this.emailValidations, { skipValidate: true });
    }

    @action
    makePrimary(email: UserEmail) {
        taskFor(this.updatePrimaryEmail).perform(email);
    }

    @action
    resendConfirmation(email: UserEmail) {
        this.toggleProperty('showMergeModal');
        taskFor(this.resendEmail).perform(email);
    }

    @action
    removeEmail(email: UserEmail) {
        taskFor(this.deleteEmail).perform(email);
    }

    @action
    toggleAddModal() {
        this.toggleProperty('showAddModal');
    }

    @action
    toggleMergeModal() {
        this.toggleProperty('showMergeModal');
    }
}
