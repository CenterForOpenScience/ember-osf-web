export function make(factory: string, data?: object);
export function setupFactoryGuy(hooks: any);

class Mock {
    returns(object): void;
}

export function mockFindRecord(model: string): Mock;
