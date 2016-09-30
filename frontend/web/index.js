var URL = 'http://localhost:4567/api'

function $(sel) {
  return document.querySelector(sel)
}

function $$(sel) {
  return [].slice.call(document.querySelectorAll(sel))
}

function throttle(fn, delay) {
  let timer = null;

  return function() {
    var args = arguments;

    clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, args)
    }, delay)
  }
}

function createXhrObj() {
  var XMLHttpFactories = [
    () => new XMLHttpRequest(),
    () => new ActiveXObject("Msxml2.XMLHTTP"),
    () => new ActiveXObject("Msxml3.XMLHTTP"),
    () => new ActiveXObject("Microsoft.XMLHTTP")
  ];

  var xmlhttp = false;
 
  for (let i = 0; i < XMLHttpFactories.length; i++) {
    try {
     xmlhttp = XMLHttpFactories[i]();
    } catch (e) {
     continue;
    }
   
    break;
  }
  return xmlhttp;
}

function get(url) {
  let xhr = createXhrObj();

  if(!xhr) return Promise.reject("Error");
  return new Promise((resolve, reject) => {
    xhr.open('GET', url, true);
    xhr.onload = function() {
      try { resolve(JSON.parse(xhr.responseText)) } catch(e) { reject(xhr.responseText) }
    }
    xhr.onerror = function() { reject('Ajax Error') }
    xhr.send()
  })
}

function makeList(data) {
  let ul = document.createElement('ul')
  ul.className = 'audio-list';
  
  data.forEach(d => {
    let li = document.createElement('li')
    li.className = 'audio'
    li.innerHTML = d.text
    li.dataset.v = d.vid
    
    ul.appendChild(li)
  })

  return ul;
}

$('#search_button').addEventListener('click', function() {
  let text = $('#search_text').value;

  get(`${URL}/search?query=${text}`).then(v => {
    console.log(v);

    if(v.error) {}
    else {
      let docfrag = document.createDocumentFragment()
      docfrag.appendChild(makeList(v.data));
    
      $('.audio-list-container').innerHTML = ""
      $('.audio-list-container').appendChild(docfrag)
    }
  }).catch(e => { console.log(e) })
})

$('.audio-list-container').addEventListener('click', function(e) {
  if(e.target.tagName == 'LI') {
    let v = e.target.dataset.v
    
    $('.player audio').src = `http://localhost:4567/api/music?video_id=${v}`
  }
})

