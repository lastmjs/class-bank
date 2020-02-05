import { 
    createStore,
    Store
} from 'redux';

export type State = {
    readonly route: Readonly<Route>;
};

export type Action = 
    SET_ROUTE |
    RENDER;

type SET_ROUTE = {
    readonly type: 'SET_ROUTE';
    readonly route: Readonly<Route>;
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