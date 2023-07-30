import { action } from '@ember/object';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import SearchResultModel from 'ember-osf-web/models/search-result';
import { inject as service } from '@ember/service';
import Intl from 'ember-intl/services/intl';

interface Args {
    result: SearchResultModel;
}

export default class SearchResultCard extends Component<Args> {
    @service intl!: Intl;
    @tracked isOpenSecondaryMetadata = false;

    @action
    toggleSecondaryMetadata() {
        this.isOpenSecondaryMetadata = !this.isOpenSecondaryMetadata;
    }

    get cardTypeLabel() {
        return this.intl.t(`osf-components.search-result-card.${this.args.result.resourceType}`);
    }
}
