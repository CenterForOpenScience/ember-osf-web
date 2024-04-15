import Component from '@glimmer/component';
import PreprintStateMachine from 'ember-osf-web/preprints/-components/submit/preprint-state-machine/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import Intl from 'ember-intl/services/intl';

/**
 * The Supplements Args
 */
interface SupplementsArgs {
    manager: PreprintStateMachine;
}

/**
 * The Supplements Component
 */
export default class Supplements extends Component<SupplementsArgs>{
    @service intl!: Intl;

    @action
    public onConnectOsfProject(): void {
        this.validate();
    }

    @action
    public onCreateOsfProject(): void {
        this.validate();
    }

    @action
    public validate(): void {
        this.args.manager.validateSupplements(true);
    }
}
