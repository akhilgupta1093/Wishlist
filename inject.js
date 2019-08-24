chrome.runtime.onMessage.addListener(function (request) {
  var website = getWebsiteName(request)
  var imageCollection = document.images
  var itemText = document.title

  var textArr = itemText.split(" ")
  var index = Math.floor(textArr.length / 2)
  var middleWords = textArr[index]
  middleWords = middleWords.replace(/[^A-Za-z0-9 -]/gi, '')

  var re = new RegExp(middleWords, i)

  var found = ''
  for (var i = 0; i < imageCollection.length; i++) {
    if (re.test(imageCollection[i].alt)) {
      found = imageCollection[i].src
      break
    }
  }

  var ret = {}
  var present = false
  chrome.storage.sync.get(website, function (storageHash) {
    if (storageHash && storageHash[website]) {
      var stuff = [
        itemText,
        request,
        found
      ]
      for (var i = 0; i < storageHash[website].length; i++) {
        if (storageHash[website][i][0] === stuff[0]) {
          present = true
        }
      }
      if (!present) {
        storageHash[website].push(stuff)
      }
      ret = storageHash
    } else {
      ret[website] = []
      ret[website].push([
        itemText,
        request,
        found
      ])
    }

    chrome.storage.sync.set(ret, function () {
      console.log("saved")
    })
  })

  return Promise.resolve('dummy response')
})

function getWebsiteName (request) {
  var index = request.indexOf('.')
  var index2 = request.indexOf('.', index + 1)
  var name = request.substring(index + 1, index2)
  return name.charAt(0).toUpperCase() + name.slice(1)
}
