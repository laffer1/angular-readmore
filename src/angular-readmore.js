/**
 * Created by Joyce Cam on 30/12/2014.
 *
 * Simple and easy-to-implement angular read more directive.
 *
 */
(function () {
    'use strict';

    angular.module('readMore', [])
            .directive('readMore', readMore);

    function readMore() {
        return {
            restrict: 'A',
            transclude: true,
            replace: true,
            template: '<p></p>',
            scope: {
                moreText: '@',
                lessText: '@',
                words: '@',
                ellipsis: '@',
                char: '@',
                limit: '@',
                content: '@'
            },
            link: function (scope, elem, attr, ctrl, transclude) {
                var moreText = angular.isUndefined(scope.moreText) ? ' <a class="read-more">Read More...</a>' : ' <a class="read-more">' + scope.moreText + '</a>';
                var lessText = angular.isUndefined(scope.lessText) ? ' <a class="read-less">Less ^</a>' : ' <a class="read-less">' + scope.lessText + '</a>';
                var ellipsis = angular.isUndefined(scope.ellipsis) ? '' : scope.ellipsis;
                var limit = angular.isUndefined(scope.limit) ? 150 : scope.limit;

                function readmore(text) {
                    if (typeof text === 'undefined' || text === null) {
                        return;
                    }
                    var orig = text;
                    var regex = /\s+/gi;
                    var charCount = text.length;
                    var wordCount = text.trim().replace(regex, ' ').split(' ').length;
                    var countBy = 'char';
                    var count = charCount;
                    var foundWords = [];
                    var markup = text;
                    var more = '';
                    var ellipsisMarkup = '<span class="ellipsis">'+ellipsis+ '</span>';

                    if (!angular.isUndefined(attr.words)) {
                        countBy = 'words';
                        count = wordCount;
                    }

                    if (countBy === 'words') { // Count words

                        foundWords = text.split(/\s+/);

                        if (foundWords.length > limit) {
                            text = foundWords.slice(0, limit).join(' ');
                            more = foundWords.slice(limit, count).join(' ');
                            markup = text + ellipsisMarkup + moreText + '<span class="more-text">' + more + lessText + '</span>';
                        }

                    } else { // Count characters

                        if (count > limit) {
                            text = orig.slice(0, limit);
                            more = orig.slice(limit, count);
                            markup = text + ellipsisMarkup + moreText + '<span class="more-text">' + more + lessText + '</span>';
                        }

                    }

                    elem.append(markup);
                    elem.find('.read-more').on('click', function () {
                        $(this).hide();
                        elem.find('.more-text').addClass('show').slideDown();
                        elem.find('.ellipsis').hide();
                    });
                    elem.find('.read-less').on('click', function () {
                        elem.find('.read-more').show();
                        elem.find('.more-text').hide().removeClass('show');
                        elem.find('.ellipsis').show();
                    });

                }

                attr.$observe('content', function (str) {
                    readmore(str);
                });

                transclude(scope.$parent, function (clone, scope) {
                    readmore(clone.text().trim());
                });
            }
        };
    }
})();