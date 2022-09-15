const BASE_URL = `https://lighthouse-user-api.herokuapp.com/`
const INDEX_URL = BASE_URL + `api/v1/users/`
const DATA_PANEL = document.querySelector('#data-panel')
const MEMBER_LISTS = JSON.parse(localStorage.getItem('followMember')) || []

// 渲染畫面
displayUserList(MEMBER_LISTS)

// userlist印出來
function displayUserList(items) {
  let htmlContent = ''
  items.forEach((item) => {
    htmlContent +=
      `<div class="col-sm-2" id="user-info" >
    <div class="card m-2" style="width: 12rem;">
      <img src="${item.avatar}" class="card-img-top " alt="userImg" id="user-avatar">
      <div class="card-body">
        <p class="card-text" id="user-name">${item.name}</p>
        <button class="btn btn-sm btn-show-info" data-bs-toggle="modal" data-bs-target="#user-modal"data-id="${item.id}">More info</button>
        <button class="btn btn-outline-danger btn-sm btn-add-follower add-color" data-id="${item.id}">♡</button>
      </div>
    </div>
  </div>
  `
  })
  DATA_PANEL.innerHTML = htmlContent
}

//點擊監聽

DATA_PANEL.addEventListener('click', function onPanelClicked(event) {
  if (event.target.matches('.btn-show-info')) {
    showUserModal(Number(event.target.dataset.id))
  } else if (event.target.matches('.btn-add-follower')) {
    delToFollowList(Number(event.target.dataset.id))
    event.target.classList.remove('add-color')
  }
})



// 函式顯示 Modal

function showUserModal(id) {
  const modalUserName = document.querySelector('#user-modal-name')
  const modalUserAvatar = document.querySelector('#user-modal-avatar')
  const modalUserAge = document.querySelector('#user-modal-age')
  const modalUserGender = document.querySelector('#user-modal-gender')
  const modalUserBir = document.querySelector('#user-modal-bir')
  const modalUserReg = document.querySelector('#user-modal-region')
  const modalUserMail = document.querySelector('#user-modal-mail')

  axios
    .get(INDEX_URL + id)
    .then(response => {
      let data = response.data
      // console.log(data)
      modalUserName.innerText = `${data.name} ${data.surname}`
      modalUserAvatar.innerHTML = `<img src="${data.avatar}" alt="avatar" class="img-fuid">`
      modalUserAge.innerText = `Age：${data.age}`
      modalUserGender.innerText = `Gender：${data.gender}`
      modalUserBir.innerText = `Birthday：${data.birthday}`
      modalUserReg.innerText = `Region：${data.region}`
      modalUserMail.innerHTML = `email：<a href="mailto:">${data.email}</a>`
    })
}


function delToFollowList(id) {
  if (!MEMBER_LISTS || !MEMBER_LISTS.length) return //例外如果沒有成員清單加入的話中斷
  const memberIndex = MEMBER_LISTS.findIndex(member => member.id === id)
  MEMBER_LISTS.splice(MEMBER_LISTS, 1) // 刪除該成員
  if (memberIndex === -1) return // 例外如果搜尋成員沒有在清單內的話中斷
  localStorage.setItem('followMember', JSON.stringify(MEMBER_LISTS)) //更新localstorage
  displayUserList(MEMBER_LISTS)  // 重新渲染成員
}