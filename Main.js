window.onload = function(){

  var game = new Phaser.Game(672, 480, Phaser.CANVAS, 'game');

  var Bomberman = function (game) {
    this.map = null;
    this.layer = null;
    this.bomber = null;
    this.gridsize = 16;
    this.bombMax = 1;
    this.activeBomb = 0;
    this.fireSize =  1;
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
          this.spaceKey.onDown.add(function(){
            this.placeBomb();
          },this)



          if(this.cursors.right.isDown) {

            this.bomber.body.velocity.y = 0;
            this.bomber.body.velocity.x = 100;
            this.bomber.animations.play('right');
          } else if(this.cursors.left.isDown) {
            this.bomber.body.velocity.y = 0;
            this.bomber.body.velocity.x = -100;
            this.bomber.animations.play('left');
          } else if(this.cursors.up.isDown) {
            this.bomber.body.velocity.x = 0;
            this.bomber.body.velocity.y = -100;
            this.bomber.animations.play('up');
          } else if(this.cursors.down.isDown) {
            this.bomber.body.velocity.x = 0;
            this.bomber.body.velocity.y = 100;
            this.bomber.animations.play('down');
          }
          else {
            this.bomber.body.velocity.x = 0;
            this.bomber.body.velocity.y = 0;
            this.bomber.animations.stop();
          }
        },

        placeBomb: function() {
          if (this.activeBomb < this.bombMax) {
            var bomb = this.add.sprite(this.bomber.body.x, this.bomber.body.y, 'bomb', 0);
            bomb.animations.add('pulse', [1,2,3], 10, true);
            bomb.animations.play('pulse');
            bomb.scale.setTo(2);
            this.activeBomb += 1;

            setTimeout(this.explode, 3000, this, bomb);
          }
        },

        explode: function(that, bomb) {

          bomb.animations.stop()
          bomb.animations.add('explode', [9, 17], 10, false);
          bomb.animations.play('explode', 10, false, true);
          that.activeBomb -= 1;

        },

        update: function() {

          this.physics.arcade.collide(this.bomber, this.layer);
          this.checkInput();

        }
      };
      game.state.add('Game', Bomberman, true);
    }
