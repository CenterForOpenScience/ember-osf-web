import { tagName } from '@ember-decorators/component';
import Component from '@ember/component';
import { assert } from '@ember/debug';
import { action, computed } from '@ember/object';
import { inject as service } from '@ember/service';
import config from 'ember-get-config';
import Intl from 'ember-intl/services/intl';
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
    @service intl!: Intl;
    // Required parameter
    manager!: FinalizeRegistrationModalManager;

    // Private properties
    makePublicOption: string = '';
    embargoRangeStartDate: Date = moment().add(3, 'days').toDate();
    embargoRangeEndDate: Date = moment().add(1460, 'days').toDate();
    learnMoreLink = config.helpLinks.linkToAProject;

    didReceiveAttrs() {
        assert('finalize-registration-modal requires @manager!', Boolean(this.manager));
    }

    @action
    onChoiceChange() {
        if (this.makePublicOption === 'immediate') {
            this.manager.setEmbargoEndDate(null);
        }
    }

    @computed('manager.draftManager.{reviewsWorkflow,draftRegistration.hasProject}')
    get noticeText() {
        const translationOptions = { learnMoreLink: this.learnMoreLink, htmlSafe: true };
        let translationString = '';

        if (this.manager.draftManager.draftRegistration.hasProject) {
            translationString = this.manager.draftManager.reviewsWorkflow
                ? 'withModerationFromProject'
                : 'noModerationFromProject';
        } else {
            translationString = this.manager.draftManager.reviewsWorkflow
                ? 'withModerationNoProject'
                : 'noModerationNoProject';
        }
        return this.intl.t(`registries.finalizeRegistrationModal.notice.${translationString}`, translationOptions);
    }

    @computed('manager.{hasEmbargoEndDate,submittingRegistration}', 'makePublicOption')
    get shouldDisableSubmitButton() {
        return this.makePublicOption === ''
          || (this.makePublicOption === 'embargo' && !this.manager.hasEmbargoEndDate)
          || this.manager.submittingRegistration;
    }
}
