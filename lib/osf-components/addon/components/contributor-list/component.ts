import { tagName } from '@ember-decorators/component';
import { action, computed } from '@ember-decorators/object';
import { alias } from '@ember-decorators/object/computed';
import { service } from '@ember-decorators/service';
import Component from '@ember/component';
import { task } from 'ember-concurrency';
import DS from 'ember-data';
import I18N from 'ember-i18n/services/i18n';

import Contributor from 'ember-osf-web/models/contributor';
import Node from 'ember-osf-web/models/node';
import Preprint from 'ember-osf-web/models/preprint';
import Registration from 'ember-osf-web/models/registration';
import defaultTo from 'ember-osf-web/utils/default-to';

import styles from './styles';
import layout from './template';

export interface Contrib {
    title: string;
    id: string | null;
    bibliographic?: boolean | null;
}

@tagName('span')
export default class ContributorList extends Component {
    layout = layout;
    styles = styles;

    @service i18n!: I18N;
    @service store!: DS.Store;

    nodeId?: string;
    node?: Node | Preprint | Registration;

    page = 1;
    defaultStep = 3;

    loadingMore: boolean = false;
    initialLoad: boolean = true;

    showStep: number = defaultTo(this.showStep, 0);
    contribsPerPage: number = defaultTo(this.contribsPerPage, 10);
    displayedContribs: number = defaultTo(this.displayedContribs, this.defaultStep);

    showLoading: boolean = defaultTo(this.showLoading, true);
    darkBall: boolean = defaultTo(this.darkBall, true);
    userIsBot: boolean = defaultTo(this.userIsBot, navigator.userAgent.includes('Prerender'));

    useLinks?: boolean = defaultTo(this.useLinks, false);
    useContributorLink?: boolean = defaultTo(this.useContributorLink, false);
    useShowMoreLink?: boolean = defaultTo(this.useShowMoreLink, false);
    useShowLess?: boolean = this.userIsBot ? false : defaultTo(this.useShowLess, false);

    showNonBibliographic?: boolean = defaultTo(this.showNonBibliographic, false);

    contributors!: DS.PromiseManyArray<Contributor> &
                      { meta: { total: number } };

    moreContribs = task(function *(this: ContributorList, more?: boolean) {
        // we have enough contributors to show, don't request any more.
        const hiddenContribs = this.contributorList.length - this.displayedContribs;
        if (!this.userIsBot && (this.rest <= hiddenContribs)) {
            if (this.useShowStep) {
                this.incrementProperty('displayedContribs', this.showStep);
            } else {
                this.set('displayedContribs', this.contributorList.length);
            }
            return;
        }

        if (!this.node) {
            return;
        }

        // we are running in Prerender, load and show all contributors at once.
        if (this.userIsBot) {
            if (!this.hasMore) {
                this.set('displayedContribs', this.contributorList.length);
            } else {
                const allContributors = yield this.node.loadAll('contributors');
                this.set('contributors', allContributors);
                this.set('displayedContribs', allContributors.length);
                this.set('initialLoad', false);
            }
            return;
        }

        // Fetch more contributors.
        this.set('loadingMore', true);

        const contribs = yield this.node.queryHasMany('contributors', {
            page: more ? this.incrementProperty('page') : this.set('page', 1),
            'page[size]': this.contribsPerPage,
        });

        if (more && this.contributors) {
            this.contributors.pushObjects(contribs);

            if (this.useShowStep) {
                this.incrementProperty('displayedContribs', this.showStep);
            } else {
                this.set('displayedContribs', this.contributorList.length);
            }
        } else {
            this.set('contributors', contribs);
        }

        this.set('loadingMore', false);
    }).restartable();

    @computed('contributors.[]', 'showNonBibliographic')
    get contributorList(this: ContributorList): Contrib[] {
        if (!this.contributors) {
            return [];
        }
        const contributors = this.contributors.toArray();

        if (!(contributors && contributors.length)) {
            return [];
        }

        const contribs: Contrib[] = contributors
            .filter(c => this.get('showNonBibliographic') || c.get('bibliographic'))
            .map(c => ({
                title: c.users.get('familyName') || c.users.get('givenName') || c.users.get('fullName'),
                id: c.get('unregisteredContributor') ? null : c.users.get('id'),
            }));

        return contribs;
    }

    @alias('contributorList.firstObject') first!: Contrib;
    @alias('contributors.meta.total') numContributors!: number;

    @computed('showStep')
    get useShowStep(this: ContributorList): boolean {
        return Boolean(this.showStep);
    }

    @computed('contributors.meta.total', 'displayedContribs')
    get rest(this: ContributorList): number {
        return this.contributors.meta.total - this.displayedContribs;
    }

    @computed('contributors.{length,meta.total}')
    get hasMore(this: ContributorList): boolean | undefined {
        return this.contributors ? this.contributors.toArray().length < this.contributors.meta.total : undefined;
    }

    @computed('contributors.meta.total', 'showStep', 'displayedContribs', 'useShowLess')
    get showLess(this: ContributorList): boolean {
        return (this.useShowLess as boolean) &&
              (this.displayedContribs > this.defaultStep) &&
            (this.displayedContribs >= this.contributors.meta.total);
    }

    @computed('useLinks', 'useContributorLink')
    get showContributorLink(this: ContributorList): boolean | undefined {
        return this.useLinks || this.useContributorLink;
    }

    @computed('useLinks', 'useShowMoreLink', 'node', 'hasMore')
    get showMoreLink(this: ContributorList): boolean | undefined {
        return (this.node || !this.hasMore) && (this.useLinks || this.useShowMoreLink);
    }

    @action
    more(this: ContributorList) {
        this.get('moreContribs').perform(true);
        return false;
    }

    @action
    less(this: ContributorList) {
        this.set('displayedContribs', this.defaultStep);
        return false;
    }

    didReceiveAttrs(this: ContributorList) {
        if (this.userIsBot && this.initialLoad) {
            if (this.rest > 0) {
                this.get('moreContribs').perform(true);
            }
        }
    }
}
