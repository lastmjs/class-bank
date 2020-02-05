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

// TODO probably not the best, but very simple, very random I assume, and no dependencies
// TODO the popular Node.js uuid library doesn't have a simple browser-compatible build
export function uuid() {
    return window.crypto.getRandomValues(new Uint8Array(16)).join('');
}