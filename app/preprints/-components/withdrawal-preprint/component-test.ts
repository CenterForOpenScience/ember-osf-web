import { click, fillIn, render, settled} from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { setupRenderingTest } from 'ember-qunit';
import {TestContext} from 'ember-intl/test-support';
import { module, test } from 'qunit';
import { setupIntl } from 'ember-intl/test-support';
import { PreprintProviderReviewsWorkFlow, ReviewsState } from 'ember-osf-web/models/provider';
import PreprintModel from 'ember-osf-web/models/preprint';
import PreprintProviderModel from 'ember-osf-web/models/preprint-provider';
import { ModelInstance } from 'ember-cli-mirage';

interface ComponentTestContext extends TestContext {
    preprint: PreprintModel;
    provider: PreprintProviderModel;
    onWithdrawal: () => void;
}

module('Integration | Preprint | Component | withdrawal-preprint', hooks => {
    setupRenderingTest(hooks);
    setupMirage(hooks);
    setupIntl(hooks);

    test('it renders and shows appropriate text', async function(this: ComponentTestContext, assert) {
        this.store = this.owner.lookup('service:store');
        this.intl = this.owner.lookup('service:intl');

        server.loadFixtures('preprint-providers');
        const mirageProvider = server.schema.preprintProviders.find('osf') as ModelInstance<PreprintProviderModel>;
        const provider = await this.store.findRecord('preprint-provider', mirageProvider.id);

        server.create('preprint', {
            id: 'test',
            reviewsState: ReviewsState.PENDING,
            provider: mirageProvider,
        });
        const preprint = await this.store.findRecord('preprint', 'test');
        const onWithdrawal = () => {/* noop */};
        this.setProperties({
            preprint,
            provider,
            onWithdrawal,
        });
        await render(hbs`
<Preprints::-Components::WithdrawalPreprint
    @preprint={{this.preprint}}
    @provider={{this.provider}}
    @onWithdrawal={{this.onWithdrawal}}
/>
`);
        assert.dom('[data-test-withdrawal-button]').exists('Withdrawal button exists');
        assert.dom('[data-test-withdrawal-button]').hasText('Withdraw', 'Withdrawal button text is correct');
        await click('[data-test-withdrawal-button]');
        assert.dom('[data-test-dialog-heading').hasText('Withdraw Preprint', 'Withdrawal modal title is correct');
        assert.dom('[data-test-dialog-body]').containsText('You are about to withdraw this version of your preprint',
            'Withdrawal modal text contains versioning language');
        assert.dom('[data-test-dialog-body]').containsText(
            'Since this version is still pending approval and private, it can be withdrawn immediately',
            'Withdrawal modal text contains pending language for pre-moderation providers',
        );
        this.preprint.reviewsState = ReviewsState.ACCEPTED;
        await settled();

        assert.dom('[data-test-dialog-body]').containsText('Preprints are a permanent part of the scholarly record',
            'Withdrawal modal text contains language for published preprints');
        assert.dom('[data-test-dialog-body]').containsText(
            'This service uses pre-moderation. This request will be submitted to service moderators for review.',
            'Withdrawal modal text contains moderation language for pre-moderation providers',
        );
        this.provider.reviewsWorkflow = PreprintProviderReviewsWorkFlow.POST_MODERATION;
        await settled();

        assert.dom('[data-test-dialog-body]').containsText(
            'This service uses post-moderation. This request will be submitted to service moderators for review.',
            'Withdrawal modal text contains moderation language for post-moderation providers',
        );
        this.provider.reviewsWorkflow = null;
        await settled();

        assert.dom('[data-test-dialog-body]').containsText(
            'This request will be submitted to support@osf.io for review and removal.',
            'Withdrawal modal text contains language for providers without moderation',
        );

        assert.dom('[data-test-comment-label]').hasText('Reason for withdrawal (required): *',
            'Comment input label is correct');
        assert.dom('[data-test-comment-input] textarea').exists('Comment input exists');
        assert.dom('[data-test-comment-input] textarea').hasAttribute('placeholder', 'Comment',
            'Comment input placeholder is correct');

        assert.dom('[data-test-confirm-withdraw-button]')
            .isDisabled('Withdrawal button is disabled when form is empty');

        await fillIn('[data-test-comment-input] textarea', 'Short comment');
        assert.dom('[data-test-confirm-withdraw-button]')
            .isDisabled('Withdrawal button is disabled when comment is too short');

        await fillIn('[data-test-comment-input] textarea', 'Longer test comment that should be long enough');
        assert.dom('[data-test-confirm-withdraw-button]')
            .isEnabled('Withdrawal button is enabled when comment is long enough');
    });
});
