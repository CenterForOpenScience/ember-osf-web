import { action } from '@ember/object';
import Component from '@glimmer/component'
import { tracked } from '@glimmer/tracking'

export default class SearchResultCard extends Component {
    @tracked isOpenSecondaryMetadata = false;

    @action
    toggleSecondaryMetadata() {
        this.isOpenSecondaryMetadata = !this.isOpenSecondaryMetadata;
    }
}
