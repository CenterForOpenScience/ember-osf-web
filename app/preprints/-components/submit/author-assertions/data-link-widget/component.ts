import Component from '@glimmer/component';
import { action, notifyPropertyChange } from '@ember/object';
import { inject as service } from '@ember/service';
import Intl from 'ember-intl/services/intl';
import { tracked } from '@glimmer/tracking';


/**
 * The Data Link Widget Args
 */
interface DataLinkWidgetArgs {
    update: (_: string[]) => {};
}

/**
 * The Data Link Widget Component
 */
export default class DataLinkWidget extends Component<DataLinkWidgetArgs>{
    @service intl!: Intl;
    @tracked links: string[] = [''];

    @action
    public onUpdate(value: string, index: number): void {
        this.links[index] = value;
        this.args.update(this.links);
        notifyPropertyChange(this, 'links');
    }

    @action
    public addLink(): void {
        this.links.push('');
        notifyPropertyChange(this, 'links');
        this.args.update(this.links);
    }

    @action
    public removeLink(index: number): void {
        if (index === 0 && this.links.length === 1) {
            this.onUpdate('', index);
        } else {
            this.links.splice(index, 1);
            this.args.update(this.links);
        }
        notifyPropertyChange(this, 'links');
    }
}
