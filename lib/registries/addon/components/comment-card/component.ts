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
        const reports = yield this.comment.reports;
        const userReport: CommentReport = reports.find(
            (report: CommentReport) => report.reporter === this.currentUser.currentUserId,
        );

        if (!userReport) {
            this.toast.error(this.i18n.t('registries.overview.comments.cannot_retract_report'));
            return;
        }

        try {
            this.comment.set('isAbuse', false);
            yield userReport.destroyRecord();
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

        const newReport = this.store.createRecord('comment-report', {
            reporter: this.currentUser.currentUserId,
            comment: this.comment,
            category: this.abuseCategory,
            message: this.abuseDescription,
        });

        try {
            this.comment.set('isAbuse', true);
            yield newReport.save();
        } catch (e) {
            this.toast.error(this.i18n.t('registries.overview.comments.unable_to_report'));
            if (this.reload) {
                this.reload();
            }
        } finally {
            this.set('reportMode', false);
        }
    }),
    loadReplies: task(function *(this: CommentCard, more = false) {
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
    abuseCategory?: AbuseCategories = AbuseCategories.Spam;
    abuseDescription: string | undefined;

    page: number = 1;
    reportMode?: boolean = false;
    showReplies?: boolean = false;

    @alias('loadReplies.isRunning') loadingReplies!: boolean;
    @alias('comment.deleted') isDeleted!: boolean;
    @alias('comment.isAbuse') isAbuse!: boolean;
    @alias('comment.hasReport') currentUserHasReported!: boolean;
    @alias('comment.hasChildren') hasReplies!: boolean;
    @not('comment') loading!: boolean;

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
        return this.comment && relativeDate(this.comment.dateCreated);
    }

    @computed('comment.dateModified')
    get dateModified() {
        return this.comment && relativeDate(this.comment.dateModified);
    }

    @computed('abuseDescription')
    get reportIsValid() {
        const description = this.abuseDescription && this.abuseDescription.trim();
        return Boolean(description);
    }

    @computed('replies.length', 'replies.meta.{total,per_page}')
    get hasMoreReplies(): boolean | undefined {
        return this.replies && (this.replies.meta.total > this.replies.meta.per_page)
            && (this.replies.length < this.replies.meta.total);
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
        this.setProperties({
            reportMode: false,
            abuseDescription: '',
            abuseCategory: undefined,
        });
    }

    @action
    more(this: CommentCard) {
        this.loadReplies.perform(true);
    }
}
