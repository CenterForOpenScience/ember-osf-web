import Component from '@ember/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { ValidationObject } from 'ember-changeset-validations';
import { validateFormat } from 'ember-changeset-validations/validators';
import { ChangesetDef } from 'ember-changeset/types';
import { task } from 'ember-concurrency-decorators';
import DS from 'ember-data';
import Intl from 'ember-intl/services/intl';
import Toast from 'ember-toastr/services/toast';

import { QueryHasManyResult } from 'ember-osf-web/models/osf-model';
import UserEmail from 'ember-osf-web/models/user-email';
import CurrentUser from 'ember-osf-web/services/current-user';
import buildChangeset from 'ember-osf-web/utils/build-changeset';
import captureException, { getApiErrorMessage } from 'ember-osf-web/utils/capture-exception';
import getHref from 'ember-osf-web/utils/get-href';

interface EmailValidation {
    emailAddress: string;
}

export default class ConnectedEmails extends Component {
    // Private properties
    @service currentUser!: CurrentUser;
    @service store!: DS.Store;
    @service intl!: Intl;
    @service toast!: Toast;
    showAddModal = false;
    showMergeModal = false;
    didValidate = false;
    lastUserEmail = '';
    changeset!: ChangesetDef;
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

    @task({ withTestWaiter: true, restartable: true })
    loadPrimaryEmail = task(function *(this: ConnectedEmails) {
        const { user } = this.currentUser;

        if (!user) {
            return undefined;
        }
        try {
            const emails: QueryHasManyResult<UserEmail> = yield user.queryHasMany(
                'emails',
                { 'filter[primary]': true },
            );
            return emails.length ? emails[0] : undefined;
        } catch (e) {
            return this.intl.t('settings.account.connected_emails.load_fail');
        }
    });

    @task({ withTestWaiter: true })
    deleteEmail = task(function *(this: ConnectedEmails, email: UserEmail) {
        const errorMessage = this.intl.t('settings.account.connected_emails.delete_fail');
        const successMessage = this.intl.t('settings.account.connected_emails.delete_success');

        if (!email) {
            return undefined;
        }

        try {
            yield email.destroyRecord();
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
    });

    @task({ withTestWaiter: true })
    updatePrimaryEmail = task(function *(this: ConnectedEmails, email: UserEmail) {
        const errorMessage = this.intl.t('settings.account.connected_emails.update_fail');
        const successMessage = this.intl.t('settings.account.connected_emails.update_success');

        if (!email) {
            return undefined;
        }

        email.set('primary', true);

        try {
            yield email.save();
        } catch (e) {
            captureException(e, { errorMessage });
            return this.toast.error(getApiErrorMessage(e), errorMessage);
        }

        this.get('loadPrimaryEmail').perform();

        this.reloadAlternateList();

        return this.toast.success(successMessage);
    });

    @task({ withTestWaiter: true })
    resendEmail = task(function *(this: ConnectedEmails, email: UserEmail) {
        const errorMessage = this.intl.t('settings.account.connected_emails.resend_fail');
        const successMessage = this.intl.t('settings.account.connected_emails.resend_success');

        if (!email) {
            return this.toast.error(errorMessage);
        }

        const url = getHref(email.links.resend_confirmation);

        try {
            yield this.currentUser.authenticatedAJAX({
                url,
                type: 'GET',
            });
        } catch (e) {
            captureException(e, { errorMessage });
            return this.toast.error(getApiErrorMessage(e), errorMessage);
        }

        return this.toast.success(successMessage);
    });

    @task({ withTestWaiter: true })
    onSave = task(function *(this: ConnectedEmails) {
        let newEmail;
        try {
            this.changeset.validate();
            if (this.changeset.get('isValid') && this.changeset.get('emailAddress')) {
                this.set('lastUserEmail', this.changeset.get('emailAddress'));
                newEmail = yield this.store.createRecord('user-email', {
                    emailAddress: this.changeset.get('emailAddress'),
                    user: this.currentUser.user,
                });
                yield newEmail.save();
                this.set('showAddModal', true);
                this.reloadUnconfirmedList();
                this.toast.success(this.intl.t('settings.account.connected_emails.save_success'));
            }
        } catch (e) {
            if (newEmail) {
                newEmail.unloadRecord();
            }
            captureException(e);
            this.toast.error(getApiErrorMessage(e));
        }
    });

    init() {
        super.init();
        this.loadPrimaryEmail.perform();
        this.changeset = buildChangeset({ emailAddress: '' }, this.emailValidations, { skipValidate: true });
    }

    @action
    makePrimary(email: UserEmail) {
        this.updatePrimaryEmail.perform(email);
    }

    @action
    resendConfirmation(email: UserEmail) {
        this.toggleProperty('showMergeModal');
        this.resendEmail.perform(email);
    }

    @action
    removeEmail(email: UserEmail) {
        this.deleteEmail.perform(email);
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
