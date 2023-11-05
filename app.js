const slider = document.querySelector('.items');
let isDown = false;
let startX;
let scrollLeft;
let lastScroll = [];
let interval;

// Define the event handler functions
function handleDown(e) {
    isDown = true;
    slider.classList.add('active');
    startX = e.clientX - slider.offsetLeft;
    scrollLeft = slider.scrollLeft;
    lastScroll = [];
}

function handleOut() {
    if(isDown)
        handleDrifting();
    
    isDown = false;
    slider.classList.remove('active');
}

function handleDrifting(){
    clearInterval(interval);
    if(lastScroll.length == 0) return;
    scrollLeft = slider.scrollLeft;
    const driftSpeed = 10; // Adjust the drift speed as needed
    let drift = lastScroll[lastScroll.length - 1] - lastScroll[0];
    interval = setInterval(() => {
        if (Math.round(Math.abs(drift)) === 0) {
            clearInterval(interval);
        } else {
            drift = drift * (1 - 1 / driftSpeed);
            console.log(drift);
            slider.scrollLeft = scrollLeft + drift;
            scrollLeft = slider.scrollLeft;
        }
    }, 16); // Adjust the interval duration as needed
}

function addToDrift(number){
    if(lastScroll.length === 5){
        lastScroll.shift();
    }
    lastScroll.push(number);
}

function handleMove(e) {
    if(!isDown) return;
    clearInterval(interval);
    const x = e.clientX - slider.offsetLeft;
    walk = startX - x;
    slider.scrollLeft = scrollLeft + walk;
    addToDrift(walk);
}

function handleTouchPassing(e, callback){
    e.preventDefault();
    const touch  = e.touches[0];
    callback(touch);
}

// Add the event listeners
slider.addEventListener('mousedown', handleDown);
slider.addEventListener('mouseleave', handleOut);
slider.addEventListener('mouseup', handleOut);
slider.addEventListener('mousemove', handleMove);

slider.addEventListener('touchstart', (e) => handleTouchPassing(e, handleDown));
slider.addEventListener('touchend', (e) => handleTouchPassing(e, handleOut));
slider.addEventListener('touchcancel', (e) => handleTouchPassing(e, handleOut));
slider.addEventListener('touchmove', (e) => handleTouchPassing(e, handleMove));
