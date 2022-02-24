'use strict';

const placeForWarning = document.querySelector('.button');

const option1 = document.querySelector('.option1'),
option2 = document.querySelector('.option2'),
option3 = document.querySelector('.option3'),
option4 = document.querySelector('.option4'),
optionsElements = document.querySelectorAll('.option');

const question = document.querySelector('#question'), //сам вопрос
numberOfQuestion = document.querySelector('#number-of-question'), //№ текущего вопроса
numberOfAllQuestions = document.querySelector('#number-of-all-questions'); //кол-во вопросов

let indexOfQuestion, //индекс текущего вопроса
indexOfPage = 0; //индекс страницы

const answersTracker = document.querySelector('#answers-tracker'); //кружки

const btnNext  = document.querySelector('#btn-next');
let btnPress;
const warning = document.createElement('div');

let score = 0; //результат викторины

//модалка
const overModal = document.querySelector('.quiz-over-modal'),
      correctAnswer = document.querySelector('#correct-answer'),
      numberOfAllQestions2 = document.querySelector('#number-of-all-questions-2'),
      btnTryAgain = document.querySelector('#btn-try-again');

const questions = [
    {
        question: 'Тут третий',
        options: [
            'Неверно',
            'Неверно',
            'Верно',
            'Неверно'
        ],
        rightAnswer: 2
    },
    {
        question: 'Тут второй',
        options: [
            'Неверно',
            'Верно',
            'Неверно',
            'Неверно'
        ],
        rightAnswer: 1
    },
    {
        question: 'Тут четвертый',
        options: [
            'Неверно',
            'Неверно',
            'Неверно',
            'Верно'
        ],
        rightAnswer: 3
    }, 
    {
        question: 'Тут первый',
        options: [
            'Верно',
            'Неверно',
            'Неверно',
            'Неверно'
        ],
        rightAnswer: 0
    },
];

numberOfAllQuestions.textContent = questions.length;

const load = () => {
    question.textContent = questions[indexOfQuestion].question;

    option1.textContent = questions[indexOfQuestion].options[0];
    option2.textContent = questions[indexOfQuestion].options[1];
    option3.textContent = questions[indexOfQuestion].options[2];
    option4.textContent = questions[indexOfQuestion].options[3];

    numberOfQuestion.textContent = indexOfPage + 1;
    indexOfPage++;
};

let completedAnswer = []; //для заданных вопросов

const randomQuestion = () => {
    let randomNumber = Math.floor(Math.random() * questions.length);
    let hitDublicate = false; //якорь для проверки одинаковых вопросов

    if(indexOfPage == questions.length) {
        quizOver();
    } else {
        if(completedAnswer.length > 0){
            completedAnswer.forEach(item => {
                if(item == randomNumber) {
                    hitDublicate = true;
                }
            });
            if(hitDublicate) {
                randomQuestion();
            } else {
                indexOfQuestion = randomNumber;
                load();
            }
        } else {
            indexOfQuestion = randomNumber;
                load();
        }
    }
    completedAnswer.push(indexOfQuestion);
};

const checkAnswer = el => { //проверка правильный вариант или нет и присвоение классов
    if (el.target.dataset.id == questions[indexOfQuestion].rightAnswer) {
        el.target.classList.add('correct');
        updateAnswerTracker('correct');
        score++;
    } else {
        el.target.classList.add('wrong');
        updateAnswerTracker('wrong');  
    }
    btnPress = true;
    disabledOptions(); //отключение активности кнопок
};

const disabledOptions = () => { //отключение активности кнопок
    optionsElements.forEach(item => {
        item.classList.add('disabled');
        if(item.dataset.id == questions[indexOfQuestion].rightAnswer) {
            item.classList.add('correct'); //присвоение класса правильному варианту
        }
    });
};

optionsElements.forEach(elem => {
    elem.addEventListener('click', event => checkAnswer(event));

});

const enableOption = () => { //удаление классов для нового вопроса
    optionsElements.forEach(item => {
        item.classList.remove('disabled', 'correct', 'wrong');
    });
};

const answerTracker = () => { //создание кружочка 
    questions.forEach(() => {
        const div = document.createElement('div');
        answersTracker.append(div);
    });
};

const updateAnswerTracker = status => { //присвоение класса кружочку 
    answersTracker.children[indexOfPage - 1].classList.add(`${status}`);
};

const validate = () => { //проверка выбран ли вариант ответа
    if(!btnPress) {
        warning.classList.add('warning');
        warning.textContent = 'Вам нужно выбрать один из вариантов ответа';
        placeForWarning.append(warning);
        setTimeout(() => warning.remove(), 1500);
    } else {
        enableOption(); //удаление классов для нвого вопроса
        randomQuestion(); //запуск инициализации нового вопроса
        btnPress = false;
    }
};

const quizOver = () => { //
    overModal.classList.add('active');
    correctAnswer.textContent = score;
    numberOfAllQestions2.textContent = questions.length;
        for (let i = 0; i < completedAnswer.length; i++) {
            delete completedAnswer[i]; //очистка массива в пройдеными ответами
        }
        indexOfPage = 0;
        randomQuestion();
};

const tryAgain = () => {
    window.location.reload();
};

btnTryAgain.addEventListener('click', tryAgain);

btnNext.addEventListener('click', () => {
    validate(); 
});

document.addEventListener('DOMContentLoaded', () => {
    randomQuestion();
    answerTracker();
});


