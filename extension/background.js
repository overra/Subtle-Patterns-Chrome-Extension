var raw_url  = 'https://raw.github.com/subtlepatterns/SubtlePatterns/master/',
    patterns = [],
    page     = 0,
    selector,
    selected;

chrome.extension.onMessage.addListener(function(message, info, cb) {
    if (message == 'getPatterns') {
        cb({
            patterns: patterns,
            page:     page,
            selector: selector,
            selected: selected
        });
    }
    else if (message.pattern) {
        selector = message.selector||'body';
        selected = message.pattern;
        chrome.tabs.insertCSS({
                code: selector + ' { background-image: url(' + raw_url + message.pattern + ') !important; }'
        });
    }
    else if (message.page) {
        page = message.page;
    }
});

function loadPatterns(j) {
    var file;
    for (var i in j.data) {
        file = j.data[i];
        if (/\.png$/.test(file.name)) {
            patterns.push(file);
        }
    }
}

var patternsJSON = document.createElement('script');
patternsJSON.src = 'https://api.github.com/repos/subtlepatterns/SubtlePatterns/contents/?callback=loadPatterns'
document.body.appendChild(patternsJSON);