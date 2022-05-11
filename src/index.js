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

wrapper.classList.add("wrapper");
textarea.classList.add("use-keyboard-input");
textarea.setAttribute("rows", "1");
textarea.setAttribute("placeholder", "Well, click me and write something good....");
title.textContent = "Virtual Keyboard";
info.innerText = "The virtual keyboard was created in Windows OS\nPush Ctrl + Alt to change the language ";

/* Textarea авто расширение*/
textarea.addEventListener("keydown", autosize);
function autosize(){
    let el = textarea;
    el.style.cssText = "height: auto;";
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
        capsLock: false,
        capsLockPush: false,
        languageEn: localStorage.getItem("languageEnLocSt") === "false" ? false : true,
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
        KEYS.forEach((key) => {
            this.properties.languageEn == true && this.properties.capsLockPush == false? keyLayout.push(key.contents.en):
            this.properties.languageEn == false && this.properties.capsLockPush == false? keyLayout.push(key.contents.ru):
            this.properties.languageEn == true && this.properties.capsLockPush == true? keyLayout.push(key.shift.en):
            keyLayout.push(key.shift.ru);
        });           
        keyLayout.forEach((key, ind) => {
            const codeLayout = [];
            (function () {
                KEYS.forEach((key) => {
                    codeLayout.push(key.code);
                });            
            }());
            const keyElement = document.createElement("button");
            keyElement.setAttribute("id", codeLayout[ind]);
            // Add attributes/classes 
            keyElement.setAttribute("type", "button");
            keyElement.classList.add("keyboard__key");
            switch (key) {
                case "Backspace":
                    keyElement.classList.add("keyboard__key--wide");
                    keyElement.textContent = key;
                    keyElement.addEventListener("click", () => {
                        this.insertText("", "Backspace");
                    });
                    break;

                case "CapsLock":
                    keyElement.classList.add("keyboard__key--wide");
                    keyElement.addEventListener("click", () => {
                        this.properties.capsLockPush = this.properties.capsLockPush == true ? false: true;
                        this.elements.keysContainer.innerHTML = "";
                        this.elements.keysContainer.appendChild(this._createKeys());
                    });
                    keyElement.textContent = key;

                    break;
                case "Shift":
                    keyElement.classList.add("keyboard__key--wide");
                    keyElement.textContent = key;

                    break;        
                    
                case "Enter":
                    keyElement.classList.add("keyboard__key--wide");
                    keyElement.textContent = key;
                    keyElement.addEventListener("click", () => {
                        this.properties.value += "\n";
                        this._triggerEvent("oninput");
                        autosize();
                    });

                    break;

                case " ":
                    keyElement.classList.add("keyboard__key--extra-wide");
                    keyElement.addEventListener("click", () => {
                        this.properties.value += " ";
                        this._triggerEvent("oninput");
                        autosize();
                    });

                    break;
                case "Tab":
                    keyElement.textContent = key;
                    keyElement.addEventListener("click", () => {
                        this.properties.value += "    ";
                        this._triggerEvent("oninput");
                        autosize();
                    });

                    break;
                case "Del":
                    keyElement.textContent = key;
                    keyElement.addEventListener("click", () => {
                        this.insertText("", "Delete");
                    });

                    break;
                case "Ctrl":
                    keyElement.textContent = key;
                    keyElement.addEventListener("click", () => {
                        this.properties.value += "";
                        this._triggerEvent("oninput");
                    });

                    break;
                case "Win":
                    keyElement.textContent = key;
                    keyElement.addEventListener("click", () => {
                        this.properties.value += "";
                        this._triggerEvent("oninput");
                    });

                    break;  
                case "Alt":
                    keyElement.textContent = key;
                    keyElement.addEventListener("click", () => {
                        this.properties.value += "";
                        this._triggerEvent("oninput");
                    });

                    break;  

                default:
                    keyElement.textContent = key;
                    keyElement.addEventListener("click", () => {
                        this.properties.value += this.properties.capsLockPush == true ? key.toUpperCase() : key.toLowerCase();
                        this._triggerEvent("oninput");
                        autosize();
                    });

                    break;
            }

            fragment.appendChild(keyElement);

        });

        return fragment;
    },

    _triggerEvent(handlerName) {
        if (typeof this.eventHandlers[handlerName] == "function") {
            this.eventHandlers[handlerName](this.properties.value);
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
            if (textBtn === "Delete") cursorEnd += 1;
            else if (textBtn === "Backspace") cursorStart = Math.max(0, cursorStart - 1);
        }
    
        if (textBtn === "Delete" || textBtn === "Backspace") {
            textarea.setRangeText("", cursorStart, cursorEnd);
        } 
        else textarea.setRangeText(text);
        textarea.selectionStart = cursorStart + text.length;
        textarea.selectionEnd = textarea.selectionStart;
    },

    addListeners() {
        document.addEventListener("keydown", (keyEvent) => {  
            const key = document.getElementById(keyEvent.code);
            if (key) {
                key.classList.add("pressed");
                keyEvent.preventDefault();
                if(keyEvent.ctrlKey && keyEvent.altKey){
                    setTimeout(() => {
                    this.properties.languageEn = this.properties.languageEn == true ? false: true;

                        localStorage.setItem("languageEnLocSt", this.properties.languageEn);

                    this.elements.keysContainer.innerHTML = "";
                    this.elements.keysContainer.appendChild(this._createKeys());
                    }, 500);
                }
                else if (keyEvent.code === "CapsLock"){
                    this.properties.capsLockPush = this.properties.capsLockPush == true ? false: true;
                    this.elements.keysContainer.innerHTML = "";
                    this.elements.keysContainer.appendChild(this._createKeys());
                
                }
                else if (keyEvent.code === "Backspace") this.insertText("", "Backspace");
                else if (keyEvent.code === "Delete") this.insertText("", "Delete");
                else if (keyEvent.code === "Enter") this.insertText("\n");
                else if (keyEvent.code === "Tab") this.insertText("    ");
                else if (keyEvent.code === "ControlRight" || keyEvent.code === "ControlLeft") this.insertText("");
                else if (keyEvent.code === "Win") this.insertText("");
                else if (keyEvent.code === "Space") this.insertText(" ");
                else if (keyEvent.code === "AltLeft" || keyEvent.code === "AltRight") this.insertText("");
                else if (keyEvent.code === "ShiftLeft" || keyEvent.code === "ShiftRight") this.insertText("");
                else{ this.insertText(key.textContent);}
                
            }
        });
        document.addEventListener("keyup", (keyEvent) => {
            const key = document.getElementById(keyEvent.code);
            if (key) {
                key.classList.remove("pressed");
            }
        });
    }
};

window.addEventListener("DOMContentLoaded", function () {
    Keyboard.init();
    Keyboard.addListeners();
});
textarea.onblur = () => textarea.focus();
