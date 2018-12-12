import OriginalBsAlert from 'ember-bootstrap/components/bs-alert';
import { localClassNames } from 'ember-css-modules';

import { layout } from 'ember-osf-web/decorators/component';
import styles from './styles';
import template from './template';

@layout(template, styles)
@localClassNames('bs-alert')
export default class BsAlert extends OriginalBsAlert {
}
