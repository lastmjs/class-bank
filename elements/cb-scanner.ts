import { createObjectStore } from 'reduxular';
import { 
    render as litRender, 
    html,
    TemplateResult
} from 'lit-html';
import Quagga from '../web_modules/quagga.js';

type LocalState = {
};

const InitialLocalState: Readonly<LocalState> = {
};

class CBScanner extends HTMLElement {
    readonly localStore = (() => {
        return createObjectStore(InitialLocalState, (localState: Readonly<LocalState>) => {
            litRender(
                this.render(
                    localState
                ),
            this);
        }, this);
    })();

    connectedCallback() {

        // TODO reduxular doesn't seem to be type checking the actions here
        this.localStore.dispatch({
            type: 'RENDER'
        });

        // TODO I don't really want the thing to return multiple results, just one, but I'm not sure it's really a problem
        Quagga.init({
            inputStream: {
                name: 'Live',
                type: 'LiveStream',
                target: this.querySelector('#barcode-target')
            },
            decoder: {
                readers: ['code_128_reader']
            }
        }, (err) => {
            if (err) {
                console.log(err);
                return;
            }

            Quagga.start();

            Quagga.onDetected((data) => {
                Quagga.stop();

                this.dispatchEvent(new CustomEvent('scan-completed', {
                    detail: data.codeResult.code
                }));
            });
        });
    }

    cancelClicked() {
        console.log('cancel clicked 0')
        this.dispatchEvent(new CustomEvent('scan-canceled'));
    }

    render(localState: Readonly<LocalState>): Readonly<TemplateResult> {
        return html`
            <style>
                #barcode-target {
                    position: absolute;
                    top: 0;
                    width: 100%;
                    height: 100%;
                    background-color: rgba(0, 0, 0, .5);
                }

                video {
                    width: 100vw;
                }

                .cb-scanner-cancel-button {
                    position: absolute;
                    top: 0;
                    right: 0;
                    font-size: calc(25px + 1vmin);
                    z-index: 1;
                    background-color: white;
                    cursor: pointer;
                    border: none;
                    box-shadow: 0px 0px 5px black;
                    padding: calc(5px + 1vmin);
                    margin: calc(5px + 1vmin);
                }
            </style>

            <div>
                <div id="barcode-target">
                    <button class="cb-scanner-cancel-button" @click=${() => this.cancelClicked()}>Cancel</button>
                </div>
            </div>

        `;
    }
}

window.customElements.define('cb-scanner', CBScanner);