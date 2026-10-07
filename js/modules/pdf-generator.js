// PDF జనరేషన్ ఇంజిన్ (html2pdf Library ఆధారంగా)
const PdfEngine = {
    generate: function() {
        const element = document.getElementById('paperCanvas');
        if (!element) {
            alert('కాన్వాస్ ఏరియా కనిపించలేదు!');
            return;
        }

        const options = {
            margin:       0,
            filename:     `Yuvagalam_Newspaper_${new Date().toISOString().slice(0,10)}.pdf`,
            image:        { type: 'jpeg', quality: 0.98 },
            html2canvas:  { scale: 2, useCORS: true },
            jsPDF:        { unit: 'mm', format: 'a3', orientation: 'portrait' }
        };

        alert('PDF డౌన్‌లోడ్ ప్రాసెస్ ప్రారంభమైంది. దయచేసి కొన్ని సెకన్లు వేచి ఉండండి...');

        html2pdf().set(options).from(element).save().then(() => {
            alert('PDF విజయవంతంగా డౌన్‌లోడ్ అయ్యింది!');
        }).catch(err => {
            console.error('PDF generation error:', err);
            alert('PDF జనరేట్ చేయడంలో సమస్య వచ్చింది.');
        });
    }
};
