import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

export default class FileBrowser extends Component {
    @tracked isDeleteModalOpen = false;
}
