import { 
    render as litRender, 
    html,
    TemplateResult
} from 'lit-html';
import { Store } from '../state/store';
import {
    State,
    Class
} from '../index.d';
import Quagga from '../web_modules/quagga.js';

class CBClass extends HTMLElement {

    classId: string | null;

    constructor() {
        super();

        Store.subscribe(() => litRender(this.render(Store.getState()), this));
    }

    connectedCallback() {
        setTimeout(() => {
            Store.dispatch({
                type: 'RENDER'
            });
        });
    }

    // TODO I don't really want the thing to return multiple results, just one, but I'm not sure it's really a problem
    scanNewAccount() {
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

            console.log('Quagga initialized');
            Quagga.start();

            Quagga.onDetected((data) => {
                Quagga.stop();
                this.querySelector('#barcode-target').innerHTML = ``;
                console.log(data);

                Store.dispatch({
                    type: 'CREATE_ACCOUNT',
                    id: data.codeResult.code,
                    name: `Test${new Date()}`,
                    classId: this.classId
                });
            });
        });
    }

    render(state: Readonly<State>): Readonly<TemplateResult> {

        const theClass: Readonly<Class> = state.classes[this.classId];

        if (theClass === undefined) {
            return html`<div>Loading...</div>`;
        }

        const accounts: ReadonlyArray<Account> = Object.values(state.accounts).filter((account) => {
            return account.classId === theClass.id;
        });

        return html`
            <h1>Class</h1>

            <h2>${theClass.name}</h2>

            <h3>Accounts</h3>
            
            <div>
                <button>Generate new account</button>
            </div>

            <br>

            <div>
                <button @click=${() => this.scanNewAccount()}>Scan new account</button>
            </div>

            <div>
                ${accounts.map((account: Readonly<Account>) => {
                    return html`<div>${account.name}</div>`;
                })}
            </div>

            <div id="barcode-target"></div>
        `;
    }
}

window.customElements.define('cb-class', CBClass);