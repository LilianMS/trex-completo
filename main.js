
    //variáveis globais
var PLAY = 1;
var END = 0;

var gameState = PLAY;

var trex, trex_img,ground,ground_img;
var ground2;
var nuvemImg,cacto1,cacto2,cacto3,cacto4,cacto5,cacto6;
var grupoNuvens, grupoCactos;
var trex_collided;
var jump, die, ponto;
var placar = 0;
var gameOver, restart, gameOver_img, restart_img;

//função de carregamento de arquivos
function preload(){
    trex_img = loadAnimation("trex1.png","trex3.png","trex4.png");
    trex_collided = loadAnimation("trex_collided.png");

    ground_img = loadImage("ground2.png");
    nuvemImg = loadImage("cloud.png");
    cacto1 = loadImage("obstacle1.png");
    cacto2 = loadImage("obstacle2.png");
    cacto3 = loadImage("obstacle3.png");
    cacto4 = loadImage("obstacle4.png");
    cacto5 = loadImage("obstacle5.png");
    cacto6 = loadImage("obstacle6.png");

    jump = loadSound("jump.mp3");
    die = loadSound("die.mp3");
    ponto = loadSound("checkpoint.mp3");

    gameOver_img = loadImage("gameOver.png");
    restart_img = loadImage("restart.png");

}

//função de criação de objetos e suas propriedades
function setup(){
    createCanvas(windowWidth,windowHeight);
    trex = createSprite(50,height-170,30,70);
    trex.addAnimation("correndo",trex_img);
    trex.addAnimation("morreu",trex_collided);

    trex.scale = 0.7;
    
    //chão
    ground = createSprite(300,height-190,600,10);
    ground.addImage(ground_img);
    ground.x = ground.width/2;
    

    //chao invisível
    ground2 = createSprite(300,height-170,600,10);
    ground2.visible = false;

    grupoCactos = new Group();
    grupoNuvens = new Group();

    //trex.debug = true;
    trex.setCollider("rectangle",0,0,100,100);

    gameOver = createSprite(300,100);
    gameOver.addImage(gameOver_img);
    gameOver.scale = 0.7;
    gameOver.visible = false;
    
    restart = createSprite(300,130);
    restart.addImage(restart_img);
    restart.scale = 0.5;
    restart.visible = false;
}

//desenha em loop/frames
function draw(){
    background("white");
    textSize(18);
    text("Placar: "+placar,450,60);

    if(gameState == PLAY){
        //pontuação
        placar = placar + Math.round(frameRate()/60);
        if(placar > 0 && placar%100 === 0){
            ponto.play();
        }
        //pular
        if(keyDown("space") && trex.y > 150){
            trex.velocityY = -10;
            jump.play(); 
            
        }
        //gravidade
        trex.velocityY = trex.velocityY + 0.5;
        ground.velocityX = -5;
        gerarNuvem();

        gerarCactos();

        if(trex.isTouching(grupoCactos)){
            gameState = END;
            die.play();

        }
    }else if(gameState == END){
        ground.velocityX=0;
        grupoCactos.setVelocityXEach(0);
        grupoNuvens.setVelocityXEach(0);
        grupoNuvens.setLifetimeEach(-1);
        grupoCactos.setLifetimeEach(-1);

        trex.changeAnimation("morreu",trex_collided);
        gameOver.visible = true;
        restart.visible = true;
    }

    //fundo infinito
    if(ground.x < 0){
        ground.x = ground.width/2;
    }
    //trex colide com chão invisível
    trex.collide(ground2);

    
    //clique no restart chama a função reset
    if(mousePressedOver(restart)){
        reset();
    }

    drawSprites();
    
}


function gerarNuvem(){
    if(frameCount%60 === 0){
        var nuvem = createSprite(600,100,40,10);
        nuvem.velocityX = -2;
        nuvem.y = Math.round(random(20,70));
        nuvem.addImage(nuvemImg);
        nuvem.scale = 0.5;
        nuvem.lifetime = 300;

        //mudando camadas
        trex.depth = trex.depth+1;
        nuvem.depth = trex.depth;
        
        grupoNuvens.add(nuvem);
    }    
}

function gerarCactos(){
    if(frameCount%60 == 0){
        var cacto = createSprite(width,height-200,10,50);
        cacto.velocityX = -5;
        cacto.scale=0.8;

        var num = Math.round(random(1,6));
        switch(num){
            case 1:cacto.addImage(cacto1);
                 break;
            case 2:cacto.addImage(cacto2);
                 break;
            case 3:cacto.addImage(cacto3);
                 break;
            case 4:cacto.addImage(cacto4);
                 break;
            case 5:cacto.addImage(cacto5);
                 break;
            case 6:cacto.addImage(cacto6);
                 break;
            default:break;
        }
        console.log(num);
        //largura da tela e divide pela velocidade
        cacto.lifetime = width/5;
        cacto.depth = trex.depth;

        grupoCactos.add(cacto);
    }
}

function reset(){
    gameState = PLAY;
    gameOver.visible = false;
    restart.visible = false;
    trex.changeAnimation("correndo",trex_img);
    grupoCactos.destroyEach();
    grupoNuvens.destroyEach();
    placar = 0;
}