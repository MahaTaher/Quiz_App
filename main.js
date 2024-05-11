let countSpan = document.querySelector(".count span");
let bulletsSpanContainer = document.querySelector(".bullets .spans");
let quizArea = document.querySelector(".quiz-area");
let answersArea = document.querySelector(".answers-area");
let submitButton = document.querySelector(".submit-button");
let bullets = document.querySelector(".bullets");
let resuletsContainer = document.querySelector(".results");
let countdownElemet = document.querySelector(".countdown");
//set options
let currentIndex = 0;
let rightAnswers = 0;
function getQuestions()
{
    let myRequest = new XMLHttpRequest();

    myRequest.onreadystatechange  = function(){
    if (this.readyState === 4 && this.status === 200)
    {
        let questionsObject = JSON.parse(this.responseText);
        //console.log(questionsObject);
        let qCount = questionsObject.length;
        //create bullet + set question count
        createBullets(qCount);
        // add question data
        addQuestionData(questionsObject[currentIndex],qCount);
        // countdown 
        countdown(9,qCount);
        // click on submit
        submitButton.onclick = () =>
        {
           // get right answer
           let theRightAnswer = questionsObject[currentIndex].right_answer;
            // increase index
            currentIndex++;
            // check the answer
            checkAnswer(theRightAnswer,qCount);
             // remove previous question
             quizArea.innerHTML = "";
             answersArea.innerHTML = "";
             addQuestionData(questionsObject[currentIndex],qCount);
             // handle bullets classes 
             handleBullets();
             // countdown 
             clearInterval(countdownInterval);
            countdown(9,qCount);
             // show results
             showResults(qCount);
         };

     }
 };
 myRequest.open("GET", "html-questions.json", true);
 myRequest.send();
}

getQuestions();

function createBullets(num)
{
    countSpan.innerHTML = num;
    //creat spans
    for(let i = 0; i<num ;i++)
    {
       // create span
       let theBullet = document.createElement("span");
       //check if its first span
       if (i === 0)
       {
        theBullet.className = "on";
      }
       // append bullets to main bullet container
       bulletsSpanContainer.appendChild(theBullet);
     }
 }

 function addQuestionData(obj,count)
 {
     if (currentIndex < count)
     {
       // create h2 question title
   let questiontitle = document.createElement("h2");
   // create question text
   let questiontext = document.createTextNode(obj['title']);
   // append text to h2
   questiontitle.appendChild(questiontext);
   // append h2 to quiz raea
   quizArea.appendChild(questiontitle);

   // create the answers 
   for (let i=1 ; i<=4 ; i++)
   {
    //create main answer div
    let maiDiv = document.createElement("div");
    maiDiv.className = 'answer';
     // create radio input
     let radioInput = document.createElement("input");
     /// add tpe + name + id + dataattribute 
     radioInput.name='question';
     radioInput.type='radio';
     radioInput.id='answer_${i}';
     radioInput.dataset.answer = obj[`answer_${i}`];
    // makee first option selected
    /*if (i == 1)
    {
        radioInput.checked=true;
    }*/
     // create lable
     theLabel = document.createElement("label") ;
     // add for attribute
     theLabel.htmlFor='answer_${i}';
     // create label text
     let theLabeltext = document.createTextNode(obj[`answer_${i}`]);
     // add text to label 
     theLabel.appendChild(theLabeltext);
     // append radio + label to main div
     maiDiv.appendChild(radioInput);
     maiDiv.appendChild(theLabel);

     // append all divs to answers area
     answersArea.appendChild(maiDiv);
   }
      }
   
 }

function checkAnswer(rAnswer,count)
{
    let answers = document.getElementsByName("question");
    let theChoosenAnswer;
    for(let i=0 ; i< answers.length; i++)
    {
        if(answers[i].checked)
        {
            if(answers[i].checked)
            theChoosenAnswer = answers[i].dataset.answer;
        }
    }
    
    if(rAnswer === theChoosenAnswer)
    {
        rightAnswers++;
        console.log("good answer");
    }
}

function handleBullets()
{
    let bulletsSpans = document.querySelectorAll(".bullets .spans span");
    let arrayOfSpans = Array.from(bulletsSpans);
    arrayOfSpans.forEach((span,index) =>
    {
       if (currentIndex === index)
       {
        span.className="on";
    }
    });
}

function showResults(count)
{
    let theResults;
   if (currentIndex === count) 
   {
     quizArea.remove();
     answersArea.remove();
     submitButton.remove();
     bullets.remove();
     if (rightAnswers > (count / 2) && rightAnswers < count)
     {
        theResults=`<span class="good">Good</span>,${rightAnswers} From ${count} Is Good.`;
    }
    else if(rightAnswers === count)
    {
        theResults=`<span class="perfect">Perfect</span>, All Answers Is Good.`;
    }
    else
    {
        theResults=`<span class="bad">Bad</span>, ${rightAnswers} From ${count}`;
    }
     resuletsContainer.innerHTML=theResults;
     resuletsContainer.style.padding="10px";
     resuletsContainer.style.backgroundColor="white";
     resuletsContainer.style.margin="10px";
   }
}

function countdown(duration, count)
{
    if (currentIndex < count)
    {
        let minutes, seconds;
        countdownInterval = setInterval(function()
        {
           minutes=parseInt(duration/60) ;
           seconds = parseInt(duration%60);
           minutes = minutes < 10 ? `0${minutes}`:minutes; 
           seconds = seconds < 10 ? `0${seconds}`:seconds;

           countdownElemet.innerHTML=`${minutes}:${seconds}`;
           if (--duration<0)
           {
           clearInterval(countdownElemet);
           submitButton.click();
         }
        },1000); 
    
    }
    
}

