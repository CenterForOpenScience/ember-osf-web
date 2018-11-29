import { layout } from '@ember-decorators/component';
import { action, computed } from '@ember-decorators/object';
import { alias, or } from '@ember-decorators/object/computed';
import { service } from '@ember-decorators/service';
import Component from '@ember/component';
import { w } from '@ember/string';
import { task } from 'ember-concurrency';
import DS from 'ember-data';
import I18n from 'ember-i18n/services/i18n';
import { pluralize } from 'ember-inflector';
import Comment from 'ember-osf-web/models/comment';
import CommentReport from 'ember-osf-web/models/comment-report';
import { QueryHasManyResult } from 'ember-osf-web/models/osf-model';
import Registration from 'ember-osf-web/models/registration';
import User from 'ember-osf-web/models/user';
import CurrentUser from 'ember-osf-web/services/current-user';
import Ready from 'ember-osf-web/services/ready';
import defaultTo from 'ember-osf-web/utils/default-to';
import Toast from 'ember-toastr/services/toast';
import moment from 'moment';
import styles from './styles';
import template from './template';

@layout(template)
export default class CommentCard extends Component.extend({
    didReceiveAttrs(this: CommentCard, ...args: any[]) {
        this._super(...args);
        if (!this.comment) {
            return;
        }

        if (this.createMode || this.replyMode) {
            this.set('user', this.currentUser.user as User);
        } else {
            this.set('content', this.comment.content);
            this.set('user', this.comment.user);
            this.loadReplies.perform();
        }
    },
    submitRetractReport: task(function *(this: CommentCard) {
        const reports = yield this.comment.reports;
        const userReport: CommentReport = reports.filter(
            (report: CommentReport) => report.reporter === this.currentUser.currentUserId,
        ).firstObject;

        if (!userReport) {
            return;
        }

        try {
            userReport.deleteRecord();
            this.comment.set('isAbuse', false);
            yield userReport.save();
            yield this.comment.save();
        } catch (e) {
            this.toast.error(this.i18n.t('registries.overview.comments.unable_to_retract_report'));
            throw e;
        } finally {
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
            throw e;
        } finally {
            this.set('reportMode', true);

            if (this.reload) {
                this.reload();
            }

            blocker.done();
        }
    }),
    submitRestore: task(function *(this: CommentCard) {
        try {
            this.comment.set('deleted', false);
            yield this.comment.save();
        } catch (e) {
            this.toast.error(this.i18n.t('registries.overview.comments.unable_to_restore'));
            if (this.reload) {
                this.reload();
            }
            throw e;
        }
    }),
    submitDelete: task(function *(this: CommentCard) {
        try {
            this.comment.set('deleted', true);
            yield this.comment.save();
        } catch (e) {
            this.toast.error(this.i18n.t('registries.overview.comments.unable_to_delete'));
            if (this.reload) {
                this.reload();
            }
            throw e;
        } finally {
            this.set('deleteMode', false);
        }
    }),
    submitReply: task(function *(this: CommentCard) {
        const blocker = this.ready.getBlocker();
        const node = yield this.comment.node;

        const newReply = this.store.createRecord('comment', {
            node,
            user: this.currentUser.user,
            content: this.content,
            targetID: this.comment.id,
            targetType: 'comments',
        });

        try {
            this.comment.replies.pushObject(newReply);
            yield newReply.save();
        } catch (e) {
            this.toast.error(this.i18n.t('registries.overview.comments.unable_to_reply'));
            throw e;
        } finally {
            this.set('content', undefined);
            this.set('showCreateReply', false);

            if (this.onReply) {
                this.onReply();
            }

            blocker.done();
        }
    }),
    submitCreate: task(function *(this: CommentCard) {
        const blocker = this.ready.getBlocker();

        const newComment = this.store.createRecord('comment', {
            node: this.node,
            user: this.currentUser.user,
            content: this.content,
            targetID: this.node.id,
            targetType: 'registrations',
        });
        try {
            this.node.comments.pushObject(newComment);
            yield newComment.save();
        } catch (e) {
            this.toast.error(this.i18n.t('registries.overview.comments.unable_to_create'));
            throw e;
        } finally {
            if (this.onCreate) {
                this.onCreate();
            }
            this.set('content', undefined);
            blocker.done();
        }
    }),
    submitEdit: task(function *(this: CommentCard) {
        if (this.content === this.preEditContent) {
            return;
        }

        const blocker = this.ready.getBlocker();
        if (this.content !== this.preEditContent) {
            try {
                this.comment.set('content', this.content as string);
                return yield this.comment.save();
            } catch (e) {
                this.toast.error(this.i18n.t('registries.overview.comments.unable_to_edit'));
                this.set('content', this.preEditContent);
                throw e;
            } finally {
                this.set('editMode', false);
                blocker.done();
            }
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
    styles = styles;

    @service store!: DS.Store;
    @service ready!: Ready;
    @service i18n!: I18n;
    @service currentUser!: CurrentUser;
    @service toast!: Toast;

    // TODO: Handle Creating a comment: DONE
    // TODO: Handle Replying a comment: DONE
    // TODO: Display replies, nested replies: DONE
    // TODO: Handle Editing a comment: DONE
    // TODO: Handle Reporting comment as spam, ham
    // TODO: Handle Deleting a comment: DONE
    // TODO: Handle Restoring a deleted comment: DONE

    // required arguments
    comment!: Comment;

    // optional arguments
    node!: Registration;
    user!: User;
    replies!: QueryHasManyResult<Comment>;

    abuseCategories: string[] = w('spam hate violence');

    abuseDescription: string | undefined;
    abuseCategory: string | undefined;

    @or('submitEdit.isRunning',
        'submitDelete.isRunning',
        'submitCreate.isRunning',
        'submitReport.isRunning') saving!: boolean;

    @alias('loadReplies.isRunning') loadingReplies!: boolean;
    @alias('comment.deleted') isDeleted!: boolean;
    @alias('comment.isAbuse') isAbuse!: boolean;

    page: number = 1;
    content?: string | undefined = undefined;
    editMode?: boolean = defaultTo(this.editMode, false);
    createMode?: boolean = defaultTo(this.createMode, false);
    replyMode?: boolean = defaultTo(this.replyMode, false);
    deleteMode?: boolean = false;
    reportMode?: boolean = false;
    preEditContent?: string = '';
    showReplies?: boolean = false;
    showCreateReply?: boolean = false;

    reload?: () => void;
    onReply?: () => void;
    onCreate?: () => void;

    @computed('isDeleted', 'isAbuse')
    get isDeletedAbuse() {
        return this.isDeleted && this.isAbuse;
    }

    @computed('isDeleted', 'isAbuse')
    get isDeletedNotAbuse() {
        return this.isDeleted && !this.isAbuse;
    }

    @computed('isDeleted', 'isAbuse')
    get isAbuseNotDeleted() {
        return !this.isDeleted && this.isAbuse;
    }

    @or('isAbuseNotDeleted', 'isDeletedNotAbuse', 'isDeletedAbuse') isAbuseOrDeleted!: boolean;

    @computed('node')
    get currentUserCanComment() {
        if (!this.node) {
            return;
        }
        return this.node.currentUserCanComment;
    }

    @computed('isAbuseOrDeleted')
    get reportInfo() {
        if (this.isAbuseOrDeleted) {
            return (this.isDeletedNotAbuse && {
                text: 'registries.overview.comments.comment_deleted',
                actionText: 'registries.overview.comments.comment_deleted_action',
                action: this.submitRestore,
            }) || (this.isAbuseNotDeleted && {
                text: 'registries.overview.comments.comment_abuse',
                actionText: 'registries.overview.comments.comment_abuse_action',
                action: this.submitRetractReport,
            }) || (this.isDeletedAbuse && {
                text: 'registries.overview.comments.comment_deleted_abuse',
                actionText: '',
            });
        }
        return {};
    }

    @computed('editMode', 'createMode', 'replyMode', 'deleteMode', 'reportMode', 'contentIsValid')
    get showFormButtons() {
        return (
            this.editMode ||
            this.createMode ||
            this.deleteMode ||
            this.replyMode ||
            this.reportMode
        ) && this.contentIsValid;
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

    @computed('content', 'reportMode', 'abuseCategory', 'abuseDescription')
    get contentIsValid() {
        if (this.reportMode) {
            return (this.abuseCategory && this.abuseDescription && this.notEmpty('abuseDescription'));
        }
        return this.content && this.notEmpty(this.content);
    }

    @computed('replies.meta.total', 'replies')
    get hasMoreReplies(): boolean | undefined {
        return false;
        // return this.replies && (this.replies.meta.total - this.replies.length) > 0;
    }

    @computed('currentUser', 'comment')
    get isAuthor() {
        if (!this.comment) {
            return;
        }
        return this.comment.canEdit && (this.comment.user === this.currentUser.user);
    }

    @computed('createMode', 'editMode', 'deleteMode', 'replyMode', 'reportMode')
    get submit() {
        return (this.createMode && {
            text: 'registries.overview.comments.comment',
            submitTask: this.submitCreate,
            cancelAction: this.cancelEdit,
            class: 'save',
        }) || (this.editMode && {
            text: 'registries.overview.comments.save',
            submitTask: this.submitEdit,
            cancelAction: this.cancelEdit,
            class: 'save',
        }) || (this.deleteMode && {
            text: 'registries.overview.comments.delete',
            submitTask: this.submitDelete,
            cancelAction: this.cancelDelete,
            class: 'delete',
        }) || (this.replyMode && {
            text: 'registries.overview.comments.reply',
            submitTask: this.submitReply,
            cancelAction: this.cancelReply,
            class: 'save',
        }) || (this.reportMode && {
            text: 'registries.overview.comments.report',
            submitTask: this.submitReport,
            cancelAction: this.cancelReport,
            class: 'save',
        });
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
    edit() {
        this.setProperties({
            editMode: true,
            preEditContent: this.content,
        });
    }

    @action
    cancelEdit(this: CommentCard) {
        this.set('editMode', false);
        this.set('content', this.preEditContent as string);
    }

    @action
    delete(this: CommentCard) {
        this.set('deleteMode', true);
    }

    @action
    cancelDelete(this: CommentCard) {
        this.set('deleteMode', false);
    }

    @action
    cancelReply(this: CommentCard) {
        this.set('content', undefined);
        this.set('showReplies', false);
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

    notEmpty(value: string): boolean {
        const trimmed = value.trim().toLowerCase();
        return !!trimmed && trimmed !== '<br>';
    }
}
