//variáveis globais
var trex, trex_running,trex_collided, ground, groundImg;
var chao_invisivel, num1, num2;
var nuvemImg;
var grupoNuvem, grupoObs;
var score = 0;
var PLAY = 1;
var END = 0;
var gameState = PLAY;
var jumpSound, dieSound, pointSound;
var gameOver, restart, gameOverImg, restartImg;

//função de carregamento de arquivos
function preload (){
    trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
    trex_collided = loadAnimation("trex_collided.png");
    groundImg = loadImage("ground2.png");
    nuvemImg = loadImage ("cloud.png");
    obstaculo1 = loadImage("obstacle1.png");
    obstaculo2 = loadImage("obstacle2.png");
    obstaculo3 = loadImage("obstacle3.png");
    obstaculo4 = loadImage("obstacle4.png");
    obstaculo5 = loadImage("obstacle5.png");
    obstaculo6 = loadImage("obstacle6.png");
    jumpSound = loadSound("jump.mp3");
    pointSound = loadSound("checkpoint.mp3");
    gameOverImg = loadImage("gameOver.png");
    restartImg = loadImage("restart.png");
}

//função criação de sprites e propriedades
function setup(){
    createCanvas(windowWidth,windowHeight);

    trex = createSprite(50,height-70,20,60);
    trex.scale=0.8;
    trex.addAnimation("running",trex_running);
    trex.addAnimation("trex_collided",trex_collided);

    ground = createSprite(width/2,height,width,20);
    ground.addImage("ground",groundImg);
    ground.x = ground.width/2;
    
    chao_invisivel = createSprite(width/2,height-10,width,125);
    chao_invisivel.visible = false;

    grupoNuvem = new Group();
    grupoObs = new Group();

    trex.debug = true;
    trex.setCollider("rectangle",0,0,70,90);
    
    gameOver = createSprite(width/2,height/2- 50);
    gameOver.addImage(gameOverImg);
  
    restart = createSprite(width/2,height/2);
    restart.addImage(restartImg);
    
    gameOver.scale = 0.5;
    restart.scale = 0.1;

    gameOver.visible = false;
    restart.visible = false;

}

//função que desenha e repete em frames
function draw(){
    background("white");
    //pontuação na tela
    text("SCORE: " + score,500,50);
    
    if(gameState === PLAY){
        //atualizar pontuação
        score = score + Math.round(getFrameRate()/60);
        //faz o trex pular
        if((touches.length > 0 || keyDown("space")) && trex.y >= height-120 ){
            trex.velocityY = -12; 
            jumpSound.play();
            touches=[];
        }
        //criando força de gravidade
        trex.velocityY += 0.5;
        //movimento do chão
        ground.velocityX = -2;

        gerarNuvens();
        gerarObs();
        
        if(grupoObs.isTouching(trex)){
            gameState = END;
        }
    }else if(gameState === END){
        gameOver.visible = true;
        restart.visible = true;

        ground.velocityX = 0;

        trex.changeAnimation("trex_collided",trex_collided);

        grupoObs.setVelocityXEach(0);
        grupoNuvem.setVelocityXEach(0);

        grupoObs.setLifetimeEach(-1);
        grupoNuvem.setLifetimeEach(-1);
        trex.velocityY = 0;
        if(mousePressedOver(restart)){
            reset();
        }
    }

    //colisão trex e chao
    trex.collide(chao_invisivel);
    

    //chão infinito
    if(ground.x < 0){
        ground.x = ground.width/2;
    }

    if(score>0 && score%100 === 0){
        pointSound.play();
    }
    
    drawSprites();
}

//criando a função que gera as nuvens
function gerarNuvens(){
    
    if(frameCount%60 === 0){
        var nuvem = createSprite(width+20,height-300,40,10);
        nuvem.velocityX = -2;
        nuvem.y = random(100,220);
        nuvem.addImage("nuvem",nuvemImg);
        nuvem.scale = 0.5;
        //
        nuvem.depth = trex.depth;
        trex.depth += 1;
        //
        nuvem.lifetime = 300;
        grupoNuvem.add(nuvem);
    }
    
}
//
function gerarObs(){
    if(frameCount%60 === 0){
        var obstaculo = createSprite(600,height-95,20,30);
        obstaculo.velocityX = -4;
        
        var rand = Math.round(random(1,6));

        switch(rand){
            case 1: obstaculo.addImage(obstaculo1);
                    break;
            case 2: obstaculo.addImage(obstaculo2);
                    break;
            case 3: obstaculo.addImage(obstaculo3);
                    break;
            case 4: obstaculo.addImage(obstaculo4);
                    break;
            case 5: obstaculo.addImage(obstaculo5);
                    break;
            case 6: obstaculo.addImage(obstaculo6);
                    break;
            default:break;

        }  

        obstaculo.scale=0.8;
        obstaculo.lifetime=200; 
        grupoObs.add(obstaculo); 
    }
}

function reset(){
    gameState = PLAY;
    gameOver.visible = false;
    restart.visible = false;
    
    grupoObs.destroyEach();
    grupoNuvem.destroyEach();
    
    trex.changeAnimation("running",trex_running);
    
    score = 0;
    
  }