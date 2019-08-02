import Component from '@ember/component';
import { task } from 'ember-concurrency';
import DS from 'ember-data';
import moment from 'moment';

import I18n from 'ember-i18n/services/i18n';
import Toast from 'ember-toastr/services/toast';

import { action, computed } from '@ember-decorators/object';
import { alias, not } from '@ember-decorators/object/computed';
import { service } from '@ember-decorators/service';

import { layout } from 'ember-osf-web/decorators/component';
import Comment from 'ember-osf-web/models/comment';
import CommentReport from 'ember-osf-web/models/comment-report';
import { QueryHasManyResult } from 'ember-osf-web/models/osf-model';
import Registration from 'ember-osf-web/models/registration';
import CurrentUser from 'ember-osf-web/services/current-user';
import Ready from 'ember-osf-web/services/ready';
import styles from './styles';
import template from './template';

enum AbuseCategories {
    Spam = 'spam',
    Hate = 'hate',
    Violence = 'violence',
}

export function relativeDate(datetime: any) {
    const now = moment.utc();
    let then = moment.utc(datetime);
    then = then > now ? now : then;
    return then.fromNow();
}

@layout(template, styles)
export default class CommentCard extends Component.extend({
    submitRetractReport: task(function *(this: CommentCard) {
        const userReports: CommentReport[] = yield this.comment.reports;

        const userReport: CommentReport | undefined = userReports.find(
            (report: CommentReport) => (!report.isDeleted && (report.id !== null)),
        );

        if (!userReport) {
            this.toast.error(this.i18n.t('registries.overview.comments.cannot_retract_report'));
            return;
        }

        try {
            this.comment.set('isAbuse', false);
            yield userReport.destroyRecord();
        } catch (e) {
            this.toast.error(this.i18n.t('registries.overview.comments.retract_report.error'));
            this.comment.rollbackAttributes();
            userReport.rollbackAttributes();
            throw e;
        }

        this.toast.success(this.i18n.t('registries.overview.comments.retract_report.success'));
    }),
    loadReplies: task(function *(this: CommentCard, more: boolean = false) {
        if (!more) {
            const replies = yield this.comment.replies;
            if (!this.replies) {
                this.set('replies', replies);
            }
        } else {
            const moreReplies = yield this.comment.queryHasMany('replies', {
                page: this.incrementProperty('page'),
                embed: ['user'],
            });

            this.replies.pushObjects(moreReplies);
            this.set('loadingMoreReplies', false);
        }
    }).restartable(),
}) {
    @service store!: DS.Store;
    @service ready!: Ready;
    @service i18n!: I18n;
    @service currentUser!: CurrentUser;
    @service toast!: Toast;

    // required arguments
    comment!: Comment;
    node!: Registration;
    reload?: () => void;

    // private arguments
    replies!: QueryHasManyResult<Comment>;
    abuseCategories: AbuseCategories[] = Object.values(AbuseCategories);

    page: number = 1;
    reporting?: boolean = false;
    showReplies?: boolean = false;
    loadingMoreReplies?: boolean = false;

    @alias('comment.deleted') isDeleted!: boolean;
    @alias('comment.isAbuse') isAbuse!: boolean;
    @alias('comment.hasReport') currentUserHasReported!: boolean;
    @alias('comment.hasChildren') hasReplies!: boolean;
    @not('comment') loading!: boolean;

    @computed('node')
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
        return this.comment && relativeDate(this.comment.dateCreated);
    }

    @computed('comment.dateModified')
    get dateModified() {
        return this.comment && relativeDate(this.comment.dateModified);
    }

    @computed('replies.length', 'replies.meta.{total,per_page}')
    get hasMoreReplies(): boolean | undefined {
        return this.replies && (this.replies.meta.total > this.replies.meta.per_page)
            && (this.replies.length < this.replies.meta.total);
    }

    @computed('loadingMoreReplies', 'loadReplies.isRunning')
    get loadingReplies() {
        return this.loadReplies.isRunning && !this.loadingMoreReplies;
    }

    @computed('currentUser', 'comment')
    get isAuthor() {
        if (!this.comment) {
            return undefined;
        }
        return this.comment.canEdit &&
            (this.comment.user.get('id') === this.currentUser.currentUserId);
    }

    @action
    report() {
        this.set('reporting', true);
    }

    @action
    cancelReport() {
        this.set('reporting', false);
    }

    @action
    onSave() {
        this.toast.success(this.i18n.t('registries.overview.comments.create_report.success'));
        this.comment.setProperties({
            isAbuse: true,
            hasReport: true,
        });
        this.set('reporting', false);
    }

    @action
    toggleReplies() {
        this.toggleProperty('showReplies');

        if (this.showReplies) {
            this.loadReplies.perform();
        }
    }

    @action
    onError() {
        this.comment.rollbackAttributes();
        this.toast.error(this.i18n.t('registries.overview.comments.create_report.error'));
    }

    @action
    more(this: CommentCard) {
        this.set('loadingMoreReplies', true);
        this.loadReplies.perform(true);
    }
}
