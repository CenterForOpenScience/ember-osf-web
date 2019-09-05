import Component from '@ember/component';

import { tagName } from '@ember-decorators/component';
import { layout } from 'ember-osf-web/decorators/component';

import { PageManager } from 'ember-osf-web/packages/registration-schema/page-manager';
import styles from './styles';
import template from './template';

@layout(template, styles)
@tagName('')
export default class PageRenderer extends Component {
    // Required param
    pageManager?: PageManager;
}
