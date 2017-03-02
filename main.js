//////////////////////////////////////////////////////////////////
file_path = "./img/";
player_right_sprite = "ryu_right_1.png";
player_left_sprite = "ryu_left_1.png";
// Added by Travis
ai_right_sprite = "ryu_right_2.png";
ai_left_sprite = "ryu_left_2.png";
// End Added by Travis
const frame_width = 150;
const frame_height = 150;
const punch_width = 130;
const kick_width = 150;
var entities_list = [];

//global var of sound
var backgroundMusic;
var isBackgroundMusicPlaying;


window.onload = function () {
    document.getElementById("gameWorld").focus();
};

function sleep(milliseconds) {
    var start = new Date().getTime();
    while ((start + milliseconds) > new Date().getTime()) {
    }
}

// function distance() {
//     return (Math.abs(entities_list[0].x - entities_list[1].x) - entities_list[0].offset + entities_list[1].offset);
// }

function distance(offsetCaller, offsetOpponent) {
    return (Math.abs(entities_list[0].x - entities_list[1].x) - offsetCaller + offsetOpponent);
}

// Added by Travis
function distance_abs() {
    // Player is to the left of AI
    if ((entities_list[0].x - entities_list[1].x) > 0) {
        return -1;
        // Player is to the right of AI
    } else if ((entities_list[0].x - entities_list[1].x) < 0) {
        return 1;
        // Players at same X coordinate or some error condition
    } else {
        return 0;
    }
}
// End Added by Travis

function Animation(spriteSheet, startX, startY, frameWidth, frameHeight, frameDuration, frames, loop, reverse) {
    this.spriteSheet = spriteSheet;
    this.startX = startX;
    this.startY = startY;
    this.frameWidth = frameWidth;
    this.frameDuration = frameDuration;
    this.frameHeight = frameHeight;
    this.frames = frames;
    this.totalTime = frameDuration * frames;
    this.elapsedTime = 0;
    this.loop = loop;
    this.reverse = reverse;
}

Animation.prototype.drawFrame = function (tick, ctx, x, y, scaleBy) {
    var scaleBy = scaleBy || 1;
    this.elapsedTime += tick;
    if (this.loop) {
        if (this.isDone()) {
            this.elapsedTime = 0;
        }
    } else if (this.isDone()) {
        return;
    }
    var index = this.reverse ? this.frames - this.currentFrame() - 1 : this.currentFrame();
    var vindex = 0;
    if ((index + 1) * this.frameWidth + this.startX > this.spriteSheet.width) {
        index -= Math.floor((this.spriteSheet.width - this.startX) / this.frameWidth);
        vindex++;
    }
    while ((index + 1) * this.frameWidth > this.spriteSheet.width) {
        index -= Math.floor(this.spriteSheet.width / this.frameWidth);
        vindex++;
    }

    var locX = x;
    var locY = y;
    var offset = vindex === 0 ? this.startX : 0;
    ctx.drawImage(this.spriteSheet,
        index * this.frameWidth + offset, vindex * this.frameHeight + this.startY,  // source from sheet
        this.frameWidth, this.frameHeight,
        locX, locY,
        this.frameWidth * scaleBy,
        this.frameHeight * scaleBy);
}

Animation.prototype.currentFrame = function () {
    return Math.floor(this.elapsedTime / this.frameDuration);
}

Animation.prototype.isDone = function () {
    return (this.elapsedTime >= this.totalTime);
}

function Background(game) {
    Entity.call(this, game, 350, 400);

    // background sound initialization
    backgroundMusic = new Audio("./sound/backgroundsound.mp3");
    console.log("started playing background music");
    backgroundMusic.play();
    isBackgroundMusicPlaying = true;
    this.radius = 200;
}

Background.prototype = new Entity();
Background.prototype.constructor = Background;

Background.prototype.update = function () {

    //background update
    if (isBackgroundMusicPlaying) {
        backgroundMusic.pause();
        isBackgroundMusicPlaying = false;
    } else {
        isBackgroundMusicPlaying = true;
        backgroundMusic.play();
    }
}

Background.prototype.draw = function (ctx) {
    Entity.prototype.draw.call(this);
}

function Player(game) {
    this.playerLeft = false; this.playerRight = true;
    // left = true; right = false;
    if (this.playerLeft) {
        this.animation = new Animation(ASSET_MANAGER.getAsset(file_path + player_left_sprite), 0, 0, frame_width, frame_height, 0.1, 10, true, false);
        this.walkAnimation = new Animation(ASSET_MANAGER.getAsset(file_path + player_left_sprite), 0, 1 * frame_height, frame_width, frame_height, 0.05, 10, true, false);
        this.jumpAnimation = new Animation(ASSET_MANAGER.getAsset(file_path + player_left_sprite), 0, 2 * frame_height, frame_width, frame_height, 0.05, 12, false, false);
        this.punchAnimation = new Animation(ASSET_MANAGER.getAsset(file_path + player_left_sprite), 0, 3 * frame_height, frame_width, frame_height, 0.05, 5, false, false);
        this.kickAnimation = new Animation(ASSET_MANAGER.getAsset(file_path + player_left_sprite), 0, 4 * frame_height, frame_width, frame_height, 0.05, 8, false, false);
        this.fallAnimation = new Animation(ASSET_MANAGER.getAsset(file_path + player_left_sprite), 0, 2 * frame_height, frame_width, frame_height, 0.05, 12, false, false);
    } else if (this.playerRight) {
        this.animation = new Animation(ASSET_MANAGER.getAsset(file_path + player_right_sprite), 2 * frame_width, 0, frame_width, frame_height, 0.1, 10, true, false);
        this.walkAnimation = new Animation(ASSET_MANAGER.getAsset(file_path + player_right_sprite), 2 * frame_width, 1 * frame_height, frame_width, frame_height, 0.05, 10, true, false);
        this.jumpAnimation = new Animation(ASSET_MANAGER.getAsset(file_path + player_right_sprite), 0, 2 * frame_height, frame_width, frame_height, 0.05, 12, false, false);
        this.punchAnimation = new Animation(ASSET_MANAGER.getAsset(file_path + player_right_sprite), 7 * frame_width, 3 * frame_height, frame_width, frame_height, 0.05, 5, false, false);
        this.kickAnimation = new Animation(ASSET_MANAGER.getAsset(file_path + player_right_sprite), 4 * frame_width, 4 * frame_height, frame_width, frame_height, 0.05, 8, false, false);
        this.fallAnimation = new Animation(ASSET_MANAGER.getAsset(file_path + player_right_sprite), 0, 2 * frame_height, frame_width, frame_height, 0.05, 12, false, false);
    }

    //////////////mike

    // sound effect variables
    this.punchingSound = new Audio("./sound/punch.wav");
    this.walkingSound = new Audio("./sound/walking2.wav");
    this.kickingSound = new Audio("./sound/kick.wav");
    this.jumpingSound = new Audio("./sound/jump.wav");
    ///	    this.backgroundMusic = new Audio("./sound/backgroundsound.mp3");
    this.dyingSound = new Audio("./sound/dying.wav");
    // need to be implemented getting sound
    this.gethitSound = new Audio("./sound/gettinghit.wav");
    this.isGameOver = false;
    //this.backgroundMusic.play();

    ////////////////mike

    this.walking = false;
    this.jumping = false;
    this.falling = false;
    this.punching = false;
    this.kicking = false;
    this.name = 'Ken';
    this.hp = 100;
    this.offset = 0;
    this.offsetPunch = 0;
    this.offsetKick = 0;
    this.radius = 100;
    this.ground = 240;
    this.x = 300;
    this.y = 240;

    // Added by Travis
    this.direction = 1
    // End Added by Travis

    Entity.call(this, game, 300, 240);
}

Player.prototype = new Entity();
Player.prototype.constructor = Player;

Player.prototype.update = function () {
    //player is to the left
    if (distance_abs() === 1) {
        this.offset = 85;
        this.offsetPunch = 130;
        this.offsetKick = 150;
        //player is to the right
    } else if (distance_abs() === -1) {
        this.offset = 65;
        this.offsetPunch = 20;
        this.offsetKick = 0;
    }

    // Added by Travis
    if (distance_abs() == 1 && this.direction == 1) {
        this.direction = -1;
        this.animation = new Animation(ASSET_MANAGER.getAsset(file_path + player_right_sprite), 2 * frame_width, 0, frame_width, frame_height, 0.1, 10, true, false);
        this.walkAnimation = new Animation(ASSET_MANAGER.getAsset(file_path + player_right_sprite), 2 * frame_width, 1 * frame_height, frame_width, frame_height, 0.05, 10, true, false);
        this.jumpAnimation = new Animation(ASSET_MANAGER.getAsset(file_path + player_right_sprite), 0, 2 * frame_height, frame_width, frame_height, 0.05, 12, false, false);
        this.punchAnimation = new Animation(ASSET_MANAGER.getAsset(file_path + player_right_sprite), 7 * frame_width, 3 * frame_height, frame_width, frame_height, 0.05, 5, false, false);
        this.kickAnimation = new Animation(ASSET_MANAGER.getAsset(file_path + player_right_sprite), 4 * frame_width, 4 * frame_height, frame_width, frame_height, 0.05, 8, false, false);
        this.fallAnimation = new Animation(ASSET_MANAGER.getAsset(file_path + player_right_sprite), 0, 2 * frame_height, frame_width, frame_height, 0.05, 12, false, false);
    } else if (distance_abs() == -1 && this.direction == -1) {
        this.direction = 1;
        this.animation = new Animation(ASSET_MANAGER.getAsset(file_path + player_left_sprite), 0, 0, frame_width, frame_height, 0.1, 10, true, false);
        this.walkAnimation = new Animation(ASSET_MANAGER.getAsset(file_path + player_left_sprite), 0, 1 * frame_height, frame_width, frame_height, 0.05, 10, true, false);
        this.jumpAnimation = new Animation(ASSET_MANAGER.getAsset(file_path + player_left_sprite), 0, 2 * frame_height, frame_width, frame_height, 0.05, 12, false, false);
        this.punchAnimation = new Animation(ASSET_MANAGER.getAsset(file_path + player_left_sprite), 0, 3 * frame_height, frame_width, frame_height, 0.05, 5, false, false);
        this.kickAnimation = new Animation(ASSET_MANAGER.getAsset(file_path + player_left_sprite), 0, 4 * frame_height, frame_width, frame_height, 0.05, 8, false, false);
        this.fallAnimation = new Animation(ASSET_MANAGER.getAsset(file_path + player_left_sprite), 0, 2 * frame_height, frame_width, frame_height, 0.05, 12, false, false);
    }
    // End Added by Travis

    if (this.game.walk) this.walking = true; else this.walking = false;
    if (this.game.playerLeft) { this.playerLeft = true; this.playerRight = false; } else { this.playerLeft = false; this.playerRight = true };
    if (this.game.space) {
        this.jumping = true;
        ///mike
        this.jumpingSound.play();
        if (this.game.punch) this.punching = true;
        if (this.game.jump) this.punching = true;
        // this.jumping = true;
        if (this.game.kick) this.kicking = true;
        // this.hp -= 1;
        /* add this after we implement the hitbox
            if(this.hp==0){
              isGameOver= true;
              this.backgroundMusic.pause();
          this.dyingSound.play();
            }
        */

        ///mike
    }

    if (this.game.punch) {
        this.punching = true;
        this.punchingSound.play();
    }
    if (this.game.kick) {
        this.kicking = true;
        this.kickingSound.play();
    }

    if (this.falling) {
        if (this.fallAnimation.isDone()) {
            this.fallAnimation.elapsedTime = 0;
            console.log(this.playerLeft);

            sleep(2000);
            this.falling = false;

            if (this.playerRight) {
                this.x = 300;
            } else if (this.playerLeft) {
                this.x = 500;
            }
            console.log(this.x);
        }

        var fallDistance = this.fallAnimation.elapsedTime / this.fallAnimation.totalTime;
        var totalHeight = -200;

        // if (fallDistance > 0.5)
        //     fallDistance = 1 - fallDistance;

        var height = fallDistance * totalHeight;
        // var height = totalHeight * (-4 * (fallDistance * fallDistance - fallDistance));
        this.y = this.ground - height;
    }

    if (this.jumping && !this.falling) {
        if (this.jumpAnimation.isDone()) {
            this.jumpAnimation.elapsedTime = 0;
            this.jumping = false;
        }
        var jumpDistance = this.jumpAnimation.elapsedTime / this.jumpAnimation.totalTime;
        var totalHeight = 150;

        if (jumpDistance > 0.5)
            jumpDistance = 1 - jumpDistance;

        //var height = jumpDistance * 2 * totalHeight;
        var height = totalHeight * (-4 * (jumpDistance * jumpDistance - jumpDistance));
        this.y = this.ground - height;
    }

    if (this.punching && !this.falling) {
        // this.offset = 130;
        if (this.punchAnimation.isDone()) {
            this.punchAnimation.elapsedTime = 0;
            this.punching = false;
            if (distance(this.offsetPunch, entities_list[1].offset) <= 0) { entities_list[1].hp -= 2; };
        }
    }

    if (this.kicking && !this.falling) {
        // this.offset = 150;
        if (this.kickAnimation.isDone()) {
            this.kickAnimation.elapsedTime = 0;
            this.kicking = false;
            if (distance(this.offsetKick, entities_list[1].offset) <= 0) { entities_list[1].hp--; };
        }
    }

    if (this.walking && this.playerRight && !this.falling) {

        this.walkingSound.play();

        // if (this.walkAnimation.isDone()) {
        //     this.walkAnimation.elapsedTime = 0;
        //     this.walking = false;
        // }

        // var rightDistance = this.walkAnimation.elapsedTime / this.walkAnimation.totalTime;
        // var totalRight = 20;

        // if (rightDistance > 0.5)
        //     rightDistance = 1 - rightDistance;

        // var right = totalRight * (-1 * (rightDistance * rightDistance - rightDistance));
        this.jumping ? this.x += 6 : this.x += 3;
        console.log(distance(this.offset, entities_list[1].offset));
        if (this.x > 710) {
            this.falling = true;
        }
    }

    if (this.walking && this.playerLeft && !this.falling) {
        this.walkingSound.play();
        // if (this.walkAnimation.isDone()) {
        //     this.walkAnimation.elapsedTime = 0;
        //     this.walking = false;
        // }

        // var leftDistance = this.walkAnimation.elapsedTime / this.walkAnimation.totalTime;
        // var totalLeft = 20;

        // if (leftDistance > 0.5)
        //     leftDistance = 1 - leftDistance;

        // var left = totalLeft * (-1 * (leftDistance * leftDistance - leftDistance));
        this.jumping ? this.x -= 6 : this.x -= 3;
        console.log(distance(this.offset, entities_list[1].offset));
        if (this.x < 165) {
            console.log("5 " + this.x);
            this.falling = true;
        }
    }
    Entity.prototype.update.call(this);
}

Player.prototype.draw = function (ctx) {
    if (!this.falling) {
        if (this.jumping) {
            this.jumpAnimation.drawFrame(this.game.clockTick, ctx, this.x, this.y);
        } else if (this.punching) {
            // console.log("3 " + distance());
            this.punchAnimation.drawFrame(this.game.clockTick, ctx, this.x, this.y);
        } else if (this.kicking) {
            // console.log("4 " + distance());
            this.kickAnimation.drawFrame(this.game.clockTick, ctx, this.x, this.y);
        } else if (this.walking) {

            this.walkAnimation.drawFrame(this.game.clockTick, ctx, this.x, this.y);
        } else {
            this.animation.drawFrame(this.game.clockTick, ctx, this.x, this.y);
        }
    } else {
        console.log("jumping");
        this.fallAnimation.drawFrame(this.game.clockTick, ctx, this.x, this.y);
    }

    Entity.prototype.draw.call(this);

    // ctx.beginPath();
    // ctx.lineWidth = "2";
    // ctx.strokeStyle = "rgba(0, 0, 255, 1)";
    // ctx.moveTo(this.x + 130, 0);
    // ctx.lineTo(this.x + 130, this.ground + 150);
    // ctx.moveTo(this.x + 85, 0);
    // ctx.lineTo(this.x + 85, this.ground + 150);
    // ctx.moveTo(this.x + 150, 0);
    // ctx.lineTo(this.x + 150, this.ground + 150);

    // ctx.moveTo(0, this.ground + 40);
    // ctx.lineTo(this.x + 85, this.ground + 40);
    // ctx.stroke();
    // ctx.closePath();
}

function Ai(game) {
    // Modified by Travis
    this.aiLeft = true; this.aiRight = false;
    if (this.aiLeft) {
        this.animation = new Animation(ASSET_MANAGER.getAsset(file_path + ai_left_sprite), 0, 0, frame_width, frame_height, 0.1, 10, true, false);
        this.walkAnimation = new Animation(ASSET_MANAGER.getAsset(file_path + ai_left_sprite), 0, 1 * frame_height, frame_width, frame_height, 0.05, 10, true, false);
        this.jumpAnimation = new Animation(ASSET_MANAGER.getAsset(file_path + ai_left_sprite), 0, 2 * frame_height, frame_width, frame_height, 0.05, 12, false, false);
        this.punchAnimation = new Animation(ASSET_MANAGER.getAsset(file_path + ai_left_sprite), 0, 3 * frame_height, frame_width, frame_height, 0.05, 5, false, false);
        this.kickAnimation = new Animation(ASSET_MANAGER.getAsset(file_path + ai_left_sprite), 0, 4 * frame_height, frame_width, frame_height, 0.05, 8, false, false);
        this.fallAnimation = new Animation(ASSET_MANAGER.getAsset(file_path + ai_left_sprite), 0, 2 * frame_height, frame_width, frame_height, 0.05, 12, false, false);
    } else if (this.aiRight) {
        this.animation = new Animation(ASSET_MANAGER.getAsset(file_path + ai_right_sprite), 2 * frame_width, 0, frame_width, frame_height, 0.1, 10, true, false);
        this.walkAnimation = new Animation(ASSET_MANAGER.getAsset(file_path + ai_right_sprite), 2 * frame_width, 1 * frame_height, frame_width, frame_height, 0.05, 10, true, false);
        this.jumpAnimation = new Animation(ASSET_MANAGER.getAsset(file_path + ai_right_sprite), 0, 2 * frame_height, frame_width, frame_height, 0.05, 12, false, false);
        this.punchAnimation = new Animation(ASSET_MANAGER.getAsset(file_path + ai_right_sprite), 7 * frame_width, 3 * frame_height, frame_width, frame_height, 0.05, 5, false, false);
        this.kickAnimation = new Animation(ASSET_MANAGER.getAsset(file_path + ai_right_sprite), 4 * frame_width, 4 * frame_height, frame_width, frame_height, 0.05, 8, false, false);
        this.fallAnimation = new Animation(ASSET_MANAGER.getAsset(file_path + ai_right_sprite), 0, 2 * frame_height, frame_width, frame_height, 0.05, 12, false, false);
    }
    // Modified by Travis

    this.walking = false;
    this.jumping = false;
    this.falling = false;
    this.punching = false;
    this.kicking = false;
    this.name = 'Ryu';
    this.radius = 100;
    this.hp = 100;
    this.offset = 0;
    this.offsetPunch = 0;
    this.offsetKick = 0;
    this.ground = 240;

    // Added by Travis
    this.x = 500;
    this.y = 240;
    this.cooldown = 0;
    // End added by Travis


    Entity.call(this, game, 500, 240);
}

Ai.prototype = new Entity();
Ai.prototype.constructor = Ai;

// These need to add up to 1 as well.
const do_nothing_0 = 0.2;
const walk_0 = 1 - do_nothing_0;

// THESE SHOULD ADD UP TO 1 OR WEIRD STUFF WILL HAPPEN
const kick_chance_1 = 0.6;
const do_nothing_1 = 0.2;
const get_closer = 1 - kick_chance_1 - do_nothing_1;

// THIS SET OF CONSTATNTS SHOULD ALSO ADD UP TO 1
const kick_chance_2 = 0.25
const punch_chance = 0.25
const do_nothing_2 = 0.35
const walk_away = 1 - kick_chance_2 - punch_chance - do_nothing_2


Ai.prototype.update = function () {
    //player is to the left
    if (distance_abs() === 1) {
        this.offset = 85;
        this.offsetPunch = 130;
        this.offsetKick = 150;
        //player is to the right
    } else if (distance_abs() === -1) {
        this.offset = 65;
        this.offsetPunch = 20;
        this.offsetKick = 0;
    }

    // Determines whether player/AI should switch sides of the sprite.
    if (distance_abs() == -1 && this.aiLeft) {
        this.aiLeft = false; this.aiRight = true;
        this.animation = new Animation(ASSET_MANAGER.getAsset(file_path + ai_right_sprite), 2 * frame_width, 0, frame_width, frame_height, 0.1, 10, true, false);
        this.walkAnimation = new Animation(ASSET_MANAGER.getAsset(file_path + ai_right_sprite), 2 * frame_width, 1 * frame_height, frame_width, frame_height, 0.05, 10, true, false);
        this.jumpAnimation = new Animation(ASSET_MANAGER.getAsset(file_path + ai_right_sprite), 0, 2 * frame_height, frame_width, frame_height, 0.05, 12, false, false);
        this.punchAnimation = new Animation(ASSET_MANAGER.getAsset(file_path + ai_right_sprite), 7 * frame_width, 3 * frame_height, frame_width, frame_height, 0.05, 5, false, false);
        this.kickAnimation = new Animation(ASSET_MANAGER.getAsset(file_path + ai_right_sprite), 4 * frame_width, 4 * frame_height, frame_width, frame_height, 0.05, 8, false, false);
        this.fallAnimation = new Animation(ASSET_MANAGER.getAsset(file_path + ai_right_sprite), 0, 2 * frame_height, frame_width, frame_height, 0.05, 12, false, false);
    } else if (distance_abs() == 1 && this.aiRight) {
        this.aiLeft = true; this.aiRight = false;
        this.animation = new Animation(ASSET_MANAGER.getAsset(file_path + ai_left_sprite), 0, 0, frame_width, frame_height, 0.1, 10, true, false);
        this.walkAnimation = new Animation(ASSET_MANAGER.getAsset(file_path + ai_left_sprite), 0, 1 * frame_height, frame_width, frame_height, 0.05, 10, true, false);
        this.jumpAnimation = new Animation(ASSET_MANAGER.getAsset(file_path + ai_left_sprite), 0, 2 * frame_height, frame_width, frame_height, 0.05, 12, false, false);
        this.punchAnimation = new Animation(ASSET_MANAGER.getAsset(file_path + ai_left_sprite), 0, 3 * frame_height, frame_width, frame_height, 0.05, 5, false, false);
        this.kickAnimation = new Animation(ASSET_MANAGER.getAsset(file_path + ai_left_sprite), 0, 4 * frame_height, frame_width, frame_height, 0.05, 8, false, false);
        this.fallAnimation = new Animation(ASSET_MANAGER.getAsset(file_path + ai_left_sprite), 0, 2 * frame_height, frame_width, frame_height, 0.05, 12, false, false);
    }

    if (this.cooldown == 0) {
        current_distance = distance(this.offset, entities_list[0].offset);
        // AI code starts here. If the AI is too far away, it will either idle or walk towards
        // the player.
        if (current_distance >= (kick_width - entities_list[0].offset)) {
            var rdm = Math.random();
            this.clearStatuses();
            if (rdm < walk_0) {
                this.doWalking();
            } else {
                this.cooldown = 7;
                this.walking = false;
            }
        } else if (current_distance < (kick_width - entities_list[0].offset) &&
            current_distance >= (punch_width - entities_list[0].offset)) {
            if (this.kickAnimation.elapsedTime <= 0) {
                var rdm = Math.random();
                if (rdm < kick_chance_1) {
                    this.walking = false;
                    this.kicking = true;
                    this.offset = kick_width;
                } else {
                    this.doWalking();
                }
            } else if (this.kickAnimation.isDone()) {
                this.kickAnimation.elapsedTime = 0;
                this.kicking = false;
                this.cooldown = 4;
            } else {
                this.cooldown = 7;
                this.walking = false;
            }
        } else if (current_distance < (punch_width - entities_list[0].offset)) {
            if (this.kickAnimation.elapsedTime <= 0 && this.punchAnimation.elapsedTime <= 0) {
                var rdm = Math.random();
                if (rdm <= kick_chance_2) {
                    this.walking = false;
                    this.kicking = true;
                    this.offset = kick_width;
                } else if (rdm > kick_chance_2 && rdm <= (kick_chance_2 + punch_chance)) {
                    this.walking = false;
                    this.punching = true;
                    this.offset = punch_width;
                } else if (rdm > (kick_chance_2 + punch_chance) && rdm <= (kick_chance_2 + punch_chance + do_nothing_2)) {
                    this.cooldown = 7;
                    this.walking = false;
                } else {
                    this.doWalking();
                }
            } else if (this.kickAnimation.isDone()) {
                this.kickAnimation.elapsedTime = 0;
                this.kicking = false;
                this.cooldown = 4;
                if (distance(this.offsetPunch, entities_list[0].offset) <= 0) { entities_list[0].hp -= 1; };
            } else if (this.punchAnimation.isDone()) {
                this.punchAnimation.elapsedTime = 0;
                this.punching = false;
                this.cooldown = 4;
                if (distance(this.offsetPunch, entities_list[0].offset) <= 0) { entities_list[0].hp -= 2; };
            } else {
                this.cooldown = 7;
                this.walking = false;
            }
        }
    } else {
        this.cooldown -= 1;
    }

    if (this.falling) {
        if (this.fallAnimation.isDone()) {
            this.fallAnimation.elapsedTime = 0;
            sleep(2000);
            this.falling = false;
            if (this.aiRight) {
                this.x = 300;
            } else if (this.aiLeft) {
                this.x = 500;
            }
        }
        var fallDistance = this.fallAnimation.elapsedTime / this.fallAnimation.totalTime;
        var totalHeight = -200;
        var height = fallDistance * totalHeight;
        this.y = this.ground - height;
    }

    Entity.prototype.update.call(this);
}

Ai.prototype.doWalking = function () {
    // AI to the left, move right
    if (distance_abs() < 0) {
        this.walking = true;
        this.x += 3;
        if (this.x > 710) {
            this.walking = false;
            this.falling = true;
        }
        // AI to the right, move left
    } else if (distance_abs() > 0) {
        this.walking = true;
        this.x -= 3;
        if (this.x < 165) {
            this.walking = false;
            this.falling = true;
        }
    }
}

Ai.prototype.clearStatuses = function () {
    this.walking = false;
    this.jumping = false;
    // this.falling = false;
    this.punching = false;
    this.kicking = false;
    this.kickAnimation.elapsedTime = 0;
    this.punchAnimation.elapsedTime = 0;
}

Ai.prototype.draw = function (ctx) {
    if (!this.falling) {
        if (this.jumping) {
            this.jumpAnimation.drawFrame(this.game.clockTick, ctx, this.x, this.y);
        } else if (this.punching) {
            // console.log("1 " + distance(this.offset, entities_list[0].offset));
            this.punchAnimation.drawFrame(this.game.clockTick, ctx, this.x, this.y);
        } else if (this.kicking) {
            // console.log("2 " + distance(this.offset, entities_list[0].offset));
            this.kickAnimation.drawFrame(this.game.clockTick, ctx, this.x, this.y);
        } else if (this.walking) {
            this.walkAnimation.drawFrame(this.game.clockTick, ctx, this.x, this.y);
        } else {
            this.animation.drawFrame(this.game.clockTick, ctx, this.x, this.y);
        }
    } else {
        console.log("jumping");
        this.fallAnimation.drawFrame(this.game.clockTick, ctx, this.x, this.y);
    }

    Entity.prototype.draw.call(this);

    // ctx.beginPath();
    // ctx.lineWidth = "2";
    // ctx.strokeStyle = "rgba(255, 0, 0, 0.5)";
    // // console.log("AI (" + this.x  + "," + this.y + ")");
    // ctx.moveTo(this.x + 65, 0);
    // ctx.lineTo(this.x + 65, this.ground + 150);

    // ctx.moveTo(0, this.ground + 40);
    // ctx.lineTo(this.x + 65, this.ground + 40);
    // ctx.stroke();
    // ctx.closePath();
}

// the "main" code begins here

var ASSET_MANAGER = new AssetManager();

ASSET_MANAGER.queueDownload("./img/ryu_left_1.png");
ASSET_MANAGER.queueDownload("./img/ryu_right_1.png");
ASSET_MANAGER.queueDownload("./img/ryu_left_2.png");
ASSET_MANAGER.queueDownload("./img/ryu_right_2.png");

ASSET_MANAGER.downloadAll(function () {
    console.log("starting up da sheild");
    var canvas = document.getElementById('gameWorld');
    var ctx = canvas.getContext('2d');

    var gameEngine = new GameEngine();
    var bg = new Background(gameEngine);
    var player = new Player(gameEngine);
    var ai = new Ai(gameEngine);

    //gameEngine.addEntity(bg);
    gameEngine.addEntity(ai);
    gameEngine.addEntity(player);
    entities_list.push(player);
    entities_list.push(ai);

    gameEngine.init(ctx);
    gameEngine.start();
});
