// html2pdf / jsPDF సహాయంతో HD అక్షరాలు & కంప్రెస్డ్ ఫోటోలతో PDF జనరేషన్
function generatePDF() {
    const element = document.getElementById('pages-container');
    if (!element) {
        alert("పేజీలు ఏవీ కనిపించలేదు!");
        return;
    }

    alert("HD పీడీఎఫ్ తయారవుతోంది (9MB పరిమితికి అనుగుణంగా optimization జరుగుతోంది)... దయచేసి కొన్ని సెకన్లు వేచి ఉండండి.");

    // PDF ఆప్షన్స్ (10MB Render లిమిట్ కు అనుగుణంగా 0.75 - 0.85 క్వాలిటీ)
    const opt = {
        margin:       0,
        filename:     'Yuvagalam_Epaper_' + new Date().toISOString().slice(0,10) + '.pdf',
        image:        { type: 'jpeg', quality: 0.82 }, // ఫోటోల క్వాలిటీని తగ్గించి సైజ్ 9MB లోపు ఉంచుతుంది
        html2canvas:  { 
            scale: 2,             // అక్షరాలు చదవడానికి క్లియర్‌గా (HD) కనిపించేలా చేస్తుంది
            useCORS: true, 
            logging: false 
        },
        jsPDF:        { unit: 'mm', format: 'a3', orientation: 'portrait' }
    };

    // html2pdf లైబ్రరీ రన్ చేయడం
    if (typeof html2pdf !== 'undefined') {
        html2pdf().set(opt).from(element).save();
    } else {
        // html2pdf స్క్రిప్ట్ లోడ్ అవ్వకపోతే అలర్ట్
        window.print(); // ఆల్టర్నేటివ్ ప్రింట్ ఆప్షన్
    }
}
