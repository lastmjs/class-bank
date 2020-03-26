if ('serviceWorker' in window.navigator) {
    (async () => {
        try {     
            await window.navigator.serviceWorker.register('/service-worker.js', {
            });
            console.log('service worker registration successful');
        }
        catch(error) {
            console.log(error);
        }
    })();
}

import { 
    render as litRender, 
    html,
    TemplateResult
} from 'lit-html';
import './cb-router';
import { GlobalStore } from '../state/store';
import { createObjectStore } from 'reduxular';
import { GlobalState } from '../index.d';
import './cb-scanner';
import { navigate } from '../services/utilities';

type LocalState = {
    readonly showScanner: boolean;
};

const InitialLocalState: Readonly<LocalState> = {
    showScanner: false
};

class CBApp extends HTMLElement {

    readonly localStore = (() => {

        GlobalStore.subscribe(() => {
            litRender(
                this.render(
                    this.localStore.getState(),
                    GlobalStore.getState()
                ),
            this);
        });

        return createObjectStore(InitialLocalState, (localState: Readonly<LocalState>) => {
            litRender(
                this.render(
                    localState,
                    GlobalStore.getState()
                ),
            this);
        }, this);
    })();

    scanAccountCompleted(e: any) {
        this.localStore.showScanner = false;

        navigate(`/student-account?studentAccountId=${e.detail}`);
    }

    scanAccountCanceled() {
        this.localStore.showScanner = false;
    }

    render(
        localState: Readonly<LocalState>,
        globalState: Readonly<GlobalState>
    ): Readonly<TemplateResult> {
        return html`
            <style>
                html {
                    width: 100%;
                    height: 100%;
                    margin: 0;
                    font-family: sans-serif;
                }

                body {
                    width: 100%;
                    height: 100%;
                    margin: 0;
                }

                .cb-app-main-container {
                    width: 100%;
                    height: 100%;
                    display: grid;
                    grid-template-rows: 1fr 10fr;
                }

                .cb-app-top-bar {
                    font-size: calc(50px + 1vmin);
                    box-shadow: 0px 0px 4px black;
                    padding: calc(5px + 1vmin);
                }

                .cb-app-top-bar-text {
                    display: flex;
                    width: 100%;
                    height: 100%;
                    align-items: center;
                }

                .cb-app-camera {
                    position: fixed;
                    font-size: calc(100px + 1vmin);
                    bottom: 0;
                    right: 0;
                    margin: calc(5px + 1vmin);
                }
            </style>

            <div class="cb-app-main-container">
                <div class="cb-app-top-bar">
                    <div class="cb-app-top-bar-text">${globalState.topBarText}</div>
                </div>
                <cb-router></cb-router>

                <i class="material-icons cb-app-camera" @click=${() => this.localStore.showScanner = true}>camera_alt</i>
            </div>

            ${localState.showScanner ? html`<cb-scanner @scan-completed=${(e: any) => this.scanAccountCompleted(e)} @scan-canceled=${() => this.scanAccountCanceled()}></cb-scanner>` : ''}
        `;
    }
}

window.customElements.define('cb-app', CBApp);