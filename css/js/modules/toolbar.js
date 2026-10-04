// టూల్‌బార్ మోడ్స్ స్విచ్ చేసే ఫంక్షన్
function switchToolbar(mode) {
    const masterToolbar = document.getElementById('master-toolbar');
    const dailyToolbar = document.getElementById('daily-toolbar');
    const btnMaster = document.getElementById('btn-master-mode');
    const btnDaily = document.getElementById('btn-daily-mode');

    if (mode === 'master') {
        masterToolbar.classList.remove('hidden');
        dailyToolbar.classList.add('hidden');
        btnMaster.classList.add('active-mode');
        btnDaily.classList.remove('active-mode');
    } else {
        masterToolbar.classList.add('hidden');
        dailyToolbar.classList.remove('hidden');
        btnMaster.classList.remove('active-mode');
        btnDaily.classList.add('active-mode');
    }
}

// పేపర్ సైజ్ మార్చే ఫంక్షన్
function changePaperSize(size) {
    console.log("Selected Paper Size:", size);
}

// పేజీల సంఖ్యను జనరేట్ చేసే ఫంక్షన్
function generatePages(count) {
    console.log("Generating Pages:", count);
}

// పేజీకి స్క్రోల్ చేసే ఫంక్షన్
function scrollToPage(pageNo) {
    console.log("Scrolling to page:", pageNo);
}
