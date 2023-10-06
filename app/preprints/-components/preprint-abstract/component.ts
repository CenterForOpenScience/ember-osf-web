import { action } from '@ember/object';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import PreprintModel from 'ember-osf-web/models/preprint';

interface InputArgs {
    preprint: PreprintModel;
}

export default class PreprintAbstract extends Component<InputArgs> {
    preprint = this.args.preprint;

    @tracked expandedAbstract =  navigator.userAgent.includes('Prerender');

    get hasShortenedDescription(): boolean {
        return this.preprint.description !== undefined && this.preprint.description.length > 350;
    }

    private get useShortenedDescription(): boolean {
        return this.hasShortenedDescription && !this.expandedAbstract;
    }

    /**
     * description
     *
     * @description Get a shortened version of the abstract, but doesn't cut in the middle of word
     *      by going to the last space.
     * @returns string
     */
    public get description(): string {
        if (this.useShortenedDescription) {
            return this.preprint.description
                .slice(0, 350)
                .replace(/\s+\S*$/, '');
        } else {
            return this.preprint.description;
        }
    }

    @action
    public expandAbstract() {
        this.expandedAbstract = !this.expandedAbstract;
    }
}
