import Component from '@glimmer/component';
import SubjectModel from 'ember-osf-web/models/subject';

interface InputArgs {
    subjects: SubjectModel[];
}

export default class PreprintDiscipline extends Component<InputArgs> {
    subjects = this.args.subjects;

    get disciplineReduced(): SubjectModel[] {
        // Preprint disciplines are displayed in collapsed form on content page
        return this.subjects.reduce((acc: SubjectModel[], val: SubjectModel) => acc.concat(val), []).uniqBy('id');
    }
}
