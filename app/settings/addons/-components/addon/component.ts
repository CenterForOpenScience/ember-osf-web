import Component from '@ember/component';

interface AddonModel {
    id: string;
}

export default class Addon extends Component {
    addon!:AddonModel;
    userAddons!:object;

    didReceiveAttrs() {
        console.log(this.addon.id);
        console.log(this.userAddons);
        //TODO: Compare user id to userAddons to see if connection exists
    }
}
