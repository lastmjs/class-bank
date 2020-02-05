import { 
    createStore,
    Store
} from 'redux';

export type State = {
    readonly route: Readonly<Route>;
    readonly classes: Readonly<{
        [id: string]: Readonly<Class>;
    }>;
    readonly accounts: Readonly<{
        [id: string]: Readonly<Account>;
    }>;
};

export type Action = 
    CREATE_CLASS |
    CREATE_ACCOUNT |
    SET_ROUTE |
    RENDER;

type SET_ROUTE = {
    readonly type: 'SET_ROUTE';
    readonly route: Readonly<Route>;
};

type CREATE_CLASS = {
    readonly type: 'CREATE_CLASS';
    readonly name: string;
};

type CREATE_ACCOUNT = {
    readonly type: 'CREATE_ACCOUNT';
    readonly id: string;
    readonly classId: string;
    readonly name: string;
};

type RENDER = {
    readonly type: 'RENDER';
};

export type CBStore = Readonly<Store<Readonly<State>, Readonly<Action>>>;

export type Route = {
    pathname: string;
    search: string;
};

type USDCents = number;

export type Class = {
    id: string;
    name: string;
};

export type Account = {
    id: string;
    name: string;
    balance: USDCents;
    classId: string;
    // barcode: string; // TODO I am not sure what this type will actually be, we might be able to just generate it from the id
};