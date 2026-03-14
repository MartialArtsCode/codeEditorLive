const editor = document.getElementById('editor');
const preview = document.getElementById('preview');

function updatePreview() {
  const code = editor.value;
  preview.srcdoc = code;
}

editor.addEventListener('input', updatePreview);
window.onload = updatePreview;
