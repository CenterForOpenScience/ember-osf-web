import Component from '@glimmer/component';
import SubjectModel from 'ember-osf-web/models/subject';
import Media from 'ember-responsive';
import { inject as service } from '@ember/service';

interface InputArgs {
    list: SubjectModel[];
    provider: string;
}

interface PairModel {
    queryParam: object;
    text: string;
}

export default class TaxonomyTopList extends Component<InputArgs> {
    @service media!: Media;

    provider = this.args.provider;

    get isMobile(): boolean {
        return this.media.isMobile;
    }

    get sortedList() {
        if (!this.args.list) {
            return;
        }
        const sortedList = this.args.list.sortBy('text');
        const pairedList = [] as  PairModel[][];

        if (this.isMobile) {
            for (let i = 0; i < sortedList.get('length'); i += 1) {
                const pair: PairModel[] = [];
                const subject= sortedList.objectAt(i) as SubjectModel;
                pair.pushObject({
                    queryParam: {
                        activeFilters: [{
                            propertyVisibleLabel:'Subject',
                            propertyPathKey:'subject',
                            label:subject.text,
                            value: subject?.links?.iri,
                        }],
                    },
                    text: subject?.text,
                } as PairModel);
                pairedList.pushObject(pair);
            }
        } else {
            for (let i = 0; i < sortedList.get('length'); i += 2) {
                const pair: PairModel[] = [];
                // path in pair needs to be a list because that's what the
                // subject param in the discover controller is expecting
                const subjectOdd = sortedList.objectAt(i) as SubjectModel;
                pair.pushObject({
                    queryParam: {
                        activeFilters: [{
                            propertyVisibleLabel:'Subject',
                            propertyPathKey:'subject',
                            label:subjectOdd.text,
                            value: subjectOdd?.links?.iri,
                        }],
                    },
                    text: subjectOdd?.text,
                } as PairModel);

                if (sortedList.objectAt(i + 1)) {
                    const subjectEven = sortedList.objectAt(i + 1) as SubjectModel;
                    pair.pushObject({
                        queryParam: {
                            activeFilters: [{
                                propertyVisibleLabel:'Subject',
                                propertyPathKey:'subject',
                                label:subjectEven.text,
                                value: subjectEven?.links?.iri,
                            }],
                        },
                        text: subjectEven?.text,
                    });
                }
                pairedList.pushObject(pair);
            }

        }

        if (pairedList.length > 0 && typeof this.args.provider !== 'string') {
            throw new Error('A provider string must be provided with a valid list');
        }

        return pairedList;
    }
}
