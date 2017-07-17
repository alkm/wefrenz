/**
 * Created by sunil_pandita on 1/23/14.
 */
define(['app','common/directives/acreviewstars'],function(App)
{
    App.register.directive("appcenterReview",function()
    {
        var directiveFn={};

        directiveFn.restrict="E";
        directiveFn.templateUrl="partials/common/ratingreviewtpl.html";
        directiveFn.transclude=true;
        directiveFn.scope={
            rating:"=",
            lstReviews:"=reviews"
        };
        directiveFn.link=function(scope,elem,attrs)
        {
            scope.defRating=-1;

            scope.listmode=true;

            scope.writeReview=function()
            {
                scope.listmode=false;

            };

            scope.cancelAdd=function()
            {
                scope.listmode=true;
            }

            scope.saveReview=function()
            {
                var reviewStarsCount=elem.find("ul.rating li.filled").length;
                var reviewtext=elem.find("#txt-review-rating").val();

                var saveItem={};
                saveItem.reviewer="Jacob Taylor";
                saveItem.stars=reviewStarsCount;
                saveItem.comments=reviewtext;

                scope.lstReviews.usercomments.push(saveItem);
                scope.listmode=true;
            }

            scope.getRating=function(rating)
            {
               var retVal=0.0;
               if(rating)
               {
                   var numstars=parseFloat(rating);
                   var result=Math.round(numstars*2)/2;
                   retVal=result.toFixed(1);
               }
               return (""+retVal);
            };
        };
        return directiveFn;
    });
});