import Component from '@glimmer/component';
import PreprintModel, { PreprintDataLinksEnum } from 'ember-osf-web/models/preprint';
import { inject as service } from '@ember/service';
import Intl from 'ember-intl/services/intl';

interface CoiArgs {
    preprint: PreprintModel;
    preprintWord: string;
}

export default class PreprintPublicData extends Component<CoiArgs> {
    @service intl!: Intl;

    preprint = this.args.preprint;

    get publicDataDisplay(): string {
        if (this.preprint.hasDataLinks === PreprintDataLinksEnum.NOT_APPLICABLE) {
            return this.intl.t('preprints.submit.step-three.public-data-na-placeholder',
                { singularPreprintWord: this.args.preprintWord});
        } else if (this.preprint.hasDataLinks === PreprintDataLinksEnum.NO) {
            return this.preprint.whyNoData as string;
        } else {
            return '';
        }
    }
}
