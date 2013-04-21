var raw_url = 'https://raw.github.com/subtlepatterns/SubtlePatterns/gh-pages/',
    patterns_div = document.getElementById('patterns'),
    name_div     = document.getElementById('name'),
    next_btn     = document.getElementById('next'),
    prev_btn     = document.getElementById('prev'),
    target_div   = document.getElementById('target'),
    patterns,
    page,
    selected,
    selectedName,
    pageMax;

function loadPatterns() {

    var pattern,
        file,
        start = page * 12,
        end   = start + 12;

    if (page===0) {
        prev_btn.setAttribute('disabled', 'disabled');
    }
    else {
        prev_btn.removeAttribute('disabled');
    }
    if (page==pageMax) {
        next_btn.setAttribute('disabled', 'disabled');
    }
    else {
        next_btn.removeAttribute('disabled');
    }

    while (patterns_div.hasChildNodes()) {
        patterns_div.removeChild(patterns_div.firstChild);
    }

    for (var i = start, x; i < end; i++) {
        file = patterns[i];
        x = i%12;
        pattern = document.createElement('div');
        pattern.className = 'pattern';
        if (selectedName===file.name) {
            pattern.className += ' selected';
            selected = pattern;
        }
        pattern.style.backgroundImage = 'url(' + raw_url + file.name + ')';
        pattern.style.top = ((x - x%4) / 4) * 65 + 'px';
        pattern.style.left = (x%4) * 65 + 'px';
        pattern.setAttribute('data-name', file.name);
        pattern.onmouseover = function() {
            name_div.innerText = this.getAttribute('data-name');
        };
        pattern.onmouseout = function() {
            name_div.innerText = (selected)?selected.getAttribute('data-name'):'';
        };
        pattern.onclick = function() {
            if (selected) {
                selected.className = 'pattern';
            }
            this.className = 'pattern selected';
            selected = this;
            selectedName = this.getAttribute('data-name');
            chrome.extension.sendMessage({
                pattern: selectedName,
                selector: target_div.value,
            });
        };
        patterns_div.appendChild(pattern);
    }
}

prev_btn.onclick = function() {
    page--;
    loadPatterns();
    chrome.extension.sendMessage({page: page});
};
next_btn.onclick = function() {
    page++;
    loadPatterns();
    chrome.extension.sendMessage({page: page});
};

chrome.extension.sendMessage('getPatterns', function(p) {
    patterns     = p.patterns;
    selectedName = p.selected;
    page         = p.page;
    pageMax      = Math.floor(patterns.length / 12);
    if (p.selector) {
        target_div.value = p.selector;
    }

    loadPatterns();
});
