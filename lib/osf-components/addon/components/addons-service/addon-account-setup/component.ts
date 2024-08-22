import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { waitFor } from '@ember/test-waiters';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { task } from 'ember-concurrency';
import { taskFor } from 'ember-concurrency-ts';
import IntlService from 'ember-intl/services/intl';
import Toast from 'ember-toastr/services/toast';

import AddonsServiceManagerComponent from 'ember-osf-web/components/addons-service/manager/component';
import UserAddonsManagerComponent from 'ember-osf-web/components/addons-service/user-addons-manager/component';
import { AddonCredentialFields } from 'ember-osf-web/models/authorized-account';
import { CredentialsFormat } from 'ember-osf-web/models/external-service';
import ExternalStorageServiceModel from 'ember-osf-web/models/external-storage-service';
import { AllAuthorizedAccountTypes } from 'ember-osf-web/packages/addons-service/provider';
import captureException, { getApiErrorMessage } from 'ember-osf-web/utils/capture-exception';

// TODO: Get this from GravyValet??
const repoOptionsObject: Record<string, string[]> = {
    dataverse: [
        'https://dataverse.harvard.edu',
        'https://dataverse.lib.virginia.edu',
    ],
    gitlab: [
        'https://gitlab.com',
    ],
};

interface InputFieldObject {
    name: keyof AddonCredentialFields;
    labelText: string;
    inputType: string;
    inputPlaceholder: string;
    inputValue?: string;
    autocomplete?: string;
    postText?: string;
}

interface Args {
    onConnect: () => void;
    onReconnect: () => void;
    account?: AllAuthorizedAccountTypes;
    provider: ExternalStorageServiceModel; // Type?
    manager: AddonsServiceManagerComponent | UserAddonsManagerComponent;
}

export default class AddonAccountSetupComponent extends Component<Args> {
    @service intl!: IntlService;
    @service toast!: Toast;

    @tracked selectedRepo?: string;
    @tracked otherRepo?: string;
    @tracked url?: string;
    @tracked newAccount?: AllAuthorizedAccountTypes;
    @tracked pendingOauth = false;
    @tracked credentialsObject: AddonCredentialFields = {};
    @tracked displayName = this.args.account?.displayName || '';
    @tracked connectAccountError = false;

    get useOauth() {
        return [CredentialsFormat.OAUTH, CredentialsFormat.OAUTH2].includes(this.args.provider.credentialsFormat);
    }

    get showUrlField() {
        return this.args.provider.credentialsFormat === CredentialsFormat.URL_USERNAME_PASSWORD;
    }

    otherRepoLabel = this.intl.t('addons.accountCreate.other-repo-label');

    get showRepoOptions() {
        const { provider } = this.args;
        return provider.credentialsFormat === CredentialsFormat.REPO_TOKEN;
    }

    get repoOptions() {
        const repoSpecificOptions = repoOptionsObject[this.args.provider.id] || [];
        return [...repoSpecificOptions, this.otherRepoLabel];
    }

    get otherRepoSelected() {
        return this.selectedRepo === this.otherRepoLabel;
    }

    get repoOtherPostText() {
        if (this.args.provider.id === 'dataverse') {
            return this.intl.t('addons.accountCreate.dataverse-repo-other-post-text');
        } else if (this.args.provider.id === 'gitlab') {
            return this.intl.t('addons.accountCreate.gitlab-repo-other-post-text');
        }
        return '';
    }

    @action
    onRepoChange(newRepo: string) {
        this.selectedRepo = newRepo;
    }

    @action
    inputFieldChanged(event: Event) {
        const { name, value } = event.target as HTMLInputElement;
        this.credentialsObject[name as keyof AddonCredentialFields] = value;
    }

    get inputFields(): InputFieldObject[] {
        const { provider } = this.args;
        const credentials = this.credentialsObject;
        const t = this.intl.t.bind(this.intl);
        switch (this.args.provider.credentialsFormat) {
        case CredentialsFormat.USERNAME_PASSWORD, CredentialsFormat.URL_USERNAME_PASSWORD: {
            const passwordPostText = t('addons.accountCreate.password-post-text');
            return [
                {
                    name: 'username',
                    labelText: t('addons.accountCreate.username-label'),
                    inputType: 'text',
                    inputPlaceholder: t('addons.accountCreate.username-placeholder'),
                    inputValue: credentials.username,
                    autocomplete: 'username',
                },
                {
                    name: 'password',
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
                    name: 'token',
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
                    name: 'accessKey',
                    labelText: t('addons.accountCreate.access-key-label'),
                    inputType: 'text',
                    inputPlaceholder: t('addons.accountCreate.access-key-placeholder'),
                    inputValue: credentials.accessKey,
                },
                {
                    name: 'secretKey',
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

    @task
    @waitFor
    async connectAccount() {
        const { manager } = this.args;
        const credentials = this.credentialsObject;
        let apiBaseUrl;
        if (this.showUrlField) {
            apiBaseUrl = this.url;
        } else if (this.showRepoOptions) {
            apiBaseUrl = this.otherRepoSelected ? this.otherRepo : this.selectedRepo;
        }
        const accountCreationArgs = {
            credentials,
            apiBaseUrl,
            displayName: this.displayName,
            initiateOauth: this.useOauth,
        };
        try {
            await taskFor(manager.connectAccount).unlinked().perform(accountCreationArgs);
            this.toast.success(this.intl.t('addons.accountCreate.connect-success'));
        } catch (e) {
            this.connectAccountError = true;
            const errorMessage = this.intl.t('addons.accountCreate.error');
            captureException(e, { errorMessage });
            this.toast.error(getApiErrorMessage(e), errorMessage);
        }
    }

    @task
    @waitFor
    async reconnectAccount() {
        const { manager } = this.args;
        const credentials = this.credentialsObject;
        let apiBaseUrl;
        if (this.showUrlField) {
            apiBaseUrl = this.url;
        } else if (this.showRepoOptions) {
            apiBaseUrl = this.otherRepoSelected ? this.otherRepo : this.selectedRepo;
        }
        const accountCreationArgs = {
            credentials,
            apiBaseUrl,
            displayName: this.displayName,
            initiateOauth: this.useOauth,
        };
        try {
            await taskFor((manager as UserAddonsManagerComponent).reconnectAccount).perform(accountCreationArgs);
            this.toast.success(this.intl.t('addons.accountCreate.reconnect-success'));
        } catch (e) {
            const errorMessage = this.intl.t('addons.accountCreate.reconnect-error');
            captureException(e, { errorMessage });
            this.toast.error(getApiErrorMessage(e), errorMessage);
        }
    }

    @action
    onVisibilityChange() {
        if (document.visibilityState === 'visible') {
            taskFor(this.args.manager.oauthFlowRefocus).perform(this.newAccount!);
            this.pendingOauth = false;
            document.removeEventListener('visibilitychange', this.onVisibilityChange);
        }
    }
    @task
    @waitFor
    async startOauthFlow() {
        this.newAccount = await taskFor(this.args.manager.createAuthorizedAccount).perform({
            displayName: this.displayName,
            initiateOauth: true,
            apiBaseUrl: '',
        });
        if (this.newAccount) { // returned account should have authUrl
            const oauthWindow = window.open(this.newAccount.authUrl, '_blank');
            if (oauthWindow) {
                document.addEventListener('visibilitychange', this.onVisibilityChange);
                this.pendingOauth = true;
            } else {
                this.toast.error(this.intl.t('addons.accountCreate.oauth-window-blocked'));
            }
        }
    }

    @task
    @waitFor
    async startOauthReconnectFlow() {
        const { account } = this.args;
        if (account) {
            account.initiateOauth = true;
            account.displayName = this.displayName;
            await account.save(); // returned account should have authUrl
            if (account.authUrl) {
                const oauthWindow = window.open(account.authUrl, '_blank');
                if (oauthWindow) {
                    document.addEventListener('visibilitychange', this.onVisibilityChange);
                    this.pendingOauth = true;
                } else {
                    this.toast.error(this.intl.t('addons.accountCreate.oauth-window-blocked'));
                }
            } else {
                this.toast.error(this.intl.t('addons.accountCreate.oauth-reconnect-error'));
            }
        }
    }
}
