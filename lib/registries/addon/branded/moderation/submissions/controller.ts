import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class RegistriesModerationSubmissionController extends Controller {
    @tracked filterState: string = 'pending';

    @action
    changeTab(tab: string) {
        this.filterState = tab;
    }
}
