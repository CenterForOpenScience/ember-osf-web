import { action, computed } from '@ember-decorators/object';
import { A } from '@ember/array';
import Controller from '@ember/controller';
import EmberObject from '@ember/object';
import { faker } from 'ember-cli-mirage';

import Contributor from 'ember-osf-web/models/contributor';
import { QueryHasManyResult } from 'ember-osf-web/models/osf-model';

type ContribArray = QueryHasManyResult<Contributor>;

export default class DemoContributorList extends Controller {
    contributors!: ContribArray;
    node!: EmberObject;
    nodeWithNonBibliographic!: EmberObject;

    showStep: number = 0;

    init(this: DemoContributorList) {
        super.init();
        const node = EmberObject.create({ hasMany: () => ({ value: () => this.makeNContributors(10, true) }) });
        const nonBiblioContributors = this.makeNContributors(6, false);
        const nodeWithNonBibliographic = EmberObject.create({
            hasMany: () => ({ value: () => nonBiblioContributors }),
        });

        this.set('node', node);
        this.set('nodeWithNonBibliographic', nodeWithNonBibliographic);
        this.set('contributors', nonBiblioContributors);
    }

    makeNContributors(this: DemoContributorList, n: number, allBibliographic: boolean): ContribArray {
        const users: string[] = [];
        for (let i = 0; i < n; i++) {
            users.push(faker.name.lastName());
        }

        let allUsers: EmberObject[];
        if (!allBibliographic) {
            const spliceAt: number = Math.ceil(users.length / 2);
            const nonBibliographicUsers = users
                .slice(0, spliceAt)
                .map(this.nameToUsersFamilyNames, { bibliographic: false });
            const bibliographicUsers = users
                .slice(spliceAt, users.length)
                .map(this.nameToUsersFamilyNames, { bibliographic: true });
            allUsers = [...nonBibliographicUsers, ...bibliographicUsers];
        } else {
            allUsers = users.map(this.nameToUsersFamilyNames, { bibliographic: true });
        }

        const contributors = {
            toArray: () => A(allUsers),
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

    @computed('contributors.[]')
    get contributorList(this: DemoContributorList): any[] {
        const contributors = this.contributors.toArray();
        const contribs: any[] = contributors
            .map(c => ({
                title: c.users.get('familyName') || c.users.get('givenName') || c.users.get('fullName'),
                id: c.get('unregisteredContributor') ? null : c.users.get('id'),
                bibliographic: c.get('bibliographic'),
            }));

        return contribs;
    }

    @action
    bumpStep(this: DemoContributorList) {
        this.incrementProperty('showStep');
    }

    @action
    resetStep(this: DemoContributorList) {
        this.set('showStep', 0);
    }
}
