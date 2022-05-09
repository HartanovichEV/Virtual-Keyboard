import KEYS from "./keys.js";

const wrapper = document.createElement("div");
const title = document.createElement("h1");
const textarea = document.createElement("textarea");
//const keyboardElem = document.createElement("div");
const info = document.createElement("p");

document.body.appendChild(wrapper);
wrapper.appendChild(title);
wrapper.appendChild(info);
wrapper.appendChild(textarea);
//wrapper.appendChild(keyboardElem);


wrapper.classList.add("wrapper");
textarea.classList.add("use-keyboard-input");
textarea.setAttribute("rows", "1");
textarea.setAttribute("placeholder", "Well, click me and write something good....");
title.textContent = "Virtual Keyboard";
info.innerText = "The virtual keyboard was created in Windows OS\nPush Ctrl + Alt for changing language";

/* Textarea авто расширение*/
textarea.addEventListener("keydown", autosize);
function autosize(){
    let el = this;
    el.style.cssText = "height:auto;";
    el.style.cssText =" height:" + (el.scrollHeight + 20) + "px";
}
/*__________________________*/

const Keyboard = {
    elements: {
        main: null,
        keysContainer: null,
        keys: []
    },

    eventHandlers: {
        oninput: null,
        onclose: null
    },

    properties: {
        value: "",
        capsLock: false
    },

    init() {
        // Create main elements
        this.elements.main = document.createElement("div");
        this.elements.keysContainer = document.createElement("div");

        // Setup main elements
        this.elements.main.classList.add("keyboard", "keyboard--hidden");
        this.elements.keysContainer.classList.add("keyboard__keys");
        this.elements.keysContainer.appendChild(this._createKeys());

        this.elements.keys = this.elements.keysContainer.querySelectorAll(".keyboard__key");

        // Add to DOM
        this.elements.main.appendChild(this.elements.keysContainer);
        document.body.appendChild(this.elements.main);

        // Automatically use keyboard for elements with .use-keyboard-input
        document.querySelectorAll(".use-keyboard-input").forEach(element => {
            element.addEventListener("focus", () => {
                this.open(element.value, currentValue => {
                    element.value = currentValue;
                });
            });
        });
    },

    _createKeys() {
        const fragment = document.createDocumentFragment();
        const keyLayout = [];
        // Creates keyLayout in contents.en
        (function () {
            KEYS.forEach((key) => {
                keyLayout.push(key.contents.en);
            });            
        }());

        keyLayout.forEach((key, ind) => {
            const codeLayout = [];
            (function () {
                KEYS.forEach((key) => {
                    codeLayout.push(key.code);
                });            
            }());
            const keyElement = document.createElement("button");
            keyElement.setAttribute('id', codeLayout[ind]);
            // Add attributes/classes 
            keyElement.setAttribute("type", "button");

            keyElement.classList.add("keyboard__key");
            keyElement.textContent = key;
            keyElement.addEventListener("click", () => {
                this.properties.value += this.properties.capsLock ? key.toUpperCase() : key.toLowerCase();
                this._triggerEvent("oninput");
            });

            fragment.appendChild(keyElement);

        });

        return fragment;
    },

    _triggerEvent(handlerName) {
        if (typeof this.eventHandlers[handlerName] == "function") {
            this.eventHandlers[handlerName](this.properties.value);
        }
    },

    _toggleCapsLock() {
        this.properties.capsLock = !this.properties.capsLock;

        for (const key of this.elements.keys) {
            if (key.childElementCount === 0) {
                key.textContent = this.properties.capsLock ? key.textContent.toUpperCase() : key.textContent.toLowerCase();
            }
        }
    },

    open(initialValue, oninput, onclose) {
        this.properties.value = initialValue || "";
        this.eventHandlers.oninput = oninput;
        this.eventHandlers.onclose = onclose;
        this.elements.main.classList.remove("keyboard--hidden");
    },

    close() {
        this.properties.value = "";
        this.eventHandlers.oninput = oninput;
        this.eventHandlers.onclose = onclose;
        this.elements.main.classList.add("keyboard--hidden");
    },

    insertText(text, textBtn) {
        let cursorStart = textarea.selectionStart;
        let cursorEnd = textarea.selectionEnd;
        if (textarea.selectionStart === textarea.selectionEnd) {
            if (textBtn === 'Delete') cursorEnd += 1;
            else if (textBtn === 'Backspace') cursorStart = Math.max(0, cursorStart - 1);
        }
    
        if (textBtn === 'Delete' || textBtn === 'Backspace') {
            textarea.setRangeText('', cursorStart, cursorEnd);
        } else textarea.setRangeText(text);
        textarea.selectionStart = cursorStart + text.length;
        textarea.selectionEnd = textarea.selectionStart;
    },

    addListeners() {
        document.addEventListener('keydown', (keyEvent) => {            
            const key = document.getElementById(keyEvent.code);
            if (key) {
                key.classList.add('pressed');
                keyEvent.preventDefault();
                this.insertText(key.textContent)
                //console.log(key.textContent)
            }
        });
        document.addEventListener('keyup', (keyEvent) => {
            const key = document.getElementById(keyEvent.code);
            if (key) {
                key.classList.remove('pressed');
            }
        });
    }
};

window.addEventListener("DOMContentLoaded", function () {
    Keyboard.init();
    Keyboard.addListeners();
});
