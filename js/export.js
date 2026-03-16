async function exportToZip() {
  const zip = new JSZip();
  Object.keys(files).forEach(path => {
    zip.file(path, files[path]);
  });
  const blob = await zip.generateAsync({ type: "blob" });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = "browser-ide-project.zip";
  a.click();
}
