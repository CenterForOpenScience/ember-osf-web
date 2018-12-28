import { action } from '@ember-decorators/object';
import { service } from '@ember-decorators/service';
import Component from '@ember/component';
import { task } from 'ember-concurrency';
import DS from 'ember-data';
import I18N from 'ember-i18n/services/i18n';
import { QueryHasManyResult } from 'ember-osf-web/models/osf-model';
import UserEmail from 'ember-osf-web/models/user-email';
import CurrentUser from 'ember-osf-web/services/current-user';
import Toast from 'ember-toastr/services/toast';

export default class ConnectedEmails extends Component.extend({
    loadPrimaryEmail: task(function *(this: ConnectedEmails) {
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
            return this.i18n.t('settings.account.connected_emails.load_fail');
        }
    }).restartable(),

    deleteEmail: task(function *(this: ConnectedEmails, email: UserEmail) {
        const errorMessage: string = this.i18n.t('settings.account.connected_emails.delete_fail');
        const successMessage: string = this.i18n.t('settings.account.connected_emails.delete_success');

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
    }),

    updatePrimaryEmail: task(function *(this: ConnectedEmails, email: UserEmail) {
        const errorMessage: string = this.i18n.t('settings.account.connected_emails.update_fail');
        const successMessage: string = this.i18n.t('settings.account.connected_emails.update_success');

        if (!email) {
            return undefined;
        }

        email.set('primary', true);

        try {
            yield email.save();
        } catch (e) {
            return this.toast.error(errorMessage);
        }

        this.get('loadPrimaryEmail').perform();

        this.reloadAlternateList();

        return this.toast.success(successMessage);
    }),
}) {
    // Required arguments
    reloadAlternateList!: (page?: number) => void; // bound by paginated-list
    reloadUnconfirmedList!: (page?: number) => void; // bound by paginated-list

    // Private properties
    @service currentUser!: CurrentUser;
    @service store!: DS.Store;
    @service i18n!: I18N;
    @service toast!: Toast;
    userEmail!: UserEmail;
    showAddModal: boolean = false;
    showMergeModal: boolean = false;
    didValidate = false;
    lastUserEmail = '';
    modelProperties = { user: this.currentUser.user };
    alternateQueryParams = { 'filter[primary]': false, 'filter[confirmed]': true };
    unconfirmedQueryParams = { 'filter[primary]': false, 'filter[confirmed]': false };

    init() {
        super.init();
        this.loadPrimaryEmail.perform();
    }

    @action
    onSave(this: ConnectedEmails, email: UserEmail) {
        if (email.emailAddress) {
            this.set('lastUserEmail', email.emailAddress);
            this.set('showAddModal', true);
            this.reloadUnconfirmedList();
            return this.toast.success(this.i18n.t('settings.account.connected_emails.save_success'));
        }
    }
    @action
    onError<E extends Error>(this: ConnectedEmails, userEmail: UserEmail, e: E) {
        if (e instanceof DS.ConflictError) {
            userEmail.addExistingEmail();
            userEmail.validate();
        } else if (e instanceof DS.AdapterError) {
            userEmail.addInvalidEmail();
            userEmail.validate();
        } else {
            return this.toast.error(e.message);
        }
    }

    @action
    makePrimary(this: ConnectedEmails, email: UserEmail) {
        this.updatePrimaryEmail.perform(email);
    }

    @action
    resendConfirmation(this: ConnectedEmails) {
        this.toggleProperty('showMergeModal');
    }

    @action
    removeEmail(this: ConnectedEmails, email: UserEmail) {
        this.get('deleteEmail').perform(email);
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
