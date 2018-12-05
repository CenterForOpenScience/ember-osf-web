import Component from '@ember/component';
import { w } from '@ember/string';
import { task } from 'ember-concurrency';
import DS from 'ember-data';
import moment from 'moment';

import I18n from 'ember-i18n/services/i18n';
import { pluralize } from 'ember-inflector';
import Toast from 'ember-toastr/services/toast';

import { action, computed } from '@ember-decorators/object';
import { alias } from '@ember-decorators/object/computed';
import { service } from '@ember-decorators/service';

import { layout } from 'ember-osf-web/decorators/component';
import Comment from 'ember-osf-web/models/comment';
import CommentReport from 'ember-osf-web/models/comment-report';
import { QueryHasManyResult } from 'ember-osf-web/models/osf-model';
import Registration from 'ember-osf-web/models/registration';
import User from 'ember-osf-web/models/user';
import CurrentUser from 'ember-osf-web/services/current-user';
import Ready from 'ember-osf-web/services/ready';
import styles from './styles';
import template from './template';

@layout(template, styles)
export default class CommentCard extends Component.extend({
    didReceiveAttrs(this: CommentCard, ...args: any[]) {
        this._super(...args);

        if (!this.comment) {
            return;
        }

        this.set('content', this.comment.content);
        this.set('user', this.comment.user);
        this.loadReplies.perform();
    },
    submitRetractReport: task(function *(this: CommentCard) {
        const reports = yield this.comment.reports;
        const userReport: CommentReport = reports.filter(
            (report: CommentReport) => report.reporter === this.currentUser.currentUserId,
        ).firstObject;

        if (!userReport) {
            this.toast.error(this.i18n.t('registries.overview.comments.cannot_retract_report'));
            return;
        }

        try {
            userReport.deleteRecord();
            this.comment.set('isAbuse', false);
            yield userReport.save();
            yield this.comment.save();
        } catch (e) {
            this.toast.error(this.i18n.t('registries.overview.comments.unable_to_retract_report'));
            if (this.reload) {
                this.reload();
            }
        }
    }),
    submitReport: task(function *(this: CommentCard) {
        if (!this.abuseCategory || !this.abuseDescription) {
            return;
        }

        const blocker = this.ready.getBlocker();
        const newReport = this.store.createRecord('comment-report', {
            reporter: this.currentUser.currentUserId,
            comment: this.comment,
            category: this.abuseCategory,
            message: this.abuseDescription,
        });

        try {
            this.comment.reports.pushObject(newReport);
            this.comment.set('isAbuse', true);
            yield newReport.save();
        } catch (e) {
            this.toast.error(this.i18n.t('registries.overview.comments.unable_to_report'));
            if (this.reload) {
                this.reload();
            }
        } finally {
            this.set('reportMode', false);
            blocker.done();
        }
    }),
    loadReplies: task(function *(this: CommentCard, more?: boolean) {
        const blocker = this.ready.getBlocker();

        let replies = yield this.comment.replies;

        if (!more && replies) {
            this.set('replies', replies);
            return;
        }

        replies = yield this.comment.queryHasMany('replies', {
            page: more ? this.incrementProperty('page') : this.set('page', 1),
        });

        if (more && this.replies) {
            this.replies.pushObjects(replies);
        } else {
            this.set('replies', replies);
        }

        blocker.done();
    }).restartable(),
}) {
    @service store!: DS.Store;
    @service ready!: Ready;
    @service i18n!: I18n;
    @service currentUser!: CurrentUser;
    @service toast!: Toast;

    // required arguments
    comment!: Comment;

    // optional arguments
    node!: Registration;
    user!: User;
    replies!: QueryHasManyResult<Comment>;

    abuseCategories: string[] = w('spam hate violence');
    abuseCategory?: string = 'spam';
    abuseDescription: string | undefined;

    page: number = 1;
    content?: string;
    reportMode?: boolean = false;
    showReplies?: boolean = false;

    reload?: () => void;

    @alias('loadReplies.isRunning') loadingReplies!: boolean;
    @alias('comment.deleted') isDeleted!: boolean;
    @alias('comment.isAbuse') isAbuse!: boolean;
    @alias('comment.hasReport') currentUserHasReported!: boolean;

    @computed('node')
    get currentUserCanComment() {
        if (!this.node) {
            return;
        }
        return this.node.currentUserCanComment;
    }

    @computed('currentUserCanComment', 'isAuthor')
    get canReport() {
        return this.currentUserCanComment && !this.isAuthor;
    }

    @computed('comment.dateCreated')
    get dateCreated() {
        return this.comment && this.relativeDate(this.comment.dateCreated);
    }

    @computed('comment.dateModified')
    get dateModified() {
        return this.comment && this.relativeDate(this.comment.dateModified);
    }

    @computed('replies')
    get repliesCount() {
        if (this.replies) {
            return this.replies.length;
        }
        return 0;
    }

    @computed('repliesCount')
    get repliesCountText() {
        return pluralize(
            this.repliesCount,
            (this.i18n.t('registries.overview.comments.reply')).toString(),
        );
    }

    @computed('repliesCount')
    get hideRepliesCount() {
        return this.repliesCount === 0;
    }

    @computed('abuseDescription')
    get reportIsValid() {
        const description = this.abuseDescription && this.abuseDescription.trim();
        return !!description;
    }

    @computed('replies', 'replies.meta.total')
    get hasMoreReplies(): boolean | undefined {
        return this.replies && (this.replies.meta.total - this.replies.length) > 0;
    }

    @computed('currentUser', 'comment')
    get isAuthor() {
        if (!this.comment) {
            return;
        }
        return this.comment.canEdit && (this.comment.user === this.currentUser.user);
    }

    @action
    report() {
        this.set('reportMode', true);
    }

    @action
    cancelReport() {
        this.set('reportMode', false);
        this.set('abuseDescription', '');
        this.set('abuseCategory', undefined);
    }

    @action
    more(this: CommentCard) {
        this.set('showReplies', true);
        this.loadReplies.perform(true);
    }

    relativeDate(datetime: any) {
        const now = moment.utc();
        let then = moment.utc(datetime);
        then = then > now ? now : then;
        return then.fromNow();
    }
}
