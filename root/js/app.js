const questionsArea = document.querySelector('[data-questions-area]');
const answersArea = document.querySelector('[data-answers-area]');
const resultsArea = document.querySelector('[data-results-area]');
const quizArea = document.querySelector('[data-quiz-area]');
const quizControl = document.querySelector('.quiz-control');
const btnWrapper = document.querySelector('.btn-wrapper');
const countdown = document.querySelector('.countdown');
const btn = document.querySelector('button');
let currentIndex = 0;
let rightAnswers = 0;

!function () {
      let xhr = new XMLHttpRequest();

      xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                  let questions = JSON.parse(this.responseText);
                  let count = questions.length;

                  createIndicators(count);

                  let shuffledQuestions = questions.sort(() => Math.random() - 0.5);

                  addQuestions(shuffledQuestions[currentIndex], count);

                  setCountdown(60, count);

                  quizArea.addEventListener('click', e => {
                        let item = e.target;
                        if (item.classList.contains("option")) {
                              item.classList.add("clicked");

                              if (currentIndex < count) {
                                    var rightAnswer = questions[currentIndex]["answer"];
                              }

                              currentIndex++

                              checkAnswer(rightAnswer);

                              questionsArea.innerHTML = null;
                              answersArea.innerHTML = null;

                              addQuestions(shuffledQuestions[currentIndex], count);

                              clearInterval(countdownInterval);
                              setCountdown(60, count);


                              setIndicators();

                              showResults(count);
                        }
                  })

                  btn.onclick = function () {
                        currentIndex++;

                        questionsArea.innerHTML = null;
                        answersArea.innerHTML = null;

                        addQuestions(shuffledQuestions[currentIndex], count);

                        clearInterval(countdownInterval);
                        setCountdown(60, count);

                        setIndicators();

                        showResults(count);

                        if (currentIndex === count) {
                              btn.className = "btn-disabled";
                        }
                  }
            }
      }

      xhr.open("GET", "root/json/quiz.json", true);
      xhr.send();
}();

function createIndicators(count) {
      let i = 0;
      let ul = document.createElement('ul');
      ul.className = "indicators";
      for (;;) {
            if (i >= count) break;
            let li = document.createElement('li');
            if (i == 0) {
                  li.className = "on";
            }
            ul.appendChild(li);
            quizControl.insertBefore(ul, btnWrapper);
            i++
      }
}

function addQuestions(quiz, count) {
      if (currentIndex < count) {
            questionsArea.innerHTML = `<h3>${quiz.question}</h3>`;
            answersArea.innerHTML = `
            <ol>
            <li class="option">${quiz.option__1}</li>
            <li class="option">${quiz.option__2}</li>
            <li class="option">${quiz.option__3}</li>
            <li class="option">${quiz.option__4}</li>
            <li class="option">${quiz.option__5}</li>
            </ol>`
      }
}

function checkAnswer(rightAnswer) {
      let answers = answersArea.querySelectorAll('ol li');
      let chosenAnswer;

      for (let answer of answers) {
            if (answer.classList.contains('clicked')) {
                  chosenAnswer = answer.innerHTML;
            }
      }
      if (rightAnswer === chosenAnswer) {
            rightAnswers++
      }
}

function setIndicators() {
      let indicators = quizControl.querySelectorAll('ul li');
      let items = Array.from(indicators);
      items.forEach((item, index) => {
            if (currentIndex == index) {
                  item.className = "on";
            }
      });

}

function showResults(count) {
      let result;
      let pos = "afterbegin";
      if (currentIndex === count) {
            answersArea.remove();
            questionsArea.remove();
            resultsArea.style.display = "block";

            if (rightAnswers > (count / 2)) {
                  result = `<span class='txt good'>good</span>, you made ${rightAnswers} right answer from ${count}`;
            } else if (rightAnswers == (count / 2)) {
                  result = `<span class='txt medium'>not enough</span>, you made ${rightAnswers} right answer from ${count}`;
            } else {
                  result = `<span class='txt bad'>bad</span>, you made just ${rightAnswers} right answer from ${count}`;
            }
            resultsArea.insertAdjacentHTML(pos, result);

      }
}

function setCountdown(duration, count) {
      if (currentIndex < count) {
            let min, sec;
            countdownInterval = setInterval(() => {
                  min = parseInt(duration / 60);
                  sec = parseInt(duration % 60);

                  min = min < 10 ? `0${min}` : `${min}`;
                  sec = sec < 10 ? `0${sec}` : `${sec}`;

                  countdown.innerHTML = `${min}:${sec}`;

                  if (duration-- == 0) {
                        clearInterval(countdownInterval);
                        btn.click();
                  }
            }, 1e3)
      }
}
