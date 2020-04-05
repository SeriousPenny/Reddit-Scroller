document.addEventListener('DOMContentLoaded', function ()
{
    var cbScroller = document.getElementById("cbScroller");
    var seconds = document.getElementById("seconds");

    chrome.tabs.query({ currentWindow: true, active: true },
        function (tabs)
        {
            //Enter only if user is in Reddit
            if(tabs[0].url.indexOf("https://www.reddit.com/") > -1 || tabs[0].url.indexOf("https://old.reddit.com/") > -1)
            {
                //Hide error and show the scroller
                document.getElementById('rowScroller').style.display = 'block';
                document.getElementById('rowError').style.display = 'none';

                //Recover the state of the popup (per tab basis)
                var key = 'tab_' + tabs[0].id;
                chrome.storage.local.get(key, function(items)
                {
                    try
                    {
                        cbScroller.checked = items[key].checkedScroller;
                        seconds.setAttribute('value', items[key].scrollerSeconds);
                    }
                    catch(error)
                    {
                        //Whoops, something went wrong
                        document.getElementById("errorMessage").innerHTML = chrome.i18n.getMessage("errorFirstInstall");
        
                        document.getElementById('rowScroller').style.display = 'none';
                        document.getElementById('rowError').style.display = 'block';
                    }
                });

                //Listeners
                cbScroller.addEventListener('click', cbScrollerClick, false);
                seconds.onkeypress = isNumber;
                seconds.oninput = maxLengthCheck;
                
            }
            else //Otherwise, we hide the scroller control
            {
                //Whoops, something went wrong
                document.getElementById("errorMessage").innerHTML = chrome.i18n.getMessage("errorNotReddit");

                document.getElementById('rowScroller').style.display = 'none';
                document.getElementById('rowError').style.display = 'block';
            }
            
        }
    );
    
}, false);

//Function for when the checkbox is clicked
function cbScrollerClick()
{
    //If the user is trying to click on the checkbox with 0 seconds, don't let them
    if(cbScroller.checked && seconds.value <= 0)
        cbScroller.checked = false;
    else
    {
        chrome.tabs.query({ currentWindow: true, active: true },
            function (tabs) 
            {
                var key = 'tab_' + tabs[0].id;

                //Save the state so it persists when the popup is reopened
                chrome.storage.local.set({[key]: {
                    checkedScroller: cbScroller.checked,
                    scrollerSeconds: seconds.value
                }});
    
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