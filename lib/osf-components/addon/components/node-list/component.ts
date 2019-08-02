import { computed } from '@ember-decorators/object';
import Component from '@ember/component';
import { TaskInstance } from 'ember-concurrency';

import { layout } from 'ember-osf-web/decorators/component';
import OsfModel from 'ember-osf-web/models/osf-model';

import template from './template';

@layout(template)
export default class NodeList extends Component {
    // Required parameters
    modelTaskInstance!: TaskInstance<OsfModel>;
    relationshipName!: string;

    // Optional parameters
    bindReload?: (action: (page?: number) => void) => void;

    @computed('relationshipName')
    get queryParams() {
        switch (this.relationshipName) {
        case 'registrations':
            return { embed: ['bibliographic_contributors', 'registration_schema'] };
        case 'forks':
            return { embed: 'bibliographic_contributors' };
        default:
            return {};
        }
    }
}
