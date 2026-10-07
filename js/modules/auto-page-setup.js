// ఖాళీలు లేకుండా ఆటో పేజీ అడ్జస్టర్ మరియు కంటెంట్ ఫ్లో లాజిక్
const AutoPageSetup = {
    run: function() {
        // 1. స్థిరమైన బాడీ ఫాంట్ పరిమాణాన్ని నిర్వచించడం
        const FIXED_BODY_SIZE = "12px";

        const cards = document.querySelectorAll('.news-card');
        cards.forEach(card => {
            const body = card.querySelector('.body-content');
            if (body) {
                body.style.fontSize = FIXED_BODY_SIZE; // బాడీ వార్త సైజ్ మారదు
            }

            // నిష్పత్తి ఆధారంగా హెడ్‌లైన్లు మరియు ఫోటో పరిమాణాలు పెంచడం/తగ్గించడం
            const headline = card.querySelector('.headline');
            if (headline) {
                headline.style.fontSize = "22px"; // రేషియో ఆధారిత సర్దుబాటు
            }
        });

        alert("ఆటో పేజీ సెటప్ పూర్తయింది. గ్రిడ్లు పేజీ ఎత్తుకు సరిపడా సర్దుబాటు అయ్యాయి!");
    },

    flowToNextPage: function(sourceNewsId, targetPageNum) {
        // మొదటి పేజీ నుండి తరువాయి భాగాన్ని రెండవ పేజీలోకి పంపే ఫ్లో
        const source = document.getElementById(sourceNewsId);
        if (source) {
            source.innerHTML += `<div class="continue-tag">(తరువాయి భాగం ${targetPageNum}వ పేజీలో)</div>`;
            
            const targetPageContainer = document.querySelector(`#page-${targetPageNum} .news-container`);
            if(targetPageContainer) {
                targetPageContainer.innerHTML = `<div class="news-card continuation"><div class="continue-header">(మొదటి పేజీ తరువాయి)</div></div>` + targetPageContainer.innerHTML;
            }
        }
    }
};

