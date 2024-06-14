(() => {
  const participantForm = document.getElementById("participantForm");
  const startBtn = document.querySelector(".start_btn button");
  const infoBox = document.querySelector(".info_box");
  const exitBtn = infoBox.querySelector(".buttons .quit");
  const continueBtn = infoBox.querySelector(".buttons .restart");
  const quizBox = document.querySelector(".quiz_box");
  const resultBox = document.querySelector(".result_box");
  const optionList = document.querySelector(".option_list");
  const timeLine = document.querySelector("header .time_line");
  const timeText = document.querySelector(".timer .time_left_txt");
  const timeCount = document.querySelector(".timer .timer_sec");
  const nextBtn = document.querySelector("footer .next_btn");
  const bottomQuesCounter = document.querySelector("footer .total_que");
  const quitQuizBtn = resultBox.querySelector(".buttons .quit");

  let timeValue = 15;
  let queCount = 0;
  let queNumb = 1;
  let userScore = 0;
  let counter;
  let counterLine;
  let widthValue = 0;

  const tickIconTag =
    '<div class="icon tick"><i class="fas fa-check"></i></div>';
  const crossIconTag =
    '<div class="icon cross"><i class="fas fa-times"></i></div>';

  const randomQuestions = shuffle(questions).slice(0, 4);

  participantForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = participantForm.name.value;
    const mobile = participantForm.mobile.value;

    try {
      const response = await fetch(
        "https://form-api-1.onrender.com/api/participants",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name, mobile }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        alert(errorData.message);
        return;
      }

      participantForm.classList.add("hideForm");
      startBtn.parentElement.classList.remove("hideBtn");
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred. Please try again later.");
    }
  });

  startBtn.onclick = () => {
    infoBox.classList.add("activeInfo");
  };

  exitBtn.onclick = () => {
    infoBox.classList.remove("activeInfo");
  };

  continueBtn.onclick = () => {
    infoBox.classList.remove("activeInfo");
    quizBox.classList.add("activeQuiz");
    showQuetions(queCount);
    queCounter(queNumb);
    // startTimer(timeValue);
    // startTimerLine(widthValue);
  };

  nextBtn.onclick = () => {
    if (queCount < randomQuestions.length - 1) {
      queCount++;
      queNumb++;
      showQuetions(queCount);
      queCounter(queNumb);
      clearInterval(counter);
      clearInterval(counterLine);
      // startTimer(timeValue);
      // startTimerLine(widthValue);
      timeText.textContent = "Time Left";
      nextBtn.classList.remove("show");
    } else {
      clearInterval(counter);
      clearInterval(counterLine);
      showResult();
    }
  };

  quitQuizBtn.onclick = () => {
    window.location.reload();
  };

  function shuffle(array) {
    let currentIndex = array.length,
      temporaryValue,
      randomIndex;

    while (0 !== currentIndex) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  }

  function showQuetions(index) {
    const queText = document.querySelector(".que_text");
    const question = randomQuestions[index];
    const questionTag = `<span>${question.question}</span>`;
    const optionTag = question.options
      .map((option) => `<div class="option"><span>${option}</span></div>`)
      .join("");
    queText.innerHTML = questionTag;
    optionList.innerHTML = optionTag;

    const option = optionList.querySelectorAll(".option");
    option.forEach((opt) => {
      opt.setAttribute("onclick", "optionSelected(this)");
    });
  }

  window.optionSelected = (answer) => {
    clearInterval(counter);
    clearInterval(counterLine);
    const userAns = answer.textContent;
    const correctAns = randomQuestions[queCount].answer;
    const allOptions = optionList.children.length;

    if (userAns === correctAns) {
      userScore += 1;
      answer.classList.add("correct");
      answer.insertAdjacentHTML("beforeend", tickIconTag);
    } else {
      answer.classList.add("incorrect");
      answer.insertAdjacentHTML("beforeend", crossIconTag);

      for (let i = 0; i < allOptions; i++) {
        if (optionList.children[i].textContent === correctAns) {
          optionList.children[i].setAttribute("class", "option correct");
          optionList.children[i].insertAdjacentHTML("beforeend", tickIconTag);
        }
      }
    }

    for (let i = 0; i < allOptions; i++) {
      optionList.children[i].classList.add("disabled");
    }
    nextBtn.classList.add("show");
  };

  function showResult() {
    infoBox.classList.remove("activeInfo");
    quizBox.classList.remove("activeQuiz");
    resultBox.classList.add("activeResult");
    const scoreText = resultBox.querySelector(".score_text");
    const scoreTag =
      userScore >= 2
        ? `<span>Congratulations 🎉 🎉, You got <p>${userScore}</p> out of <p>4</p></span> <p>You are now eligible to try our mystery box, good luck!</p>`
        : `<span>Oops ☹. You got only <p>${userScore}</p> out of <p>4</p></span><p>Sorry, you didn't pass. It's time for you to learn more about Amirá!</p>`;
    // let scoreTag = `<span>and congrats! You got <p>${userScore}</p> out of <p>${randomQuestions.length}</p></span>`;
    scoreText.innerHTML = scoreTag;
    document.getElementById("applause").play();
  }

  // function startTimer(time) {
  //   counter = setInterval(timer, 1000);
  //   function timer() {
  //     timeCount.textContent = time;
  //     time--;
  //     if (time < 9) {
  //       let addZero = timeCount.textContent;
  //       timeCount.textContent = "0" + addZero;
  //     }
  //     if (time < 0) {
  //       clearInterval(counter);
  //       timeText.textContent = "Time Off";
  //       const allOptions = optionList.children.length;
  //       const correctAns = randomQuestions[queCount].answer;
  //       for (let i = 0; i < allOptions; i++) {
  //         if (optionList.children[i].textContent === correctAns) {
  //           optionList.children[i].setAttribute("class", "option correct");
  //           optionList.children[i].insertAdjacentHTML("beforeend", tickIconTag);
  //         }
  //       }
  //       for (let i = 0; i < allOptions; i++) {
  //         optionList.children[i].classList.add("disabled");
  //       }
  //       nextBtn.classList.add("show");
  //     }
  //   }
  // }

  // function startTimerLine(time) {
  //   counterLine = setInterval(timer, 29);
  //   function timer() {
  //     time += 1;
  //     timeLine.style.width = time + "px";
  //     if (time > 549) {
  //       clearInterval(counterLine);
  //     }
  //   }
  // }

  function queCounter(index) {
    const totalQueCounTag = `<span><p>${index}</p> of <p>${randomQuestions.length}</p> Questions</span>`;
    bottomQuesCounter.innerHTML = totalQueCounTag;
  }
})();
