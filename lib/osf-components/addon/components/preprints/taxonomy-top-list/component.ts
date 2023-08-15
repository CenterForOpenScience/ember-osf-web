import Component from '@glimmer/component';
import { computed } from '@ember/object';
import SubjectModel from 'ember-osf-web/models/subject';

interface InputArgs {
    list: SubjectModel[];
}

interface PairModel {
    path: string[];
    text: string;
}

export default class TaxonomyTopList extends Component<InputArgs> {
    routerPrefix = 'http://localhost:4200';


    @computed('args.list')
    get sortedList() {
        if (!this.args.list) {
            return;
        }
        const sortedList = this.args.list.sortBy('text');
        const pairedList = [] as  PairModel[][];
        for (let i = 0; i < sortedList.get('length'); i += 2) {
            const pair: PairModel[] = [];
            // path in pair needs to be a list because that's what the
            // subject param in the discover controller is expecting
            const subjectOdd = sortedList.objectAt(i) as SubjectModel;
            pair.pushObject({
                path: [subjectOdd?.taxonomyName],
                text: subjectOdd?.text,
            } as PairModel);

            if (sortedList.objectAt(i + 1)) {
                const subjectEven = sortedList.objectAt(i + 1) as SubjectModel;
                pair.pushObject({
                    path: [subjectEven?.taxonomyName],
                    text: subjectEven?.text,
                });
            }
            pairedList.pushObject(pair);
        }
        return pairedList;
    }
}
