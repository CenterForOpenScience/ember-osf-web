import Component from '@ember/component';
import { assert } from '@ember/debug';

import { layout } from 'ember-osf-web/decorators/component';
import { SubjectManager } from 'osf-components/components/subjects/manager/component';

import styles from './styles';
import template from './template';

@layout(template, styles)
export default class SubjectWidget extends Component {
    // required
    subjectsManager!: SubjectManager;

    init() {
        super.init();

        assert('@subjectsManager is required', Boolean(this.subjectsManager));
    }
}
