// పేపర్ సైజ్ మార్చే ఫంక్షన్
function changePaperSize(size) {
    const pages = document.querySelectorAll('.newspaper-page');
    pages.forEach(page => {
        if (size === 'broadsheet') {
            page.style.width = '380mm';
            page.style.minHeight = '540mm';
        } else if (size === 'a4') {
            page.style.width = '210mm';
            page.style.minHeight = '297mm';
        } else { // Tabloid (Standard)
            page.style.width = '320mm';
            page.style.minHeight = '470mm';
        }
    });
}

// బాటమ్ బుల్లెట్లు యాడ్ చేసే మోడల్/ఫంక్షన్
function openBulletsModal() {
    const bulletsText = prompt("బాటమ్ బుల్లెట్ పాయింట్లను (కామాలతో వేరు చేసి) టైప్ చేయండి:");
    if (bulletsText) {
        const bulletsArray = bulletsText.split(',');
        const activePage = document.querySelector('.newspaper-page'); // మొదటి పేజీ లేదా సెలెక్ట్ చేసిన పేజీ
        
        if (activePage) {
            let footer = activePage.querySelector('.page-footer-bullets');
            if (!footer) {
                footer = document.createElement('div');
                footer.className = 'page-footer-bullets';
                footer.style.borderTop = '1px solid #000';
                footer.style.marginTop = 'auto';
                footer.style.paddingTop = '5px';
                footer.style.fontSize = '12px';
                activePage.appendChild(footer);
            }
            
            footer.innerHTML = '<strong>ముఖ్యాంశాలు:</strong> ' + bulletsArray.map(b => `• ${b.trim()}`).join(' ');
        }
    }
}

// ఆటో పేజీ సెటప్ ఫంక్షన్ (డేట్‌లైన్ & ఫార్మాటింగ్)
function autoSetupPage() {
    const today = new Date().toLocaleDateString('te-IN', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    const headers = document.querySelectorAll('.page-header');
    headers.forEach((header, index) => {
        header.innerHTML = `
            <div style="display: flex; justify-content: space-between; font-size: 12px; border-bottom: 1px solid #000; padding-bottom: 3px; margin-bottom: 5px;">
                <span>యువగళం దినపత్రిక</span>
                <span>${today}</span>
                <span>పేజీ: ${index + 1}</span>
            </div>
        `;
    });
    alert('ఆటో పేజీ సెటప్ పూర్తయింది! తేదీ మరియు హెడర్‌లు అప్‌డేట్ అయ్యాయి.');
}
