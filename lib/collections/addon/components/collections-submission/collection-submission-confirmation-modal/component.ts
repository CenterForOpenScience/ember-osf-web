import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

export default class CollectionSubmissionConfirmationModal extends Component {
    @tracked removeReason?: string;
}

