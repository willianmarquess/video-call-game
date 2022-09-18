import global from "../utils/global.js";
import initGame from "../initGame.js";
import createElement from "../utils/elementsHelper.js";

export default class LoginComponent {

    #parentElem = null;
    #userService = null;
    #callComponent = null;
    #videoCallController = null;

    constructor({ parentElem, userService, callComponent, videoCallController }) {
        this.#parentElem = parentElem;
        this.#userService = userService;
        this.#callComponent = callComponent;
        this.#videoCallController = videoCallController;
    }

    async #formSubmit(e) {
            e.preventDefault();
            const user = await this.#userService.login({ name: document.getElementById('input-name').value });
            global.user = user;
            this.#parentElem.innerHTML = '';
            
            initGame();

            this.#callComponent.render();
            this.#videoCallController.init();
    }

    render() {
        const formCardElem = createElement('form', {
            events: {
                'submit': this.#formSubmit.bind(this)
            }
        }, 
        null, 
        [
            createElement('input', {
                attributes: {
                    type: 'text',
                    required: 'true',
                    maxlength: '20',
                    minlength: '2',
                    id: 'input-name'
                }
            }),
            createElement('button', null, 'Entrar')
        ]);
    
        const divCardElem = createElement('div', {
            attributes: {
                class: 'card'
            }
        },
            null,
            [
                createElement('span', null, 'Digite um nome ou apelido:'),
                createElement('h6', null, '* Mínimo 2 caracteres, máximo 20 caracteres'),
                formCardElem
            ]
        )
    
        this.#parentElem.appendChild(divCardElem);
    }
}