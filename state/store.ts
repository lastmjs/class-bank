import { 
    createStore
} from 'redux';
import {
    State,
    Action,
    CBStore,
    Class,
    Account
} from '../index.d';
import {
    uuid
} from '../services/utilities';

const persistedState: Readonly<State> | null = JSON.parse(window.localStorage.getItem('state'));

const InitialState: Readonly<State> = persistedState || {
    route: {
        pathname: '/',
        search: ''
    },
    classes: {},
    accounts: {}
};

function rootReducer(
    state: Readonly<State> = InitialState,
    action: Readonly<Action>
): Readonly<State> {

    if (action.type === 'SET_ROUTE') {
        return {
            ...state,
            route: action.route
        };
    }

    if (action.type === 'CREATE_CLASS') {
        const newClass: Readonly<Class> = {
            id: uuid(),
            name: action.name
        };

        return {
            ...state,
            classes: {
                ...state.classes,
                [newClass.id]: newClass
            }
        };
    }

    if (action.type === 'CREATE_ACCOUNT') {
        const newAccount: Readonly<Account> = {
            id: action.id,
            name: action.name,
            classId: action.classId,
            balance: 0
        };

        return {
            ...state,
            accounts: {
                ...state.accounts,
                [newAccount.id]: newAccount
            }
        };
    }

    return state;
}

export const Store: Readonly<CBStore> = createStore((state: Readonly<State>, action: Readonly<Action>) => {
    const newState: Readonly<State> = rootReducer(state, action);

    window.localStorage.setItem('state', JSON.stringify(newState));

    return newState;
});