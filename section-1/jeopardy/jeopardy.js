// categories is the main data structure for the app; it looks like this:

//  [
//    { title: "Math",
//      clues: [
//        {question: "2+2", answer: 4, showing: null},
//        {question: "1+1", answer: 2, showing: null}
//        ...
//      ],
//    },
//    { title: "Literature",
//      clues: [
//        {question: "Hamlet Author", answer: "Shakespeare", showing: null},
//        {question: "Bell Jar Author", answer: "Plath", showing: null},
//        ...
//      ],
//    },
//    ...
//  ]

//let categories = [];


/** Get NUM_CATEGORIES random category from API.
 *
 * Returns array of category ids
 */



//async function getCategoryIds() {
//    try{
//       const caturl = await axios.get("https://jservice.io/api/categories");
//       return caturl.data.map(function(category){
//        //return category.id
//        console.log (category.id);
//       });
//    }catch{
//       
//    }
//}
//https://jservice.io/api/categories?count=100
const NUM_CATEGORIES = 6;
const NUM_QUESTIONS_PER_CAT = 5;

document.getElementById("start").addEventListener("click",setupAndStart); //event listener for start button to cue setupandstart


async function getCategoryIds() {
    try{
      const response = await fetch("https://jservice.io/api/categories?count=20");
      const categories = await response.json();//parse json data from response
      const shuffleCategories = shuffleArray(categories); //random shuffle
      const selectedCategories = shuffleCategories.slice(0,6); //selects 6
      return selectedCategories.map(category => category.id); //maps selectedcategory and gets the 'ID'
    }catch(error){
      console.error("error fetching category IDs",error);
      return[];
    }
}
//this function takes 20 categories and calls back shuffleArray to pick randoms (0,6)


function shuffleArray(array){
  let currentIdxCats = array.length,tempVal,randomIdx;
  while(currentIdxCats !== 0){
    randomIdx = Math.floor(Math.random()*currentIdxCats);
    currentIdxCats -=1;
    
    tempVal = array[currentIdxCats];
    array[currentIdxCats] = array[randomIdx];
    array[randomIdx] = tempVal;
  }
  return array;
}

/** Return object with data about a category:
 *
 *  Returns { title: "Math", clues: clue-array }
 *
 * Where clue-array is:
 *   [
 *      {question: "Hamlet Author", answer: "Shakespeare", showing: null},
 *      {question: "Bell Jar Author", answer: "Plath", showing: null},
 *      ...
 *   ]
 *///https://jservice.io/api/category?=${catId}

 async function getCategory(catId) {
     try{
      const response = await fetch(`https://jservice.io/api/category?id=${catId}`);
      const categoryData = await response.json();
      return{title: categoryData.title, clues: categoryData.clues}; //'answers: categoryData.answer"
     }catch(error){
        console.error(`error fetching data for category ${catId}:`,error);
        return{title: "defualt category", clues: []};//DISPLAYS CELLS AS "DEFAULT"
     }
}//data about specific categories

/** Fill the HTML table#jeopardy with the categories & cells for questions.
 *
 * - The <thead> should be filled w/a <tr>, and a <td> for each category
 * - The <tbody> should be filled w/NUM_QUESTIONS_PER_CAT <tr>s,
 *   each with a question for each category in a <td>
 *   (initally, just show a "?" where the question/answer would go.)
 */

 function fillTable(categories) {
    const table = document.getElementById("jeopardy");
    const thead = document.getElementById("tablehead");
    const tbody = document.getElementById("tablebody");
    thead.innerHTML = "";  
    tbody.innerHTML = "";
    const headerRow = thead.insertRow(0); //inserts category header row at index 0
    categories.forEach((category,index) =>{     //iterates for each category and index and gets it to the callback (category and index of that) for header
      const headerCell = headerRow.insertCell(index); //inserts row at index
      headerCell.innerHTML = category.title;           //sets category title in header      
    });
    Array.from({length: NUM_QUESTIONS_PER_CAT}).forEach((_,i) =>{    //creates arr with data to NUM_Q_P_C which is 5 //i is index of el in the arr
      //Array(NUM_QUESTIONS_PER_CAT).fill().forEach((_,i) =>{
      const row = tbody.insertRow(i);     //inserts row to body at that index i
      categories.forEach((index)=>{  //iterates through el in categories arr
        const bodyCell = row.insertCell(index); //adds cell into its row
        bodyCell.innerHTML = "?";   //we want the cells to be "?" before click
      });
    });
}

/** Handle clicking on a clue: show the question or answer.
 *
 * Uses .showing property on clue to determine what to show:
 * - if currently null, show question & set .showing to "question"
 * - if currently "question", show answer & set .showing to "answer"
 * - if currently "answer", ignore click
 * */

function handleClick(event,categories) {
    const clickTarget = event.target;
    if(clickTarget.tagName === "TD"){ //checks if clicked el is a td
      const rowIndex = clickTarget.parentNode.rowIndex;   //spots the click at the index of the row and col//parentnode gets tr of clicked cell td
      const colIndex = clickTarget.cellIndex;
      if(clickTarget.innerHTML === "?" && rowIndex > 0){   // if cell has "?"  and not a header cell hence greater than row index 0
        clickTarget.innerHTML = categories[colIndex].clues[rowIndex-1].question; //-1 because we dont want to fill the headers with questions if a tbdoy cell show clue and answer from categories
      }else if(rowIndex > 0){
        clickTarget.innerHTML = categories[colIndex].clues[rowIndex-1].answer; //else if row index where click is greate than zero. show us answer when clicked or populate
      }
    }
  }









/** Wipe the current Jeopardy board, show the loading spinner,
 * and update the button used to fetch data.
 */
function showLoadingView() {
 //const $table = $("#table");
 //const $spinner = $("#fa-spinner");
 // if($table.length && $spinner.length){
 //   if($table.html() !== ""){
 //     $spinner.addClass("hide");
 //   }else{
 //     $spinner.removeClass("hide");
 //   }
 // }
 const spinner = document.getElementById("spin-container");
 spinner.style.opacity = "1";
}
/** Remove the loading spinner and update the button used to fetch data. */

function hideLoadingView() {
  //const thead = document.getElementById("tablehead");
  //const tbody = document.getElementById("tablebody");
  //const spinner = document.getElementById("fa-spinner");
  //if(thead.length && tbody.length){
  //  if(tbody.innerHTML !== ""){
  //    spinner.style.display = "none";
  //  }
  //}
  const spinner = document.getElementById("spin-container");
  spinner.style.opacity = "0";
}
//could of done this with jquery or with if statements and condtions but was having style conflicts
/** Start game:
 *
 * - get random category Ids
 * - get data for each category
 * - create HTML table
 * */

async function setupAndStart() {
    showLoadingView(); //show loading view when started
    try{
      const categoryIds = await getCategoryIds(); //gets ids
      const categories = await Promise.all(categoryIds.map(getCategory)); //gets category data for each id
      fillTable(categories); //fill the table with these and data
      document.getElementById("jeopardy").addEventListener("click",(event)=>
      handleClick(event,categories)); //calls back handle click function on setupandstart for the table
    }catch(error){
      console.error("error in startup",error);
      //hideLoadingView();
    }finally{
      hideLoadingView(); //hide is afterwards table is displayed
    }
}



/** On click of start / restart button, set up game. */
//document.addEventListener("DOMContentLoaded",function(){
//    const startButton = document.getElementById("start");
//    startButton.addEventListener("click",setupAndStart);
//});
// TODO
//setupAndStart();
/** On page load, add event handler for clicking clues */

// TODO