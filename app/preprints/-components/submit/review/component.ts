import Component from '@glimmer/component';
import PreprintStateMachine from 'ember-osf-web/preprints/-components/submit/preprint-state-machine/component';

/**
 * The Review Args
 */
interface ReviewArgs {
    manager: PreprintStateMachine;
}

/**
 * The Review Component
 */
export default class Review extends Component<ReviewArgs>{
    preprint = this.args.manager.preprint;
    provider = this.preprint.provider;

    public get providerLogo(): string | undefined {
        return this.provider.get('assets')?.square_color_no_transparent;

    }
}
