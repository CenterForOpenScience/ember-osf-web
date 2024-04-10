import { inject as service } from '@ember/service';
import Component from '@glimmer/component';
import IntlService from 'ember-intl/services/intl';

import { AllProviderTypes} from 'ember-osf-web/packages/addons-service/provider';
import ExternalStorageServiceModel, { TermsOfServiceCapabilities } from 'ember-osf-web/models/external-storage-service';
import ExternalComputingServiceModel from 'ember-osf-web/models/external-computing-service';
import ExternalCitationServiceModel from 'ember-osf-web/models/external-citation-service';

interface Args {
    provider: AllProviderTypes;
}

type CapabilityCategory =
    TermsOfServiceCapabilities.ADD_UPDATE_FILES |
    TermsOfServiceCapabilities.DELETE_FILES |
    TermsOfServiceCapabilities.FORKING |
    TermsOfServiceCapabilities.LOGS |
    TermsOfServiceCapabilities.PERMISSIONS |
    TermsOfServiceCapabilities.REGISTERING |
    TermsOfServiceCapabilities.FILE_VERSIONS;

type ServiceTranslationKey = 'storage' | 'computing' | 'citation';


const capabilitiesToLabelKeyMap: Record<CapabilityCategory, string> = {
    [TermsOfServiceCapabilities.ADD_UPDATE_FILES]: 'addons.terms.labels.add-update-files',
    [TermsOfServiceCapabilities.DELETE_FILES]: 'addons.terms.labels.delete-files',
    [TermsOfServiceCapabilities.FORKING]: 'addons.terms.labels.forking',
    [TermsOfServiceCapabilities.LOGS]: 'addons.terms.labels.logs',
    [TermsOfServiceCapabilities.PERMISSIONS]: 'addons.terms.labels.permissions',
    [TermsOfServiceCapabilities.REGISTERING]: 'addons.terms.labels.registering',
    [TermsOfServiceCapabilities.FILE_VERSIONS]: 'addons.terms.labels.file-versions',
};

const capabilitiesToTextKeyMap: Record<ServiceTranslationKey, Partial<Record<CapabilityCategory, any>>> = {
    storage: {
        [TermsOfServiceCapabilities.ADD_UPDATE_FILES]: {
            true: 'addons.terms.storage.add-update-files-true',
            false: 'addons.terms.storage.add-update-files-false',
            partial: 'addons.terms.storage.add-update-files-partial',
        },
        [TermsOfServiceCapabilities.DELETE_FILES]: {
            true: 'addons.terms.storage.delete-files-true',
            false: 'addons.terms.storage.delete-files-false',
            partial: 'addons.terms.storage.delete-files-partial',
        },
        [TermsOfServiceCapabilities.FORKING]: {
            true: 'addons.terms.storage.forking-true',
        },
        [TermsOfServiceCapabilities.LOGS]: {
            true: 'addons.terms.storage.logs-true',
            false: 'addons.terms.storage.logs-false',
        },
        [TermsOfServiceCapabilities.PERMISSIONS]: {
            true: 'addons.terms.storage.permissions-true',
        },
        [TermsOfServiceCapabilities.REGISTERING]: {
            true: 'addons.terms.storage.registering-true',
        },
        [TermsOfServiceCapabilities.FILE_VERSIONS]: {
            true: 'addons.terms.storage.file-versions-true',
            false: 'addons.terms.storage.file-versions-false',
        },
    },
    citation: {
        [TermsOfServiceCapabilities.FORKING]: {
            partial: 'addons.terms.citation.forking-partial',
        },
        [TermsOfServiceCapabilities.PERMISSIONS]: {
            partial: 'addons.terms.citation.permissions-partial',
        },
        [TermsOfServiceCapabilities.REGISTERING]: {
            false: 'addons.terms.citation.registering-false',
        },
    },
    computing: {
        [TermsOfServiceCapabilities.ADD_UPDATE_FILES]: {
            partial: 'addons.terms.computing.add-update-files-partial',
        },
        [TermsOfServiceCapabilities.FORKING]: {
            partial: 'addons.terms.computing.forking-partial',
        },
        [TermsOfServiceCapabilities.LOGS]: {
            partial: 'addons.terms.computing.logs-partial',
        },
        [TermsOfServiceCapabilities.PERMISSIONS]: {
            partial: 'addons.terms.computing.permissions-partial',
        },
        [TermsOfServiceCapabilities.REGISTERING]: {
            partial: 'addons.terms.computing.registering-partial',
        },
    },
};


export default class UserAddonManagerComponent extends Component<Args> {
    @service intl!: IntlService;

    applicableCapabilities: CapabilityCategory[] = [];
    baseTranslationKey!: ServiceTranslationKey;

    constructor(owner: unknown, args: Args) {
        super(owner, args);
        if (args.provider instanceof ExternalStorageServiceModel) {
            this.applicableCapabilities = [
                TermsOfServiceCapabilities.ADD_UPDATE_FILES,
                TermsOfServiceCapabilities.DELETE_FILES,
                TermsOfServiceCapabilities.FORKING,
                TermsOfServiceCapabilities.LOGS,
                TermsOfServiceCapabilities.PERMISSIONS,
                TermsOfServiceCapabilities.REGISTERING,
                TermsOfServiceCapabilities.FILE_VERSIONS,
            ];
            this.baseTranslationKey = 'storage';
        } else if (args.provider instanceof ExternalComputingServiceModel) {
            this.applicableCapabilities = [
                TermsOfServiceCapabilities.ADD_UPDATE_FILES,
                TermsOfServiceCapabilities.FORKING,
                TermsOfServiceCapabilities.LOGS,
                TermsOfServiceCapabilities.PERMISSIONS,
                TermsOfServiceCapabilities.REGISTERING,
            ];
            this.baseTranslationKey = 'computing';
        } else if (args.provider instanceof ExternalCitationServiceModel) {
            this.applicableCapabilities = [
                TermsOfServiceCapabilities.FORKING,
                TermsOfServiceCapabilities.PERMISSIONS,
                TermsOfServiceCapabilities.REGISTERING,
            ];
            this.baseTranslationKey = 'citation';
        }
    }

    get sections() {
        const providerCapabilities = this.args.provider.termsOfService;
        const providerName = this.args.provider.name;
        return this.applicableCapabilities.map((capability: CapabilityCategory) => {
            const textTranslationChoices = capabilitiesToTextKeyMap[this.baseTranslationKey][capability];
            let textTranslationKey = textTranslationChoices.false;
            let localClass='danger-bg';
            if (providerCapabilities.includes(capability)) {
                textTranslationKey = textTranslationChoices.true;
                localClass = 'success-bg';
            } else if (providerCapabilities.includes((capability + '_partial' as TermsOfServiceCapabilities))) {
                textTranslationKey = textTranslationChoices.partial;
                localClass = 'warning-bg';
            }
            return {
                title: this.intl.t(capabilitiesToLabelKeyMap[capability]),
                text: textTranslationKey ? this.intl.t(textTranslationKey, { provider: providerName }) : undefined,
                class: localClass,
            };
        });
    }
}
