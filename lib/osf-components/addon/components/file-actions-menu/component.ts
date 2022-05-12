import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

export default class CreateFolderModal extends Component {
    @tracked isDeleteModalOpen = false;
}
