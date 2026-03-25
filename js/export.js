async function exportToZip() {
    try {
        const zip = new JSZip();

        // Add each file to the ZIP
        for (const path of Object.keys(files)) {
            if (files[path]) {
                zip.file(path, files[path]);
            }
        }

        // Generate the ZIP blob
        const blob = await zip.generateAsync({ type: "blob" });

        // Create a link element for downloading the zip file
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = "browser-ide-project.zip";

        // Append the link to the document
        document.body.appendChild(a);

        // Trigger the download
        a.click();

        // Remove the link after triggering the download
        document.body.removeChild(a);

        // Release the object URL
        URL.revokeObjectURL(a.href);

    } catch (error) {
        console.error('Error exporting to ZIP:', error);
        alert('Failed to export files. Please try again.');
    }
}