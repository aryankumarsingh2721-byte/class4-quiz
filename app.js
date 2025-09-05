// Olympiad Quiz Application Logic - Multi-Subject Version
(function () {
    // Page elements
    const homePage = document.getElementById('home-page');
    const quizPage = document.getElementById('quiz-page');
    const questionElement = document.getElementById('question');
    const answerButtonsElement = document.getElementById('answer-buttons');
    const nextButton = document.getElementById('next-btn');
    const quizContent = document.getElementById('quiz-content');
    const resultScreen = document.getElementById('result-screen');
    const finalScoreElement = document.getElementById('final-score');
    const restartButton = document.getElementById('restart-btn');
    const progressBar = document.getElementById('progress-bar');
    const subjectTitle = document.getElementById('subject-title');
    const backToHome = document.getElementById('back-to-home');
    const backToSubjects = document.getElementById('back-to-subjects');
    
    // Header elements
    const headerScore = document.getElementById('header-score');
    const headerProgress = document.getElementById('header-progress');

    let currentSubject = '';
    let quizData = [];
    let currentQuestionIndex = 0;
    let score = 0;

    function showQuestion() {
        resetState();
        let currentQuestion = quizData[currentQuestionIndex];
        questionElement.innerText = currentQuestion.question;

        currentQuestion.answers.forEach((answer, index) => {
            const button = document.createElement('button');
            button.innerText = answer.text;
            button.classList.add(
                'answer-btn', 
                'w-full', 
                'text-left', 
                'p-6', 
                'rounded-xl', 
                'border-2', 
                'border-gray-200', 
                'bg-white', 
                'hover:bg-blue-50', 
                'hover:border-blue-300',
                'focus:outline-none',
                'focus:ring-4',
                'focus:ring-blue-100',
                'transition-all',
                'duration-200',
                'transform',
                'hover:scale-[1.02]',
                'shadow-sm',
                'hover:shadow-md'
            );
            
            if (answer.correct) button.dataset.correct = 'true';
            button.addEventListener('click', selectAnswer);
            answerButtonsElement.appendChild(button);
        });
    }

    function resetState() {
        nextButton.classList.add('hidden');
        while (answerButtonsElement.firstChild) {
            answerButtonsElement.removeChild(answerButtonsElement.firstChild);
        }
    }

    function selectAnswer(e) {
        const selectedBtn = e.target;
        const isCorrect = selectedBtn.dataset.correct === 'true';
        
        if (isCorrect) {
            selectedBtn.classList.remove('border-gray-200', 'bg-white', 'hover:bg-blue-50', 'hover:border-blue-300');
            selectedBtn.classList.add('correct', 'border-green-500', 'bg-green-50', 'text-green-800');
            score++;
        } else {
            selectedBtn.classList.remove('border-gray-200', 'bg-white', 'hover:bg-blue-50', 'hover:border-blue-300');
            selectedBtn.classList.add('incorrect', 'border-red-500', 'bg-red-50', 'text-red-800');
        }
        
        // Show all correct answers and disable all buttons
        Array.from(answerButtonsElement.children).forEach(button => {
            if (button.dataset.correct === 'true') {
                if (!button.classList.contains('correct')) {
                    button.classList.remove('border-gray-200', 'bg-white', 'hover:bg-blue-50', 'hover:border-blue-300');
                    button.classList.add('correct', 'border-green-500', 'bg-green-50', 'text-green-800');
                }
            }
            button.disabled = true;
            button.classList.remove('hover:scale-[1.02]', 'hover:shadow-md', 'cursor-pointer');
            button.classList.add('cursor-not-allowed');
        });

        nextButton.classList.remove('hidden');
        updateProgress(true);
    }

    function showResults() {
        quizContent.classList.add('hidden');
        resultScreen.classList.remove('hidden');
        const percentage = Math.round((score / quizData.length) * 100);
        finalScoreElement.innerText = `Your final score is ${score} out of ${quizData.length} (${percentage}%).`;
        
        // Update header for final results
        headerScore.textContent = `Final Score: ${score}/${quizData.length}`;
        headerProgress.textContent = `Completed (${percentage}%)`;
    }

    function handleNextButton() {
        currentQuestionIndex++;
        if (currentQuestionIndex < quizData.length) {
            showQuestion();
            updateProgress();
        } else {
            showResults();
        }
    }

    function updateProgress(answerSelected = false) {
        // Update header
        headerScore.textContent = `Score: ${score}`;
        const questionNumber = currentQuestionIndex + 1;
        headerProgress.textContent = `Question ${questionNumber} of ${quizData.length}`;
        
        // Update progress bar
        let progressIndex = answerSelected ? currentQuestionIndex + 1 : currentQuestionIndex;
        const progressPercentage = (progressIndex / quizData.length) * 100;
        progressBar.style.width = `${progressPercentage}%`;
    }

    function showHomePage() {
        homePage.classList.remove('hidden');
        quizPage.classList.add('hidden');
        headerScore.textContent = 'Score: 0';
        headerProgress.textContent = 'Choose a subject';
    }

    function startSubjectQuiz(subject) {
        currentSubject = subject;
        quizData = window.__QUIZ_DATA__[subject] || [];
        
        if (quizData.length === 0) {
            alert('No questions found for this subject.');
            return;
        }

        // Update subject title
        const subjectNames = {
            mathematics: 'Mathematics',
            science: 'Science',
            english: 'English',
            general: 'General Knowledge'
        };
        subjectTitle.textContent = subjectNames[subject] || subject;

        // Show quiz page
        homePage.classList.add('hidden');
        quizPage.classList.remove('hidden');
        
        // Reset quiz state
        currentQuestionIndex = 0;
        score = 0;
        nextButton.classList.add('hidden');
        resultScreen.classList.add('hidden');
        quizContent.classList.remove('hidden');
        
        showQuestion();
        updateProgress();
    }

    function startQuiz() {
        // This function is kept for backward compatibility
        // Default to mathematics if no subject specified
        startSubjectQuiz('mathematics');
    }

    // Expose functions globally
    window.startQuiz = startQuiz;
    window.startSubjectQuiz = startSubjectQuiz;
    window.showHomePage = showHomePage;

    // Event listeners
    nextButton?.addEventListener('click', handleNextButton);
    restartButton?.addEventListener('click', () => startSubjectQuiz(currentSubject));
    backToHome?.addEventListener('click', showHomePage);
    backToSubjects?.addEventListener('click', showHomePage);

    // Subject card click handlers
    document.querySelectorAll('.subject-card').forEach(card => {
        card.addEventListener('click', () => {
            const subject = card.dataset.subject;
            startSubjectQuiz(subject);
        });
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !nextButton.classList.contains('hidden')) {
            handleNextButton();
        }
    });

    // Add smooth animations
    function addAnimations() {
        const style = document.createElement('style');
        style.textContent = `
            .answer-btn {
                position: relative;
                overflow: hidden;
            }
            
            .answer-btn::before {
                content: '';
                position: absolute;
                top: 0;
                left: -100%;
                width: 100%;
                height: 100%;
                background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
                transition: left 0.5s;
            }
            
            .answer-btn:hover::before {
                left: 100%;
            }
            
            .correct {
                animation: correctPulse 0.6s ease-in-out;
            }
            
            .incorrect {
                animation: incorrectShake 0.6s ease-in-out;
            }
            
            @keyframes correctPulse {
                0% { transform: scale(1); }
                50% { transform: scale(1.05); }
                100% { transform: scale(1); }
            }
            
            @keyframes incorrectShake {
                0%, 100% { transform: translateX(0); }
                25% { transform: translateX(-5px); }
                75% { transform: translateX(5px); }
            }
        `;
        document.head.appendChild(style);
    }

    // Initialize animations
    addAnimations();

    // Initialize the app - show home page by default
    showHomePage();
})();