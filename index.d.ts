import { 
    createStore,
    Store
} from 'redux';

export type GlobalState = {
    readonly route: Readonly<Route>;
    readonly studentGroups: Readonly<StudentGroups>;
    readonly studentAccounts: Readonly<StudentAccounts>;
    readonly topBarText: string;
};

export type StudentGroups = Readonly<{
    [id: string]: Readonly<StudentGroup>;
}>;

export type StudentAccounts = Readonly<{
    [id: string]: Readonly<StudentAccount>;
}>;

export type Action = 
    UPDATE_STUDENT_NAME |
    SET_TOP_BAR_TEXT |
    ADD_TO_BALANCE |
    CREATE_STUDENT_GROUP |
    CREATE_STUDENT_ACCOUNT |
    SET_ROUTE |
    RENDER;

type ADD_TO_BALANCE = {
    readonly type: 'ADD_TO_BALANCE';
    readonly studentAccountId: string;
    readonly amount: USDCents;
};

type SET_ROUTE = {
    readonly type: 'SET_ROUTE';
    readonly route: Readonly<Route>;
};

type CREATE_STUDENT_GROUP = {
    readonly type: 'CREATE_STUDENT_GROUP';
    readonly name: string;
};

type CREATE_STUDENT_ACCOUNT = {
    readonly type: 'CREATE_STUDENT_ACCOUNT';
    readonly id: string;
    readonly studentGroupId: string;
    readonly name: string;
};

type UPDATE_STUDENT_NAME = {
    readonly type: 'UPDATE_STUDENT_NAME';
    readonly studentAccountId: string;
    readonly name: string;
}

type RENDER = {
    readonly type: 'RENDER';
};

type SET_TOP_BAR_TEXT = {
    readonly type: 'SET_TOP_BAR_TEXT';
    readonly topBarText: string;
};

export type CBGlobalStore = Readonly<Store<Readonly<GlobalState>, Readonly<Action>>>;

export type Route = {
    readonly pathname: string;
    readonly search: string;
};

type USDCents = number;

export type StudentGroup = {
    readonly id: string;
    readonly name: string;
};

export type StudentAccount = {
    readonly id: string;
    readonly name: string;
    readonly balance: USDCents;
    readonly studentGroupId: string;
    // barcode: string; // TODO I am not sure what this type will actually be, we might be able to just generate it from the id
};