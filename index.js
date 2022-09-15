const BASE_URL = `https://lighthouse-user-api.herokuapp.com/`
const INDEX_URL = BASE_URL + `api/v1/users/`
const DATA_PANEL = document.querySelector('#data-panel')
const MEMBER_LISTS = []
const SEARCH_FORM = document.querySelector('#search-form')
const SEARCH_INPUT = document.querySelector('#search-input')
const PAGINATOR = document.querySelector('.pagination')
const MEMBER_PER_PAGE = 18
// null就是false，所以若list內沒資料會先以空陣列為值，之後有內容後會以左邊優先
// 拿出來變全域因為其他地方用的到
const list = JSON.parse(localStorage.getItem('followMember')) || []
let filterMembers = []
let page = 1



// 抓user資料
axios
  .get(INDEX_URL)
  .then(response => {
    let data = response.data.results
    MEMBER_LISTS.push(...data)
    displayUserList(getMemberByPage(1))
    displayPaginator(MEMBER_LISTS.length)
  })
  .catch((err) => console.log(err))

// userlist印出來

function displayUserList(items) {
  let htmlContent = ''
  items.forEach((item) => {
    // 如果用find找到就會中斷迭代，所以用some他會全部跑一遍。
    if (list.some(list => list.id === item.id)) {
      htmlContent +=
        `<div class="col-sm-2" id="user-info" >
    <div class="card m-2" style="width: 12rem;">
      <img src="${item.avatar}" class="card-img-top " alt="userImg" id="user-avatar">
      <div class="card-body">
        <p class="card-text" id="user-name">${item.name}</p>
        <button class="btn btn-sm btn-show-info" data-bs-toggle="modal" data-bs-target="#user-modal" data-id="${item.id}">More info</button>
        <button class="btn btn-outline-danger btn-sm btn-add-follower add-color" data-id="${item.id}">♡</button>
      </div>
    </div>
  </div>
  `
    } else {
      htmlContent +=
        `<div class="col-sm-2" id="user-info" >
    <div class="card m-2" style="width: 12rem;">
      <img src="${item.avatar}" class="card-img-top " alt="userImg" id="user-avatar">
      <div class="card-body">
        <p class="card-text" id="user-name">${item.name}</p>
        <button class="btn btn-sm btn-show-info" data-bs-toggle="modal" data-bs-target="#user-modal" data-id="${item.id}">More info</button>
        <button class="btn btn-outline-danger btn-sm btn-add-follower" data-id="${item.id}">♡</button>
      </div>
    </div>
  </div>
  `
    }
  })
  DATA_PANEL.innerHTML = htmlContent
}

// 點擊info監聽
// 監聽這裡match follower後判斷是否有add-color,有就刪除追蹤，沒有就加入追蹤
DATA_PANEL.addEventListener('click', function onPanelClicked(event) {
  if (event.target.matches('.btn-show-info')) {

    showUserModal(Number(event.target.dataset.id)) //抓到該物件id
  } else if (event.target.matches('.btn-add-follower')) {
    if (event.target.matches('.add-color')) {
      delToFollowList(Number(event.target.dataset.id))
      displayUserList(getMemberByPage(page)) // 重新渲染畫面
    } else {
      addToFollowList(Number(event.target.dataset.id))
      displayUserList(getMemberByPage(page)) // 重新渲染畫面
    }
  }
})


// 搜尋監聽
SEARCH_FORM.addEventListener('input', function onSearchFormSumitted(event) { //原本用submit
  event.preventDefault() // 中斷預設行為
  const keyword = SEARCH_INPUT.value.trim().toLowerCase()
  filterMembers = MEMBER_LISTS.filter((member) => member.name.toLowerCase().includes(keyword))
  displayUserList(filterMembers)
  displayPaginator(filterMembers.length)
})

// 點擊分頁器監聽，確認 tagName 是 a 後就抓 dataset 的 page，getMember 確認是第幾頁的成員再 display user 出來
PAGINATOR.addEventListener('click', function onPaginatorClicked(event) {
  if (event.target.tagName !== 'A') return
  page = Number(event.target.dataset.page)
  displayUserList(getMemberByPage(page))
})


// 函式顯示 Modal

function showUserModal(id) {
  const modalUserName = document.querySelector('#user-modal-name')
  const modalBody = document.querySelector('#user-modal-body')
  const memberIndex = MEMBER_LISTS.findIndex(member => member.id === id)
  const data = MEMBER_LISTS[memberIndex]
  modalUserName.innerText = `${data.name} ${data.surname}`
  modalBody.innerHTML = `
      <div class="row">
              <div class="col-sm-3" id='user-modal-avatar'>
                <img src="${data.avatar}" alt="avatar" class="img-fuid">
              </div>
              <div class="col-sm-9">
                <ul>
                  <li id="user-modal-age">Age：${data.age}</li>
                  <li id="user-modal-gender">Gender：${data.gender}</li>
                  <li id="user-modal-bir">Birthday：${data.birthday}</li>
                  <li id="user-modal-region">Region：${data.region}</li>
                  <li id="user-modal-mail">email：<a href="mailto:">${data.email}</li>
                </ul>
              </div>
            </div>
      `


}

// 函式顯示 切割後的成員畫面

function getMemberByPage(page) {
  const data = filterMembers.length ? filterMembers : MEMBER_LISTS
  const startIndex = (page - 1) * MEMBER_PER_PAGE
  return data.slice(startIndex, startIndex + MEMBER_PER_PAGE)
}

// 函式 渲染分頁器，多少Member看可以渲染幾頁

function displayPaginator(amount) {
  const numOfPage = Math.ceil(amount / MEMBER_PER_PAGE)
  let htmlContent = ''
  for (let page = 1; page <= numOfPage; page++) {
    htmlContent += `<li class="page-item" ><a class="page-link" href="#" data-page='${page}'>${page}</a></li>`
  }
  PAGINATOR.innerHTML = htmlContent
}

// 函式 把 follow 放入local storage裡

function addToFollowList(id) {
  const member = MEMBER_LISTS.find(member => member.id === id)
  // if (list.some(member => member.id === id)) {
  //   return alert(`已經追蹤過囉~`)
  // }
  list.push(member)
  localStorage.setItem('followMember', JSON.stringify(list))
  alert(`已加入追蹤`)
}

// 函式 把追蹤取消

function delToFollowList(id) {
  const listIndex = list.findIndex(list => list.id === id)
  if (listIndex < 0) return //如果 index < 0 表示沒東西就中斷
  list.splice(listIndex, 1)
  localStorage.setItem('followMember', JSON.stringify(list))
  alert(`已取消追蹤`)
}