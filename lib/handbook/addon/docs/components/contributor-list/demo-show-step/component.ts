import { action } from '@ember-decorators/object';
import DemoMixin from '../mixin/component';

export default class ContributorListShowStep extends DemoMixin {
    showStep: number = 0;

    @action
    bumpStep(this: ContributorListShowStep) {
        this.incrementProperty('showStep');
    }

    @action
    resetStep(this: ContributorListShowStep) {
        this.set('showStep', 0);
    }
}
