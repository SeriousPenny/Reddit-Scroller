document.addEventListener('DOMContentLoaded', function ()
{
    var cbScroller = document.getElementById("cbScroller");
    var seconds = document.getElementById("seconds");

    chrome.tabs.query({ currentWindow: true, active: true },
        function (tabs)
        {
            //Enter only if user is in Reddit
            if(tabs[0].url.indexOf("https://www.reddit.com/") > -1)
            {
                try
                {
                    //Hide error and show the scroller
                    document.getElementById('rowScroller').style.display = 'block';
                    document.getElementById('rowError').style.display = 'none';

                    //Recover the state of the popup (per tab basis) 
                    cbScroller.checked = chrome.extension.getBackgroundPage().tabData['tab_'+tabs[0].id].checkedScroller;
                    seconds.setAttribute('value',chrome.extension.getBackgroundPage().tabData['tab_'+tabs[0].id].scrollerSeconds);

                    //Listeners
                    cbScroller.addEventListener('click', cbScrollerClick, false);
                    seconds.onkeypress = isNumber;
                    seconds.oninput = maxLengthCheck;

                }catch(error) 
                {
                    //Whoops, something went wrong
                    document.getElementById("errorMessage").innerHTML = "Please "+"reload this page".bold()+", we need to load important scripts in order for it to work properly :)";

                    //Show the error, hide the content
                    document.getElementById('rowScroller').style.display = 'none';
                    document.getElementById('rowError').style.display = 'block';
                }
            }
            else //Otherwise, we hide the scroller control
            {
                //Whoops, something went wrong
                document.getElementById("errorMessage").innerHTML = "Sorry! This is a "+"Reddit-only".bold()+" extension, please go to Reddit to use it :D";

                document.getElementById('rowScroller').style.display = 'none';
                document.getElementById('rowError').style.display = 'block';
            }
            
        }
    );
    
}, false);

//Function for when the checkbox is clicked
function cbScrollerClick()
{
    if(cbScroller.checked && seconds.value <= 0)
        cbScroller.checked = false;
    else
    {
        chrome.tabs.query({ currentWindow: true, active: true },
            function (tabs) 
            {
                //Save the state so it persists when the popup is reopened
                chrome.extension.getBackgroundPage().tabData['tab_'+tabs[0].id].checkedScroller = cbScroller.checked;
                chrome.extension.getBackgroundPage().tabData['tab_'+tabs[0].id].scrollerSeconds = seconds.value;
    
                if (cbScroller.checked)
                    chrome.tabs.sendMessage(tabs[0].id, seconds.value);
                else //If it's unchecked, send seconds as 0 (same as stopped, right? ¯\_(ツ)_/¯)
                    chrome.tabs.sendMessage(tabs[0].id, 0);
            }
        );
    }
}


/*
    ------------ EXTRA FUNCTIONS -------------
*/

//Check you can only type in numbers
function isNumber(evt)
{
    var charCode = (evt.which) ? evt.which : evt.keyCode
    if ((charCode < 48 || charCode > 57 || charCode == 101)) //101 is e
        return false;
    return true;
}

//Check max 3 characters
function maxLengthCheck()
{
    var seconds = document.getElementById("seconds");

    if (seconds.value.length > seconds.maxLength)
        seconds.value = seconds.value.slice(0, seconds.maxLength)
}