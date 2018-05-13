const canvas = {
    w: 700,
    h: 600
};

let gameStart = false;
let newGame =  false;
let life = 3;
let count_egg = 0;
let count_gold = 0;

//get elements
const hearts = document.querySelector('img');
const heart = document.querySelector('.heart');
const eggElement = document.querySelector('.count-egg');
const goldElement = document.querySelector('.count-gold');
const modal = document.getElementById('myModal');
const m_content_1 = document.querySelector('.modal-content-1');
const m_content_2 = document.querySelector('.modal-content-2');
const btn_1 = document.getElementById("myBtn-1");
const btn_2 = document.getElementById("myBtn-2");

// Enemies our player must avoid
class Enemy {  
    constructor(x,y) {
    // Variables applied to each of our instances
        this.x = x;
        this.y = y;
        this.s = 100 + Math.floor(Math.random() * 300);
        this.h = 60;
        this.w = 60;
        this.sprite = 'images/pig.png';
    }
    // Update the enemy's position, required method for game
    // Parameter: dt, a time delta between ticks
    update(dt) {
        this.x += this.s * dt;
        //update enemies postion in relation with game start.
        if(gameStart === true){      
            if(this.x > canvas.w) {
                this.x = -100;
                this.s = 100 + Math.floor(Math.random() * 300);
                modal.style.display = "none";
                m_content_2.style.display= "none"; 
            }
        } else {
                this.x =-100;
                this.s = 0;
                modal.style.display = "block";
              if(newGame !== true){
                  m_content_2.style.display= "block";
                  m_content_1.style.display= "none";
                }    
                restartGame();
          }
        //collision detector
        if (this.x < player.x + player.w &&
            this.x + this.w > player.x &&
            this.y < player.y + player.h &&
            this.h + this.y > player.y) {
            player.resetPlayer();
            if(life > 1){
                heart.removeChild(heart.firstElementChild);  
                life--;
                } else {
                   //modal
                   newGame = true;
                   endGame();
                }
        }
    }
    
    // Draw the enemy on the screen, required method for game
    render() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }
}

//create player
class Player {
    constructor(x, y) {
        this.sprite = 'images/bird-red.png';
        this.x = x;
        this.y = y;
        this.h = 65;
        this.w = 65;
    }
    update(dt){
        if(this.y === 50 ){
            player.resetPlayer();
            randomGoodies();
        }
    }
    
    resetPlayer() {
        this.x = 318;
        this.y = 475;
    }
    
    render() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }
    
     handleInput (key) {
        switch (key) {
            case 'left': 
                if(this.x > 50){
                    this.x -= 100;
                }
                break;
            case 'right':
                if(this.x < 600){
                    this.x += 100;
                }
                break;
            case 'up':
                if(this.y > 50){
                    this.y -= 85;
                }
                break;
            case 'down':
                if(this.y < 400){
                    this.y += 85;
                }
                break;
        }    
    }  
}

//create items
class Goodies {
     constructor(x,y) {
        this.x = x;
        this.y = y;
        this.h = 80;
        this.w = 80;  
        let goodie = Math.floor(Math.random() * 3) + 1 ;  
        switch (goodie) {
            case 1:
                this.sprite ='images/egg.png';
                break;
            case 2:
                this.sprite ='images/gold.png';
                break;
            case 3:
                this.sprite ='images/bomb.png';
                break;  
        }
     }
    
     update(dt) {    
        //collision detector
        if (this.x < player.x + player.w &&
            this.x + this.w > player.x &&
            this.y < player.y + player.h &&
            this.h + this.y > player.y) {
            this.gather();
            if(this.sprite ==='images/egg.png' ){
                count_egg += 1;
                eggElement.innerHTML = count_egg;
            }else if(this.sprite ==='images/gold.png'){
                count_gold += 1;
                goldElement.innerHTML= count_gold;
            } else {
                player.resetPlayer();
               if(life > 1){
                   heart.removeChild(heart.firstElementChild);
                   life--;
               } else {
                   //modal that you lost
                   newGame = true;
                   endGame();
               }
            }
        }
    }
    
    render() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }
    
    gather() {
        this.x = -200;
        this.y = -200;         
    }   
}

//generate player
const player = new Player(318, 475);

//generate enemies
let allEnemies =[];
const enemy1 = new Enemy(-50, 135);
const enemy2 = new Enemy(-110, 220);
const enemy3 = new Enemy(-150, 300);
const enemy4 = new Enemy(-150, 380);

allEnemies.push(enemy1,enemy2,enemy3,enemy4);

//generate items to gather
let bucket_x = shuffle([20, 120, 220, 320, 420, 520, 620]);
let bucket_y = shuffle([135, 220, 300, 385]);

let allGoodies = [];
const goodies1 = new Goodies(bucket_x[0],bucket_y[0]);
const goodies2 = new Goodies(bucket_x[1],bucket_y[1]);
const goodies3 = new Goodies(bucket_x[2],bucket_y[2]);

allGoodies.push(goodies1, goodies2,goodies3);


// Shuffle function from http://stackoverflow.com/a/2450976  
function shuffle(array) {
    let currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
};

//end the game
const endGame = () =>{
    modal.style.display = "block";
    m_content_1.style.display= "block"; 
    m_content_2.style.display= "none"; 
    const gold_end = document.querySelector('.count-gold-end');
    const egg_end = document.querySelector('.count-egg-end');
    gold_end.innerHTML = count_gold;
    egg_end.innerHTML = count_egg;
    restartGame();
    gameStart =  false;
}

//restarts the game
function restartGame() {  
    btn_1.onclick = () => {
         const cloneH = hearts.cloneNode(false);
         heart.appendChild(hearts);
         heart.appendChild(cloneH);
         count_egg = 0
         eggElement.innerHTML = count_egg;
         count_gold = 0;
         goldElement.innerHTML= count_gold;
         life = 3;
         m_content_1.style.display="none";
         m_content_2.style.display= "block";  
    } 
    
    btn_2.onclick = () => {
        gameStart = true;
        modal.style.display = "none";
        m_content_2.style.display="none";
        for(let i = 0; i < allEnemies.length;i++){
            allEnemies[i].x = -100;
            allEnemies[i].s = 100 + Math.floor(Math.random() * 300);
        }  
        randomGoodies();
    }  
};

//select player
const choosePlayer = (selection) => {
    switch(selection){
        case "red": 
            player.sprite = 'images/bird-red.png';
            break; 
            case "yellow":
            player.sprite = 'images/bird-yellow.png';
            break;
            case "black":
            player.sprite = 'images/bird-black.png';
            break;
    }
}


// randomize items to gather
const randomGoodies = () => {
    bucket_x = shuffle([20, 120, 220, 320, 420, 520, 620]);
    bucket_y = shuffle([135, 220, 300, 385]);
    let random_sprite = shuffle(['images/egg.png', 'images/gold.png', 'images/bomb.png'])
    goodies1.x = bucket_x[0];
    goodies1.y = bucket_y[0];
    goodies1.sprite =random_sprite[Math.floor(Math.random() * Math.floor(3))];
    goodies2.x = bucket_x[1];
    goodies2.y = bucket_y[1];
    goodies2.sprite =random_sprite[Math.floor(Math.random() * Math.floor(3))];
    goodies3.x = bucket_x[2];
    goodies3.y = bucket_y[2];
    goodies3.sprite =random_sprite[Math.floor(Math.random() * Math.floor(3))];
}

// This listens for key presses and sends the keys to your
document.addEventListener('keyup', function(e) {
    if(gameStart === true){
        var allowedKeys = {
            37: 'left',
            38: 'up',
            39: 'right',
            40: 'down'
        };
    } else {
        return undefined;
    }
    player.handleInput(allowedKeys[e.keyCode]);
});
