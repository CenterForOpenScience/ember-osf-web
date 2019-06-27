import Component from '@ember/component';
import { layout } from 'ember-osf-web/decorators/component';
import defaultTo from 'ember-osf-web/utils/default-to';

import styles from './styles';
import template from './template';

@layout(template, styles)
export default class GetStartedButton extends Component {
    analytics: string = defaultTo(this.analytics, 'Get started button');
}
