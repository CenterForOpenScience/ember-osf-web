import BsButton from 'ember-bootstrap/components/bs-button';

import { layout } from 'ember-osf-web/decorators/component';

import styles from './styles';
import template from './template';

@layout(template, styles)
export default class OsfButton extends BsButton {
}
