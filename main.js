let spanConut = document.querySelector(".count span");
let bullets = document.querySelector(".bullets");
let bulletsSpanContainer = document.querySelector(".bullets .spans");
let quizArea = document.querySelector(".quiz-area");
let answersArea = document.querySelector(".answers-area");
let submitButton = document.querySelector(".submit-button");
let theResultContainer = document.querySelector(".results");
let countDownElement = document.querySelector(".countdown");

let currentIndex = 0;
let rightAnswers = 0;
let countdownInterval;
function getQuestions() {
  let myRequest = new XMLHttpRequest();
  myRequest.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      let questuinsObject = JSON.parse(this.responseText);
      let qCount = questuinsObject.length;
      createBullets(qCount);
      addQuestionData(questuinsObject[currentIndex], qCount);
      countdown(90, qCount);
      submitButton.onclick = () => {
        let theRightAnswer = questuinsObject[currentIndex].right_answer;
        currentIndex++;
        checkAnswer(theRightAnswer, qCount);
        quizArea.innerHTML = "";
        answersArea.innerHTML = "";
        addQuestionData(questuinsObject[currentIndex], qCount);
        handleBullets();
        clearInterval(countdownInterval);
        countdown(90, qCount);
        showResult(qCount);
      };
    }
  };
  myRequest.open("GET", "html_questions.json", true);
  myRequest.send();
}
getQuestions();
function createBullets(num) {
  spanConut.innerHTML = num;
  for (let i = 0; i < num; i++) {
    let theBullet = document.createElement("span");
    if (i === 0) {
      theBullet.className = "on";
    }
    bulletsSpanContainer.appendChild(theBullet);
  }
}
function addQuestionData(obj, count) {
  if (currentIndex < count) {
    let questionTitle = document.createElement("h2");
    let questionText = document.createTextNode(obj[`title`]);
    questionTitle.appendChild(questionText);
    quizArea.appendChild(questionTitle);
    for (let i = 1; i <= 4; i++) {
      let minDiv = document.createElement("div");
      minDiv.className = "answer";
      // Create Input Radio
      let radioInput = document.createElement("input");
      radioInput.type = "radio";
      radioInput.name = "question";
      radioInput.id = `answer_${i}`;
      radioInput.dataset.answer = obj[`answer_${i}`];
      if (i === 1) {
        radioInput.checked = true;
      }
      let thelabel = document.createElement("label");
      let theLabelText = document.createTextNode(obj[`answer_${i}`]);
      thelabel.htmlFor = `answer_${i}`;
      thelabel.appendChild(theLabelText);
      minDiv.appendChild(radioInput);
      minDiv.appendChild(thelabel);
      answersArea.appendChild(minDiv);
    }
  }
}
function checkAnswer(rAnswer, count) {
  let answers = document.getElementsByName("question");
  let theChoosenAnswer;
  for (let i = 0; i < answers.length; i++) {
    if (answers[i].checked) {
      theChoosenAnswer = answers[i].dataset.answer;
    }
  }
  if (rAnswer === theChoosenAnswer) {
    rightAnswers++;
    console.log("Perfect");
  }
}
function handleBullets() {
  let bulletsSpans = document.querySelectorAll(".bullets .spans span");
  let arrayOfSpans = Array.from(bulletsSpans);
  arrayOfSpans.forEach((span, index) => {
    if (currentIndex == index) {
      span.className = "on";
    }
  });
}
function showResult(count) {
  let theResult;
  if (currentIndex === count) {
    quizArea.remove();
    answersArea.remove();
    bullets.remove();
    submitButton.remove();
    if (rightAnswers > count / 2 && rightAnswers > count) {
      theResult = `<span class="good">Good</span>, ${rightAnswers} From ${count}`;
    } else if (rightAnswers === count) {
      theResult = `<span class="perfect">Perfect</span>, All Answers Is Right ${rightAnswers} From ${count}`;
    } else {
      theResult = `<span class="bad">Bad</span>, ${rightAnswers} From ${count}`;
    }
    theResultContainer.innerHTML = theResult;
  }
}
function countdown(duration, count) {
  if (currentIndex < count) {
    let minutes, secondes;
    countdownInterval = setInterval(() => {
      minutes = parseInt(duration / 60);
      secondes = parseInt(duration % 60);
      minutes = minutes < 10 ? `0${minutes}` : minutes;
      secondes = secondes < 10 ? `0${secondes}` : secondes;
      countDownElement.innerHTML = `${minutes}:${secondes}`;
      if (--duration < 0) {
        console.log("finished");
        clearInterval(countdownInterval);
        submitButton.click();
      }
    }, 1000);
  }
}
