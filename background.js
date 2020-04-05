chrome.runtime.onStartup.addListener(function(){
    //On each startup, we clean the tabs info in memory, just in case Chrome closed forcefully
    chrome.storage.local.clear();
})

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab){

    if (changeInfo.status === 'loading')
    {
        var key = 'tab_' + tabId;

        //Stop the interval, in case it was running for any reason
        chrome.tabs.sendMessage(tabId, 0);

        //If we're loading into reddit (whether newly, or reloading, doesn't matter)
        if(tab.url.indexOf("https://www.reddit.com/") > -1 || tab.url.indexOf("https://old.reddit.com/") > -1)
        {
            chrome.storage.local.set({[key]: {
                checkedScroller: false,
                scrollerSeconds: 0
            }});
        }
        else //If we're not loading into reddit, then we can delete the data from this tab
            chrome.storage.local.remove(key);
    }
});

//If we close a tab, remove the data for that tab
chrome.tabs.onRemoved.addListener(function (tabId) {
    var key = 'tab_' + tabId;
    chrome.storage.local.remove(key);
});
