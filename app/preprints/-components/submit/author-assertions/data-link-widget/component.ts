import Component from '@glimmer/component';
import PreprintStateMachine from 'ember-osf-web/preprints/-components/submit/preprint-state-machine/component';
import { action, notifyPropertyChange } from '@ember/object';
import { inject as service } from '@ember/service';
import Intl from 'ember-intl/services/intl';
import { tracked } from '@glimmer/tracking';


/**
 * The Data Link Widget Args
 */
interface DataLinkWidgetArgs {
    manager: PreprintStateMachine;
    update: (_: string[]) => {};
}

/**
 * The Data Link Widget Component
 */
export default class DataLinkWidget extends Component<DataLinkWidgetArgs>{
    @service intl!: Intl;
    @tracked links: string[] = [''];

    @action
    public async onUpdate(value: string, index: number): Promise<void> {
        this.links[index] = value;
        this.args.update(this.links);
    }

    @action
    public async addLink(): Promise<void> {
        this.links.push('');
        notifyPropertyChange(this, 'links');
    }
}
