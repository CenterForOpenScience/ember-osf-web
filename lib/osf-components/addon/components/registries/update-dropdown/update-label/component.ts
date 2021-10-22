import { inject as service } from '@ember/service';
import Component from '@glimmer/component';
import Intl from 'ember-intl/services/intl';

interface Args {
    totalRevisions: number;
    index: number;
}

export default class UpdateLabel extends Component<Args> {
    @service intl!: Intl;

    get label() {
        const { totalRevisions, index } = this.args;
        const revisionNumber = totalRevisions - index;
        let labelString = this.intl.t('registries.update_dropdown.updates_list_label', { revisionNumber });
        if (index === totalRevisions) {
            labelString = this.intl.t('registries.update_dropdown.updates_list_label_original');
        }
        if (index === 0) {
            labelString = this.intl.t('registries.update_dropdown.latest');
        }
        return labelString;
    }
}
