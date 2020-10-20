const creaturesURL = "http://localhost:3000/creatures"
const usersURL = "http://localhost:3000/users"
const housesURL = "http://localhost:3000/houses"

const mainContentDiv = document.querySelector('#main-content')
const mainContentMessage = document.querySelector("#main-content-message")
const mainContentImageDiv = document.querySelector("#main-content-image-div")
const bodyBackground = document.querySelector('.body-content')



document.addEventListener("DOMContentLoaded", () => {
  getHouses()
  document.querySelector(".new-submit-button").addEventListener('click', (event) => {
    newUserForm(event)
  });
  welcomeMessage()
  
})

function getHouses(){
  fetch(housesURL)
  .then(res => res.json())
  .then(houseData => houseData.forEach(house => renderHouse(house)))
}

function renderHouse(house){
  
  let headerDiv = document.querySelector('#header')

  let houseDiv = document.createElement('div')
  headerDiv.append(houseDiv)

  houseDiv.id = `${house.name}-header`
  let houseTitleEl = document.createElement('h2')
  houseTitleEl.textContent = house.name
  houseDiv.append(houseTitleEl)
  houseDiv.id = `${house.name}-title`

  let pointsEl = document.createElement('p')
  pointsEl.innerText = `Points: ${house.points}`
  pointsEl.className = "points-p"
  pointsEl.id = `${house.name}-points`
  houseDiv.append(pointsEl)

  let dropdownDiv = document.createElement('div')
  dropdownDiv.className = "dropdown"
  houseDiv.append(dropdownDiv)

  let houseUserList = document.createElement('div')
  houseUserList.id = `ul-${house.id}-house`
  houseUserList.className = "dropdown-content"

  let dropdownBtn = document.createElement('button')
  dropdownBtn.className = 'dropbtn'
  dropdownBtn.innerText = "Students"

  dropdownDiv.append(dropdownBtn)
  dropdownDiv.append(houseUserList)

  house.users.forEach(singleUser => {
    renderUserList(singleUser, house)
  });
}

function renderUserList(user, house){
  let userListDiv = document.querySelector(`#ul-${house.id}-house`)
  let firstName = user.name.replace(/\s+/g, '')
  
  let userLink = document.createElement("a")
  userListDiv.append(userLink)
  userLink.innerText = user.name
  userLink.id = `character-${firstName}-link`
  userLink.href = '#'
  

  document.querySelector(`#character-${firstName}-link`).addEventListener("click", (event) => {
    renderEncounter(event, user, house)
  })
}

function newUserForm(event){
  event.preventDefault();
  let newUserName = document.querySelector(".new-user-name").value
  let newHouse = Math.floor(Math.random()*4 +1)
  
  fetch(usersURL, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({name: newUserName, house_id: newHouse})
  })
  .then(res => res.json())
  .then(newUser => {
    let houseUl = document.querySelector(`#ul-${newHouse}-house`)
    let newUserA = document.createElement("a")
    newUserA.innerText = newUser.name
    houseUl.append(newUserA)
  });
}

function welcomeMessage(){

  mainContentMessage.innerText = "Put welcome message here"
 
}

function renderEncounter(event, user, house){
  event.preventDefault()
  // renderSpells()
  // renderCreature()
  // renderLives(user)
  // creatureEncounterLogic(user, house)
  fetch(creaturesURL)
  .then(res => res.json())
  .then(creatureArray => {
    let randomCreature = creatureArray[Math.floor(Math.random()*creatureArray.length)]
    renderCreatureAndBackground(randomCreature)
  });
  
}

function renderCreatureAndBackground(creature){
 
  let randomBackground = Math.floor(Math.random()*7 +1)
  mainContentImageDiv.id = `${creature.name}-image`
  bodyBackground.className = `background-${randomBackground}`

  let locationName
  switch (randomBackground) {
    case 1: 
      locationName = "the Library"
      break;
    case 2:
      locationName = "the Great Hall"
      break;
    case 3:
      locationName = "the Slytherin Common Room"
      break; 
    case 4:
      locationName = "the Gryffindor Common Room"
      break;
    case 5:
      locationName = "the Forbidden Forrest"
      break;
    case 6:
      locationName = "the corridors"
      break;
    case 7:
      locationName = "the Great Hall"
  }

  
  mainContentMessage.innerText = `You found a ${creature.name} in ${locationName}`
  
}




function creatureEncounterLogic(user, house){
  // let creatureHealth = creature.health

  // if creature's health = 0 
}

  
// function renderLives(user){
//   show number of potions based on lives
//   case list? .hidden attribute?
// }
