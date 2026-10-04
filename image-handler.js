// క్లిప్‌బోర్డ్ నుంచి ఇమేజ్ పేస్ట్ (Ctrl+V) చేసే లాజిక్
document.addEventListener('paste', function (e) {
    const items = e.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
            const blob = items[i].getAsFile();
            const reader = new FileReader();
            
            reader.onload = function (event) {
                insertImageToPage(event.target.result);
            };
            
            reader.readAsDataURL(blob);
        }
    }
});

// పేజీలో ఇమేజ్ ఇన్సర్ట్ చేసే ఫంక్షన్
function insertImageToPage(imageSrc) {
    const activePage = document.querySelector('.newspaper-page'); // సెలెక్ట్ చేసిన లేదా మొదటి పేజీ
    if (activePage) {
        const imgContainer = document.createElement('div');
        imgContainer.className = 'news-image-wrapper';
        imgContainer.style.position = 'relative';
        imgContainer.style.display = 'inline-block';
        imgContainer.style.margin = '10px';
        imgContainer.style.resize = 'both';
        imgContainer.style.overflow = 'hidden';

        const img = document.createElement('img');
        img.src = imageSrc;
        img.style.width = '100%';
        img.style.height = '100%';
        img.style.objectFit = 'cover';

        imgContainer.appendChild(img);
        
        // కంటెంట్ ఏరియాలో ఇమేజ్ చేర్చడం
        const contentArea = activePage.querySelector('.page-content');
        if (contentArea) {
            contentArea.appendChild(imgContainer);
        } else {
            activePage.appendChild(imgContainer);
        }
    }
}

// టూల్‌బార్ బటన్ నొక్కినప్పుడు పేస్ట్ ప్రాంప్ట్
function triggerPaste(targetType) {
    alert("వాట్సాప్ లేదా గ్యాలరీ నుంచి ఇమేజ్ కాపీ చేసి, స్క్రీన్ పై 'Ctrl + V' ద్వారా పేస్ట్ చేయండి.");
}
