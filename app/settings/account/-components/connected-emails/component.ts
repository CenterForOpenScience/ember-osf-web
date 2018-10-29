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

        let emails: QueryHasManyResult<UserEmail>;

        if (!user) {
            return undefined;
        }
        try {
            emails = yield user.queryHasMany('emails', { 'filter[primary]': true });
            return emails.length ? emails[0] : undefined;
        } catch (e) {
            return this.i18n.t('settings.account.connectedEmails.loadFail');
        }
    }).restartable(),

    submitEmail: task(function *(this: ConnectedEmails) {
        const userEmail = this.get('userEmail');
        const successMessage: string = this.i18n.t('settings.account.connectedEmails.saveSuccess');

        if (!userEmail) {
            return undefined;
        }

        const { validations } = yield this.userEmail.validate();
        this.set('didValidate', true);

        if (!validations.isValid) {
            return;
        }

        try {
            yield userEmail.save();
        } catch (e) {
            if (e instanceof DS.ConflictError) {
                this.userEmail.addExistingEmail();
                yield this.userEmail.validate();
            }
            return;
        }
        this.set('lastUserEmail', userEmail.emailAddress);
        this.toggleModal();
        this.reloadUnconfirmedList();
        this.set('userEmail', this.store.createRecord('user-email', { user: this.currentUser.user }));
        this.set('didValidate', false);
        return this.toast.success(successMessage);
    }),

    deleteEmail: task(function *(this: ConnectedEmails, email: UserEmail) {
        const errorMessage: string = this.i18n.t('settings.account.connectedEmails.deleteFail');
        const successMessage: string = this.i18n.t('settings.account.connectedEmails.deleteSuccess');

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

    updateEmail: task(function *(this: ConnectedEmails, email: UserEmail) {
        const errorMessage: string = this.i18n.t('settings.account.connectedEmails.updateFail');
        const successMessage: string = this.i18n.t('settings.account.connectedEmails.updateSuccess');

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
    didValidate = false;

    @service currentUser!: CurrentUser;
    @service store!: DS.Store;
    @service i18n!: I18N;
    @service toast!: Toast;

    userEmail!: UserEmail;
    lastUserEmail = '';

    modalShown: boolean = false;
    reloadAlternateList!: (page?: number) => void; // bound by paginated-list
    reloadUnconfirmedList!: (page?: number) => void; // bound by paginated-list

    alternateQueryParams = { 'filter[primary]': false, 'filter[confirmed]': true };
    unconfirmedQueryParams = { 'filter[primary]': false, 'filter[confirmed]': false };

    init(this: ConnectedEmails) {
        super.init();
        this.set('userEmail', this.store.createRecord('user-email', { user: this.currentUser.user }));
        this.get('loadPrimaryEmail').perform();
    }

    @action
    submit(this: ConnectedEmails) {
        this.get('submitEmail').perform();
    }

    @action
    makePrimary(this: ConnectedEmails, email: UserEmail) {
        this.get('updateEmail').perform(email);
    }

    @action
    resendConfirmation(this: ConnectedEmails) {
        return true;
    }

    @action
    removeEmail(this: ConnectedEmails, email: UserEmail) {
        this.get('deleteEmail').perform(email);
    }

    @action
    toggleModal(this: ConnectedEmails) {
        this.toggleProperty('modalShown');
    }
}
