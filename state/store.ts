import { 
    createStore
} from 'redux';
import {
    State,
    Action,
    CBStore
} from '../index.d';

const InitialState: Readonly<State> = {
    route: {
        pathname: '/',
        search: ''
    }
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

    return state;
}

export const Store: Readonly<CBStore> = createStore(rootReducer);