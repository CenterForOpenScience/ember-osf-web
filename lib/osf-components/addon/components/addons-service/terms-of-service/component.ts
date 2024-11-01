import { inject as service } from '@ember/service';
import Component from '@glimmer/component';
import IntlService from 'ember-intl/services/intl';

import { AllProviderTypes } from 'ember-osf-web/packages/addons-service/provider';
import { ExternalServiceCapabilities } from 'ember-osf-web/models/external-service';
import ExternalStorageServiceModel from 'ember-osf-web/models/external-storage-service';
import ExternalComputingServiceModel from 'ember-osf-web/models/external-computing-service';
import ExternalCitationServiceModel from 'ember-osf-web/models/external-citation-service';

interface Args {
    provider: AllProviderTypes;
}

type CapabilityCategory =
    ExternalServiceCapabilities.ADD_UPDATE_FILES |
    ExternalServiceCapabilities.DELETE_FILES |
    ExternalServiceCapabilities.FORKING |
    ExternalServiceCapabilities.LOGS |
    ExternalServiceCapabilities.PERMISSIONS |
    ExternalServiceCapabilities.REGISTERING |
    ExternalServiceCapabilities.FILE_VERSIONS;

type ServiceTranslationKey = 'storage' | 'computing' | 'citation';


const capabilitiesToLabelKeyMap: Record<CapabilityCategory, string> = {
    [ExternalServiceCapabilities.ADD_UPDATE_FILES]: 'addons.terms.labels.add-update-files',
    [ExternalServiceCapabilities.DELETE_FILES]: 'addons.terms.labels.delete-files',
    [ExternalServiceCapabilities.FORKING]: 'addons.terms.labels.forking',
    [ExternalServiceCapabilities.LOGS]: 'addons.terms.labels.logs',
    [ExternalServiceCapabilities.PERMISSIONS]: 'addons.terms.labels.permissions',
    [ExternalServiceCapabilities.REGISTERING]: 'addons.terms.labels.registering',
    [ExternalServiceCapabilities.FILE_VERSIONS]: 'addons.terms.labels.file-versions',
};

const capabilitiesToTextKeyMap: Record<ServiceTranslationKey, Partial<Record<CapabilityCategory, any>>> = {
    storage: {
        [ExternalServiceCapabilities.ADD_UPDATE_FILES]: {
            true: 'addons.terms.storage.add-update-files-true',
            false: 'addons.terms.storage.add-update-files-false',
            partial: 'addons.terms.storage.add-update-files-partial',
        },
        [ExternalServiceCapabilities.DELETE_FILES]: {
            true: 'addons.terms.storage.delete-files-true',
            false: 'addons.terms.storage.delete-files-false',
            partial: 'addons.terms.storage.delete-files-partial',
        },
        [ExternalServiceCapabilities.FORKING]: {
            true: 'addons.terms.storage.forking-true',
        },
        [ExternalServiceCapabilities.LOGS]: {
            true: 'addons.terms.storage.logs-true',
            false: 'addons.terms.storage.logs-false',
        },
        [ExternalServiceCapabilities.PERMISSIONS]: {
            true: 'addons.terms.storage.permissions-true',
        },
        [ExternalServiceCapabilities.REGISTERING]: {
            true: 'addons.terms.storage.registering-true',
        },
        [ExternalServiceCapabilities.FILE_VERSIONS]: {
            true: 'addons.terms.storage.file-versions-true',
            false: 'addons.terms.storage.file-versions-false',
        },
    },
    citation: {
        [ExternalServiceCapabilities.FORKING]: {
            partial: 'addons.terms.citation.forking-partial',
        },
        [ExternalServiceCapabilities.PERMISSIONS]: {
            partial: 'addons.terms.citation.permissions-partial',
        },
        [ExternalServiceCapabilities.REGISTERING]: {
            false: 'addons.terms.citation.registering-false',
        },
    },
    computing: {
        [ExternalServiceCapabilities.ADD_UPDATE_FILES]: {
            partial: 'addons.terms.computing.add-update-files-partial',
        },
        [ExternalServiceCapabilities.FORKING]: {
            partial: 'addons.terms.computing.forking-partial',
        },
        [ExternalServiceCapabilities.LOGS]: {
            partial: 'addons.terms.computing.logs-partial',
        },
        [ExternalServiceCapabilities.PERMISSIONS]: {
            partial: 'addons.terms.computing.permissions-partial',
        },
        [ExternalServiceCapabilities.REGISTERING]: {
            partial: 'addons.terms.computing.registering-partial',
        },
    },
};


export default class TermsOfServiceComponent extends Component<Args> {
    @service intl!: IntlService;

    applicableCapabilities: CapabilityCategory[] = [];
    baseTranslationKey!: ServiceTranslationKey;

    constructor(owner: unknown, args: Args) {
        super(owner, args);
        if (args.provider instanceof ExternalStorageServiceModel) {
            this.applicableCapabilities = [
                ExternalServiceCapabilities.ADD_UPDATE_FILES,
                ExternalServiceCapabilities.DELETE_FILES,
                ExternalServiceCapabilities.FORKING,
                ExternalServiceCapabilities.LOGS,
                ExternalServiceCapabilities.PERMISSIONS,
                ExternalServiceCapabilities.REGISTERING,
                ExternalServiceCapabilities.FILE_VERSIONS,
            ];
            this.baseTranslationKey = 'storage';
        } else if (args.provider instanceof ExternalComputingServiceModel) {
            this.applicableCapabilities = [
                ExternalServiceCapabilities.ADD_UPDATE_FILES,
                ExternalServiceCapabilities.FORKING,
                ExternalServiceCapabilities.LOGS,
                ExternalServiceCapabilities.PERMISSIONS,
                ExternalServiceCapabilities.REGISTERING,
            ];
            this.baseTranslationKey = 'computing';
        } else if (args.provider instanceof ExternalCitationServiceModel) {
            this.applicableCapabilities = [
                ExternalServiceCapabilities.FORKING,
                ExternalServiceCapabilities.PERMISSIONS,
                ExternalServiceCapabilities.REGISTERING,
            ];
            this.baseTranslationKey = 'citation';
        }
    }

    get sections() {
        const providerCapabilities = this.args.provider.supportedFeatures;
        const providerName = this.args.provider.displayName;
        return this.applicableCapabilities.map((capability: CapabilityCategory) => {
            const textTranslationChoices = capabilitiesToTextKeyMap[this.baseTranslationKey][capability];
            let textTranslationKey = textTranslationChoices.false;
            let localClass='danger-bg';
            if (providerCapabilities?.includes(capability)) {
                textTranslationKey = textTranslationChoices.true;
                localClass = 'success-bg';
            } else if (providerCapabilities?.includes((capability + '_partial' as ExternalServiceCapabilities))) {
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
