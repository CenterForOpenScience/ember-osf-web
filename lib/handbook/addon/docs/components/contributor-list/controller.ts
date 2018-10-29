import { action } from '@ember-decorators/object';
import Controller from '@ember/controller';

export default class DemoContributorList extends Controller {
    showStep: number = 0;

    @action
    bumpStep(this: DemoContributorList) {
        this.incrementProperty('showStep');
    }

    @action
    resetStep(this: DemoContributorList) {
        this.set('showStep', 0);
    }
}
