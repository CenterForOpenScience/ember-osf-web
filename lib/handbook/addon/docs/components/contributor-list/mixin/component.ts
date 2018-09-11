import { A } from '@ember/array';
import Component from '@ember/component';
import EmberObject from '@ember/object';
import { faker } from 'ember-cli-mirage';

import DS from 'ember-data';
import Contributor from 'ember-osf-web/models/contributor';

type ContribArray = DS.PromiseManyArray<Contributor> &
                  { meta: { total: number } };

export default class ContributorListShowContributorLink extends Component {
    contributors!: ContribArray;

    init(this: ContributorListShowContributorLink) {
        super.init();
        this.set('contributors', this.makeNContributors(10));
    }

    makeNContributors(this: ContributorListShowContributorLink, n: number): ContribArray {
        const users: string[] = [];
        for (let i = 0; i < n; i++) {
            users.push(faker.name.lastName());
        }
        const contributors = {
            toArray: () => A(users.map(this.nameToUsersFamilyNames, { bibliographic: true })),
            meta: {
                total: users.length,
            },
        };
        return contributors as ContribArray;
    }

    nameToUsersFamilyNames (
        this: { bibliographic?: boolean, id?: string },
        familyName: string,
    ): EmberObject {
        return EmberObject.create({
            users: EmberObject.create({
                familyName,
                id: this.id || 'excuj',
            }),
            bibliographic: this.bibliographic,
        });
    }
}
