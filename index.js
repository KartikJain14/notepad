const boldButton = document.getElementById("bold-button");
const italicButton = document.getElementById("italic-button");
const underlineButton = document.getElementById("underline-button");
const strikethroughButton = document.getElementById("strikethrough-button");
const colorPicker = document.getElementById("color-picker");
const increaseFontSizeButton = document.getElementById("increase-font-size-button");
const decreaseFontSizeButton = document.getElementById("decrease-font-size-button");
const saveButton = document.getElementById("save-button");
const loadButton = document.getElementById("load-button");
const clearButton = document.getElementById("clear-button");
const clearConfirmButton = document.getElementById("clear-confirm-button");
const editor = document.getElementById("editor");
const key = "PrEzTyL!";

function load(){
    try{
        const encDataText = localStorage.getItem("dataText");
        if (!encDataText) {
            editor.innerHTML = '\n        Start typing here...\n    ';
            return;
        }
        const decDataText = decrypt(encDataText, key);
        editor.innerHTML = decDataText;
    } catch (e) {
        console.error('Error loading data:', e);
    }
}
function exit(){
    const textData = editor.innerHTML;
    const encTextData = encrypt(textData, key);
    localStorage.setItem("dataText", encTextData);
}

function clear(){
    clearButton.hidden = true;
    clearConfirmButton.hidden = false;
}

function confirmClear() {
    localStorage.removeItem("dataText");
    editor.innerHTML='\n        Start typing here...\n    ';
    exit();
    location.reload();
}

window.onbeforeunload = function () {
    exit();
};
function formatText(command) {
    document.execCommand(command, false, null);
}
function changeLineFontSize(size) {
    const selection = window.getSelection();
    if (selection.rangeCount === 0) return;
    const range = selection.getRangeAt(0);
    const startNode = range.startContainer;
    if (startNode.nodeType === Node.TEXT_NODE) {
        const line = startNode.parentNode;
        line.style.fontSize = size + "rem";
    }
}
boldButton.addEventListener("click", () => formatText("bold"));
italicButton.addEventListener("click", () => formatText("italic"));
underlineButton.addEventListener("click", () => formatText("underline"));
strikethroughButton.addEventListener("click", () => formatText("strikethrough"));
saveButton.addEventListener("click", () => save());
loadButton.addEventListener("click", () => triggerFileInput());
clearButton.addEventListener("click", () => clear());
clearConfirmButton.addEventListener("click", () => confirmClear());

colorPicker.addEventListener("input", function () {
    const color = colorPicker.value;
    document.execCommand("styleWithCSS", false, true);
    document.execCommand("foreColor", false, color);
    document.execCommand("styleWithCSS", false, false);
});
increaseFontSizeButton.addEventListener("click", () => changeLineFontSize(1.5));
decreaseFontSizeButton.addEventListener("click", () => changeLineFontSize(1));
function save() {
    const content = editor.innerHTML;
    const enc = encrypt(content, key);
    localStorage.setItem("dataText", enc);
    const link = document.createElement("a");
    const file = new Blob([enc], { type: 'text/plain' });
    link.href = URL.createObjectURL(file);
    link.download = "note.pxt";
    link.click();
    URL.revokeObjectURL(link.href);
}
function saved() {
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function (e) {
        const content = e.target.result;
        const dec = decrypt(content, key);
        editor.innerHTML = dec;
        fileInput.value = "";
    };
    reader.readAsText(file);
}
function encrypt(text, key) {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    return Array.from(data).map((byte, i) =>
        (byte ^ key.charCodeAt(i % key.length)).toString(16).padStart(2, "0")
    ).join('');
}

function decrypt(text, key) {
    const data = new Uint8Array(text.match(/.{2}/g).map(byte => parseInt(byte, 16)));
    return new TextDecoder().decode(data.map((byte, i) =>
        byte ^ key.charCodeAt(i % key.length)
    ));
}
function triggerFileInput() {
    document.getElementById('fileInput').click();
}
function handleFileSelection(event) {
    const fileInput = event.target;
    const selectedFile = fileInput.files[0];
    if (selectedFile && selectedFile.name.endsWith('.pxt')) {
        saved();
    } else {
        alert('Please select a valid ".pxt" file.');
    }
    fileInput.value = '';
}

function removeHolder(){
    if(editor.innerHTML.includes("Start typing here..."))
    {
        editor.innerHTML="";
    }
}

document.addEventListener('keydown', function(event) {
    if (event.ctrlKey && event.key === 's') {
        event.preventDefault();
        save();
    }
});
load();
