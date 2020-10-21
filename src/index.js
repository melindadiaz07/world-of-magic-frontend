const creaturesURL = "http://localhost:3000/creatures"
const usersURL = "http://localhost:3000/users"
const housesURL = "http://localhost:3000/houses"
const spellsURL = "http://localhost:3000/spells"

const mainContentDiv = document.querySelector('#main-content')
const mainContentMessage = document.querySelector("#main-content-message")
const mainContentImageDiv = document.querySelector("#main-content-image-div")
const bodyBackground = document.querySelector('.body-content')
const spellUl = document.querySelector("#spells-ul")


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
  userLink.className = 'character-button'
  
  document.querySelector(`#character-${firstName}-link`).addEventListener("click", (event) => {
    renderEncounter(event, user, house)
  })
}


function newUserForm(event){
  event.preventDefault();
  let newUserName = document.querySelector(".new-user-name").value
  let newHouse = Math.floor(Math.random()*4 +1)

  document.querySelector("#form-form").reset()

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
    newUserA.className = "character-button"
   
    fetch(housesURL+`/${newHouse}`)
    .then(res => res.json())
    .then(house => {
      renderEncounter(event, newUser, house)
    })
  });
}


function welcomeMessage(){
  mainContentMessage.innerText = "Put welcome message here"
}



function renderEncounter(event, user, house){
  event.preventDefault()

  let lives = user.lives
  

  renderPotions(user.lives)

  let oldForm = document.querySelector('#form-form')
  oldForm.hidden = true
  
  let characterButtons = document.querySelectorAll('.character-button')
  characterButtons.forEach(characterButton =>{
    characterButton.hidden = true;
  })
  let dropButtons = document.querySelectorAll(".dropbtn")
  dropButtons.forEach(button =>{
    button.hidden = true
  })

  fetch(creaturesURL)
  .then(res => res.json())
  .then(creatureArray => {
    let randomCreature = creatureArray[Math.floor(Math.random()*creatureArray.length)]
    renderCreatureAndBackground(randomCreature)
  
      creatureEncounterLogic(user, house, randomCreature)
  })
};
  


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


function renderPotions(lives){
  for (let i = 1; i <= lives; i++){
    let potion = document.querySelector(`#potion-${i}`)
    potion.hidden = false
  }
}




function creatureEncounterLogic(user, house, creature){
  
  lives = user.lives
  let housePoints = house.points
  let creatureHealth = creature.health
  let creaturePoints = creature.points
  let turn = 1
  let userSpellsList


  fetch(spellsURL)
  .then(res => res.json())
  .then(spellArray => {

    let spellIndexArray = []
    for (let i = 0; i < 5; i++) {
      let randomSpellIndex = Math.floor(Math.random()*spellArray.length)
      spellIndexArray.push(randomSpellIndex)
    }
    let usersSpells = []
    spellIndexArray.forEach(index => {
      usersSpells.push(spellArray[index])
    })
      userSpellsList = usersSpells
      renderSpells(usersSpells)
      
    })


    function renderSpells(spells){
      
      spellUl.hidden = false
      

      spells.forEach(spell => {
        let spellPTag = document.createElement("p")
        spellPTag.innerText = spell.name
        spellPTag.id = `spell-item-${spell.id}`
        spellPTag.className = 'spell-item'
        spellPTag.dataset.damage = `${spell.damage}`
        spellUl.append(spellPTag)
        
        spellPTag.addEventListener('click', (event) => {
          if (turn == 1) {
          castSpell1(event)
          } else if (turn == 2){
            castSpell2(event)
          } else {
            castSpell3(event)
          }
        })
      })
    }
      

  
    function castSpell1(event){
      event.preventDefault()
       console.log(event.target)
      
        event.currentTarget.remove()
        let damage = event.target.dataset.damage
      creatureHealth = creatureHealth - damage

      if (creatureHealth < 0) {
        userWins(creature, house, user)
      } else {
        mainContentMessage.innerText = "Your spell wasn't powerful enough! Cast again."
        turn = 2 
        }
      }

      function castSpell2(event){
        event.currentTarget.remove()

        let damage = event.target.dataset.damage
        creatureHealth = creatureHealth - damage

        if (creatureHealth < 0) {
          userWins(creature, house, user)
        } else {
          mainContentMessage.innerText = "Your spell wasn't powerful enough! Cast again."
        turn = 3
       }
      }

      function castSpell3(event){
        
        let damage = event.target.dataset.damage
        creatureHealth = creatureHealth - damage
        
        if (creatureHealth < 0) {
          userWins(creature, house, user)
        } else {
          creatureWins(event, user, house, creature)
       }
      }
    }
  



function userWins(creature, house, user){

  let points = creature.points
  console.log('you win')

  // fetch patch to update house points in backend
    // based on creature.points

    // show message "you earned ${points} for ${house} 
    // by sending the ${creature} back to the forbidden forrest"
    // create event listner so user clicks to find a new creature - pass event into -
    // renderEncounter(event, user, house)

}

function creatureWins(event, user, house, creature){
  
  spellUl.hidden = true

  mainContentImageDiv.hidden = true
  mainContentMessage.innerText = "Your spell wasn't powerful enough! The creature attacks and escapes."

  if (lives == 0) {
    userDies(house, creature)
  } else {

    
 // render a button with the current magical item you can use to revive yourself

  // fetch patch to update character's lives in backend
  
  //show message about magical item they used then
  // add event listener so user can click on button to continue

  // renderEncounter(event, user, house)
  // if user loses last life, go to last life function
  }
    
}

function userDies(){
  // fetch patch to update house points (lose 100?)
  // rerender page to front page
  // fetch patch to return users lives to 5
}
