function scrollWindowsToNewPos(x, y) {
    window.scrollTo({ left: x, top: y, behavior: "auto" });
    setTimeout(() => { window.scrollTo({ left: x, top: y, behavior: "auto" }); }, 100);
}

function clamp01(value) {
    return Math.min(Math.max(0, value), 1);
}

function getElementPosition(el) {
    // yay readability
    for (var lx = 0, ly = 0;
        el != null;
        lx += el.offsetLeft, ly += el.offsetTop, el = el.offsetParent);
    return { x: lx, y: ly };
}