import Component from '@ember/component';
import { assert } from '@ember/debug';

import { layout } from 'ember-osf-web/decorators/component';
import { SubjectManager } from 'osf-components/components/subjects/manager/component';

import template from './template';

@layout(template)
export default class SubjectsBrowser extends Component {
    // required
    subjectsManager!: SubjectManager;

    init() {
        super.init();
        assert('@subjectsManager is required', Boolean(this.subjectsManager));
    }
}
