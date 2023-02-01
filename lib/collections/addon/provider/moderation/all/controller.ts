import Controller from '@ember/controller';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import IntlService from 'ember-intl/services/intl';
import Media from 'ember-responsive';

import { CollectionSubmissionReviewStates, SubmissionIconMap } from 'ember-osf-web/models/collection-submission';

interface SortOption {
    label: string;
    value: string;
}

export default class CollectionsModerationAllController extends Controller {
    @service intl!: IntlService;
    @service media!: Media;

    queryParams = ['state'];

    @tracked state?: CollectionSubmissionReviewStates;
    @tracked sort = { label: this.intl.t('collections.moderation.all.sort.date_descending'), value: '-date_modified' };

    states = [
        CollectionSubmissionReviewStates.Pending,
        CollectionSubmissionReviewStates.Accepted,
        CollectionSubmissionReviewStates.Rejected,
        CollectionSubmissionReviewStates.Removed,
    ];
    submissionIconMap = SubmissionIconMap;
    sortOptions: SortOption[]  = [
        { label: this.intl.t('collections.moderation.all.sort.date_descending'), value: '-date_modified' },
        { label: this.intl.t('collections.moderation.all.sort.date_ascending'), value: 'date_modified' },
        { label: this.intl.t('collections.moderation.all.sort.title_ascending'), value: 'title' },
        { label: this.intl.t('collections.moderation.all.sort.title_descending'), value: '-title' },
    ];
    reloadSubmissionList?: (page?: number) => void; // bound by paginated-list

    get isMobile() {
        return this.media.isMobile;
    }

    get query() {
        return {
            filter: {
                reviews_state: this.state,
            },
            sort: this.sort.value,
        };
    }

    @action
    onSortChange(option: SortOption) {
        this.sort = option;
    }

    @action
    changeTab(tab: CollectionSubmissionReviewStates) {
        this.state = tab;
    }
}
