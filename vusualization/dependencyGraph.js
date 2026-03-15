import { project } from "../core/projectManager.js";

const canvas = document.getElementById("graph");
const ctx = canvas.getContext("2d");

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "white";

    ctx.fillText("HTML", 40, 100);
    ctx.fillText("CSS", 160, 40);
    ctx.fillText("JS", 160, 160);
    ctx.fillText("API", 260, 100);

    if (project.files.css.length > 0) {
        ctx.beginPath();
        ctx.moveTo(60, 100);
        ctx.lineTo(160, 40);
        ctx.stroke();
    }

    if (project.files.js.length > 0) {
        ctx.beginPath();
        ctx.moveTo(60, 100);
        ctx.lineTo(160, 160);
        ctx.stroke();
    }

    if (project.files.js.includes("fetch")) {
        ctx.beginPath();
        ctx.moveTo(160, 160);
        ctx.lineTo(260, 100);
        ctx.stroke();
    }
}

setInterval(draw, 1500);
