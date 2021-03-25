import Component from '@ember/component';

import { layout } from 'ember-osf-web/decorators/component';
import styles from './styles';
import template from './template';

@layout(template, styles)
export default class OsfLogo extends Component {
    double: boolean = false;
    animate: boolean = false;
}
