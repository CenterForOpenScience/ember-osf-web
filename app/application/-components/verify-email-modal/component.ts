import Component from '@ember/component';
import { action, computed } from '@ember/object';
import { alias, or } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import { timeout } from 'ember-concurrency';
import { task } from 'ember-concurrency-decorators';
import DS from 'ember-data';
import Intl from 'ember-intl/services/intl';
import Toast from 'ember-toastr/services/toast';

import UserEmail from 'ember-osf-web/models/user-email';
import CurrentUser from 'ember-osf-web/services/current-user';
import captureException, { getApiErrorMessage } from 'ember-osf-web/utils/capture-exception';

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

export default class VerifyEmailModal extends Component {
    @service currentUser!: CurrentUser;
    @service intl!: Intl;
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

    @task
    loadEmailsTask = task(function *(this: VerifyEmailModal) {
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
    });

    @task({ drop: true })
    verifyTask = task(function *(this: VerifyEmailModal, emailAction: EmailActions) {
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

            this.toast[successMessageLevel](
                this.intl.t(
                    this.translationKeys[successKey],
                    { email: userEmail.emailAddress, htmlSafe: true },
                ),
            );

            // Close the modal and open another one (if needed) because it's confusing for the text to change in place
            this.set('shouldShowModal', false);
            yield timeout(300);
            this.set('shouldShowModal', true);
        } catch (e) {
            const errorMessage = this.intl.t(
                this.translationKeys[errorKey],
                { email: userEmail.emailAddress, htmlSafe: true },
            );
            captureException(e, { errorMessage });
            this.toast.error(getApiErrorMessage(e), errorMessage);
            throw e;
        }
    });

    constructor(...args: any[]) {
        super(...args);
        this.loadEmailsTask.perform();
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
