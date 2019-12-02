import { layout } from 'ember-osf-web/decorators/component';

import Base from '../base/component';
import styles from './styles';
import template from './template';

@layout(template, styles)
export default class ActiveFilterStatus extends Base {
}
