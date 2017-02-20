window.onload = function(){

  var game = new Phaser.Game(672, 480, Phaser.CANVAS, 'game');

  var Bomberman = function (game) {
    this.map = null;
    this.layer = null;
    this.bomber = null;
    this.gridsize = 16;
    this.bombMax = 3;
    this.activeBomb = 0;
    this.fireSize =  4;
  }
  Bomberman.prototype = {

        init: function () {

            this.physics.startSystem(Phaser.Physics.ARCADE);

        },

        preload: function () {

            this.load.tilemap('map', 'assets/bomberman-stage-1.json', null, Phaser.Tilemap.TILED_JSON);
            this.load.image('tiles', 'assets/tiles.png');
            this.load.spritesheet('bomber', 'assets/bomber.png', 16, 32);
            this.load.spritesheet('bomb', 'assets/bombs.png', 16, 16, -1, 0, 1);

        },

        create: function() {

          this.map = this.add.tilemap('map');
          this.map.addTilesetImage('battle stage', 'tiles');
          this.layer = this.map.createLayer('Tile Layer 1');
          this.layer.setScale(2);
          this.map.setCollision([2,3], true, this.layer);
          this.bomber = this.add.sprite(64, 32, 'bomber', 20);
          this.bomber.scale.setTo(2);
          this.bomber.anchor.set(0);
          this.bomber.animations.add('right', [10,11,10,12], 10, true);
          this.bomber.animations.add('left', [30,31,30,32], 10, true);
          this.bomber.animations.add('up', [0,1,0,2], 10, true);
          this.bomber.animations.add('down', [20,21,20,22], 10, true);
          this.physics.arcade.enable(this.bomber);
          this.bomber.body.setSize(16,16,0,16)
          this.cursors = this.input.keyboard.createCursorKeys();
          this.spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

        },

        checkInput: function() {
          var that = this;
          this.spaceKey.onDown.add( this.placeBomb ,this)



          if(this.cursors.right.isDown) {
            this.bomber.body.velocity.x = 100;
            this.bomber.animations.play('right');
          } else if(this.cursors.left.isDown) {
            this.bomber.body.velocity.x = -100;
            this.bomber.animations.play('left');
          } else if(this.cursors.up.isDown) {
            this.bomber.body.velocity.y = -100;
            this.bomber.animations.play('up');
          } else if(this.cursors.down.isDown) {
            this.bomber.body.velocity.y = 100;
            this.bomber.animations.play('down');
          }
          else if(this.bomber.x%32 === 0 && this.bomber.y%32 === 0){

            this.bomber.body.velocity.x = 0;
            this.bomber.body.velocity.y = 0;
            this.bomber.animations.stop();
          }
        },

        placeBomb: function() {

          if (this.activeBomb < this.bombMax) {
            var bomb = this.add.sprite(Phaser.Math.snapTo(this.bomber.body.x, 32), Phaser.Math.snapTo(this.bomber.body.y, 32), 'bomb', 0);
            bomb.animations.add('pulse', [1,2,3], 10, true);
            bomb.animations.play('pulse');
            bomb.scale.setTo(2);
            this.activeBomb += 1;

            setTimeout(this.explode, 3000, this, bomb);
          }
        },

        explode: function(that, bomb) {
          var fire = that.fireSize;
          bomb.animations.stop()
          bomb.animations.add('explode', [9, 17, 25, 33, 41], 10, false);
          if (fire === 0) {
            var right = bomb.addChild(that.make.sprite(that.gridsize-1, 0, 'bomb', 15));
            var left = bomb.addChild(that.make.sprite(1, 0,'bomb', 15));
            var up = bomb.addChild(that.make.sprite(0, -that.gridsize +1, 'bomb', 15));
            var down = bomb.addChild(that.make.sprite(0, 2*that.gridsize - 1, 'bomb', 15));
            down.anchor.setTo(0,0);
            left.anchor.setTo(0, 0);
            down.scale.y = -1;
            left.scale.x = -1;
            right.animations.add('explode_right', [10,18,26,34,42], 15, false);
            left.animations.add('explode_left', [10,18,26,34,42], 15, false);
            up.animations.add('explode_up', [8,16,24,32,40], 15, false);
            down.animations.add('explode_down', [8,16,24,32,40], 15, false);
            right.animations.play('explode_right', 10, false);
            left.animations.play('explode_left', 10, false);
            up.animations.play('explode_up', 10, false);
            down.animations.play('explode_down', 10, false);
            bomb.animations.play('explode', 15, false, true);
          }
          else{
            var right = bomb.addChild(that.make.sprite(that.gridsize-1, 0, 'bomb', 15));
            var left = bomb.addChild(that.make.sprite(1, 0,'bomb', 15));
            var up = bomb.addChild(that.make.sprite(0, -that.gridsize +1, 'bomb', 15));
            var down = bomb.addChild(that.make.sprite(0, 2*that.gridsize - 1, 'bomb', 15));
            down.anchor.setTo(0,0);
            left.anchor.setTo(0, 0);
            down.scale.y = -1;
            left.scale.x = -1;
            right.animations.add('explode_right', [12,20,28,36,44], 15, false);
            left.animations.add('explode_left', [12,20,28,36,44], 15, false);
            up.animations.add('explode_up', [11,19,27,35,43], 15, false);
            down.animations.add('explode_down', [11,19,27,35,43], 15, false);
            right.animations.play('explode_right', 10, false);
            left.animations.play('explode_left', 10, false);
            up.animations.play('explode_up', 10, false);
            down.animations.play('explode_down', 10, false);
            bomb.animations.play('explode', 15, false, true);
            fire -= 1;
            var pos = 2;
            var leftPos = 1;
            var downPos = 3;
            var offset = 2;
            while(fire > 0) {
              right = bomb.addChild(that.make.sprite((pos * that.gridsize)-offset, 0, 'bomb', 15));
              left = bomb.addChild(that.make.sprite((leftPos * -that.gridsize)+offset, 0,'bomb', 15));
              up = bomb.addChild(that.make.sprite(0, (pos * -that.gridsize) +offset, 'bomb', 15));
              down = bomb.addChild(that.make.sprite(0, (downPos * that.gridsize) - offset, 'bomb', 15));
              down.anchor.setTo(0,0);
              left.anchor.setTo(0, 0);
              down.scale.y = -1;
              left.scale.x = -1;
              right.animations.add('explode_right', [12,20,28,36,44], 15, false);
              left.animations.add('explode_left', [12,20,28,36,44], 15, false);
              up.animations.add('explode_up', [11,19,27,35,43], 15, false);
              down.animations.add('explode_down', [11,19,27,35,43], 15, false);
              right.animations.play('explode_right', 10, false);
              left.animations.play('explode_left', 10, false);
              up.animations.play('explode_up', 10, false);
              down.animations.play('explode_down', 10, false);
              fire -= 1;
              pos += 1;
              leftPos += 1;
              downPos +=1;
              offset += 1;
              }

            right = bomb.addChild(that.make.sprite((pos * that.gridsize)-offset, 0, 'bomb', 15));
            left = bomb.addChild(that.make.sprite((leftPos * -that.gridsize)+offset, 0,'bomb', 15));
            up = bomb.addChild(that.make.sprite(0, (pos * -that.gridsize) +offset, 'bomb', 15));
            down = bomb.addChild(that.make.sprite(0, (downPos * that.gridsize) - offset, 'bomb', 15));
            down.anchor.setTo(0,0);
            left.anchor.setTo(0, 0);
            down.scale.y = -1;
            left.scale.x = -1;
            right.animations.add('explode_right', [10,18,26,34,42], 15, false);
            left.animations.add('explode_left', [10,18,26,34,42], 15, false);
            up.animations.add('explode_up', [8,16,24,32,40], 15, false);
            down.animations.add('explode_down', [8,16,24,32,40], 15, false);
            right.animations.play('explode_right', 10, false);
            left.animations.play('explode_left', 10, false);
            up.animations.play('explode_up', 10, false);
            down.animations.play('explode_down', 10, false);
            bomb.animations.play('explode', 15, false, true);
          }

          that.activeBomb -= 1;

        },

        update: function() {

          this.physics.arcade.collide(this.bomber, this.layer);
          this.checkInput();
        }
      };
      game.state.add('Game', Bomberman, true);
    }
