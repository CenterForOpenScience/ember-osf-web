import Component from '@ember/component';
import { assert } from '@ember/debug';

import { layout } from 'ember-osf-web/decorators/component';
import { SubjectBrowserManager } from 'osf-components/components/subjects/browse/browse-manager/component';

import styles from './styles';
import template from './template';

@layout(template, styles)
export default class SubjectsBrowser extends Component {
    // required
    browserManager!: SubjectBrowserManager;

    init() {
        super.init();
        assert('@browserManager is required', Boolean(this.browserManager));
    }
}
