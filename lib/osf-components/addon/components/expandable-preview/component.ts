import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

interface Args {
    height?: number;
    open?: boolean;
}

export default class ExpandablePreview extends Component<Args> {
    @tracked thresholdHeight: number;
    @tracked collapsed: boolean;
    @tracked collapsible = false;
    @tracked wrapperElement?: HTMLElement;

    @action
    didInsert(element: HTMLElement) {
        this.wrapperElement = element;
        this.checkThreshold(element);
    }

    @action
    checkThreshold(element: HTMLElement) {
        if (!this.wrapperElement) {
            this.wrapperElement = element;
        }
        if (this.thresholdHeight < element.clientHeight) {
            this.collapsible = true;
            if (this.collapsed) {
                this.collapseWrapper();
            }
        }
    }

    @action
    toggleCollapse() {
        this.collapsed = !this.collapsed;
        if (this.collapsed) {
            this.collapseWrapper();
        } else {
            this.expandWrapper();
        }
    }

    @action
    collapseWrapper() {
        if (this.wrapperElement) {
            this.wrapperElement.style.maxHeight = this.thresholdHeight + 'px';
        }
    }

    @action
    expandWrapper() {
        if (this.wrapperElement) {
            this.wrapperElement.style.maxHeight = '';
        }
    }

    constructor(owner: unknown, args: Args) {
        super(owner, args);
        this.thresholdHeight = this.args.height || 200;
        this.collapsed = this.args.open ? false : true;
    }
}
