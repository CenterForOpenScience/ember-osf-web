import Component from '@glimmer/component';
import PreprintModel from 'ember-osf-web/models/preprint';
import { inject as service } from '@ember/service';
import Intl from 'ember-intl/services/intl';
import { task } from 'ember-concurrency';
import { waitFor } from '@ember/test-waiters';
import Store from '@ember-data/store';
import { taskFor } from 'ember-concurrency-ts';
import NodeModel from 'ember-osf-web/models/node';

interface NodeDisplayArgs {
    preprint: PreprintModel;
    preprintWord: string;
}

export default class PreprintNodeDisplay extends Component<NodeDisplayArgs> {
    @service intl!: Intl;
    @service store!: Store;

    preprint = this.args.preprint;
    node?: NodeModel;
    nodeId?: string;

    constructor(owner: unknown, args: NodeDisplayArgs) {
        super(owner, args);

        this.nodeId = this.preprint.belongsTo('node').id();
        taskFor(this.loadNode).perform();

    }

    get nodeDisplay(): string {
        if (this.nodeId) {
            return this.node?.title as string;
        } else {
            return this.intl.t('preprints.submit.step-five.supplement-na',
                { singularPreprintWord: this.args.preprintWord});
        }
    }

    @task
    @waitFor
    private async loadNode()  {
        if (this.nodeId) {
            this.node = await this.store.findRecord('node', this.nodeId);
        }
    }
}
