import Component from '@ember/component';
import defaultTo from 'ember-osf-web/utils/default-to';
import styles from './styles';
import layout from './template';

export default class OsfLogo extends Component {
    layout = layout;
    styles = styles;

    double: boolean = defaultTo(this.double, false);
    animate: boolean = defaultTo(this.animate, false);
}
