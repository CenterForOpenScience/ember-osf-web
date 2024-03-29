import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import Store from '@ember-data/store';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import Intl from 'ember-intl/services/intl';

import SearchResultModel from 'ember-osf-web/models/search-result';
import PreprintProviderModel from 'ember-osf-web/models/preprint-provider';
import InstitutionModel from 'ember-osf-web/models/institution';


const CardLabelTranslationKeys = {
    project: 'osf-components.search-result-card.project',
    project_component: 'osf-components.search-result-card.project_component',
    registration: 'osf-components.search-result-card.registration',
    registration_component: 'osf-components.search-result-card.registration_component',
    preprint: 'osf-components.search-result-card.preprint',
    file: 'osf-components.search-result-card.file',
    user: 'osf-components.search-result-card.user',
    unknown: 'osf-components.search-result-card.unknown',
};

interface Args {
    result: SearchResultModel;
    provider?: PreprintProviderModel;
    institution?: InstitutionModel;
}

export default class SearchResultCard extends Component<Args> {
    @service intl!: Intl;
    @service store!: Store;

    @tracked isOpenSecondaryMetadata = false;

    @action
    toggleSecondaryMetadata() {
        this.isOpenSecondaryMetadata = !this.isOpenSecondaryMetadata;
    }

    get cardTypeLabel() {
        const { provider, institution } = this.args;
        const resourceType = this.args.result.resourceType;
        if (resourceType === 'preprint') {
            if (institution?.id === 'yls') {
                return this.intl.t('documentType.paper.singularCapitalized');
            }
            if (provider?.preprintWord) {
                return provider.documentType.singularCapitalized;
            }
        }
        return this.intl.t(CardLabelTranslationKeys[resourceType]);
    }

    get secondaryMetadataComponent() {
        const { resourceType } = this.args.result;
        switch (resourceType) {
        case 'project':
        case 'project_component':
            return 'search-result-card/project-secondary-metadata';
        case 'registration':
        case 'registration_component':
            return 'search-result-card/registration-secondary-metadata';
        case 'preprint':
            return 'search-result-card/preprint-secondary-metadata';
        case 'file':
            return 'search-result-card/file-secondary-metadata';
        case 'user':
            return 'search-result-card/user-secondary-metadata';
        default:
            return null;
        }
    }
}
