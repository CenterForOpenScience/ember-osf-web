import Component from '@ember/component';
import { computed } from '@ember/object';
import { alias } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import { task, timeout } from 'ember-concurrency';

export default class SignUpForm extends Component.extend({
    fullNameMaximum: 255,
    fullNameMinimum: 3,
    passwordMaximum: 255,
    passwordMinimum: 8,
    recaptchaValid: false,

    actions: {
        submit(this: SignUpForm) {
            // const data = {
            //     email1: this.get('emailContact'),
            //     email2: this.get('emailConfirm'),
            //     fullName: this.get('fullName'),
            //     password: this.get('password'),
            // };
        },

        setBool(field, value: boolean = true) {
            this.set(field, value);
        },
    },

    strength: task(function* (this: SignUpForm, value) {
        if (!value) {
            return 0;
        }

        yield timeout(250);

        const passwordStrength = this.get('passwordStrength');

        return yield passwordStrength.strength(value);
    }).restartable(),
}) {
    emailContact: string;
    emailConfirm: string;
    fullName: string;
    fullNameMaximum: number;
    fullNameMinimum: number;
    password: string;
    passwordMaximum: number;
    passwordMinimum: number;

    fullNameBlurred: boolean;
    emailContactBlurred: boolean;
    emailConfirmBlurred: boolean;
    passwordBlurred: boolean;
    recaptchaValid: boolean;

    passwordStrength = service('passwordStrength');

    passwordWarning = alias('strength.lastSuccessful.value.feedback.warning');

    progress = computed('strength.lastSuccessful.value.score', function (): number {
        return 1 + this.get('strength.lastSuccessful.value.score');
    });

    progressStyle = computed('progress', function (): string {
        switch (this.get('progress')) {
        case 1:
        case 2:
            return 'danger';
        case 3:
            return 'warning';
        case 4:
        case 5:
            return 'success';
        default:
            return 'none';
        }
    });

    fullNameValid = computed('fullName', function (): boolean {
        const input = this.$('#fullName')[0];

        return this.get('fullName')
            && input
            && input.checkValidity();
    });

    fullNameError = computed('fullName', 'fullName{Blurred,Minimum,Maximum}', function (): string {
        const i18n = this.get('i18n');
        const fullName = this.get('fullName');
        const fullNameBlurred = this.get('fullNameBlurred');
        const fullNameEmpty = !fullName;

        if (fullNameBlurred && fullNameEmpty) {
            return i18n.t('sign_up_form.error_required');
        }

        if (!fullNameBlurred || fullNameEmpty) {
            return '';
        }

        const min = this.get('fullNameMinimum');

        if (fullName.length < min) {
            return i18n.t('sign_up_form.error_characters_minimum', { min });
        }

        const max = this.get('fullNameMaximum');

        if (fullName.length > max) {
            return i18n.t('sign_up_form.error_characters_maximum', { max });
        }

        return '';
    });

    emailContactValid = computed('emailContact', function (): boolean {
        const input = this.$('#emailContact')[0];

        return input
            && input.checkValidity();
    });

    emailContactError = computed('emailContact', 'emailContact{Blurred,Valid}', function (): string {
        const i18n = this.get('i18n');
        const emailContact = this.get('emailContact');
        const emailContactBlurred = this.get('emailContactBlurred');
        const emailContactEmpty = !emailContact;

        if (emailContactBlurred && emailContactEmpty) {
            return i18n.t('sign_up_form.error_required');
        }

        if (!emailContactBlurred || emailContactEmpty) {
            return '';
        }

        if (!this.get('emailContactValid')) {
            return i18n.t('sign_up_form.error_email_address');
        }

        return '';
    });

    emailConfirmValid = computed('emailConfirm', function (): boolean {
        const input = this.$('#emailConfirm')[0];

        return input
            && input.checkValidity();
    });

    emailConfirmError = computed('emailConfirm', 'emailConfirm{Blurred,Valid}', 'emailsMatch', function (): string {
        const i18n = this.get('i18n');
        const emailConfirm = this.get('emailConfirm');
        const emailConfirmBlurred = this.get('emailConfirmBlurred');
        const emailConfirmEmpty = !emailConfirm;

        if (emailConfirmBlurred && emailConfirmEmpty) {
            return i18n.t('sign_up_form.error_required');
        }

        if (!emailConfirmBlurred || emailConfirmEmpty) {
            return '';
        }

        if (!this.get('emailConfirmValid')) {
            return i18n.t('sign_up_form.error_email_address');
        }

        if (!this.get('emailsMatch')) {
            return i18n.t('sign_up_form.error_email_match');
        }

        return '';
    });

    emailsMatch = computed('emailContact', 'emailConfirm', function (): boolean {
        return this.get('emailContact') === this.get('emailConfirm');
    });

    emailValid = computed('emailContactValid', 'emailConfirmValid', 'emailsMatch', function (): boolean {
        return this.get('emailContactValid')
            && this.get('emailConfirmValid')
            && this.get('emailsMatch');
    });

    passwordValid = computed('emailContact', 'password', 'progress', function (): boolean {
        const input = this.$('#password')[0];

        return input
            && input.checkValidity()
            && this.get('emailContact') !== this.get('password')
            && this.get('progress') > 2;
    });

    passwordError = computed('password', 'password{Blurred,Maximum,Minimum}', 'emailContact', function (): string {
        const i18n = this.get('i18n');
        const password = this.get('password');
        const passwordBlurred = this.get('passwordBlurred');
        const passwordEmpty = !password;

        if (passwordBlurred && passwordEmpty) {
            return i18n.t('sign_up_form.error_required');
        }

        if (!passwordBlurred || passwordEmpty) {
            return '';
        }

        const min = this.get('passwordMinimum');

        if (password.length < min) {
            return i18n.t('sign_up_form.error_characters_minimum', { min });
        }

        const max = this.get('passwordMaximum');

        if (password.length > max) {
            return i18n.t('sign_up_form.error_characters_maximum', { max });
        }

        if (password === this.get('emailContact')) {
            return i18n.t('sign_up_form.error_password_email');
        }

        return '';
    });

    formValid = computed('fullNameValid', 'emailValid', 'passwordValid', 'recaptchaValid', function (): boolean {
        return this.get('fullNameValid')
            && this.get('emailValid')
            && this.get('passwordValid')
            && this.get('recaptchaValid');
    });
}
