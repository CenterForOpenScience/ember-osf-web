import { action, computed } from '@ember-decorators/object';
import { alias, or } from '@ember-decorators/object/computed';
import { service } from '@ember-decorators/service';
import Component from '@ember/component';
import { task, timeout } from 'ember-concurrency';
import DS from 'ember-data';
import I18n from 'ember-i18n/services/i18n';
import Toast from 'ember-toastr/services/toast';

import UserEmail from 'ember-osf-web/models/user-email';
import CurrentUser from 'ember-osf-web/services/current-user';

interface TranslationKeys {
    header: string;
    body: string;
    verifyButton: string;
    denyButton: string;
    verifySuccess: string;
    denySuccess: string;
    verifyError: string;
    denyError: string;
}

enum EmailActions {
    Verify = 'verify',
    Deny = 'deny',
}

type MessageLevel = 'error' | 'info' | 'success' | 'warning';

export default class VerifyEmailModal extends Component.extend({
    loadEmailsTask: task(function *(this: VerifyEmailModal) {
        const { user } = this.currentUser;
        if (user) {
            const emails: UserEmail[] = yield user.queryHasMany('emails', {
                filter: {
                    confirmed: true,
                    verified: false,
                },
            });
            this.set('unverifiedEmails', emails);
        }
    }),

    verifyTask: task(function *(this: VerifyEmailModal, emailAction: EmailActions) {
        const { userEmail } = this;
        if (!userEmail) {
            return;
        }

        let successKey: keyof TranslationKeys;
        let successMessageLevel: MessageLevel;
        let errorKey: keyof TranslationKeys;

        switch (emailAction) {
        case EmailActions.Verify:
            userEmail.set('verified', true);
            successKey = 'verifySuccess';
            successMessageLevel = 'success';
            errorKey = 'verifyError';
            break;
        case EmailActions.Deny:
            userEmail.deleteRecord();
            successKey = 'denySuccess';
            successMessageLevel = 'warning';
            errorKey = 'denyError';
            break;
        default:
            throw Error(`Action must be 'verify' or 'deny', got: ${emailAction}`);
        }

        try {
            yield userEmail.save();

            if (this.unverifiedEmails) {
                this.unverifiedEmails.shiftObject();
            }

            this.showMessage(successMessageLevel, successKey, userEmail);

            // Close the modal and open another one (if needed) because it's confusing for the text to change in place
            this.set('shouldShowModal', false);
            yield timeout(300);
            this.set('shouldShowModal', true);
        } catch (e) {
            this.showMessage('error', errorKey, userEmail);
            throw e;
        }
    }).drop(),
}) {
    @service currentUser!: CurrentUser;
    @service i18n!: I18n;
    @service store!: DS.Store;
    @service toast!: Toast;

    shouldShowModal: boolean = true;
    unverifiedEmails?: UserEmail[];

    @alias('unverifiedEmails.firstObject')
    userEmail?: UserEmail;

    @or('verifyTask.isRunning', 'denyTask.isRunning')
    disableButtons!: boolean;

    @computed('userEmail.isMerge')
    get translationKeys(): TranslationKeys {
        if (!this.userEmail || !this.userEmail.isMerge) {
            return {
                header: 'verifyEmail.add.header',
                body: 'verifyEmail.add.body',
                verifyButton: 'verifyEmail.add.verifyButton',
                denyButton: 'verifyEmail.add.denyButton',
                verifySuccess: 'verifyEmail.add.verifySuccess',
                denySuccess: 'verifyEmail.add.denySuccess',
                verifyError: 'verifyEmail.add.verifyError',
                denyError: 'verifyEmail.add.denyError',
            };
        }
        return {
            header: 'verifyEmail.merge.header',
            body: 'verifyEmail.merge.body',
            verifyButton: 'verifyEmail.merge.verifyButton',
            denyButton: 'verifyEmail.merge.denyButton',
            verifySuccess: 'verifyEmail.merge.verifySuccess',
            denySuccess: 'verifyEmail.merge.denySuccess',
            verifyError: 'verifyEmail.merge.verifyError',
            denyError: 'verifyEmail.merge.denyError',
        };
    }

    constructor(...args: any[]) {
        super(...args);
        this.loadEmailsTask.perform();
    }

    showMessage(
        level: MessageLevel,
        key: keyof TranslationKeys,
        userEmail: UserEmail,
    ) {
        this.toast[level](
            this.i18n.t(
                this.translationKeys[key],
                { email: userEmail.emailAddress },
            ),
        );
    }

    @action
    verify() {
        this.verifyTask.perform(EmailActions.Verify);
    }

    @action
    deny() {
        this.verifyTask.perform(EmailActions.Deny);
    }
}
