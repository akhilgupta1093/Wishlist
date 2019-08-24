document.addEventListener('DOMContentLoaded', function () {

  const websites = ['Amazon', 'Ebay', 'Walmart', 'Etsy', 'Blinq', 'Target', 'Aliexpress', 'Craigslist']
  homePage()

  document.querySelector('#adding').addEventListener('click', addItem, false)
  document.querySelector('#clearing').addEventListener('click', clearAll, false)

  function addItem () {
    chrome.tabs.query({currentWindow: true, active: true},
    function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, tabs[0].url, function () {
        var header = document.getElementsByClassName('header')[0]
        if (header) {
          createLinkElement(header.innerHTML)
        }
      })
    })
  }

  function clearAll () {
    var r = confirm('Are you sure you want to clear all of your saved items?')
    if (r) {
      chrome.storage.sync.clear(function () {
        console.log('All wishlist items cleared.')
      })
    }
  }

  function goToPage (curr) {
    for (var i = 0; i < websites.length; i++) {
      removeElem(websites[i])
    }
    removeElem('clearing')

    createHeaderandBackArrow(curr)
    document.querySelector('#back').addEventListener('click', backToHome, false)

    createLinkElement(curr)
  }

  function backToHome () {
    homePage()
    removeElem('header')
    removeElem('back')
    clearAllHr()

    createClearAllButton()
    document.querySelector('#clearing').addEventListener('click', clearAll, false)

    clearRemainingItems()
  }

  function homePage () {
    for (var i = 0; i < websites.length; i++) {
      (function () {
        var curr = websites[i]

        createInitialLogos(curr)
        document.querySelector('#' + curr).addEventListener('click', function () {
          goToPage(curr)
        }, false)
      }())
    }
  }

  function createLinkElement (website) {
    chrome.storage.sync.get(website, function (ret) {

      var currWebsite = ret[website]
      var currItem
      if (currWebsite) {
        for (var i = 0; i < currWebsite.length; i++) {
          (function () {
            var currItem = currWebsite[i]

            var words = currItem[0].split(" ")
            var id = words[0] + words[1] + words[2]
            id = id.replace(/[^a-zA-Z]/gi, '')

            if (document.querySelector('#' + id)) {
              return
            }
            var div = document.createElement('div')
            div.id = id
            div.classList.add('item')

            var a = document.createElement('a')
            a.href = currItem[1]
            a.innerHTML = currItem[0]
            a.classList.add('inline')
            a.classList.add('item-link')
            div.appendChild(a)

            var button = document.createElement("button")
            button.classList.add('block')
            button.classList.add('inline')
            button.classList.add('item')
            button.classList.add('delete')
            button.innerHTML = 'Delete'
            var second_id = id.slice(1)
            button.id = second_id
            div.appendChild(button)

            var found = currItem[2]
            if (found) {
              var img = document.createElement("img")
              img.src = found
              img.classList.add('item-image')
              div.appendChild(img)
            }

            document.body.appendChild(div)

            document.querySelector('#' + second_id).addEventListener('click', function () {
              removeElem(id)
              deleteItem(website, currItem)
            }, false)
          }())
        }
      }
    })
  }

}, false)


function deleteItem (website, currItem) {
  chrome.storage.sync.get(website, function (ret) {
    var currWebsite = ret[website]
    for (var i = 0; i < currWebsite.length; i++) {
      if (currWebsite[i][0] === currItem[0]) {
        currWebsite.splice(i, 1)
        ret[website] = currWebsite
        break
      }
    }
    chrome.storage.sync.set(ret, function () {
    })
  })
}

function createInitialLogos (curr) {
  var img = document.createElement("input")
  img.type = 'image'
  img.src = "../icons/"+ curr +"-logo.png"
  img.classList.add('logo')
  img.alt = curr + " logo"
  img.id = curr
  document.body.appendChild(img)
}

function createHeaderandBackArrow (curr) {
  var maindiv = document.createElement('div')

  var back = document.createElement("input")
  back.type = 'image'
  back.src = '../icons/back-arrow.png'
  back.classList.add('back-arrow')
  back.alt = 'back'
  back.id = 'back'
  maindiv.appendChild(back)

  var div = document.createElement('div')
  div.id = 'header'
  div.innerHTML = curr
  div.classList.add('header')
  maindiv.appendChild(div)

  var hr = document.createElement('hr')
  hr.classList.add('hr')
  maindiv.appendChild(hr)

  document.body.appendChild(maindiv)
}

function removeElem (elemId) {
  var elem = document.querySelector('#' + elemId)
  elem.parentNode.removeChild(elem)
}

function createClearAllButton () {
  var button = document.createElement('button')
  button.id = 'clearing'
  button.classList.add('block')
  button.innerHTML = 'Clear All'
  document.querySelector('#buttons').appendChild(button)
}

function clearRemainingItems () {
  var items = document.getElementsByClassName('item')
  while (items[0]) { items[0].parentNode.removeChild(items[0]) }
}

function clearAllHr () {
  var hrs = document.getElementsByClassName('hr')
  while (hrs[0]) { hrs[0].parentNode.removeChild(hrs[0]) }
}
