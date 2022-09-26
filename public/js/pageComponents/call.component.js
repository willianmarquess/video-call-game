import createElement from "../utils/elementsHelper.js";

export default class CallComponent {
    #parentElem = null;

    constructor({ parentElem }) {
        this.#parentElem = parentElem;
    }

    render() {

        const localVideoElem = createElement('video', {
            attributes: {
                id: 'local-video',
                autoplay: 'true',
                poster: './assets/basic-avatar.png'
            }
        })
        
        localVideoElem.muted = true;

        const areaCameraElem = createElement('div', {
            attributes: {
                class: 'area-camera',
                id: 'video-container'
            }
        },
            null,
            [
                localVideoElem
            ]);

        const areaControllCallElem = createElement('div', {
            attributes: {
                class: 'control-call'
            }
        },
            null,
            [
                createElement('img', {
                    attributes: {
                        id: 'control-video',
                        src: `./assets/video-controlls/true-video-icon.png`
                    }
                }),
                createElement('img', {
                    attributes: {
                        id: 'control-audio',
                        src: `./assets/video-controlls/true-audio-icon.png`
                    }
                })
            ])

        const callComponentElem = createElement('div', { attributes: { class: 'call' } }, null, [areaCameraElem, areaControllCallElem]);

        this.#parentElem.prepend(callComponentElem);
    }
}