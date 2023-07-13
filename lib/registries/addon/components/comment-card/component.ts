import Store from '@ember-data/store';
import Component from '@ember/component';
import { action, computed } from '@ember/object';
import { alias, not } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import { waitFor } from '@ember/test-waiters';
import { restartableTask, task } from 'ember-concurrency';
import { taskFor } from 'ember-concurrency-ts';
import Intl from 'ember-intl/services/intl';
import Toast from 'ember-toastr/services/toast';

import { layout } from 'ember-osf-web/decorators/component';
import Comment from 'ember-osf-web/models/comment';
import CommentReport from 'ember-osf-web/models/comment-report';
import { QueryHasManyResult } from 'ember-osf-web/models/osf-model';
import Registration from 'ember-osf-web/models/registration';
import CurrentUser from 'ember-osf-web/services/current-user';
import Ready from 'ember-osf-web/services/ready';
import captureException, { getApiErrorMessage } from 'ember-osf-web/utils/capture-exception';
import formattedTimeSince from 'ember-osf-web/utils/formatted-time-since';

import styles from './styles';
import template from './template';

enum AbuseCategories {
    Spam = 'spam',
    Hate = 'hate',
    Violence = 'violence',
}

@layout(template, styles)
export default class CommentCard extends Component {
    @service store!: Store;
    @service ready!: Ready;
    @service intl!: Intl;
    @service currentUser!: CurrentUser;
    @service toast!: Toast;

    // required arguments
    comment!: Comment;
    node!: Registration;
    reload?: () => void;

    // private arguments
    replies!: QueryHasManyResult<Comment>;
    abuseCategories: AbuseCategories[] = Object.values(AbuseCategories);

    page = 1;
    showReplies? = false;
    loadingMoreReplies? = false;

    @alias('comment.deleted') isDeleted!: boolean;
    @alias('comment.isAbuse') isAbuse!: boolean;
    @alias('comment.hasReport') currentUserHasReported!: boolean;
    @alias('comment.hasChildren') hasReplies!: boolean;
    @not('comment') loading!: boolean;

    @task
    @waitFor
    async submitRetractReport() {
        const userReports = await this.comment.reports;

        const userReport: CommentReport | undefined = userReports.find(
            (report: CommentReport) => (!report.isDeleted && (report.id !== null)),
        );

        if (!userReport) {
            this.toast.error(this.intl.t('registries.overview.comments.cannot_retract_report'));
            return;
        }

        try {
            this.comment.set('isAbuse', false);
            await userReport.destroyRecord();
        } catch (e) {
            const errorMessage = this.intl.t('registries.overview.comments.retract_report.error');
            captureException(e, { errorMessage });
            this.toast.error(getApiErrorMessage(e), errorMessage);
            this.comment.rollbackAttributes();
            userReport.rollbackAttributes();
            throw e;
        }

        this.toast.success(this.intl.t('registries.overview.comments.retract_report.success'));
    }

    @restartableTask
    @waitFor
    async loadReplies(more = false) {
        if (!more) {
            const replies = await this.comment.replies;
            if (!this.replies) {
                this.set('replies', replies);
            }
        } else {
            const moreReplies = await this.comment.queryHasMany('replies', {
                page: this.incrementProperty('page'),
                embed: ['user'],
            });

            this.replies.pushObjects(moreReplies);
            this.set('loadingMoreReplies', false);
        }
    }

    @computed('node.currentUserCanComment')
    get currentUserCanComment() {
        if (!this.node) {
            return undefined;
        }
        return this.node.currentUserCanComment;
    }

    @computed('currentUserCanComment', 'isAuthor')
    get canReport() {
        return this.currentUserCanComment && !this.isAuthor;
    }

    @computed('comment.dateCreated')
    get dateCreated() {
        return this.comment && formattedTimeSince(this.comment.dateCreated);
    }

    @computed('comment.dateModified')
    get dateModified() {
        return this.comment && formattedTimeSince(this.comment.dateModified);
    }

    @computed('replies.length', 'replies.meta.{total,per_page}')
    get hasMoreReplies(): boolean | undefined {
        return this.replies && (this.replies.meta.total > this.replies.meta.per_page)
            && (this.replies.length < this.replies.meta.total);
    }

    @computed('loadingMoreReplies', 'loadReplies.isRunning')
    get loadingReplies() {
        return taskFor(this.loadReplies).isRunning && !this.loadingMoreReplies;
    }

    @computed('comment.{canEdit,user}', 'currentUser.currentUserId')
    get isAuthor() {
        if (!this.comment) {
            return undefined;
        }
        return this.comment.canEdit
            && (this.comment.user.get('id') === this.currentUser.currentUserId);
    }

    @action
    toggleReplies() {
        this.toggleProperty('showReplies');

        if (this.showReplies) {
            taskFor(this.loadReplies).perform();
        }
    }

    @action
    more() {
        this.set('loadingMoreReplies', true);
        taskFor(this.loadReplies).perform(true);
    }
}
