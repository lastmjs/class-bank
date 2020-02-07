import { 
    render as litRender, 
    html,
    TemplateResult
} from 'lit-html';
import { GlobalStore } from '../state/store';
import {
    StudentGroups,
    StudentGroup
} from '..';
import { navigate } from '../services/utilities';
import {
    createObjectStore
} from 'reduxular';

type State = {
    readonly studentGroups: Readonly<StudentGroups>;
};

const InitialState: Readonly<State> = {
    studentGroups: GlobalStore.getState().studentGroups
};

class CBStudentGroups extends HTMLElement {
    
    readonly store = (() => {

        GlobalStore.subscribe(() => {
            this.store.studentGroups = GlobalStore.getState().studentGroups;
        });

        return createObjectStore(
            InitialState, 
            (state: Readonly<State>) => {
                litRender(this.render(state), this)       
            }, 
            this
        );
    })();
    
    createClass() {
        const name: string = (this.querySelector('#input-class-name') as any).value;

        GlobalStore.dispatch({
            type: 'CREATE_STUDENT_GROUP',
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
                        ${Object.values(state.studentGroups).map((studentGroup: Readonly<StudentGroup>) => {
                            return html`
                                <div style="padding: 5px; cursor: pointer" @click=${() => navigate(`/student-group?studentGroupId=${studentGroup.id}`)}>${studentGroup.name}</div>
                            `;
                        })}
                    </div>
                </div>
            </div>
        `;
    }
}

window.customElements.define('cb-student-groups', CBStudentGroups);