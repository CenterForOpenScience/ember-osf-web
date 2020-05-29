import { tagName } from '@ember-decorators/component';
import Component from '@ember/component';
import { tracked } from '@glimmer/tracking';
import { task } from 'ember-concurrency-decorators';
import { layout } from 'ember-osf-web/decorators/component';
import ContributorModel from 'ember-osf-web/models/contributor';
import DraftRegistrationModel from 'ember-osf-web/models/draft-registration';
import NodeModel from 'ember-osf-web/models/node';
import template from './template';

@layout(template)
@tagName('')
export default class ContributorsManager extends Component {
    node?: NodeModel | DraftRegistrationModel;
    @tracked contributors: ContributorModel[] = [];
    @tracked totalPage: number = 1;
    @tracked currentPage: number = 1;

    get hasMore() {
        return this.currentPage <= this.totalPage;
    }

    @task({ on: 'init', enqueue: true })
    fetchContributors = task(function *(this: ContributorsManager) {
        if (this.node && this.hasMore) {
            const currentPageResult = yield this.node.queryHasMany('contributors', {
                page: this.currentPage,
            });
            this.totalPage = Math.ceil(currentPageResult.meta.total / currentPageResult.meta.per_page);
            this.contributors.pushObjects(currentPageResult);
            this.currentPage = this.currentPage + 1;
        }
    });
}
