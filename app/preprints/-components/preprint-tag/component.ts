import Component from '@glimmer/component';
import PreprintModel from 'ember-osf-web/models/preprint';

interface InputArgs {
    preprint: PreprintModel;
}

export default class PreprintTag extends Component<InputArgs> {
    preprint = this.args.preprint;
}
