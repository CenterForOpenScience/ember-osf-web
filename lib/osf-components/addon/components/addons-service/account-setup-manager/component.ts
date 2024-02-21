import { inject as service } from '@ember/service';
import Component from '@glimmer/component';
import IntlService from 'ember-intl/services/intl';

import ExternalStorageServiceModel, { CredentialsFormat } from 'ember-osf-web/models/external-storage-service';
import AddonsServiceManagerComponent from 'ember-osf-web/components/addons-service/manager/component';
import UserAddonsManagerComponent from 'ember-osf-web/components/addons-service/user-addons-manager/component';

interface InputFieldObject {
    labelText: string;
    inputType: string;
    inputPlaceholder: string;
    inputValue: string;
    autocomplete?: string;
}

interface Args {
    onConnect: () => void;
    provider: ExternalStorageServiceModel; // Type?
    manager: AddonsServiceManagerComponent | UserAddonsManagerComponent;
}

export default class AccountSetupManagerComponent extends Component<Args> {
    @service intl!: IntlService;

    get useOauth() {
        return [CredentialsFormat.OAUTH, CredentialsFormat.OAUTH2].includes(this.args.provider.credentialsFormat);
    }

    get inputFields(): InputFieldObject[] {
        const credentials = this.args.manager.credentialsObject;
        const t = this.intl.t.bind(this.intl);
        switch (this.args.provider.credentialsFormat) {
        case CredentialsFormat.USERNAME_PASSWORD:
            return [
                {
                    labelText: t('addons.accountCreate.username-label'),
                    inputType: 'text',
                    inputPlaceholder: t('addons.accountCreate.username-placeholder'),
                    inputValue: credentials.username,
                    autocomplete: 'username',
                },
                {
                    labelText: t('addons.accountCreate.password-label'),
                    inputType: 'password',
                    inputPlaceholder: t('addons.accountCreate.password-placeholder'),
                    inputValue: credentials.password,
                    autocomplete: 'current-password',
                },
            ];
        case CredentialsFormat.REPO_TOKEN:
            return [
                {
                    labelText: t('addons.accountCreate.token-label'),
                    inputType: 'text',
                    inputPlaceholder: t('addons.accountCreate.token-placeholder'),
                    inputValue: credentials.token,
                },
            ];
        case CredentialsFormat.SECRET_KEY:
            return [
                {
                    labelText: t('addons.accountCreate.secret-key-label'),
                    inputType: 'password',
                    inputPlaceholder: t('addons.accountCreate.secret-key-placeholder'),
                    inputValue: credentials.key,
                },
            ];
        default: // OAUTH, OAUTH2
            return [];
        }
    }
}
