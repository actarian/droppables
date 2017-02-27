/* global angular, module */

module.directive('draggableItem', ['$parse', '$timeout', 'Utils', 'Style', 'ElementRect', 'Droppables', function ($parse, $timeout, Utils, Style, ElementRect, Droppables) {

    return {
        require: 'ngModel',
        link: function (scope, element, attributes, model) {
            var nativeElement = element[0];
            var selector = attributes.draggableItem || '.item';
            var condition = attributes.draggableIf !== undefined ? $parse(attributes.draggableIf) : function () { return true; };
            var target = nativeElement.querySelector(selector);
            var style = new Style();
            var elementRect = new ElementRect();
            var down, move, diff, dragging, rects;
            function onStart(e) {
                if (condition(scope)) {
                    down = Utils.getTouch(e);
                    addDragListeners();
                }
                return false;
            }
            function onMove(e) {
                move = Utils.getTouch(e);
                diff = down.difference(move);
                if (!dragging && diff.power() > 25) {
                    dragging = true;
                    element.addClass('dragging');
                }
                if (dragging) {
                    style.transform = 'translateX(' + diff.x + 'px) translateY(' + diff.y + 'px)';
                    style.set(target);
                    elementRect.set(nativeElement).offset(diff);
                    rects = Droppables.getIntersections(elementRect);
                    if (rects.length) {
                        angular.element(rects[0].native).addClass('dropping');
                    }
                }
                // console.log(diff);
                return false;
            }
            function onEnd(e) {
                if (dragging) {
                    dragging = false;
                    element.removeClass('dragging');
                    style.transform = 'none';
                    style.set(target);
                    var fromIndex = $parse(attributes.droppableIndex)(scope);
                    var fromModel = $parse(attributes.ngModel)(scope);
                    if (rects.length) {
                        var event = null;
                        angular.forEach(rects, function (rect, index) {
                            angular.element(rect.native).removeClass('dropping over');
                            if (rect.data.droppable(scope) && !event) {
                                event = {
                                    from: {
                                        index: fromIndex,
                                        model: fromModel,
                                        target: target,
                                    },
                                    to: {
                                        index: rect.data.index,
                                        model: rect.data.model,
                                        target: rect.native
                                    },
                                };
                                $timeout(function () {
                                    scope.$emit('onDropItem', event);
                                });
                            }
                        });
                    } else {
                        var event = {
                            from: {
                                index: fromIndex,
                                model: fromModel,
                                target: target,
                            },
                            to: null,
                        };
                        $timeout(function () {
                            scope.$emit('onDropOut', event);
                        });
                    }
                }
                removeDragListeners();
                return false;
            }
            function addDragListeners() {
                angular.element(window).on('touchmove mousemove', onMove);
                angular.element(window).on('touchend mouseup', onEnd);
            };
            function removeDragListeners() {
                angular.element(window).off('touchmove mousemove', onMove);
                angular.element(window).off('touchend mouseup', onEnd);
            };
            function addListeners() {
                element.on('touchstart mousedown', onStart);
            };
            function removeListeners() {
                element.off('touchstart mousedown', onStart);
            };
            scope.$on('$destroy', function () {
                removeListeners();
            });
            addListeners();
        }
    };
}]);

module.directive('droppableItem', ['$parse', 'Utils', 'Style', 'Droppables', function ($parse, Utils, Style, Droppables) {
    var droppables = {};
    return {
        require: 'ngModel',
        link: function (scope, element, attributes, model) {
            var nativeElement = element[0];
            var selector = attributes.droppableItem || '.item';
            function onGetData() {
                var index = $parse(attributes.droppableIndex)(scope);
                var model = $parse(attributes.ngModel)(scope);
                var droppable = attributes.droppableIf !== undefined ? $parse(attributes.droppableIf) : function () { return true };
                return {
                    index: index,
                    model: model,
                    droppable: droppable,
                };
            }
            Droppables.add(nativeElement, onGetData);
            scope.$on('$destroy', function () {
                Droppables.remove(nativeElement);
            });
        }
    }
}]);
