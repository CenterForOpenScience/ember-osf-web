import Component from '@glimmer/component';


/**
 * The Submit Args
 */
interface StatusFlowArgs {
    statusFlowIndex: number;
}

export default class StatusFlow extends Component<StatusFlowArgs>{
    statusFlowIndex = this.args.statusFlowIndex;
}
