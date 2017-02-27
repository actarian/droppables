/* global angular, module */

module.service('Droppables', ['ElementRect', function (ElementRect) {
    this.natives = [];
    this.callbacks = [];
    this.rects = [];
    this.add = function (nativeElement, callback) {
        this.natives.push(nativeElement);
        this.callbacks.push(callback || function () { });
        this.rects.push(ElementRect.fromNative(nativeElement));
    };
    this.remove = function (nativeElement) {
        var index = this.natives.indexOf(nativeElement);
        if (index !== -1) {
            this.natives.splice(index, 1);
            this.callbacks.splice(index, 1);
            this.rects.splice(index, 1);
        }
    };
    this.getIntersections = function (item) {
        var intersections = [], element;
        angular.forEach(this.rects, function (rect, index) {
            rect.set(rect.native);
            element = angular.element(rect.native);
            element.removeClass('dropping');
            if (rect.intersect(item)) {
                rect.distance = rect.center.distance(item.center);
                rect.data = this.callbacks[index]();
                intersections.push(rect);
                element.addClass('over');
            } else {
                element.removeClass('over');
            }
        }.bind(this));
        intersections.sort(function (a, b) {
            if (a.distance < b.distance) {
                return -1;
            }
            if (a.distance > b.distance) {
                return 1;
            }
            return 0;
        });
        return intersections;
    };
}]);
