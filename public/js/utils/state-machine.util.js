export default class StateMachine {

    #target = null
    #currentState = null
    #states = new Map()

    constructor(target) {
        this.#target = target
    }

    addState(name, config) {
        this.#states.set(name, {
            name,
            onEnter: (config.onEnter) ? config.onEnter.bind(this.#target) : () => { },
            onUpdate: (config.onUpdate) ? config.onUpdate.bind(this.#target) : () => { },
            onExit: (config.onExit) ? config.onExit.bind(this.#target) : () => { }
        })

        return this
    }

    #isCurrentState(name) {
        return this.#currentState ? this.#currentState.name === name : false
    }

    setState(name) {
        if (!this.#states.has(name)) {
            console.warn(`unknown state : ${name}`)
            return
        }

        if (this.#isCurrentState(name)) {
            return
        }

        console.log(`[StateMachine change from ${(this.#currentState) ? this.#currentState.name : 'none'} to ${name}`)

        if (this.#currentState && this.#currentState.onExit) {
            this.#currentState.onExit()
        }

        this.#currentState = this.#states.get(name)

        if (this.#currentState.onEnter) {
            this.#currentState.onEnter()
        }

    }

    update(dt) {
        if (this.#currentState && this.#currentState.onUpdate) {
            this.#currentState.onUpdate(dt)
        }
    }

}