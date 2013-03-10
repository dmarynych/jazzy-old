define(['./Tile', './Map', './Point3D', './Sprite', './EventEmitter'],
function(Tile, Map, Point3D, Sprite) {
    'use strict';

    /**
     *
     * @param settings
     * @constructor
     */
    var Game = function(settings) {
        this.tickNumber = 0;
        this.uniqueTiles = [];
        this.tiles = {};
        this.watchedHotkeys = [];

        this.events = _.extend({}, $.eventEmitter);

        // file loader vars
        this.loader = _.extend({}, $.eventEmitter);
        this.loadedFiles = {};
        this.currentlyLoadingFiles = [];

        this.entities = {};

        this.settings = _.defaults(settings, {
            fps: 60,
            entitiesPath: 'entities/',
            tilesPath: 'tiles/',
            spritesPath: 'sprites/',
            animationsPath: 'animations/',
            imagesPath: 'media/',
            bgColor: '#000'
        });

        $(this.settings.container).css({
            width: this.settings.width,
            height: this.settings.height
        });
    };

    Game.prototype.start = function(tile) {
        fbug('starting game');
        fbug(this.uniqueTiles);

        this.map = new Map(this);
        this.map.init();

        this.startLoop();
    };

    Game.prototype.startLoop = function() {
        requestAnimFrame( this.tick.bind(this) );
    };

    Game.prototype.tick = function() {
        this.tickNumber++;
        // now, rendering map
        this.map.tick();

        requestAnimFrame( this.tick.bind(this) );
    };

    Game.prototype.setMap = function(map) {
        var x, y;
        // first, we should load all tiles json files
        for (y = 0; y < map.length; y++) {
            for (x = 0; x < map[y].length; x++) {
                if(_.indexOf(this.uniqueTiles, map[y][x]) === -1) {
                    this.uniqueTiles.push(map[y][x]);
                }

                this.addTile(map[y][x], [x, y]);
            }
        }

        fbug(['init map', map]);
    };

    Game.prototype.addTile = function(tileName, pos) {
        if(_.indexOf(this.uniqueTiles, tileName) === -1) {
            this.uniqueTiles.push(tileName);
        }

        // first, loading json file, with tile data
        this.load(this.settings.tilesPath + tileName, 'json', function(tile) {
            // then, we should load image file
            this.load(this.settings.imagesPath + tile.sprite.imageSrc, 'image', function(image) {
                tile.sprite.image = image;
                tile.pos = new Point3D(pos[0], pos[1]);

                this.map.addTile(new Tile(tile));
            });
        });
    };

    Game.prototype.getEntity = function(entityId) {
        return this.entities[entityId];
    };

    /**
     * Adding entity to game.
     *
     * @param entityData
     */
    Game.prototype.addEntity = function(entityData) {
        require([this.settings.entitiesPath + entityData.name], function(LoadedEntity) {
            var ent = new LoadedEntity();

            this.entities[entityData.id] = ent;

            this.load(this.settings.spritesPath + ent.spriteName, 'json', function(sprite) {
                var callb;

                callb = function(sprite) {
                    var path = this.settings.imagesPath + sprite.imageSrc;

                    this.load(path, 'image', function(image) {
                        sprite.image = image;
                        ent.sprite = new Sprite(sprite);
                        fbug(ent);

                        ent.init(entityData);
                        this.map.addEntity(ent);
                    });
                }.bind(this);

                // if we have animation for this sprite
                if(sprite.animationName) {
                    var path = this.settings.animationsPath + sprite.animationName;
                    this.load(path, 'json', function(animData) {
                        sprite.animData = animData;
                        callb(sprite);
                    });
                }
                else {
                    callb(sprite);
                }
            });
        }.bind(this));
    };


    /**
     * Universal files loader function. Uses cache, to prevent loading the same file twice.
     *
     * @param {String} fileName Full path to file
     * @param {String} type file type, may be 'json', 'image', 'mp3' etc.
     * @param callback
     */
    Game.prototype.load = function(fileName, type, callback) {
        var fileToLoad,
            i, path, eventName;

        if(!this.loadedFiles[type]) {
            this.loadedFiles[type] = {};
        }

        if(type === 'image') {
            path = 'image!'+ fileName;
            eventName = 'image/'+ fileName;
        }
        else if(type === 'json') {
            path = 'json!'+ fileName +'.json';
            eventName = 'json/'+ fileName +'.json';
        }
        fileToLoad = path;

        // if this file is loaded and in cache now
        if(this.loadedFiles[type][fileName]) {
            //fbug('file '+ fileName +' is in cache');
            callback.bind(this)(this.loadedFiles[type][fileName]);
        }
        else {
            // start loading this file, only if it isn't being loaded now
            if(_.indexOf(this.currentlyLoadingFiles, fileToLoad) === -1) {
                this.currentlyLoadingFiles.push(fileToLoad);

                require([fileToLoad], function(file) {
                    // now, storing file to local cache
                    this.loadedFiles[type][fileName] = file;

                    // file is loaded
                    _.without(this.currentlyLoadingFiles, function(f) {fbug(['ff', f]);
                        return f === fileToLoad;
                    });

                    // now, triggering event, indicating that files are loaded
                    this.loader.trigger(eventName, file);
                }.bind(this));
            }


            // callback, after loading all files
            // event name is comma separated files list
            this.loader.once(eventName, function(e, files) {
                callback.bind(this)(files);
            }.bind(this));
        }
    };

    return Game;
});