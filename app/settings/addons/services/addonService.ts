import DS from 'ember-data';
import AccountModel from 'ember-osf-web/models/account';
import UserModel from 'ember-osf-web/models/user';
import UserAddonModel from 'ember-osf-web/models/user-addon';

export function bindEmberStore(service: any, store: DS.Store) {
    return (...args: any[]) => {
        return service(store, ...args);
    };
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

export async function getUserAccount(store: DS.Store, userAddon: UserAddonModel) {
    const account = await userAddon.get('account');

    if (account && account.get('id')) {
        return account;
    }
    return store.createRecord('account');
}

export async function addNewUserAccount(store: DS.Store, id: string, user: UserModel) {
    const userAddon = await getUserAddon(store, id, user);
    const account = await getUserAccount(store, userAddon);
    account.setProperties({
        addon: userAddon,
        provider: id,
        displayName: user.fullName,
    });

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
