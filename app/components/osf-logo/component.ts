import Component from '@ember/component';
import defaultTo from 'ember-osf-web/utils/default-to';

export default class OsfLogo extends Component {
    double: boolean = defaultTo(this.double, false);
    animate: boolean = defaultTo(this.animate, false);
}
