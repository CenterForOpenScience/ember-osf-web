import { computed } from '@ember-decorators/object';
import { service } from '@ember-decorators/service';
import Component from '@ember/component';
import Node from 'ember-osf-web/models/node';
import { Permission } from 'ember-osf-web/models/osf-model';
import Registration from 'ember-osf-web/models/registration';
import Analytics from 'ember-osf-web/services/analytics';
import defaultTo from 'ember-osf-web/utils/default-to';
import moment from 'moment';
import styles from './styles';
import layout from './template';

enum BlurbType {
    FORK = 'fork',
    GENERIC = 'generic',
}

export default class NodeBlurb extends Component {
    layout = layout;
    styles = styles;

    @service analytics!: Analytics;

    node?: Node | Registration;
    blurbType: BlurbType = defaultTo(this.blurbType, BlurbType.FORK);

    @computed('node.currentUserPermissions')
    get canEdit(this: NodeBlurb): boolean {
        if (!this.node || !this.node.get('currentUserPermissions')) {
            return false;
        }
        return this.node.get('currentUserPermissions').includes(Permission.Write);
    }

    @computed('node.dateCreated')
    get date(this: NodeBlurb): string {
        if (!this.node) {
            return '';
        }
        return moment(this.node.get('dateCreated')).format('YYYY-MM-DD h:mm A');
    }

    @computed('blurbType')
    get dateLabelKey(this: NodeBlurb): string {
        return `node_blurb.${this.blurbType}.dateLabel`;
    }
}
