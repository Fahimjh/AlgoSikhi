//firstRow
let arrayBox = document.querySelector(".arrayIntro");
let sortBox = document.querySelector(".sort");
let searchBox = document.querySelector(".search");
let updateBox = document.querySelector(".updation");

arrayBox.addEventListener("click",()=>{
    window.location.href="array.html";
});
sortBox.addEventListener("click",()=>{
    window.location.href="arraySort.html";
});
searchBox.addEventListener("click",()=>{
    window.location.href="arraySearch.html";
});
updateBox.addEventListener("click",()=>{
    window.location.href="arrayUpdate.html";
});


//SecondRow
let vectorBox = document.querySelector(".vectorIntro");
vectorBox.addEventListener("click",()=>{
    window.location.href="vector.html";
});