document.addEventListener('DOMContentLoaded', function() {
    
    const newsText = document.getElementById('news-text');
    const analyzeBtn = document.getElementById('analyze-btn');
    const clearBtn = document.getElementById('clear-btn');
    const resultSection = document.getElementById('result-section');
    const resultCard = document.getElementById('result-card');
    const resultIcon = document.getElementById('result-icon');
    const resultText = document.getElementById('result-text');
    const resultDetails = document.getElementById('result-details');
    const sampleCards = document.querySelectorAll('.sample-card');
    const tryButtons = document.querySelectorAll('.try-btn');

    const API_ENDPOINT = '/predict';

    analyzeBtn.addEventListener('click', analyzeNews);
    clearBtn.addEventListener('click', clearForm);
    newsText.addEventListener('input', validateInput);

    sampleCards.forEach(card => {
        card.addEventListener('click', function() {
            const text = this.getAttribute('data-text');
            newsText.value = text;
            newsText.focus();
        });
    });

    tryButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            const card = this.closest('.sample-card');
            const text = card.getAttribute('data-text');
            newsText.value = text;
            analyzeNews();
        });
    });

    function validateInput() {
        const text = newsText.value.trim();
        analyzeBtn.disabled = text.length < 10;
    }

    function clearForm() {
        newsText.value = '';
        resultSection.style.display = 'none';
        analyzeBtn.disabled = false;
        newsText.focus();
    }

    async function analyzeNews() {
        const text = newsText.value.trim();
        
        if (text.length < 10) {
            showError('Please enter at least 10 characters');
            return;
        }

        // Show loading state
        showLoading();

        try {
            const response = await fetch(API_ENDPOINT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ text: text })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            showResult(data.prediction);
        } catch (error) {
            console.error('Error:', error);
            showError('Unable to analyze the news. Please try again later.');
        }
    }

    function showLoading() {
        resultSection.style.display = 'block';
        resultCard.className = 'result-card';
        resultIcon.innerHTML = '<i class="fas fa-question-circle"></i>';
        resultText.innerHTML = '<h3>Analyzing...</h3><p>Please wait while we process your request</p>';
        resultDetails.innerHTML = '<div class="loading-spinner"></div>';
        analyzeBtn.disabled = true;
    }

    function showResult(prediction) {
        const isFake = prediction.toLowerCase() === 'fake';
        
        resultCard.className = `result-card ${isFake ? 'fake' : 'real'}`;
        resultIcon.innerHTML = isFake ? 
            '<i class="fas fa-exclamation-triangle"></i>' : 
            '<i class="fas fa-check-circle"></i>';
        
        resultText.innerHTML = `
            <h3>${prediction}</h3>
            <p>${isFake ? 
                'This news appears to be fake or misleading' : 
                'This news appears to be legitimate'
            }</p>
        `;
        
        resultDetails.innerHTML = `
            <div class="confidence">
                <p>Analysis completed successfully</p>
                <small>Based on AI analysis of text patterns and linguistic features</small>
            </div>
        `;
        
        analyzeBtn.disabled = false;
    }

    function showError(message) {
        resultSection.style.display = 'block';
        resultCard.className = 'result-card';
        resultCard.style.background = 'linear-gradient(135deg, #f2994a, #f2c94c)';
        resultCard.style.color = 'white';
        resultIcon.innerHTML = '<i class="fas fa-exclamation-circle"></i>';
        resultText.innerHTML = `<h3>Error</h3><p>${message}</p>`;
        resultDetails.innerHTML = '';
        analyzeBtn.disabled = false;
    }

    // Initialize
    validateInput();

});
