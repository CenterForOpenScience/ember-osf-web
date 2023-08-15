import Component from '@glimmer/component';

interface InputArgs {
    footerLinks: string;
}

export default class BrandedFooter extends Component<InputArgs> {
    footerLinks = this.args.footerLinks;

    get hasFooters(): boolean {
        return this.footerLinks !== '' && this.footerLinks !== undefined;
    }
}
