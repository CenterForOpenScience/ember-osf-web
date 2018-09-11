import { A } from '@ember/array';
import EmberObject from '@ember/object';
import DS from 'ember-data';

import { computed } from '@ember-decorators/object';
import { faker } from 'ember-cli-mirage';

import Contributor from 'ember-osf-web/models/contributor';
import DemoMixin from '../mixin/component';

type ContribArray = DS.PromiseManyArray<Contributor> &
                  { meta: { total: number } };
export default class ContributorListShowNonBibliographic extends DemoMixin {
    init(this: ContributorListShowNonBibliographic) {
        super.init();
        this.set('contributors', this.makeNContributors(6));
    }

    @computed('contributors.[]')
    get contributorList(this: ContributorListShowNonBibliographic): any[] {
        if (!this.contributors) {
            return [];
        }
        const contributors = this.contributors.toArray();

        if (!(contributors && contributors.length)) {
            return [];
        }

        const contribs: any[] = contributors
            .map(c => ({
                title: c.users.get('familyName') || c.users.get('givenName') || c.users.get('fullName'),
                id: c.get('unregisteredContributor') ? null : c.users.get('id'),
                bibliographic: c.get('bibliographic'),
            }));

        return contribs;
    }

    makeNContributors(this: ContributorListShowNonBibliographic, n: number): ContribArray {
        const users: string[] = [];
        for (let i = 0; i < n; i++) {
            users.push(faker.name.lastName());
        }
        const spliceAt: number = Math.ceil(users.length / 2);
        const nonBibliographicUsers = users
            .slice(0, spliceAt)
            .map(this.nameToUsersFamilyNames, { bibliographic: false });
        const bibliographicUsers = users
            .slice(spliceAt, users.length)
            .map(this.nameToUsersFamilyNames, { bibliographic: true });

        const allUsers: EmberObject[] = [...nonBibliographicUsers, ...bibliographicUsers];

        const contributors = {
            toArray: () => A(allUsers),
            meta: {
                total: users.length,
            },
        };
        return contributors as ContribArray;
    }
}
