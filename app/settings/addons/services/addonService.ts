import UserModel from 'ember-osf-web/models/user';
import AccountModel from 'ember-osf-web/models/account';
import UserAddonModel from 'ember-osf-web/models/user-addon';
import DS from 'ember-data';

interface AccountData {
    providerId: string;
    displayName: string;
    userAddon: UserAddonModel;
}

export function bindEmberStore(service: any, store: DS.Store) {
    return function(...args: any[]) {
        return service(store, ...args);
    }
}

export function getAppAddons(store: DS.Store) {
    return store.query('addon', {});
}

export function getAllUserAddons(store: DS.Store, id: string) {
    return store.findRecord('user', id, { include: 'addons' });
}

export async function getUserAddon(store: DS.Store, id: string, user: UserModel) {
    let userAddon = store.peekRecord('user-addon', id);
    if (!userAddon) {
        userAddon = store.createRecord('user-addon', {
            id,
            userHasAuth: true,
            user,
        });
    }

    return userAddon;
}

export async function getUserAccount(userAddon: UserAddonModel) {
    const account = await userAddon.get('account');

    if(account && account.get('id')) {
        return account;
    }
    return null;
}

export async function addNewUserAccount(account: AccountModel, data: AccountData) {
    const { userAddon, providerId, displayName } = data;

    account.setProperties({
        addon: userAddon,
        provider: providerId,
        displayName,
    });
    userAddon.set('account', account);

    await userAddon.save();
    await account.save();
}

export async function deleteUserAddon(store: DS.Store, id: string) {
    const userAddon: UserAddonModel = await store.findRecord(
        'user-addon',
        id,
        { backgroundReload: false },
    );

    await userAddon.destroyRecord();
    return store.unloadRecord(userAddon);
}

export async function deleteAccount(store: DS.Store, id: string) {
    const account: AccountModel = await store.findRecord(
        'account',
        id,
        { backgroundReload: false },
    );

    await account.destroyRecord();
    return store.unloadRecord(account);
}

