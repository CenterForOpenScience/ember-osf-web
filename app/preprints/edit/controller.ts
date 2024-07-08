import Controller from '@ember/controller';
import { action} from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class PreprintEdit extends Controller {
    @tracked isPageDirty = false;

    @action
    setPageDirty() {
        this.isPageDirty = true;
    }

    @action
    resetPageDirty() {
        this.isPageDirty = false;
    }
}
