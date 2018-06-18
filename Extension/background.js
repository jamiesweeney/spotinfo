
chrome.browserAction.onClicked.addListener(function(activeTab)
{
    var newURL = "http://www.youtube.com/watch?v=oHg5SJYRHA0";
    // chrome.tabs.create({ url: newURL });
    chrome.tabs.create({ url: "spotinfo/templates/base.html" });
});
