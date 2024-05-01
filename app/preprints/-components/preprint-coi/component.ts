import Component from '@glimmer/component';
import PreprintModel from 'ember-osf-web/models/preprint';
import { inject as service } from '@ember/service';
import Intl from 'ember-intl/services/intl';

interface CoiArgs {
    preprint: PreprintModel;
}

export default class PreprintCoi extends Component<CoiArgs> {
    @service intl!: Intl;

    preprint = this.args.preprint;

    get coiDisplay(): string {
        return this.preprint.hasCoi
            ? this.preprint.conflictOfInterestStatement as string
            : this.intl.t('preprints.submit.step-five.no-conflict-of-interest');
    }
}
