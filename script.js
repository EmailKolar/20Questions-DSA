"use strict"

window.addEventListener("load", start)


function start(){
    console.log("Started")
    registerButtonClicks()
    //showQuestion(root)
    //currentQuestion = root;
    //dumpTree(root)

    const decisionTree = parseDecisionTree(jsonString);
    dumpTree(decisionTree)

    currentQuestion = decisionTree;
    showQuestion(decisionTree);
}
let currentQuestion

const jsonString = `
{
  "question": "Er det et pattedyr??",
  "yes": {
    "question": "Har det Striber?",
    "yes": {
      "question": "Er det en zebra??"
    },
    "no": {
      "question": "Er det en løve??"
    }
  },
  "no": {
    "question": "Er det en fugl??",
    "yes": {
      "question": "Kan den flyve?",
      "yes": {
        "question": "Er det en ørn?"
      },
      "no": {
        "question": "Er det en pingvin?"
      }
    },
    "no": {
      "question": "Er det en Gila-øgle?"
    }
  }
}
`;



function registerButtonClicks(){
    document.querySelector("main").addEventListener("click",userClicked);

    
}
function userClicked(event){
    const target = event.target;
    if(target.tagName === "BUTTON" && target.parentElement.id=="yes-no"){
        buttonClicked(target)
    }
}
function buttonClicked(button){

    //kanpper skal fjernes
    button.parentElement.remove();

    if(currentQuestion.yes == null && button.id==='yes'){
        showWin();
        return;
    }
    if(currentQuestion.no == null && button.id==='no'){
        showLossPrompt();
        return;
    }


    if(button.id==='yes'){
        currentQuestion=currentQuestion.yes;
    }else { 
        currentQuestion = currentQuestion.no;
    }

    //næste scene vises
    showQuestion(currentQuestion)
}

function showQuestion(question){
    const html =/*html*/ `<div class="question">
    <h3>${question.question}</h3>
    
    <div class="answer" id="yes-no">
    <button id="yes">Ja</button>
    <button id="no">Nej</button>
    </div>
    </div>`;
    document.querySelector("main").insertAdjacentHTML("beforeend",html);
}
function showWin(){
    const html =/*html*/ `<div class="question">
    <h3>Tak for at Spille! - Vi vandt!</h3>
    </div>`;
    document.querySelector("main").insertAdjacentHTML("beforeend",html);
}
function showLossPrompt(){
    const html = /*html*/ `
    <div class="loss-prompt">
        <h3>Tak for at Spille! Hjælp mig med at forbedre</h3>
        <form id="feedback-form">
            <div>
                <label for="question">Spørgsmål:</label>
                <input type="text" id="question" name="question" required>
            </div>
            <div>
                <label for="answer">Svar:</label>
                <input type="text" id="answer" name="answer" required>
            </div>
            <button type="submit">Send Feedback</button>
        </form>
    </div>`;
    document.querySelector("main").insertAdjacentHTML("beforeend",html);

    const form = document.querySelector("#feedback-form");
    form.addEventListener("submit", handleFormSubmit);
}
function handleFormSubmit(event) {
    event.preventDefault(); 

    const question = document.querySelector("#question").value;
    const answer = document.querySelector("#answer").value;

    
    console.log(`Question: ${question}`);
    console.log(`Answer: ${answer}`);

    //opdater træ:
    updateTree(question, answer);

   
    document.getElementById("question").value = "";
    document.getElementById("answer").value = "";

   
    const lossPrompt = document.querySelector(".loss-prompt");
    lossPrompt.parentNode.removeChild(lossPrompt);
}

function updateTree(question, answer){
    console.log("curr question: "+currentQuestion.question)

    const newQuestion = {
        parent: null,
        question: `${question}`,
        yes: null,
        no: currentQuestion
    };
    const newQuestionAnswer = {
        parent: null,
        question: `Er det en ${answer}?`,
        yes: null,
        no: null
    };
    currentQuestion.parent.no=newQuestion;
    newQuestion.yes = newQuestionAnswer;
    newQuestion.parent = currentQuestion.parent;
    newQuestionAnswer.parent = newQuestion;
    currentQuestion.parent = newQuestion;
    console.log("new tree: ")
    dumpTree(root)  
}


function dumpTree(node, indent = "") {
    console.log(`${indent}${node.question}`);

    if (node.yes) {
        console.log(`${indent}  Yes:`);
        dumpTree(node.yes, indent + "    ");
    }

    if (node.no) {
        console.log(`${indent}  No:`);
        dumpTree(node.no, indent + "    ");
    }
}

function parseDecisionTree(jsonString, parent = null) {
    const tree = JSON.parse(jsonString);
  
    function addParent(node, parent) {
      node.parent = parent;
      if (node.yes) {
        addParent(node.yes, node);
      }
      if (node.no) {
        addParent(node.no, node);
      }
    }
  
    addParent(tree, parent);
    return tree;
  }



//graveyard:
  /*
  const root = {
    parent: null,
    question: "Er det et pattedyr?",
    yes: null,
    no: null 
};

const striber = {
    parent: root,
    question: "Har det striber?",
    yes: null,
    no: null 
};

const bird = {
    parent: root,
    question: "Er det en fugl?",
    yes: null, 
    no: null  
};

const lizard = {
    parent: bird,
    question: "Er det en gila-øgle?",
    yes: null,
    no: null
};

const fly = {
    parent: bird,
    question: "Kan den flyve?",
    yes: null, 
    no: null  
};

const eagle = {
    parent: fly,
    question: "Er det en ørn?",
    yes: null,
    no: null
};

const penguin = {
    parent: fly,
    question: "Er det en pingvin?",
    yes: null,
    no: null
};

const lion = {
    parent: striber,
    question: "Er det en løve?",
    yes: null,
    no: null
};

const zebra = {
    parent: striber,
    question: "Er det en zebra?",
    yes: null,
    no: null
};

// Assigning child objects to their respective parent objects
root.yes = striber;
root.no = bird;

striber.yes = zebra;
striber.no = lion;

bird.yes = fly;
bird.no = lizard;

fly.yes = eagle;
fly.no = penguin;


  */