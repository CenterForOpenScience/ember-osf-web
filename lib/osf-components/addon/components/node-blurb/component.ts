import { action, computed } from '@ember-decorators/object';
import { service } from '@ember-decorators/service';
import Component from '@ember/component';
import Node from 'ember-osf-web/models/node';
import Registration from 'ember-osf-web/models/registration';
import Analytics from 'ember-osf-web/services/analytics';
import defaultTo from 'ember-osf-web/utils/default-to';
import moment from 'moment';
import styles from './styles';
import layout from './template';

enum BlurbType {
    Fork = 'fork',
    Generic = 'generic',
    Registration = 'registration',
}

const schemaWithTitles = [
    'Prereg Challenge',
    'Registered Report Protocol Preregistration',
];

export default class NodeBlurb extends Component {
    layout = layout;
    styles = styles;

    @service analytics!: Analytics;

    // Optional arguments
    node?: Node | Registration;
    blurbType: BlurbType = defaultTo(this.blurbType, BlurbType.Fork);
    showTags: boolean = defaultTo(this.showTags, false);
    onClickTag?: (tag: string) => void;

    // Private properties
    pendingRegistration = true;
    archivingRegistration = true;

    @computed('node.currentUserPermissions')
    get canEdit(this: NodeBlurb): boolean {
        if (!this.node || !this.node.get('currentUserPermissions')) {
            return false;
        }
        return this.node.get('currentUserPermissions').includes('write');
    }

    @computed('node.dateCreated')
    get date(this: NodeBlurb): string {
        if (!this.node) {
            return '';
        }
        return moment(this.node.get('dateCreated')).format('YYYY-MM-DD h:mm A');
    }

    @computed('blurbType')
    get dateLabelKey(): string {
        return `node_blurb.${this.blurbType}.dateLabel`;
    }

    @computed('blurbType')
    get placeholderBodyLines(): number {
        if (this.blurbType === BlurbType.Registration) {
            return 3;
        }
        return 2;
    }

    @computed('node.registrationSchema.name', 'node.registeredMeta.q1.value')
    get registrationTitle(): string | undefined {
        if (this.node && this.node.isRegistration) {
            const registration = this.node as Registration;
            if (schemaWithTitles.includes(registration.registrationSchema.get('name'))) {
                return registration.registeredMeta.q1.value;
            }
        }
        return undefined;
    }

    @action
    clickTag(tag: string): void {
        if (this.onClickTag) {
            this.onClickTag(tag);
        }
    }
}
