import Component from '@glimmer/component';
import PreprintModel, { PreprintPreregLinkInfoEnum, PreprintPreregLinksEnum } from 'ember-osf-web/models/preprint';
import { inject as service } from '@ember/service';
import Intl from 'ember-intl/services/intl';

interface PublicPreregistrationArgs {
    preprint: PreprintModel;
    preprintWord: string;
}

export default class PreprintPublicPreregistration extends Component<PublicPreregistrationArgs> {
    @service intl!: Intl;

    preprint = this.args.preprint;

    get displayPreregLinkInfo(): boolean {
        return this.preprint.hasPreregLinks === PreprintPreregLinksEnum.AVAILABLE ||
            this.preprint.hasPreregLinks === PreprintPreregLinksEnum.YES;
    }

    get preregLinkInfoDisplay(): string {
        if (this.preprint.preregLinkInfo === PreprintPreregLinkInfoEnum.PREREG_DESIGNS) {
            return this.intl.t('preprints.submit.step-assertions.public-preregistration-link-info-designs');

        } else if (this.preprint.preregLinkInfo === PreprintPreregLinkInfoEnum.PREREG_ANALYSIS) {
            return this.intl.t('preprints.submit.step-assertions.public-preregistration-link-info-analysis');
        } else {
            return this.intl.t('preprints.submit.step-assertions.public-preregistration-link-info-both');
        }
    }

    get publicPreregistrationDisplay(): string {
        if (this.preprint.hasPreregLinks === PreprintPreregLinksEnum.NOT_APPLICABLE) {
            return this.intl.t('preprints.submit.step-assertions.public-data-na-placeholder',
                { singularPreprintWord: this.args.preprintWord});
        } else if (this.preprint.hasPreregLinks === PreprintPreregLinksEnum.NO) {
            return this.preprint.whyNoPrereg as string;
        } else {
            return '';
        }
    }
}
