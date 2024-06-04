import Component from '@glimmer/component';
import { action, notifyPropertyChange } from '@ember/object';
import { inject as service } from '@ember/service';
import Intl from 'ember-intl/services/intl';
import { tracked } from '@glimmer/tracking';


/**
 * The Data Link Widget Args
 */
interface LinkWidgetArgs {
    update: (_: string[]) => {};
    links: string[];
}

/**
 * The Data Link Widget Component
 */
export default class LinkWidget extends Component<LinkWidgetArgs>{
    @service intl!: Intl;
    @tracked links: string[] = [''];

    constructor(owner: unknown, args: LinkWidgetArgs) {
        super(owner, args);

        if (this.args.links?.length > 0) {
            this.links = this.args.links;
        }
    }

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
