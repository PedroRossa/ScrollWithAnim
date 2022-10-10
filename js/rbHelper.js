function scrollWindowsToNewPos(x, y) {
    window.scrollTo({ left: x, top: y, behavior: "auto" });
    setTimeout(() => { window.scrollTo({ left: x, top: y, behavior: "auto" }); }, 100);
    document.documentElement.scrollTop = document.body.scrollTop = y;
}

function clamp01(value) {
    return Math.min(Math.max(0, value), 1);
}