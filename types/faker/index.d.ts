declare module 'faker' {
    namespace Faker {
        interface FakerStatic {
            // added by ember-cli-mirage
            list: {
                cycle<T>(...args: T[]): (i: number) => T;
                random<T>(...args: T[]): (i: number) => T;
            };
        }
    }
}
