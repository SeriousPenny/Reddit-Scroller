var intervalID;
var divs;
var headerHeight;
var i = 0;

chrome.runtime.onMessage.addListener(
    function(seconds, sender, sendResponse)
    {
        if(seconds > 0)
        {
            //Get all the different posts in the page (each one is inside a div)
            divs = document.getElementById('siteTable').childNodes;
            setDivsClean();
            
            //Search for the first visible item
            setIndex();

            //Start interval
            intervalID = setInterval(scrollerInterval, seconds*1000);

            //Scroll as soon as it's clicked for the first time
            scrollPost();
        }
        else if(seconds == 0) //If it's 0 seconds, it means we stop the interval
            stopScroller();
    }
)

//The function used in the timer interval
function scrollerInterval()
{
    if(i < divs.length)
        scrollPost();
    else
        stopScroller();
}

//Scrolls to the next post, uses global variables
function scrollPost()
{
    divs[i].scrollIntoView();
    i++;
}

//Sets the correct index, based on where the user is on the webpage
function setIndex()
{
    i = 0;

    for(j = 0; j < divs.length; j++)
    {
        if(checkVisible(divs[j]))
        {
            i = j;
            break;
        }
    }
}

//Stops the scrolling and sets some variables back to their default values
function stopScroller()
{
    clearInterval(intervalID);
    i = 0;
    intervalID = null;
    divs = null;
    headerHeight = null;
}

//Checks whether an element is visible on the screen
//Thanks to @Tokimon in StackOverflow
function checkVisible(elm) 
{
    var rect = elm.getBoundingClientRect();
    var viewHeight = Math.max(document.documentElement.clientHeight, window.innerHeight);
    return !(rect.bottom < 0 || rect.top - viewHeight >= 0);
}

//Function used to get only the posts from the div (minus ads and spacers)
function setDivsClean()
{
    divs = [];
    var rankSpans = document.getElementsByClassName('rank');

    for(j = 0; j < rankSpans.length; j++)
    {
        if(rankSpans[j].className == "rank")
            divs.push(rankSpans[j].parentElement);
    }
}