import { action } from '@ember-decorators/object';
import { service } from '@ember-decorators/service';
import Component from '@ember/component';
import { localClassNames } from 'ember-osf-web/decorators/css-modules';
import Analytics from 'ember-osf-web/services/analytics';
import defaultTo from 'ember-osf-web/utils/default-to';
import styles from './styles';
import layout from './template';

@localClassNames('InstitutionsWidget')
export default class InstitutionWidget extends Component {
    layout = layout;
    styles = styles;

    @service analytics!: Analytics;

    readOnly: boolean = defaultTo(this.readOnly, false);
    showModal: boolean = false;

    @action
    create() {
        return true;
    }
}
