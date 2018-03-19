import Component from '@ember/component';

export default class OsfLogo extends Component.extend({
    classNameBindings: ['double:Double'],
}) {
    double: boolean = this.double || false;
}
