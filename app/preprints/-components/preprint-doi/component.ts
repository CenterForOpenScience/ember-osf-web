import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import Intl from 'ember-intl/services/intl';

import PreprintModel, { VersionStatusSimpleLabelKey } from 'ember-osf-web/models/preprint';
import PreprintProviderModel from 'ember-osf-web/models/preprint-provider';

interface InputArgs {
    versions: PreprintModel[];
    provider: PreprintProviderModel;
    currentVersion: PreprintModel;
}

export default class PreprintAbstract extends Component<InputArgs> {
    @service intl!: Intl;

    provider = this.args.provider;
    documentType = this.provider.documentType.singularCapitalized;

    @tracked selectedVersion = this.args.currentVersion;

    reviewStateLabelKeyMap = VersionStatusSimpleLabelKey;

    @action
    selectVersion(version: PreprintModel) {
        this.selectedVersion = version;
    }
}
