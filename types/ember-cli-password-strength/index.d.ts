declare module 'ember-cli-password-strength/services/password-strength' {
    import Service from '@ember/service';

    export default class PasswordStrength extends Service {
        strength(password: string): Promise<any>;
    }
}
