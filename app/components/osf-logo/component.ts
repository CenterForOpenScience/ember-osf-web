import { className } from '@ember-decorators/component';
import Component from '@ember/component';
import defaultTo from 'ember-osf-web/utils/default-to';

export default class OsfLogo extends Component {
    @className('Double') double: boolean = defaultTo(this.double, false);
    @className('Animate') animate: boolean = defaultTo(this.animate, false);
}
