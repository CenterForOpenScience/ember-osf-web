import Component from '@ember/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { task } from 'ember-concurrency-decorators';
import DS from 'ember-data';
import Intl from 'ember-intl/services/intl';
import Toast from 'ember-toastr/services/toast';

import { QueryHasManyResult } from 'ember-osf-web/models/osf-model';
import UserEmail from 'ember-osf-web/models/user-email';
import CurrentUser from 'ember-osf-web/services/current-user';
import captureException, { getApiErrorMessage } from 'ember-osf-web/utils/capture-exception';

import { ChangesetDef } from 'ember-changeset/types';
import getHref from 'ember-osf-web/utils/get-href';

export default class ConnectedEmails extends Component {
    // Private properties
    @service currentUser!: CurrentUser;
    @service store!: DS.Store;
    @service intl!: Intl;
    @service toast!: Toast;
    userEmail!: UserEmail;
    showAddModal = false;
    showMergeModal = false;
    didValidate = false;
    lastUserEmail = '';
    modelProperties = { user: this.currentUser.user };
    reloadAlternateList!: (page?: number) => void; // bound by paginated-list
    reloadUnconfirmedList!: (page?: number) => void; // bound by paginated-list
    alternateQueryParams = { 'filter[primary]': false, 'filter[confirmed]': true };
    unconfirmedQueryParams = { 'filter[primary]': false, 'filter[confirmed]': false };

    @task({ restartable: true })
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

    @task
    deleteEmail = task(function *(this: ConnectedEmails, email: UserEmail) {
        const errorMessage = this.intl.t('settings.account.connected_emails.delete_fail');
        const successMessage = this.intl.t('settings.account.connected_emails.delete_success');

        if (!email) {
            return undefined;
        }

        try {
            yield email.destroyRecord();
        } catch (e) {
            return this.toast.error(errorMessage);
        }
        if (email.isConfirmed) {
            this.reloadAlternateList();
        } else {
            this.reloadUnconfirmedList();
        }
        return this.toast.success(successMessage);
    });

    @task
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
            captureException(e);
            return this.toast.error(getApiErrorMessage(e) || errorMessage);
        }

        this.get('loadPrimaryEmail').perform();

        this.reloadAlternateList();

        return this.toast.success(successMessage);
    });

    @task
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
            return this.toast.error(errorMessage);
        }

        return this.toast.success(successMessage);
    });

    init() {
        super.init();
        this.loadPrimaryEmail.perform();
    }

    @action
    onSave(changeset: ChangesetDef & UserEmail) {
        if (changeset.get('emailAddress')) {
            this.set('lastUserEmail', changeset.get('emailAddress'));
            this.set('showAddModal', true);
            this.reloadUnconfirmedList();

            this.toast.success(this.intl.t('settings.account.connected_emails.save_success'));
        }
    }
    @action
    onError(e: DS.AdapterError | Error, changeset: ChangesetDef & UserEmail) {
        if (e instanceof DS.ConflictError) {
            const emailSet = changeset.get('existingEmails');
            emailSet.add(changeset.get('emailAddress'));
            changeset.validate();
        } else if (e instanceof DS.AdapterError) {
            const emailSet = changeset.get('invalidEmails');
            emailSet.add(changeset.get('emailAddress'));
            changeset.validate();
        } else {
            this.toast.error(e.message);
        }
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
