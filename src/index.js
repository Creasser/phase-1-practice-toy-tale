let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });
});

//Adding all current toys in the db.json to the DOM. Starts here
function fetchAllToys(){
  fetch('http://localhost:3000/toys')
  .then(resp => resp.json())
  .then(toyData => initialize(toyData))
}

const toyContainer = document.getElementById('toy-collection')

function addOneToyCard(toy){
  let card = document.createElement('div')
  card.className = 'card'
  card.innerHTML = `
  <h2>${toy.name}</h2>
  <img src ='${toy.image}' class='toy-avatar' />
  <p>${toy.likes}</p>
  <button class='like-btn' id='${toy.id}'>Like ❤️</button>
  `
  toyContainer.appendChild(card)
  let likeBtn = document.getElementById(`${toy.id}`)
  likeBtn.addEventListener('click', () => {
    toy.likes += 1
    card.querySelector('p').textContent = toy.likes
    sendLikesToServer(toy)
  })
}

function initialize(toyData){
  toyData.forEach(toy => addOneToyCard(toy))
}
fetchAllToys()
//END
//Adding a new toy using POST starts here.

let form = document.querySelector('form')
let toyForm = document.querySelector('.container')
form.addEventListener('submit', createNewToy)

function createNewToy(e){
  e.preventDefault()
  let toyObj = {
    'name': e.target.name.value,
    'image': e.target.image.value,
    'likes': 0,
  }
  submitNewToy(toyObj)
}

function submitNewToy(toyObj){
  console.log(toyObj)
  fetch('http://localhost:3000/toys',{
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    body:JSON.stringify(toyObj)
  })
  .then(resp => resp.json())
  .then(toy => addOneToyCard(toy))
}

function sendLikesToServer(toy){
  fetch(`http://localhost:3000/toys/${toy.id}`,{
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(toy)
  })
  .then(resp => resp.json())
  .then(data => console.log(data))
}