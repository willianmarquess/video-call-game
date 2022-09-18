import createElement from "../utils/elementsHelper.js";

function initUsersListComponent(users) {
    const usersElem = document.getElementById('side-users-list');

    const spanElem = createElement('span', null, 'ONLINE USERS');
    
    const liElemList = []
    for (const id in users) {
        const liElem = createElement('li', {
            attributes: {
                id: users[id].id
            }
        },
        `${users[id].name}`
        );
        liElemList.push(liElem)
    }

    const ulElem = createElement('ul', {
        attributes: {
            id: 'users-list'
        }
    },
    null,
    liElemList);

    usersElem.appendChild(spanElem);
    usersElem.appendChild(ulElem);
}

function addUserToListComponent(user) {
    const ulElem = document.getElementById('users-list');
    const liElem = createElement('li', {
        attributes: {
            id: user.id
        }
    },
    `${user.name}`);
    ulElem.appendChild(liElem);
}

function removeUserFromListComponent(id) {
    const ulElem = document.getElementById('users-list');
    const liElem = document.getElementById(id);
    ulElem.removeChild(liElem);
}

export default {
    initUsersListComponent,
    addUserToListComponent,
    removeUserFromListComponent
}