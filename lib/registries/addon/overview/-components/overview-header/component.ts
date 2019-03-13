import { action } from '@ember-decorators/object';
import Component from '@ember/component';

export default class OverviewHeader extends Component {
    @action
    acceptRegistration() {
        return 'accept registration';
    }

    @action
    rejectRegistration() {
        return 'reject registration';
    }
}
