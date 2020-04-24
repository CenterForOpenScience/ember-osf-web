import Controller from '@ember/controller';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import DS from 'ember-data';

export default class ContributorListController extends Controller {
    @service store!: DS.Store;

    contributorCountOptions: number[] = [1, 2, 3, 23];

    contributorCount: number = 3;

    @computed('model', 'contributorCount')
    get node() {
        return this.model[this.contributorCount];
    }
}
