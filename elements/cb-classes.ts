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
import { navigate } from '../services/utilities';

class CBClasses extends HTMLElement {
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

    createClass() {
        const name: string = this.querySelector('#input-class-name').value;

        Store.dispatch({
            type: 'CREATE_CLASS',
            name
        });
    }

    render(state: Readonly<State>): Readonly<TemplateResult> {
        return html`
            <style>
            </style>

            <div>
                <h1>Classes</h1>

                <div>
                    <div>
                        <input id="input-class-name" type="text" placeholder="Class name">
                    </div>
                    
                    <div>
                        <button @click=${() => this.createClass()}>Create class</button>
                    </div>

                    <br>

                    <div>
                        ${Object.values(state.classes).map((theClass) => {
                            return html`
                                <div style="padding: 5px; cursor: pointer" @click=${() => navigate(`/class?classId=${theClass.id}`)}>${theClass.name}</div>
                            `;
                        })}
                    </div>
                </div>
            </div>
        `;
    }
}

window.customElements.define('cb-classes', CBClasses);