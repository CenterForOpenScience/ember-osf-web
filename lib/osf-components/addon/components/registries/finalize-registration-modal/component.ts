import { tagName } from '@ember-decorators/component';
import { computed } from '@ember-decorators/object';
import Component from '@ember/component';
import { assert } from '@ember/debug';
import { action } from '@ember/object';
import moment from 'moment';

import { layout } from 'ember-osf-web/decorators/component';
import {
    FinalizeRegistrationModalManager,
} from 'osf-components/components/registries/finalize-registration-modal/manager/component';

import styles from './styles';
import template from './template';

@layout(template, styles)
@tagName('')
export default class FinalizeRegisrationModalComponent extends Component {
    // Required parameter
    manager!: FinalizeRegistrationModalManager;

    // Private properties
    makePublicOption: string = '';
    embargoRangeStartDate: Date = moment().add(3, 'days').toDate();
    embargoRangeEndDate: Date = moment().add(4, 'years').toDate();

    didReceiveAttrs() {
        assert('finalize-registration-modal requires @manager!', Boolean(this.manager));
    }

    @action
    onChoiceChange() {
        if (this.makePublicOption === 'immediate') {
            this.manager.setEmbargoEndDate(null);
        } else {
            this.manager.setCreateDoi(false);
        }
    }

    @computed('manager.{hasEmbargoEndDate,submittingRegistration}', 'makePublicOption')
    get shouldDisableSubmitButton() {
        return this.makePublicOption === '' ||
          (this.makePublicOption === 'embargo' && !this.manager.hasEmbargoEndDate) ||
          this.manager.submittingRegistration;
    }
}
