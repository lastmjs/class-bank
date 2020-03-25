import { 
    createStore
} from 'reduxular';
import {
    GlobalState,
    Action,
    CBGlobalStore,
    StudentGroup,
    StudentAccount
} from '../index.d';
import {
    uuid
} from '../services/utilities';

const persistedGlobalState: Readonly<GlobalState> | null = JSON.parse(window.localStorage.getItem('GlobalState'));

const InitialGlobalState: Readonly<GlobalState> = persistedGlobalState || {
    route: {
        pathname: '/',
        search: ''
    },
    studentGroups: {},
    studentAccounts: {},
    topBarText: ''
};

function rootReducer(
    state: Readonly<GlobalState> = InitialGlobalState,
    action: Readonly<Action>
): Readonly<GlobalState> {

    if (action.type === 'SET_ROUTE') {
        const routesToTopBarText = {
            '/': 'Classes'
        };

        return {
            ...state,
            route: action.route,
            topBarText: routesToTopBarText[action.route.pathname]
        };
    }

    if (action.type === 'CREATE_STUDENT_GROUP') {
        const newStudentGroup: Readonly<StudentGroup> = {
            id: uuid(),
            name: action.name
        };

        return {
            ...state,
            studentGroups: {
                ...state.studentGroups,
                [newStudentGroup.id]: newStudentGroup
            }
        };
    }

    if (action.type === 'CREATE_STUDENT_ACCOUNT') {
        const newStudentAccount: Readonly<StudentAccount> = {
            id: action.id,
            name: action.name,
            studentGroupId: action.studentGroupId,
            balance: 0
        };

        return {
            ...state,
            studentAccounts: {
                ...state.studentAccounts,
                [newStudentAccount.id]: newStudentAccount
            }
        };
    }

    if (action.type === 'ADD_TO_BALANCE') {

        const studentAccount: Readonly<StudentAccount> = state.studentAccounts[action.studentAccountId];

        return {
            ...state,
            studentAccounts: {
                ...state.studentAccounts,
                [studentAccount.id]: {
                    ...studentAccount,
                    balance: studentAccount.balance + action.amount
                }
            }
        };
    }

    if (action.type === 'SET_TOP_BAR_TEXT') {
        return {
            ...state,
            topBarText: action.topBarText
        };
    }

    return state;
}

export const GlobalStore: Readonly<CBGlobalStore> = createStore((state: Readonly<GlobalState>, action: Readonly<Action>) => {
    const newState: Readonly<GlobalState> = rootReducer(state, action);

    window.localStorage.setItem('GlobalState', JSON.stringify(newState));

    return newState;
});