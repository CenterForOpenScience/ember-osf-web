import { computed } from '@ember-decorators/object';
import Component from '@ember/component';
import { TaskInstance } from 'ember-concurrency';

import OsfModel from 'ember-osf-web/models/osf-model';

import layout from './template';

export default class NodeList extends Component {
    layout = layout;

    // Required parameters
    modelTaskInstance!: TaskInstance<OsfModel>;
    relationshipName!: string;

    // Optional parameters
    analyticsScope?: string;
    bindReload?: (action: (page?: number) => void) => void;

    @computed('relationshipName')
    get queryParams() {
        switch (this.relationshipName) {
        case 'registrations':
            return { embed: ['contributors', 'registration_schema'] };
        case 'forks':
            return { embed: 'contributors' };
        default:
            return {};
        }
    }
}
