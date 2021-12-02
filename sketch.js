var PLAY = 1;
var END = 0;
var gameState = PLAY;

var canvas;
var bgImg,girlrun;
var cave , girl , girlIdle ,girlDead;
var zombieIdle , zombieWalk , zombieAttack;
var invisibleGround;
var obstacle , obstacleGrp , obstacleImg;
var zombie , gameOver, gameOverImg , restart , restartImg;
var score, jumpSound, dieSound, checkpointSound;

function preload(){
bgImg=loadImage("forest.jpg");
girlIdle=loadImage("Idle (1).png");
girlrun=loadAnimation("Run (1).png","Run (2).png","Run (3).png","Run (4).png","Run (5).png",
"Run (6).png","Run (7).png","Run (8).png","Run (9).png","Run (10).png");
girlDead=loadAnimation("Dead (30).png");

zombieIdle=loadImage("male/Idle (1).png");
zombieWalk=loadAnimation("male/Walk (1).png","male/Walk (2).png","male/Walk (3).png","male/Walk (4).png","male/Walk (5).png",
"male/Walk (6).png","male/Walk (7).png","male/Walk (8).png","male/Walk (9).png","male/Walk (10).png");
zombieAttack=loadAnimation("male/Attack (1).png","male/Attack (2).png","male/Attack (3).png","male/Attack (4).png",
"male/Attack (5).png","male/Attack (6).png","male/Attack (7).png","male/Attack (8).png");

obstacleImg = loadImage("rockObstacle.png");
gameOverImg = loadImage("gameOver.png");
restartImg = loadImage("restart.png");

jumpSound = loadSound("jump.mp3");
dieSound = loadSound("die.mp3");
}

function setup() {
  canvas = createCanvas(600,500);
  
  cave=createSprite(300,250);
  cave.addImage("cave",bgImg);
  cave.scale=1.4;
  cave.x=width/2;
  cave.velocityX=-4;
  

  girl = createSprite(300,450);
  girl.addAnimation("run",girlrun);
  girl.addAnimation("dead",girlDead);
  girl.scale=0.3;
  girl.setCollider("rectangle",0,0,girl.width,girl.height);
  

  invisibleGround = createSprite(400,475,800,20);
  invisibleGround.visible= false;
  
  obstacleGrp= createGroup();

  zombie = createSprite(100,400);
  zombie.addAnimation("walk",zombieWalk);
  zombie.addAnimation("attack",zombieAttack)
  zombie.scale=0.3;
  zombie.debug=false;

  gameOver = createSprite(300,200,50,20);
  gameOver.addImage(gameOverImg);

  restart = createSprite(315,250,20,20);
  restart.addImage(restartImg);
  restart.scale=0.5;

  score = 0;
 
}

function draw() {
  background(0); 

  girl.collide(invisibleGround);
  zombie.collide(invisibleGround);


  if (gameState === PLAY){

    if(cave.x < 150){
      cave.x = cave.width/2;
    }

    if(keyDown("space") && girl.y>=100){
      girl.velocityY= -12;
      jumpSound.play();
    }

    //gravity
    girl.velocityY = girl.velocityY+0.8;
    zombie.velocityY = zombie.velocityY+0.8;
  
  
    if(obstacleGrp.isTouching(zombie)){
   zombie.velocityY= zombie.velocityY - 12;
    }

    cave.velocityX=-(4+3*score/100);

    if(obstacleGrp.isTouching(girl)){
      gameState=END;
      dieSound.play();
      obstacleGrp.destroyEach();
    }

    spawnObstacle();

    restart.visible=false;
    gameOver.visible=false;

    score = score + Math.round(getFrameRate()/60);
  } 
   else if (gameState === END){

    cave.x=300;
    cave.y=250;
    cave.velocityX=0;
    girl.velocityY=0;
    obstacleGrp.setVelocityEach(0);
    restart.visible=true;
    gameOver.visible=true;
    girl.changeAnimation("dead");
    zombie.changeAnimation("attack");
    zombie.x=girl.x;
    obstacleGrp.setLifetimeEach(-1);
    
   }
  
   if(mousePressedOver(restart)){
     reset();
   }
  
  drawSprites();

  fill("white");
  textSize(20);
  text("Score :" + score , 400,50);
}

function spawnObstacle() {
  if(frameCount % 175 === 0){
    obstacle = createSprite(800,450,10,40);  
    obstacle.addImage("obstacle",obstacleImg);
    obstacle.scale=0.2;
    obstacle.velocityX=-4;
    obstacle.x= Math.round(random(400,600))
    obstacle.setCollider("circle",0,0,1);
    
    obstacle.lifetime=700;
    obstacleGrp.add(obstacle);
  }
}

function reset(){
  gameState = PLAY;
  gameOver.visible=false;
  restart.visible=false;
  girl.changeAnimation("run");
  zombie.changeAnimation("walk");
  score = 0;
  cave.velocityX=-4;
  zombie.x=100;
}