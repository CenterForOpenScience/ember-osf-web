import Component from '@ember/component';

export default class AddonLoader extends Component {
    loaderSize!: [];

    didReceiveAttrs() {
        const size = new Array(10);
        this.set('loaderSize', size);
    }
}
