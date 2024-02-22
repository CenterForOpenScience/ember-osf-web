import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
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
    postText?: string;
}

interface Args {
    onConnect: () => void;
    provider: ExternalStorageServiceModel; // Type?
    manager: AddonsServiceManagerComponent | UserAddonsManagerComponent;
}

export default class AccountSetupManagerComponent extends Component<Args> {
    @service intl!: IntlService;

    @tracked selectedRepo?: string;
    @tracked otherRepo = '';

    get useOauth() {
        return [CredentialsFormat.OAUTH, CredentialsFormat.OAUTH2].includes(this.args.provider.credentialsFormat);
    }

    otherRepoLabel = this.intl.t('addons.accountCreate.other-repo-label');
    repoOptionsObject: Record<string, any> = {
        dataverse: {
            options: [
                'dataverse.harvard.edu',
                'dataverse.lib.virginia.edu',
                this.otherRepoLabel,
            ],
            dropdownLabel: this.intl.t('addons.accountCreate.dataverse-repo-label'),
            dropdownPlaceholder: this.intl.t('addons.accountCreate.dataverse-repo-placeholder'),
            textInputPlaceholder: this.intl.t('addons.accountCreate.dataverse-repo-other-placeholder'),
            textInputPostText: this.intl.t('addons.accountCreate.dataverse-repo-other-post-text'),
        },
        gitlab: {
            options: [
                'https://gitlab.com',
                this.otherRepoLabel,
            ],
            dropdownLabel: this.intl.t('addons.accountCreate.gitlab-repo-label'),
            dropdownPlaceholder: this.intl.t('addons.accountCreate.gitlab-repo-placeholder'),
            textInputPlaceholder: this.intl.t('addons.accountCreate.gitlab-repo-other-placeholder'),
            textInputPostText: this.intl.t('addons.accountCreate.gitlab-repo-other-post-text'),
        },
    };

    get showRepoOptions() {
        const { provider } = this.args;
        return provider.credentialsFormat === CredentialsFormat.REPO_TOKEN &&
            Boolean(this.repoOptionsObject[provider.id]);
    }

    get otherRepoSelected() {
        return this.selectedRepo === this.otherRepoLabel;
    }

    @action
    onRepoChange(newRepo: string) {
        const { credentialsObject } = this.args.manager;
        this.selectedRepo = newRepo;
        if (this.otherRepoSelected) {
            credentialsObject.repo = this.otherRepo;
        } else {
            credentialsObject.repo = newRepo;
        }
    }

    @action
    onOtherRepoChange() {
        this.args.manager.credentialsObject.repo = this.otherRepo;
    }

    get inputFields(): InputFieldObject[] {
        const { provider } = this.args;
        const credentials = this.args.manager.credentialsObject;
        const t = this.intl.t.bind(this.intl);
        switch (this.args.provider.credentialsFormat) {
        case CredentialsFormat.URL_USERNAME_PASSWORD: {
            const urlPostText = provider.id === 'owncloud' ?
                t('addons.accountCreate.owncloud-url-post-text', { htmlSafe: true }) : '';
            const passwordPostText = provider.id === 'owncloud' ?
                t('addons.accountCreate.owncloud-password-post-text', { htmlSafe: true }) : '';
            return [
                {
                    labelText: t('addons.accountCreate.url-label'),
                    inputType: 'text',
                    inputPlaceholder: t('addons.accountCreate.url-placeholder'),
                    inputValue: credentials.url,
                    postText: urlPostText,
                },
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
                    postText: passwordPostText,
                },
            ];
        }
        case CredentialsFormat.USERNAME_PASSWORD: {
            const passwordPostText = t('addons.accountCreate.boa-password-post-text');
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
                    postText: passwordPostText,
                },
            ];
        }
        case CredentialsFormat.REPO_TOKEN: {
            const label = provider.id === 'dataverse' ?
                t('addons.accountCreate.api-token-label') :
                t('addons.accountCreate.personal-access-token-label');
            const placeholder = provider.id === 'dataverse' ?
                t('addons.accountCreate.api-token-placeholder') :
                t('addons.accountCreate.personal-access-token-placeholder');
            return [
                {
                    labelText: label,
                    inputType: 'text',
                    inputPlaceholder: placeholder,
                    inputValue: credentials.token,
                },
            ];
        }
        case CredentialsFormat.ACCESS_SECRET_KEYS: {
            return [
                {
                    labelText: t('addons.accountCreate.access-key-label'),
                    inputType: 'text',
                    inputPlaceholder: t('addons.accountCreate.access-key-placeholder'),
                    inputValue: credentials.accessKey,
                },
                {
                    labelText: t('addons.accountCreate.secret-key-label'),
                    inputType: 'password',
                    inputPlaceholder: t('addons.accountCreate.secret-key-placeholder'),
                    inputValue: credentials.secretKey,
                },
            ];
        }
        default: // OAUTH, OAUTH2
            return [];
        }
    }
}
