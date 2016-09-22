/**
 * AngularJS 1.x library to cut text and provide a read more/ellipsis
 * @version v1.0.0 - 2016-09-22
 * @link http://github.com/laffer1/angular-readmore
 * @author Lucas Holt <luke@foolishgames.com>,Joyce Cam
 * @license MIT License, http://www.opensource.org/licenses/MIT
 */
/**
 * Created by Joyce Cam on 30/12/2014.
 *
 * Simple and easy-to-implement angular read more directive.
 *
 */

var readMore = angular.module('readMore', []);

readMore.directive('readMore', function () {
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
            var moreText = angular.isUndefined(scope.moreText) ? ' <a class="read-more">Read More...</a>' : ' <a class="read-more">' + scope.moreText + '</a>',
                    lessText = angular.isUndefined(scope.lessText) ? ' <a class="read-less">Less ^</a>' : ' <a class="read-less">' + scope.lessText + '</a>',
                    ellipsis = angular.isUndefined(scope.ellipsis) ? '' : scope.ellipsis,
                    limit = angular.isUndefined(scope.limit) ? 150 : scope.limit;

            function readmore(text) {
                var orig = text;
                var regex = /\s+/gi;
                var charCount = text.length;
                var wordCount = text.trim().replace(regex, ' ').split(' ').length;
                var countBy = 'char';
                var count = charCount;
                var foundWords = [];
                var markup = text;
                var more = '';

                if (!angular.isUndefined(attr.words)) {
                    countBy = 'words';
                    count = wordCount;
                }

                if (countBy === 'words') { // Count words

                    foundWords = text.split(/\s+/);

                    if (foundWords.length > limit) {
                        text = foundWords.slice(0, limit).join(' ') + ellipsis;
                        more = foundWords.slice(limit, count).join(' ');
                        markup = text + moreText + '<span class="more-text">' + more + lessText + '</span>';
                    }

                } else { // Count characters

                    if (count > limit) {
                        text = orig.slice(0, limit) + ellipsis;
                        more = orig.slice(limit, count);
                        markup = text + moreText + '<span class="more-text">' + more + lessText + '</span>';
                    }

                }

                elem.append(markup);
                elem.find('.read-more').on('click', function () {
                    $(this).hide();
                    elem.find('.more-text').addClass('show').slideDown();
                });
                elem.find('.read-less').on('click', function () {
                    elem.find('.read-more').show();
                    elem.find('.more-text').hide().removeClass('show');
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
});
