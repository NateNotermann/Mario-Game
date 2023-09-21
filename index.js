// import platform from './img/platform.png';


const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

//responsive canvas based on window size
canvas.width = window.innerWidth
canvas.height = window.innerHeight

// global variables. 
const gravity = 0.5
const floor = 0 //50 // pixel from th bottom player stops at
const jump = 8 // amount player should jump
const playerMovement = 10 //  amount player moves left and right
let scrollOffset = 0

 
 
class Player {
    constructor() { //  passing in x & y positions
        this.position = {
            x: 100,
            y: 100
        }
        this.velocity = {
             x: 0, // positive values move right, negative values more left.
             y: 1 // positive values move down, negative values move up
        }
        this.width = 30
        this.height = 30
    }
    draw() { // draw a rectangle that matches the size and position of the Player Sprite
        c.fillStyle = 'red' 
        c.fillRect(
            this.position.x, 
            this.position.y, 
            this.width, 
            this.height)
    }
    update() {
        this.draw()
        this.position.x += this.velocity.x // add/increase velocity (X axes only)(aka Movement) 
        this.position.y += this.velocity.y // add/increase velocity (Y axes only)(aka Gravity) 

        if (this.position.y + this.height + this.velocity.y <= canvas.height - floor)  // if the BOTTOM of our player + it's velocity is LESS than the BOTTOM of the canvas keep adding gravity. 
            this.velocity.y += gravity // velocity += gravity (0.5) repeat over and over.
            else this.velocity.y = 0 // else set velocity to 0. (If player position + player height is greater or equal to canvas height)
    } 
} // End of player Sprite

// classes are a blueprint for creating objects that share the same properties and methods.
class Platform {    
    constructor({ x, y }) {
        this.position = {
            x: x, // x is now equal to the passed in x.  // x: 600,
            y: y // y is now equal to the passed in y.  // y: 300
        }
        this.width = 200
        this.height = 20
    }
    draw() {   
        // platform's rectangle
        c.fillStyle = 'blue'
        c.fillRect(this.position.x, this.position.y, this.width, this.height) 
    }
}
 


const player = new Player() //  calling the "Player" class
// const platform = new Platform() //  calling the "Platform" class
const platforms = [new Platform({x: 600, y: 300}), new Platform({x: 300, y: 450}), new Platform({x: 825, y: 200})] // Need to pass in x & y.

const keys = {      // access using keys.left.pressed, or keys.right.pressed etc. Default = false.
    right: {
        pressed: false
    },
    left: {
        pressed: false
    }
}

function animate() { // ------ MAIN ANIMATION FUNCTION ------
    requestAnimationFrame(animate)
    console.log('animate function');  
    c.clearRect(0, 0, canvas.width, canvas.height)

    player.update() // ------ PLAYER UPDATE
    platforms.forEach(platform => { // loop through array of platforms
        platform.draw() // ------ DRAW PLATFORM
    })

    // ---- PLAYER MOVEMENT ----
    if (keys.left.pressed == true && keys.right.pressed == true ) {
        player.velocity.x = 0
        console.log('both')
    } else if (keys.right.pressed && player.position.x < 400) {  // allow player to move right unless at 400px
        player.velocity.x = playerMovement
        console.log('right');
    } else if (keys.left.pressed && player.position.x > 100) {  // allow player to move left unless at 100px
        player.velocity.x = -playerMovement 
        console.log('left');
    } else {
        player.velocity.x = 0
        console.log('none');

        // ---- PLATFORM SCROLL ----
        if (keys.right.pressed) { // if right key is pressed, move platform to the left by playMovement
            scrollOffset +=playerMovement // record how much platforms are offsetting
            platforms.forEach(platform => { // loop through array of platforms
                // platform.draw() // ------ PLATFORM INITIAL DRAW 
                platform.position.x -= playerMovement
            })
        } else if(keys.left.pressed) {  // if left key is pressed, move platform to the right by playMovement
            scrollOffset -=playerMovement // record how much platforms are offsetting
            platforms.forEach(platform => { // loop through array of platforms
                // platform.draw() // ------ PLATFORM INITIAL DRAW 
                platform.position.x += playerMovement
            })
        }
        console.log('scrollOffset:', scrollOffset); // check how much scroll is currently offsetting
    }
    
    // ---- PLATFORM COLLISION DETECTION ----
    platforms.forEach(platform => { 
    if (//player bottom is HIGHER than platform top
        player.position.y + player.height <= platform.position.y  &&
        // player bottom overlap with platform top side. (Player lands on platform)
        player.position.y + player.height + player.velocity.y >= platform.position.y &&
        //  // players left side overlap with platform right side
        player.position.x <= platform.position.x + platform.width &&
        //  // players right side overlap with platform left side
        player.position.x + player.width >= platform.position.x 
        ) {player.velocity.y = 0 
    }
})

if (scrollOffset > 1500) {
    console.log('You WIN!!!');
}

}
animate()

// ---- LISTEN FOR A KEY PRESSED ----
addEventListener('keydown', ({keyCode, key}, ) => { // keyCode is event.keyCode, key is event.key. ONLY works if they're listed in the EventListener
    // console.log('event', event, 'keyCode:', event.keyCode, 'Key:', event.key); // check Key Pressed
    switch (keyCode) {
        case 68:        // D
            console.log('right/D');
            keys.right.pressed = true
            // player.velocity.x = playerMovement // Add playerMovement
            break
        case 65:        // 'A'
            console.log('left/A');
            keys.left.pressed = true
            // player.velocity.x = -playerMovement // Subtract playerMovement
            break
        case 87:        // W
            console.log('Jump/up/W');
            player.velocity.y += - jump // subtract jump level
            break
        case 32:        // Space
            console.log('Jump/up/Space');
            player.velocity.y += - jump // subtract jump level
            break
    }
    console.log('right/D pressed:', keys.right.pressed, 'left/A pressed:', keys.left.pressed);
})



//Listen for Key UNPRESSED 
addEventListener('keyup', ({keyCode, key}, ) => { // keyCode is event.keyCode, key is event.key. ONLY works if they're listed in the EventListener
    // console.log('event', event, 'keyCode:', event.keyCode, 'Key:', event.key); // check Key Pressed
    switch (keyCode) {
        case 68:        // D
            console.log('right/D');
            keys.right.pressed = false
            // player.velocity.x = 0 // set velocity to 0
            break
        case 65:        // 'A'
            console.log('left/A');
            keys.left.pressed = false
            // player.velocity.x = 0 // set velocity to 0
            break
        case 87:        // W
            console.log('Jump/up/W');
            player.velocity.y += - jump // subtract jump level
            break
        case 32:        // Space
            console.log('Jump/up/Space');
            player.velocity.y += - jump // subtract jump level
            break
    }
    console.log('right/D pressed:', keys.right.pressed, 'left/A pressed:', keys.left.pressed);
})

// function keysPressed() { // console log if key(s) are pressed
//     console.log('right/D pressed:', keys.right.pressed, 'left/A pressed:', keys.left.pressed);
//     console.log('event', event, 'keyCode:', event.keyCode, 'Key:', event.key); // check Key Pressed
// }

function test() {
    console.log('Index.js is Connected');
    console.log('canvas W: ' + canvas.width, 'canvas H: ' + canvas.height ); // check Canvas W & H
    console.log('Window W: ' + window.innerWidth, 'Window H: ' + window.innerHeight ); // check Window W & H
}
test()

