const creaturesURL = "http://localhost:3000/creatures"
const usersURL = "http://localhost:3000/users"
const housesURL = "http://localhost:3000/houses"
const spellsURL = "http://localhost:3000/spells"

const mainContentDiv = document.querySelector('#main-content')
const mainContentMessage = document.querySelector("#main-content-message")
const mainContentImageDiv = document.querySelector("#main-content-image-div")
const bodyBackground = document.querySelector('.body-content')
const spellUl = document.querySelector("#spells-ul")
const creatureWonButton = document.querySelector('#creature-won-button')
const userWonButton = document.querySelector('#user-won-button')
const potionImages = document.querySelectorAll('.potion-img')
const useMagicalItem = document.querySelector('#use-magical-item')
const hospitalWingButton = document.querySelector('#hospital-wing-button')
let newHousePoints
let creaturePoints



document.addEventListener("DOMContentLoaded", () => {
  getHouses()
  document.querySelector("#form-sorting-hat").addEventListener('click', (event) => {
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
  // houseTitleEl.textContent = house.name
  houseDiv.append(houseTitleEl)
  houseDiv.id = `${house.name}-title`

  let pointsEl = document.createElement('p')
  pointsEl.innerHTML = `Points: ${house.points}`
  pointsEl.className = "points-p"
  pointsEl.id = `${house.name}-points`
  houseDiv.append(pointsEl)

  let dropdownDiv = document.createElement('div')
  dropdownDiv.className = "dropdown"
  dropdownDiv.id = `${house.name}-dropbtn`
  houseDiv.append(dropdownDiv)
  

  let houseUserList = document.createElement('div')
  houseUserList.id = `ul-${house.id}-house`
  houseUserList.className = "dropdown-content"

  let dropdownBtn = document.createElement('button')

  // dropdownClass.classList.add(`${house.name}-dropbtn`)
  dropdownBtn.classList.add("dropbtn")
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
  mainContentMessage.innerHTML = "Welcome to the World of Magic!<br>We have dangerous creatures wandering Hogwarts and I need your help to send them back to the Forbidden Forrest. Choose your character or create your own. You will play for your house and gain as many points as you can. <br> Beware! If you lose all five lives, you shall lose 100 points for your house. <br> We are only as strong as we are united, as weak as we are divided. So go forth and fend for your house!"
}



function renderEncounter(event, user, house){
  event.preventDefault()


  let lives = user.lives
  
  fetch(housesURL+`/${house.id}`)
    .then(res => res.json())
    .then(house => {
      newHousePoints = house.points
    })
  



  creatureWonButton.hidden = true
  userWonButton.hidden = true
  useMagicalItem.hidden = true
  useMagicalItem.style.zIndex = "1"

  mainContentImageDiv.hidden = false

  renderPotions(user.lives)

  let newUserFormHide = document.querySelector("#new-user-form")
  newUserFormHide.hidden = true

  let oldForm = document.querySelector('#form-form')
  oldForm.hidden = true
  
  let dropDownClass2 = document.querySelectorAll(".dropdown")
  dropDownClass2.forEach(singleDD => singleDD.classList.remove("dropdown"))

  dropDownClass2.forEach(singleDD => singleDD.style.visibility = "hidden")

  let characterButtons = document.querySelectorAll('.character-button')
  characterButtons.forEach(characterButton =>{
    characterButton.hidden = true;
  })
  let dropButtons = document.querySelectorAll(".dropbtn")
  dropButtons.forEach(button =>{
    button.style.visibility = "hidden"
  })

  let housesButton = document.querySelectorAll(`#${house.name}-dropbtn`)
  housesButton.forEach(houseButton => 
  houseButton.hidden = true)

  let userButtons = document.querySelectorAll(".dropdown-content")
  userButtons.forEach(singleButton => 
  singleButton.hidden = true)


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
      locationName = "the Corridors"
      break;
    case 7:
      locationName = "the Great Hall"
  }
  mainContentMessage.innerText = `You found a ${creature.name} in ${locationName}`
}



function renderPotions(lives){
  potionImages.forEach(potion => {
    potion.hidden = true
  })
  for (let i = 1; i <= lives; i++){
    let potion = document.querySelector(`#potion-${i}`)
    potion.hidden = false
  }
}

function creatureEncounterLogic(user, house, creature){

  creaturePoints = creature.points
  
  
  lives = user.lives
  
  let creatureHealth = creature.health
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
      spellUl.innerHTML = ""
      
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


  
  creaturePoints = creature.points
  newHousePoints = (creature.points)+(house.points)
  

  spellUl.hidden = true
  spellUl.innerHTML = ""
  creaturePoints = creature.points
  

  mainContentImageDiv.id = "main-content-image-div"
  mainContentMessage.innerText = `Nice spellcasting! You sent the ${creature.name} 
                                  back to the Forbidden Forrest. ${creature.points} points to ${house.name}`

  let housePointsText = document.querySelector(`#${house.name}-points`)
  housePointsText.innerHTML = `Points: ${(creature.points)+(house.points)}<br><br><br><br><br>`                                 

 userWonButton.hidden = false


fetch(housesURL+`/${house.id}`, {
  method: 'PATCH',
  headers: {"Content-Type": "application/json",
            "Accept": "application/json"},
  body: JSON.stringify({ points: `${newHousePoints}`})
})
.then(houseData => {
  let housePointsText = document.querySelector(`#${house.name}-points`)
  housePointsText.innerHTML = `Points: ${(creature.points)+(house.points)}<br><br><br><br><br>`

  userWonButton.addEventListener('click', (event) => {

  fetch(housesURL+`/${house.id}`)
  .then(res => res.json())
  .then(house => {
    newHousePoints = house.points
    renderEncounter(event, user, house)
  })

    })
 })
}



function creatureWins(event, user, house, creature){

  newLives = (user.lives)-1
  
  spellUl.hidden = true
  spellUl.innerHTML = ""

  mainContentImageDiv.hidden = true
  mainContentMessage.innerText = `Your spell wasn't powerful enough! The ${creature.name} attacks and escapes.`

  if (lives === 0) {
    userDies(house, user)
  } else {

    let itemSource
    let message

    switch (user.lives) {
      case 5: 
        itemSource = "assets/potions/horcrux.gif"
        message = "Drink your potion to be revived"
        break;
        case 4: 
        message = "Drink your butterbeer to be revived"
        itemSource = "assets/potions/butterbeer.gif"
        break; 
        case 3: 
        message = "Use your time-turner to roll back the clock"
        itemSource = "assets/potions/timeturner.gif"
        break; 
        case 2: 
        message = "Use your magical ring to dissappear"
        itemSource = "assets/potions/ring.gif"
        break; 
        case 1: 
        message = "Drink your felix felices potion to get better luck"
        itemSource = "assets/potions/felix.gif"
      }

creatureWonButton.hidden = false
creatureWonButton.innerText = `${message} and keep searching for creatures.`
useMagicalItem.hidden = false
useMagicalItem.style.zIndex = "2"
useMagicalItem.src = itemSource

   
  fetch(usersURL+`/${user.id}`, {
    method: 'PATCH',
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ lives: `${newLives}`})
  })
  .then(res => res.json())
  .then(user => {
    
    creatureWonButton.addEventListener('click', (event) => {
      renderEncounter(event, user, house)
      })
    })
  }
}


function userDies(house, user){

  let lowerPoints = (house.points) - 100
  if (lowerPoints < 0 ) {
    lowerPoints = 0
  }

  fetch(usersURL+`/${user.id}`, {
    method: 'PATCH',
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ lives: 5 })
  })
  .then(res => res.json())
  .then(user => {
    
  fetch(housesURL+`/${house.id}`, {
    method: 'PATCH',
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ points: `${lowerPoints}`})
  })
  .then(houseData => {
    
    let housePointsEl = document.querySelector(`#${house.name}-points`)
    housePointsEl.innerHTML = `Points: ${lowerPoints}`
    hospitalWingButton.hidden = false

    mainContentMessage.innerText = `Looks like you're out of magical items and that last creature did you in. 
                                    100 points from ${house.name}, and you better let Madam Pomfrey look at those wounds.`
    mainContentImageDiv.id = 'main-content-image-div'
    mainContentImageDiv.hidden = false
 
    hospitalWingButton.addEventListener('click', (event) => {
      location.reload()
      })
   })
  })
  
}


