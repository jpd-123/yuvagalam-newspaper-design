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

// పేజీల సంఖ్యను జనరేట్ చేసే ఫంక్షన్
function generatePages(count) {
    const container = document.getElementById('pages-container');
    const dailySelect = document.getElementById('daily-page-select');
    
    if(!container || !dailySelect) return;

    container.innerHTML = '';
    dailySelect.innerHTML = '';

    for (let i = 1; i <= count; i++) {
        // పేజీ దిమ్మె క్రియేషన్
        const page = document.createElement('div');
        page.className = 'newspaper-page';
        page.id = `page-${i}`;
        page.innerHTML = `<div class="page-header">యువగళం - పేజీ ${i}</div><div class="page-content" contenteditable="true">ఇక్కడ వార్తలు డిజైన్ చేయండి...</div>`;
        container.appendChild(page);

        // డైలీ టూల్‌‌బార్ లో డ్రాప్‌డౌన్ ఆప్షన్
        const option = document.createElement('option');
        option.value = `page-${i}`;
        option.textContent = `పేజీ ${i}`;
        dailySelect.appendChild(option);
    }
}

// పేజీకి స్క్రోల్ చేసే ఫంక్షన్
function scrollToPage(pageId) {
    const page = document.getElementById(pageId);
    if (page) {
        page.scrollIntoView({ behavior: 'smooth' });
    }
}

// పేజీ లోడ్ కాగానే ప్రారంభంలో 8 పేజీలు జనరేట్ చేయడం
document.addEventListener('DOMContentLoaded', () => {
    generatePages(8);
});
