const creaturesURL = "http://localhost:3000/creatures"
const usersURL = "http://localhost:3000/users"
const housesURL = "http://localhost:3000/houses"


document.addEventListener("DOMContentLoaded", () => {
  getHouses()
  document.querySelector(".new-submit-button").addEventListener('click', () => {
    newUserForm(event)
  });
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
  houseDiv.append(pointsEl)

  let houseUserUl = document.createElement('ul')
  houseUserUl.id = `ul-${house.id}-house`
  houseDiv.append(houseUserUl)

  house.users.forEach(singleUser => {
    renderUserList(singleUser, house)
  });
}

function renderUserList(user, house){
  let userUl = document.querySelector(`#ul-${house.id}-house`)
  // console.log(userUl)
  let userLi = document.createElement("li")
  userUl.append(userLi)
  userLi.innerText = user.name
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
    let newUserLi = document.createElement("li")
    newUserLi.innerText = newUser.name
    houseUl.append(newUserLi)
  });
}