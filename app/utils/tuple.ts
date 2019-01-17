type Lit = string | number | boolean | undefined | null | void | {};
export default <T extends Lit[]>(...args: T) => args;
