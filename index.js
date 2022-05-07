const wrapper = document.createElement('div');
const title = document.createElement('h1');
const textarea = document.createElement('textarea');
const keyboardElem = document.createElement('div');
const info = document.createElement('p');

wrapper.classList.add('wrapper');
title.textContent = 'RSS Virtual Keyboard';
info.innerText = 'The virtual keyboard was created in Windows OS\nPush Ctrl + Alt for changing language';

document.body.appendChild(wrapper);
wrapper.appendChild(title);
wrapper.appendChild(textarea);
wrapper.appendChild(keyboardElem);
wrapper.appendChild(info);
