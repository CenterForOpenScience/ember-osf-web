import Component from '@glimmer/component';

interface InputArgs {
    links: string[];
    analyticsName: string;
}

export default class PreprintAssertionLink extends Component<InputArgs> {
    links = this.args.links;
    analyticsName = this.args.analyticsName;
}

