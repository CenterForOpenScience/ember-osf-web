import Component from '@ember/component';

interface AddonModel {
    id: string;
}

export default class Addon extends Component {
    addon!: AddonModel;
    userAddons!: [object];
    account!: object;

    setupAccountRelationship() {
        if (!this.userAddons) {
            return;
        }
        this.userAddons.forEach((userAccount: any) => {
            if (userAccount.id === this.addon.id) {
                this.set('account', userAccount);
            }
        });
    }

    didReceiveAttrs() {
        this.setupAccountRelationship();
    }
}
