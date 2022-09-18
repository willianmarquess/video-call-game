export default class UserSevice {
    #url = 'http://localhost:3333/';

    async login({ id, name }) {
        try {
            const result = await fetch(`${this.#url}login`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id, name })
            })
            const response = await result.json();
            return response;
        } catch (error) {
            console.log(error);
        }
    }

    async getUsersInRoom() {
        try {
            const result = await fetch(`${this.#url}user`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            })
            const response = await result.json();
            return response;
        } catch (error) {
            console.log(error);
        }
    }
}