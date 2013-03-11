
define(['./Point3D', './MovePath'], function(Point3D, MovePath) {
    var Entity = function() {
        this.sprite = null;
        this.dirty = true;
        this.movePath = null;
        this.states = [];
        this.props = [];
    };

    /**
     * Checking if Entity has given state.
     *
     * @param {String} state
     * @returns {boolean}
     */
    Entity.prototype.hasState = function(state) {
        return _.indexOf(this.states, state) !== -1;
    };

    /**
     * Adding of new Entity state. Something like 'move', 'poisoned', 'undead'
     * and any other, whatever your game needs.
     *
     * @param state
     */
    Entity.prototype.addState = function(state) {
        if(!this.hasState(state)) {
            this.states.push(state);
        }
    };

    /**
     * Removing any of Entity state.
     *
     * @param state
     */
    Entity.prototype.removeState = function(state) {
        if(this.hasState(state)) {
            this.states = _.without(this.states, state);
        }
    };


    /**
     * Checking if Entity has given property.
     *
     * @param {String} prop
     * @returns {boolean}
     */
    Entity.prototype.hasProp = function(prop) {
        return _.indexOf(this.props, prop) !== -1;
    };

    /**
     * Adding of new Entity property. Something like 'walkable', 'poisoned', 'undead'
     * and any other, whatever your game needs.
     *
     * @param prop
     */
    Entity.prototype.addProp = function(prop) {
        if(!this.hasState(prop)) {
            this.props.push(prop);
        }
    };

    /**
     * Removing any of Entity prop.
     *
     * @param prop
     */
    Entity.prototype.removeProp = function(prop) {
        if(this.hasState(prop)) {
            this.props = _.without(this.props, prop);
        }
    };

    /**
     * Entity initialisation
     *
     * @param {Object} data This is object, containing data, needed for initialisation. May contain values like Entity position, states, id, name of file, containing Entity code.
     */
    Entity.prototype.init = function(data) {
        this.id = data.id;
        this.name = data.name;

        if(data.pos) {
            this.pos = new Point3D(data.pos[0], data.pos[1]);
        }
        if(this.sprite.animation) {
            this.sprite.animation.setAnim(this.animationName, this.direction);
        }

        if(this.onInit) {
            this.onInit();
        }
    };

    Entity.prototype.startMovement = function(dir) {
        fbug('start movement '+ dir);
        this.nextStepDir = dir;

        if(!this.hasState('move')) {
            this.move(dir);
        }
    };

    Entity.prototype.stopMovement = function() {
        fbug('end movement');

        this.nextStepDir = null;
    };


    Entity.prototype.moveEnd = function() {
        this.pos = this.newPos;

        if(this.nextStepDir) {
            this.move(this.nextStepDir);
        }
        else {
            this.setAnimation('idle');

            this.removeState('move');
            this.addState('idle');
        }
    };




    Entity.prototype.move = function(dir) {
        var targetPos = this.pos.nearestPosInDirection(dir),
            targetTile = this.map.getTileByPos(targetPos);

        this.setDirection(dir);

        // moving only if able to
        if(!targetTile || !targetTile.hasProp('walkable')) {
            return;
        }

        this.newPos = targetPos;
        fbug('move: '+ dir);

        this.setAnimation('move');

        // and now - moving
        this.moveTo(targetPos);

        this.removeState('idle');
        this.addState('move');
    };

    Entity.prototype.moveTo = function(pos) {
        fbug('moveto '+ pos.str);
        var path = new MovePath([this.pos, pos]);

        this.movePath = path;
    };

    Entity.prototype.setDirection = function(dir) {
        this.direction = dir;
        if(this.sprite.animation) {
            this.sprite.animation.setAnim(this.animationName, this.direction);
        }
    };

    Entity.prototype.setAnimation = function(state) {
        this.animationName = state;
        if(this.sprite.animation) {
            this.sprite.animation.setAnim(this.animationName, this.direction);
        }
    };

    /**
     * This method checks, if entity changes its animation frame, in current tick
     * If yes, marks entity as dirty
     *
     */
    Entity.prototype.checkAnimation = function() {
        this.dirty = true;
    };

    /**
     * This method checks, if entity changes its position, in current tick
     * If yes, marks entity as dirty
     *
     */
    Entity.prototype.checkPos = function() {
        if(this.movePath && this.movePath.isTimeForChanges()) {
            this.dirty = true;
        }
    };


    return Entity;
});