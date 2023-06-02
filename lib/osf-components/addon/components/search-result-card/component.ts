import { action } from '@ember/object';
import Component from '@glimmer/component'
import { tracked } from '@glimmer/tracking'

interface Args {
    displayName: string;
    nameFields: string[];
    dateFields: string[];
    context: string;
    secondaryMetadata: any;
}

export default class SearchResultCard extends Component<Args> {
    @tracked isOpenSecondaryMetadata = false;

    @action
    toggleSecondaryMetadata() {
        this.isOpenSecondaryMetadata = !this.isOpenSecondaryMetadata;
    }
}
