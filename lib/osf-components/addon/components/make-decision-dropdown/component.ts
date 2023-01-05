import Store from '@ember-data/store';
import Component from '@glimmer/component';
import { assert } from '@ember/debug';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { waitFor } from '@ember/test-waiters';
import { task } from 'ember-concurrency';
import { taskFor } from 'ember-concurrency-ts';
import Intl from 'ember-intl/services/intl';
import { BufferedChangeset } from 'ember-changeset/types';
import { validatePresence } from 'ember-changeset-validations/validators';
import Toast from 'ember-toastr/services/toast';
import RouterService from '@ember/routing/router-service';

import { ErrorDocument } from 'osf-api';
import CollectionSubmissionModel,
{
    CollectionSubmissionReviewStates,
    collectionSubmissionStateToDecisionMap,
    ActionableCollectionSubmissionStates,
} from 'ember-osf-web/models/collection-submission';
import {
    CollectionSubmissionActionTrigger,
    CollectionSubmissionActionTriggerToLabelMapKey,
    CollectionSubmissionActionTriggerToDescriptionKey,
} from 'ember-osf-web/models/collection-submission-action';
import RegistrationModel,
{
    RegistrationReviewStates,
    reviewsStateToDecisionMap,
    ActionableRegistrationStates,
    ActionableRevisionStates,
} from 'ember-osf-web/models/registration';
import {
    ReviewActionTrigger,
    ReviewActionTriggerToTextLabelKey,
    ReviewActionTriggerToDescriptionKey,
} from 'ember-osf-web/models/review-action';
import captureException, { getApiErrorMessage } from 'ember-osf-web/utils/capture-exception';
import { RevisionReviewStates } from 'ember-osf-web/models/schema-response';
import {
    SchemaResponseActionTrigger,
    SchemaResponseActionTriggerToLabelMapKey,
    SchemaResponseActionTriggerToDescriptionKey,
} from 'ember-osf-web/models/schema-response-action';
import buildChangeset from 'ember-osf-web/utils/build-changeset';

type AllActionTriggers = ReviewActionTrigger | SchemaResponseActionTrigger | CollectionSubmissionActionTrigger;

const CommentRequiredTriggers = [
    ReviewActionTrigger.RejectSubmission,
    ReviewActionTrigger.RejectWithdrawal,
    ReviewActionTrigger.ForceWithdraw,
    SchemaResponseActionTrigger.RejectRevision,
    CollectionSubmissionActionTrigger.Reject,
    CollectionSubmissionActionTrigger.Remove,
];
interface Args {
    registration: RegistrationModel;
    collectionSubmission: CollectionSubmissionModel;
    afterSubmit?: () => void;
}

export default class MakeDecisionDropdown extends Component<Args> {
    @service intl!: Intl;
    @service store!: Store;
    @service toast!: Toast;
    @service router!: RouterService;

    changeset!: BufferedChangeset;
    actionTriggerToLabelKey: {};
    actionTriggerToDescriptionKey: {};

    constructor(owner: unknown, args: Args) {
        super(owner, args);
        assert('Make decision dropdown requires a registration xor collection-submission',
            Boolean(args.registration) !== Boolean(args.collectionSubmission));
        if (args.registration) {
            if (this.revisionIsPending) {
                this.actionTriggerToLabelKey = SchemaResponseActionTriggerToLabelMapKey;
                this.actionTriggerToDescriptionKey = SchemaResponseActionTriggerToDescriptionKey;
            } else {
                this.actionTriggerToLabelKey = ReviewActionTriggerToTextLabelKey;
                this.actionTriggerToDescriptionKey = ReviewActionTriggerToDescriptionKey;
            }
        } else {
            this.actionTriggerToLabelKey = CollectionSubmissionActionTriggerToLabelMapKey;
            this.actionTriggerToDescriptionKey = CollectionSubmissionActionTriggerToDescriptionKey;
        }
        this.changeset = buildChangeset(
            {
                comment: undefined,
                decisionTrigger: undefined,
            },
            this.decisionDropdownValidations,
        );
        this.changeset.validate();
    }

    get latestRevision() {
        return this.args.registration.schemaResponses.firstObject;
    }

    get revisionIsPending() {
        if (this.args.registration) {
            return (this.args.registration.reviewsState === RegistrationReviewStates.Accepted
            || this.args.registration.reviewsState === RegistrationReviewStates.Embargo)
            && this.args.registration.revisionState === RevisionReviewStates.RevisionPendingModeration;
        }
        return false;
    }

    get commentTextArea() {
        if (this.args.registration) {
            return this.registrationCommentTextArea;
        } else if (this.args.collectionSubmission) {
            return this.collectionSubmissionCommentTextArea;
        }
        return {
            label: '',
            placeholder: '',
        };
    }

    get registrationCommentTextArea() {
        if (this.args.registration.reviewsState) {
            if ([RegistrationReviewStates.Pending, RegistrationReviewStates.PendingWithdraw]
                .includes(this.args.registration.reviewsState) ||
                this.revisionIsPending) {
                return {
                    label: this.intl.t('osf-components.makeDecisionDropdown.additionalComment'),
                    placeholder: this.intl.t('osf-components.makeDecisionDropdown.additionalCommentPlaceholder',
                        { targetType: this.intl.t('osf-components.makeDecisionDropdown.registration') }),
                };
            }

            return {
                label: this.intl.t('osf-components.makeDecisionDropdown.justificationForWithdrawal'),
                placeholder:
                    this.intl.t('osf-components.makeDecisionDropdown.justificationForWithdrawalPlaceholder'),
            };
        }
        // registration is viewed anonymously and this component should not be visible
        return {
            label: '',
            placeholder: '',
        };
    }

    get collectionSubmissionCommentTextArea() {
        if (this.args.collectionSubmission.reviewsState) {
            if (this.args.collectionSubmission.reviewsState === CollectionSubmissionReviewStates.Pending) {
                return {
                    label: this.intl.t('osf-components.makeDecisionDropdown.additionalComment'),
                    placeholder: this.intl.t('osf-components.makeDecisionDropdown.additionalCommentPlaceholder',
                        { targetType: this.intl.t('osf-components.makeDecisionDropdown.project') }),
                };
            }

            return {
                label: this.intl.t('osf-components.makeDecisionDropdown.justificationForRemoval'),
                placeholder:
                    this.intl.t('osf-components.makeDecisionDropdown.justificationForRemovalPlaceholder'),
            };
        }
        // collectionSubmission is viewed anonymously and this component should not be visible
        return {
            label: '',
            placeholder: '',
        };
    }

    get hasModeratorActions() {
        if (this.args.registration) {
            return (this.args.registration.reviewsState
            && ![
                RegistrationReviewStates.Initial,
                RegistrationReviewStates.Withdrawn,
                RegistrationReviewStates.Rejected,
            ].includes(this.args.registration.reviewsState))
            || this.revisionIsPending;
        } else {
            return this.args.collectionSubmission.reviewsState
                && [
                    CollectionSubmissionReviewStates.Pending,
                    CollectionSubmissionReviewStates.Accepted].includes(this.args.collectionSubmission.reviewsState);
        }
    }

    get moderatorActions() {
        if (this.args.registration) {
            const reviewsState =
                this.args.registration.reviewsState as ActionableRegistrationStates;
            const revisionState = this.args.registration.revisionState as ActionableRevisionStates;
            let actions = reviewsState ? reviewsStateToDecisionMap[reviewsState] : [];
            if (this.revisionIsPending) {
                actions = reviewsStateToDecisionMap[revisionState];
            }
            return actions;
        } else {
            const reviewsState = this.args.collectionSubmission.reviewsState as ActionableCollectionSubmissionStates;
            return reviewsState ? collectionSubmissionStateToDecisionMap[reviewsState] : [];
        }
    }

    @task
    @waitFor
    async submitDecision() {
        if (this.changeset.isInvalid) {
            return;
        }
        if (this.args.registration) {
            await taskFor(this.submitRegistrationDecision).perform();
        } else {
            await taskFor(this.submitCollectionSubmissionDecision).perform();
        }
    }

    @task
    @waitFor
    async submitRegistrationDecision() {
        const decisionTrigger = this.changeset.get('decisionTrigger');
        const comment = this.changeset.get('comment');
        if (decisionTrigger) {
            const isSchemaResponseAction = ([
                SchemaResponseActionTrigger.RejectRevision, SchemaResponseActionTrigger.AcceptRevision,
            ] as AllActionTriggers[]).includes(decisionTrigger);
            const actionType = isSchemaResponseAction ? 'schema-response-action' : 'review-action';
            const target = isSchemaResponseAction ? this.args.registration.schemaResponses.firstObject
                : this.args.registration;
            const newAction = this.store.createRecord(actionType, {
                actionTrigger: decisionTrigger,
                comment: (comment ? comment : undefined),
                target,
            });
            try {
                await newAction.save();
                this.toast.success(this.intl.t('osf-components.makeDecisionDropdown.success'));
                if (decisionTrigger === ReviewActionTrigger.RejectSubmission) {
                    this.router.transitionTo(
                        'registries.branded.moderation.submitted',
                        this.args.registration.provider.get('id'),
                        { queryParams: { state: RegistrationReviewStates.Rejected } },
                    );
                } else if (decisionTrigger === SchemaResponseActionTrigger.RejectRevision) {
                    this.router.transitionTo(
                        'registries.branded.moderation.submitted',
                        this.args.registration.provider.get('id'),
                        { queryParams: { state: RevisionReviewStates.RevisionPendingModeration } },
                    );
                }
                this.args.registration.reload();
                this.reset();
                if (this.args.afterSubmit) {
                    this.args.afterSubmit();
                }
            } catch (e) {
                this.catchError(e);
            }
        }
    }

    @task
    @waitFor
    async submitCollectionSubmissionDecision() {
        const decisionTrigger = this.changeset.get('decisionTrigger');
        const comment = this.changeset.get('comment');
        if (decisionTrigger) {
            const target = this.args.collectionSubmission;
            const newAction = this.store.createRecord('collection-submission-action', {
                actionTrigger: decisionTrigger,
                comment: (comment ? comment : undefined),
                target,
            });
            try {
                await newAction.save();
                this.toast.success(this.intl.t('osf-components.makeDecisionDropdown.success'));
                this.args.collectionSubmission.reload();
                this.reset();
                if (this.args.afterSubmit) {
                    this.args.afterSubmit();
                }
            } catch (e) {
                this.catchError(e);
            }
        }
    }

    @action
    updateDecisionTrigger(trigger: ReviewActionTrigger) {
        this.changeset.set('decisionTrigger', trigger);
        this.changeset.validate();
    }

    catchError(e: ErrorDocument) {
        const errorMessage = this.intl.t('osf-components.makeDecisionDropdown.failure');
        captureException(e, { errorMessage });
        this.toast.error(getApiErrorMessage(e), errorMessage);
    }

    reset() {
        this.changeset.rollback();
    }

    decisionDropdownValidations = {
        comment: this.commentValidation.bind(this),
        decisionTrigger: validatePresence({
            presence: true,
            ignoreBlank: true,
            allowBlank: false,
            allowNone: false,
        }),
    };

    commentValidation() {
        const decisionTrigger = this.changeset.get('decisionTrigger');
        const comment = this.changeset.get('comment');
        if (decisionTrigger && CommentRequiredTriggers.includes(decisionTrigger) && !comment) {
            return {
                context: {
                    type: 'moderator_comment',
                },
            };
        }
        return true;
    }
}
