import Controller from '@ember/controller';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import Media from 'ember-responsive';

import { CollectionSubmissionReviewStates, SubmissionIconMap } from 'ember-osf-web/models/collection-submission';


export default class CollectionsModerationAllController extends Controller {
    @service media!: Media;

    queryParams = ['state'];

    @tracked state?: CollectionSubmissionReviewStates;
    @tracked sort = '-date_created';

    submissionIconMap = SubmissionIconMap;
    reloadSubmissionList?: (page?: number) => void; // bound by paginated-list

    get isMobile() {
        return this.media.isMobile;
    }

    get query() {
        return {
            filter: {
                reviews_state: this.state,
            },
            // TBD: '-modified'?? Check if API has dateModified based on actions
            sort: this.sort,
        };
    }

    @action
    changeTab(tab: CollectionSubmissionReviewStates) {
        this.state = tab;
    }
}
