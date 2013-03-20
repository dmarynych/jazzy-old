/**
 Provides the base Widget class...

 @module Entity
 **/

define(['./Point3D', './MovePath'], function (Point3D, MovePath) {

    /**
     * Entity constructor
     * @constructor
     */
    var Entity = function () {
        this.sprite = null;
        this.dirty = true;
        this.movePath = null;
        this.states = [];
        this.props = [];

        this.drawers = [];
    };

    /**
     * Entity initialisation
     *
     * @param {Object} data This is object, containing data, needed for initialisation. May contain values like Entity position, states, id, name of file, containing Entity code.
     */
    Entity.prototype.init = function (data) {
        this.id = data.id;
        this.name = data.name;

        if (data.pos) {
            this.pos = new Point3D(data.pos[0], data.pos[1]);
        }
        if (this.sprite.animation) {
            this.sprite.animation.setAnim(this.animationName, this.direction);
        }
        this.sprite.init();

        this.cx = this.sprite.width / 2;
        this.cy = this.sprite.height - 4;

        if (this.onInit) {
            this.onInit();
        }
    };

    Entity.prototype.onMapAdd = function() {
        this.abspos = this.map.getCanvasPos(this.pos);
        this.game = this.map.game;

        if(this.followMap === true) {
            this.map.followEntity(this);
        }

    };

    /**
     * Checking if Entity has given state.
     *
     * @param {String} state
     * @returns {boolean}
     */
    Entity.prototype.hasState = function (state) {
        return _.indexOf(this.states, state) !== -1;
    };

    /**
     * Adding of new Entity state. Something like 'move', 'poisoned', 'undead'
     * and any other, whatever your game needs.
     *
     * @param state
     */
    Entity.prototype.addState = function (state) {
        if (!this.hasState(state)) {
            this.states.push(state);
        }
    };

    /**
     * Removing any of Entity state.
     *
     * @param state
     */
    Entity.prototype.removeState = function (state) {
        if (this.hasState(state)) {
            this.states = _.without(this.states, state);
        }
    };


    /**
     * Checking if Entity has given property.
     *
     * @param {String} prop
     * @returns {boolean}
     */
    Entity.prototype.hasProp = function (prop) {
        return _.indexOf(this.props, prop) !== -1;
    };

    /**
     * Adding of new Entity property. Something like 'walkable', 'poisoned', 'undead'
     * and any other, whatever your game needs.
     *
     * @param prop
     */
    Entity.prototype.addProp = function (prop) {
        if (!this.hasState(prop)) {
            this.props.push(prop);
        }
    };

    /**
     * Removing any of Entity prop.
     *
     * @param prop
     */
    Entity.prototype.removeProp = function (prop) {
        if (this.hasState(prop)) {
            this.props = _.without(this.props, prop);
        }
    };


    Entity.prototype.startMovement = function (dir) {
        fbug('start movement ' + dir);
        this.nextStepDir = dir;

        if (!this.hasState('move')) {
            this.move(dir);
        }
    };

    Entity.prototype.stopMovement = function () {
        fbug('end movement');

        this.nextStepDir = null;
    };


    Entity.prototype.moveToPoint = function (point) {
        var tilo = this.map.getTileByPoint(point, true),
            newPos = tilo[0],
            offsets = tilo[1],
            movePath = this.map.getPath(this.pos, newPos);


        fbug([point, newPos, offsets, movePath]);

        this.moveTo(movePath);
    };

    Entity.prototype.moveToTile = function (pos) {
        var movePath = this.map.getPath(this.pos, pos);


        fbug([pos, movePath]);

        this.moveTo(movePath);
    };

    Entity.prototype.moveEnd = function () {
        this.pos = this.newPos;

        if (this.nextStepDir) {
            this.move(this.nextStepDir);
        }
        else {
            this.setAnimation('idle');

            this.removeState('move');
            this.addState('idle');

            if(this.onMoveEnd && _.isFunction(this.onMoveEnd)) {
                this.onMoveEnd();
            }
        }
    };


    Entity.prototype.move = function (dir) {
        var targetPos = this.pos.nearestPosInDirection(dir),
            targetTile = this.map.getTileByPos(targetPos);

        this.setDirection(dir);

        // moving only if able to
        if (!targetTile || !targetTile.hasProp('walkable')) {
            return;
        }

        fbug('move: ' + dir);

        this.setAnimation('move');

        // and now - moving
        this.moveTo(targetPos);

        this.removeState('idle');
        this.addState('move');
    };

    Entity.prototype.moveTo = function (movePath) {
        var dir;
        this.newPos = movePath.targetPos;

        dir = this.getDirection(this.pos, this.newPos);
        this.setDirection(dir);
        this.setAnimation('move');
        fbug('moveto ' + this.newPos.str);

        this.movePath = movePath;
    };

    Entity.prototype.mover = function (curr) {
        var dir;

        if (this.prevMoveStep) {
            dir = this.getDirection(this.prevMoveStep, curr);
            if(dir !== this.direction) {
                this.setDirection(dir);
            }
        }

        this.prevMoveStep = curr;
    };

    Entity.prototype.getNearestTile = function(dir) {
        var pos;

        if(dir === 'up') {
            pos = new Point3D(this.pos.x, this.pos.y - 1);
        }
        else if(dir === 'right') {
            pos = new Point3D(this.pos.x + 1, this.pos.y);
        }
        else if(dir === 'down') {
            pos = new Point3D(this.pos.x, this.pos.y + 1);
        }
        else if(dir === 'left') {
            pos = new Point3D(this.pos.x - 1, this.pos.y);
        }

        return pos;
    };

    Entity.prototype.getDirection = function (from, to) {
        var fx = parseInt(from.x ? from.x : from[0]),
            fy = parseInt(from.y ? from.y : from[1]),
            tx = parseInt(to.x ? to.x : to[0]),
            ty = parseInt(to.y ? to.y : to[1]),
            dir = 'up';


        if (fx > tx && fy == ty) {
            dir = 'left';
        }
        else if (fx < tx && fy == ty) {
            dir = 'right';
        }
        else if (fx == tx && fy > ty) {
            dir = 'up';
        }
        else if (fx == tx && fy < ty) {
            dir = 'down';
        }

        return dir;
    };

    Entity.prototype.destroy = function () {
        fbug('destroy2');
        //TODO: tmp
        this.sprite.drawers = [];
        this.map.entities = _.without(this.map.entities, this);
        this.map.rebuildEntitiesCache();
    };

    Entity.prototype.setDirection = function (dir) {
        this.direction = dir;
        if (this.sprite.animation) {
            this.sprite.animation.setAnim(this.animationName, this.direction);
        }
    };

    Entity.prototype.setAnimation = function (state) {
        this.animationName = state;
        if (this.sprite.animation) {
            this.sprite.animation.setAnim(this.animationName, this.direction);
        }
    };

    /**
     * This method checks, if entity changes its animation frame, in current tick
     * If yes, marks entity as dirty
     *
     */
    Entity.prototype.checkAnimation = function () {
        if(this.sprite.animation.isTimeForChanges()) {
            this.sprite.draw();

            this.dirty = true;
        }
    };

    /**
     * This method checks, if entity changes its position, in current tick
     * If yes, marks entity as dirty
     *
     */
    Entity.prototype.checkPos = function () {
        if (this.movePath && this.movePath.isTimeForChanges()) {
            this.dirty = true;
        }
    };


    Entity.prototype.hilit = function () {
        this.sprite.hilit();
    };



    Entity.prototype.castSpell = function(spellName, target) {
        this.setAnimation('cast');
        setTimeout(function() {
            this.setAnimation('idle');

            this.game.addEntity({
                id: 'fireball',
                name: 'Fireball',
                pos: [this.pos.x, this.pos.y]
            }, function(fb) {
                fb.cast(target);

            });
        }.bind(this), 700);
    };


    Entity.prototype.showHp = function() {
        //TODO: optimize
        this.sprite.drawers.push(function(ctx) {
            var total = 60,
                left = (this.hp * total) / this.maxHp;//fbug([this.hp, this.maxHp, total, left])
            ctx.rect(0, 10, total, 6);
            ctx.fillStyle = 'red';
            ctx.fill();

            ctx.beginPath();
            ctx.rect(0, 10, left, 6);
            ctx.fillStyle = 'blue';


            ctx.fill();
        }.bind(this));
    };

    Entity.prototype.dealDamage = function(amount) {
        this.hp -= amount;

        if(this.hp <= 0) {
            this.die();
        }
    };

    Entity.prototype.die = function() {
        this.sprite.drawers = [];

        this.setAnimation('death');
        setTimeout(function() {
            this.setAnimation('dead');
        }.bind(this), 600);
    };


    return Entity;
});