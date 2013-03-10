define(['engine/Point2D', 'engine/Point3D'], function(Point2D, Point3D) {

    describe('Point2D', function() {
        var point = new Point2D(50, 45);

        it('should be inititalized', function() {
            expect(point).toBeDefined();
            expect(point instanceof Point2D).toBeTruthy();
        });

        it('checks if this point in rectangle', function() {
            expect(point.inRect(45, 45, 10, 10)).toBeTruthy();
            expect(point.inRect(60, 60, 10, 10)).toBeFalsy();
        });

        it('should be created with 1 or two params', function() {
            var p1 = new Point2D([1, 2]),
                p2 = new Point2D(1, 2);

            expect(p1).toEqual(p2);
        });

        it('adds given values to coords', function() {
            point.add(10, 10);
            expect(point.x).toBe(60);
            expect(point.y).toBe(55);
        });
    });


    describe('Point3D', function() {
        var point = new Point3D(50, 45, 0);

        it('should be inititalized', function() {
            expect(point).toBeDefined();
            expect(point instanceof Point3D).toBeTruthy();
        });

        it('creates str with coords', function() {
            expect(point.str).toBe('0_50_45');
        });

        it('checks equality', function() {
            expect(point.isEqual(new Point3D(50, 45, 0))).toBeTruthy();
        });

        it('gives array with points', function() {
            expect(point.toArray()).toEqual([50, 45, 0]);
        });

        it('clones self with new z', function() {
            expect(point.cloneWithNewZ(100)).toEqual(new Point3D(50, 45, 100));
        });

        it('finds nearest tile coords', function() {
            expect(point.nearestPosInDirection('up').isEqual(new Point3D(50, 44, 0))).toBeTruthy();
            expect(point.nearestPosInDirection('right').isEqual(new Point3D(51, 45, 0))).toBeTruthy();
            expect(point.nearestPosInDirection('down').isEqual(new Point3D(50, 46, 0))).toBeTruthy();
            expect(point.nearestPosInDirection('left').isEqual(new Point3D(49, 45, 0))).toBeTruthy();
        });

        it('checks if this point in rectangle', function() {
            expect(point.inRect(45, 45, 10, 10)).toBeTruthy();
            expect(point.inRect(60, 60, 10, 10)).toBeFalsy();
        });

    });
});