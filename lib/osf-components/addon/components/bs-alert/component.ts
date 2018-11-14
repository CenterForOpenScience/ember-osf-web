import OriginalBsAlert from 'ember-bootstrap/components/bs-alert';
import { localClassNames } from 'ember-css-modules';

import styles from './styles';
import layout from './template';

@localClassNames('bs-alert')
export default class BsAlert extends OriginalBsAlert {
    layout = layout;
    styles = styles;
}
