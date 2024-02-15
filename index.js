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
const clearConfirmButton = document.getElementById("clear-confirm-button")
const editor = document.getElementById("editor");
const key = "PrEzTyL!";

@@ -28,6 +29,11 @@ function exit(){
}

function clear(){
    clearButton.hidden = true;
    clearConfirmButton.hidden = false;
}

function confirmClear(){
    localStorage.removeItem("dataText");
    editor.innerHTML='\n        Start typing here...\n    ';
    exit();
@@ -62,6 +68,7 @@ strikethroughButton.addEventListener("click", () => formatText("strikethrough"))
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
function save(){
    const content = document.getElementById('editor').innerHTML;
    const enc = encrypt(content, key);
    localStorage.setItem("dataText",enc);
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
    const reader = new FileReader();
    reader.onload = function (e) {
        const content = e.target.result;
        const dec = decrypt(content, key);
        const editor = document.getElementById('editor');
        editor.innerHTML = dec;
        fileInput.value = "";
    };
    reader.readAsText(file);
}
function encrypt(text, key){
    return [...text].map((x, i) => 
    (x.codePointAt() ^ key.charCodeAt(i % key.length) % 255)
     .toString(16)
     .padStart(2,"0")
   ).join('')
}
function decrypt(text, key){
    return String.fromCharCode(...text.match(/.{1,2}/g)
     .map((e,i) => 
       parseInt(e, 16) ^ key.charCodeAt(i % key.length) % 255)
     )
}
function triggerFileInput() {
    document.getElementById('fileInput').click();
}
function handleFileSelection(event) {
  const fileInput = event.target;
  const selectedFile = fileInput.files[0];
  if (selectedFile && selectedFile.name.endsWith('.pxt')) {
    saved(selectedFile);
  } else {
    alert('Please select a valid ".pxt" file.');
  }
  fileInput.value = '';
}
function removeHolder(){
    content = document.getElementById('editor').innerHTML;
    if(content.startsWith('\n        Start typing here...\n    ')){
        document.getElementById('editor').innerHTML = "";
    }
}
document.addEventListener('keydown', function(event) {
    if (event.ctrlKey && event.key === 's') {
      event.preventDefault();
      save();
    }
});
