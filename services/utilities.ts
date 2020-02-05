import { Store } from '../state/store';

export function navigate(path: string) {
    history.pushState({}, '', path);
    Store.dispatch({
        type: 'SET_ROUTE',
        route: {
            pathname: window.location.pathname,
            search: window.location.search
        }  
    });
}