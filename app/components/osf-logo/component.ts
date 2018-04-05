import { className } from '@ember-decorators/component';
import Component from '@ember/component';

export default class OsfLogo extends Component {
    @className('Double') double: boolean = this.double || false;
    @className('Animate') animate: boolean = this.animate || false;
}
