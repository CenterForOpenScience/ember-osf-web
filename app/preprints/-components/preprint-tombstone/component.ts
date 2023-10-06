import Component from '@glimmer/component';
import PreprintModel from 'ember-osf-web/models/preprint';
import PreprintProviderModel from 'ember-osf-web/models/preprint-provider';
import SubjectModel from 'ember-osf-web/models/subject';

interface InputArgs {
    subjects: SubjectModel[];
    preprint: PreprintModel;
    provider: PreprintProviderModel;
}

export default class PreprintTombstone extends Component<InputArgs> {
    preprint = this.args.preprint;
    provider = this.args.provider;
    subjects = this.args.subjects;
}
