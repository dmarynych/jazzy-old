define(['./Point2D', './Point3D', './MovePath', 'pathfinding'], function (Point2D, Point3D, MovePath) {
    'use strict';

    var Map = function (game) {
        this.game = game;
        this.settings = this.game.settings;
        this.numRenderedObjectsStack = [];

        this.container = $(this.settings.container);

        this.tileW = 32;
        this.tileH = 32;
        this.rows = Math.floor(this.settings.height / this.tileH);
        this.columns = Math.floor(this.settings.width / this.tileW);

        this.clearMap();

        this.frameNumber = 0;
        this.lastFrameTime = new Date().getTime();
        this.currFps = 0;
        this.fpsStack = [];
        this.frameTimeStack = [];

    };

    Map.prototype.init = function () {
        this.fpsEl = $('<div style="position: absolute;top: 10px; right: 10px;"></div>').appendTo(this.settings.container);

        var leftOffset = parseInt(($(document).width() - this.settings.width) / 2, 10);
        this.container.css('left', leftOffset);

        this.tilesCanvas = $('<canvas class="game_canvas tiles_canvas"></canvas>')
            .attr({
                width: this.settings.width,
                height: this.settings.height
            })
            .css({
                'z-index': 1
            })
            .appendTo(this.container);

        this.tilesCanvas2d = this.tilesCanvas.get(0).getContext('2d');

        this.mainCanvas = $('<canvas class="game_canvas main_canvas"></canvas>')
            .attr({
                width: this.settings.width,
                height: this.settings.height
            })
            .css({
                'z-index': 2
            })
            .appendTo(this.container);

        this.mainCanvas2d = this.mainCanvas.get(0).getContext('2d');


        if (false) {
            this.drawDebugStuff();
        }
    };


    Map.prototype.tick = function () {
        var time = new Date().getTime(),
            diff, endTime, frameTime;

        this.frameNumber++;

        /*if(this.frameNumber % 120 !== 0) {
         requestAnimFrame( this.tick.bind(this) );
         return;
         }*/

        this.prepareEntitiesToDraw();
        this.renderEntities();



        // fps counter
        diff = time - this.lastFrameTime;
        this.currFps = 1000 / diff;

        // fps counter
        endTime = new Date().getTime();
        frameTime = endTime - time;

        this.fpsStack.push(this.currFps);
        // keep only last 60 values
        if (this.fpsStack.length > 60) {
            this.fpsStack.shift();
        }
        this.frameTimeStack.push(frameTime);
        if (this.frameTimeStack.length > 60) {
            this.frameTimeStack.shift();
        }
        this.lastFrameTime = new Date().getTime();

        // now updating fps counter
        this.fpsEl.html('fps: ' + _.average(this.fpsStack).toFixed(0) + '<br> ' +
            'time: ' + _.average(this.frameTimeStack).toFixed(0) + 'ms. <br> ');
    };

    Map.prototype.prepareEntitiesToDraw = function () {
        var i, ent;

        this.prevEntitiesToDraw = this.entitiesToDraw;
        this.entitiesToDraw = [];
        for (i = 0; i < this.entitiesVisible.length; i++) {
            ent = this.entitiesVisible[i];

            // checking, if there's new anim frame
            if (ent.sprite.animation) {
                ent.checkAnimation();
            }

            // checking, if position of entity was changed
            ent.checkPos();

            if (ent.dirty === true) {
                this.entitiesToDraw.push(ent);
            }
        }
    };

    Map.prototype.getCanvasPos = function (pos) {
        return new Point2D(this.tileW * pos.x, this.tileH * pos.y);
    };

    Map.prototype.drawDebugStuff = function () {
        var $cellTable = $('<table style="position: absolute;top: 0;"></table>').appendTo(this.container),
            $tr,
            x, y;
        // first, we should load all tiles json files
        for (x = 0; x < this.rows; x++) {
            $tr = $('<tr></tr>').appendTo($cellTable);
            for (y = 0; y < this.columns; y++) {
                $tr.append('<td style="border: 1px solid #eee;width: ' + this.tileW + 'px;height:' + this.tileH + 'px"></td>');
            }
        }
    };


    Map.prototype.getTileByPos = function (pos) {
        return this.tilesByPos[pos.str];
    };


    /*
     *    Entities Stuff
     *
     */

    Map.prototype.addEntity = function (entity) {
        if (!this.entitiesByPos[entity.pos.str]) {
            this.entitiesByPos[entity.pos.str] = [];
        }
        this.entitiesByPos[entity.pos.str].push(entity);

        this.entities.push(entity);

        entity.map = this;
        entity.onMapAdd();

        this.rebuildEntitiesCache();
    };

    Map.prototype.rebuildEntitiesCache = function () {
        var x, y, ind, i, ent;
        this.entitiesVisible = [];

        // getting only visible entities
        /*for (y = 0; y < this.rows; y++) {
            for (x = 0; x < this.columns; x++) {
                ind = '0_' + x + '_' + y;
                ent = this.entitiesByPos[ind];

                // drawing, only if its marked as "dirty", it means that smth. was changed
                if (ent) {
                    this.entitiesVisible.push(this.entitiesByPos[ind][0]);
                }
            }
        }*/
        for (i = 0; i < this.entities.length; i++) {
            ent = this.entities[i];

            if (ent) {
                this.entitiesVisible.push(ent);
            }
        }

        //fbug(['cache is rebuilt', this.tilesToDraw]);
        // in this case, we immidiately draw tiles
        //this.renderEntities();

        return true;
    };

    /**
     * Method update current walk map.
     *
     */
    Map.prototype.updateWalkMap = function () {
        this.walkMap = new PF.Grid(this.columns, this.rows);

        this.eachVisiblePos(function (pos, tile) {

            if (tile && tile.hasProp('walkable')) {
                this.walkMap.setWalkableAt(tile.pos.x, tile.pos.y, true);
            }
            else {
                this.walkMap.setWalkableAt(pos[0], pos[1], false);
            }
        });
    };

    /**
     * Iterate through visible tiles
     *
     * @param iterator
     */
    Map.prototype.eachVisibleTile = function (iterator) {
        var x, y, ind;

        for (y = 0; y < this.rows; y++) {
            for (x = 0; x < this.columns; x++) {
                ind = '0_' + x + '_' + y;
                if (this.tilesByPos[ind]) {
                    iterator.bind(this)(this.tilesByPos[ind]);
                }

            }
        }
    };

    /**
     * Iterate through visible pos
     *
     * @param iterator
     */
    Map.prototype.eachVisiblePos = function (iterator) {
        var x, y, ind;

        for (y = 0; y < this.rows; y++) {
            for (x = 0; x < this.columns; x++) {
                ind = '0_' + x + '_' + y;
                iterator.bind(this)([x, y], this.tilesByPos[ind]);
            }
        }
    };

    /**
     *
     * @param {Point3D} from
     * @param {Point3D} to
     */
    Map.prototype.getPath = function (from, to) {
        var path = [],
            finder = new PF.AStarFinder({
                allowDiagonal: false
            });

        path = finder.findPath(from.x, from.y, to.x, to.y, this.walkMap.clone());

        return new MovePath(path);
    };

    Map.prototype.clearMap = function () {
        this.tiles = [];
        this.tilesByPos = {};
        this.tilesToDraw = [];

        this.entities = [];
        this.entitiesByPos = {};
        this.entitiesVisible = [];
        this.entitiesToDraw = [];
    };

    Map.prototype.renderEntities = function () {
        //fbug('render entities');
        //fbug(this.entitiesToDraw);
        var i, entity, sprite, spritePos, canvasPos;

        this.mainCanvas2d.clearRect(0, 0, 400, 400);

        // looping, through array of rendered objects
        for (i = 0; i < this.entitiesToDraw.length; i++) {
            entity = this.entitiesToDraw[i];
            sprite = entity.sprite;
            canvasPos = this.getCanvasPos(entity.pos);
            if (sprite.offsets) {
                canvasPos.add(sprite.offsets.x, sprite.offsets.y);
            }

            spritePos = sprite.getSpritePos();

            if (entity.movePath && entity.movePath.steps) {
                var step = entity.movePath.steps[0];
                if (entity.movePath.steps.length !== 0) {
                    canvasPos.x += step.x;
                    canvasPos.y += step.y;


                    //TODO: very unoptimized
                    entity.mover([canvasPos.x, canvasPos.y]);

                    entity.movePath.steps.shift();

                    if (entity.movePath.steps.length === 0) {fbug('MOVE END')
                        entity.moveEnd();
                    }
                }
            }
            /*fbug([sprite.image,

             spritePos.x, spritePos.y,
             sprite.width, sprite.height,

             canvasPos.x, canvasPos.y,
             sprite.width, sprite.height]);*/
            /*this.mainCanvas2d.drawImage(
                sprite.image,

                spritePos.x, spritePos.y,
                sprite.width, sprite.height,

                canvasPos.x, canvasPos.y,
                sprite.width, sprite.height);*/
            this.mainCanvas2d.drawImage(sprite.getSprite(), canvasPos.x, canvasPos.y);

            /*if(true) {
             this.mainCanvas2d.arc(canvasPos.x + entity.cx, canvasPos.y +  + entity.cy, 3, 0, 180, false);
             this.mainCanvas2d.fillStyle = '#333';
             this.mainCanvas2d.fill();
             }*/
        }
    };

    /*
     *    Tiles Stuff
     *
     */


    Map.prototype.addTile = function (tile) {
        this.tilesByPos[tile.pos.str] = tile;

        this.tiles.push(tile);

        this.rebuildTilesCache();

        this.updateWalkMap();
    };

    Map.prototype.rebuildTilesCache = function () {
        var x, y, ind;
        this.tilesToDraw = [];

        for (y = 0; y < this.rows; y++) {
            for (x = 0; x < this.columns; x++) {
                ind = '0_' + x + '_' + y;
                if (this.tilesByPos[ind]) {
                    this.tilesToDraw.push(this.tilesByPos[ind]);
                }
            }
        }
        //fbug(['cache is rebuilt', this.tilesToDraw]);
        // in this case, we immidiately draw tiles
        this.renderTiles();

        return true;
    };

    Map.prototype.getTileByPoint = function (point, andOffsets) {
        var x = Math.floor(point.x / this.tileW),
            y = Math.floor(point.y / this.tileH),
            offsetX = point.x % this.tileW,
            offsetY = point.y % this.tileH;

        return andOffsets ? [new Point3D(x, y), [offsetX, offsetY]] : new Point3D(x, y);
    };

    Map.prototype.renderTiles = function () {
        var i, tile, sprite, canvasPos;
        // looping, through array of rendered objects
        for (i = 0; i < this.tilesToDraw.length; i++) {
            tile = this.tilesToDraw[i];
            sprite = tile.sprite;
            canvasPos = this.getCanvasPos(tile.pos);

            /*this.tilesCanvas2d.drawImage(
                sprite.image,

                sprite.pos.x, sprite.pos.y,
                sprite.width, sprite.height,

                canvasPos.x, canvasPos.y,
                sprite.width, sprite.height);*/
            this.tilesCanvas2d.drawImage(sprite.getSprite(), canvasPos.x, canvasPos.y);

            if (true) {
                this.tilesCanvas2d.fillStyle = '#222';
                this.tilesCanvas2d.fillText(tile.pos.x + ':' + tile.pos.y, canvasPos.x + 8, canvasPos.y + 16);
            }
        }
    };

    return Map;
});