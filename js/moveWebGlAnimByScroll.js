const headerContent = document.querySelector("#header-content");
const footerContent = document.querySelector("#footer-content");
const canvasOverlay = document.querySelector("#canvas-overlay");

const headerContentHeight = headerContent.offsetHeight;
const unityContainerWidth = container.offsetWidth;
const unityContainerHeight = container.offsetHeight;

footerContent.style.paddingTop = unityContainerHeight + "px";

canvasOverlay.style.width = unityContainerWidth + "px";
canvasOverlay.style.height = unityContainerHeight + "px";
canvasOverlay.style.top = headerContentHeight + "px";

//for mobile
document.addEventListener("touchstart", onTouchStart, {passive:true});
document.addEventListener('touchmove', onTouchMove, {passive:true});
document.addEventListener('touchmove', onMobileTouch, {passive:true});

//for desktop
document.addEventListener('wheel', onWheel, false);

const canvasOffsetToTouch = unityContainerHeight / 16;
const canvasOffsetToWheel = unityContainerHeight / 4;

const animateToPosParameter = "AnimateToPosition";

let animationIsRunning = false;
let currentAnimationPosition = 0;
let currentAnimState = -1;

var touchStart = { x: 0, y: 0 };
var touchOffset = { x: 0, y: 0 };

function onTouchStart(e) {
    touchStart.x = e.touches[0].clientX;
    touchStart.y = e.touches[0].clientY;
}

function onTouchMove(e) {
    touchOffset.x = touchStart.x - e.touches[0].clientX;
    touchOffset.y = touchStart.y - e.touches[0].clientY;
    var1.innerHTML = "Offset: " + touchOffset.y;
}

function onMobileTouch(e) {
    U_sendScrollDataToUnity(window.scrollY, touchOffset.y / 100);
    refreshCanvas(touchOffset.y, canvasOffsetToTouch);
}

function onWheel(e) {
    U_sendScrollDataToUnity(window.scrollY, e.deltaY / 100);
    refreshCanvas(e.deltaY, canvasOffsetToWheel);
}

function refreshCanvas(scrollDeltaY, canvasOffset) {
    scrollPos = window.scrollY;
    debugPanel.style.paddingTop = scrollPos + 60 + "px";

    let scrollingDown = scrollDeltaY > 0;
    let isOnCanvasRegion = scrollPos > (headerContentHeight - canvasOffset) && scrollPos < (headerContentHeight + canvasOffset);

    if (isOnCanvasRegion) {
        var2.innerHTML = "Canvas Region";

        if (!animationIsRunning) {
            if (scrollingDown) {
                if (currentAnimationPosition < 1) {
                    fixPageOnAnimatedCanvas(headerContentHeight);
                    return;
                }
            } else {
                if (currentAnimationPosition > 0) {
                    fixPageOnAnimatedCanvas(headerContentHeight);
                    return;
                }
            }
        }

        //Force the canvas position!
        if (window.scrollY != headerContentHeight) {
            scrollWindowsToNewPos(0, headerContentHeight);
        }

        currentAnimState = updateAnimation(scrollDeltaY);

        if (scrollingDown && currentAnimState == 1) {
            releasePageFromAnimatedCanvas(true, headerContentHeight + canvasOffset);
        } else if (!scrollingDown && currentAnimState == -1) {
            releasePageFromAnimatedCanvas(false, headerContentHeight - canvasOffset);
        }
        return;
    }

    var2.innerHTML = "Webpage Region";
}

//return 1 to animation finished topDown, -1 finished downTop and 0 if not finished yet
function updateAnimation(scrollDeltaY) {
    currentAnimationPosition += scrollDeltaY / 8001;
    currentAnimationPosition = clamp01(currentAnimationPosition);

    ///The position need to be normalized between 0 - 1
    U_sendFloatValue(animateToPosParameter, currentAnimationPosition);
    
    if (currentAnimationPosition >= 1) return 1;
    else if (currentAnimationPosition <= 0) return -1;
    else return 0;
}

function fixPageOnAnimatedCanvas(fixPosition) {
    //stack window position at the canvas element
    scrollWindowsToNewPos(0, fixPosition);

    document.body.style.overflow = "hidden";
    animationIsRunning = true;

    var3.innerHTML = "animation is Running!";
}

function releasePageFromAnimatedCanvas(scrollingDown, newWindowPos) {
    //if scrolling down, indicates that the animation finished, else, it's back to the top page
    currentAnimationPosition = scrollingDown ? 1 : 0
    U_sendFloatValue(animateToPosParameter, currentAnimationPosition);
    document.body.style.overflow = "scroll";
    animationIsRunning = false;
    scrollWindowsToNewPos(0, newWindowPos);
}