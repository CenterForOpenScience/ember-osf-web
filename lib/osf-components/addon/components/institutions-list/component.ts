import Component from '@ember/component';
import { localClassNames } from 'ember-osf-web/decorators/css-modules';
import styles from './styles';
import layout from './template';

@localClassNames('InstitutionsList')
export default class InstitutionsList extends Component {
    layout = layout;
    styles = styles;
}
