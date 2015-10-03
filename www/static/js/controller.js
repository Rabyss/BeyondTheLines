"use strict"

if (document.readyState !== 'loading') {
	run()
} else {
	document.addEventListener('DOMContentLoaded', run)
}

function showTab(tabName) {
	var tabs = document.querySelectorAll('.tab')
	for (var i = 0; i < tabs.length; i++) {
		tabs[i].style.display = 'none';
	}

	var tab = document.querySelector(tabName)

	tab.style.display = 'block';
}

function removeActiveClass() {
	var headers = document.querySelectorAll('#tabs-header h3')
	for (var i = 0; i < headers.length; i++) {
		headers[i].classList.remove('active')
	}
}

// Add a pin on the big triangle
function addPin(x, y, data) {
	var triangle = document.querySelector('#triangle')

	var pin = document.createElement('div')
	pin.classList.add('pin')
	var coords = pattern2html(x, y)
	pin.style.left = coords.x + 'px'
	pin.style.top = coords.y + 'px'
	
	var info = document.createElement('div')
	info.classList.add('info')
	var infoContent = document.createTextNode(data)

	info.appendChild(infoContent)
	pin.appendChild(info)
	triangle.appendChild(pin)
}

// Convert form API coords to coords in the big triangle
function pattern2html(x, y) {
	var triangle = document.querySelector('#triangle')
	var w = triangle.offsetWidth
	var h = triangle.offsetHeight

	return {
		x: (x + 1) / 2 * w,
		y: (1 - y) * h
	}
}

function boxPlot(avg, deviation, min, max, parent) {
	var div = document.querySelector(parent)
	var width = div.offsetWidth
	
	var avgPos = ((avg - min) / (max - min)) * width
	var boxLeftPos = ((avg - deviation - min) / (max - min)) * width
	var boxWidth = ((avg + deviation - min) / (max - min)) * width - boxLeftPos

	var box = document.createElement('div')
	box.classList.add('box')
	box.style.left =  boxLeftPos + 'px'
	box.style.width = boxWidth + 'px'

	var avgDiv = document.createElement('div')
	avgDiv.classList.add('avg')
	avgDiv.style.left =  avgPos + 'px'

	div.appendChild(box)
	div.appendChild(avgDiv)
}

function modality(avg, deviation) {
	boxPlot(avg, deviation, -1, 1, '#modality')
}

function wordPerSentence(avg, deviation) {
	boxPlot(avg, deviation, 0, 100, '#word-per-sentence')
}

function handleData(data) {
	addPin(data.polarity[0], data.subjectivity[0])
	wordPerSentence(data.wordPerSentence[0], data.wordPerSentence[1])
	modality(data.modality[0], data.modality[1])
}

function show(div) {
	div.style.display = "block"
}

function hide(div) {
	div.style.display = "none"
}

function run() {
	var spinner = document.querySelector("#spinner")
	var error = document.querySelector("#error")

	var tabText = document.querySelector('#tab-text')
	tabText.addEventListener('click', function () {
		hide(error)
		hide(spinner)
		showTab('#form-text')
		removeActiveClass()
		tabText.classList.add('active')
	})

	var tabWebpage = document.querySelector('#tab-webpage')
	tabWebpage.addEventListener('click', function () {
		hide(error)
		hide(spinner)
		showTab('#form-webpage')
		removeActiveClass()
		tabWebpage.classList.add('active')
	})

	var tabWebsite = document.querySelector('#tab-website')
	tabWebsite.addEventListener('click', function () {
		hide(error)
		hide(spinner)
		showTab('#form-website')
		removeActiveClass()
		tabWebsite.classList.add('active')
	})

	var buttonText = document.querySelector('#form-text button')
	buttonText.addEventListener('click', function (event) {
		event.preventDefault()
		hide(error)
		show(spinner)
		var form = document.querySelector("#form-text")
		fetch('/api/text', {
			method: 'post',
			body: new FormData(form)
		}).then(function(response) {
			hide(spinner)
			if (response.status != 200) {
				show(error)
				return ""
			}
    		return response.json()
  		}).then(function(json) {
  			if (json != "") {
				handleData(json)
			}
		}).catch(function(ex) {
			console.log('parsing failed', ex)
		})
	})

	var buttonPage = document.querySelector("#form-webpage button")
	buttonPage.addEventListener('click', function (event) {
		event.preventDefault()
		hide(error)
		show(spinner)
		var inputUrl = document.querySelector("#form-webpage #urlpage").value
		fetch('/api/webpage?url=' + inputUrl).then(function(response) {
			hide(spinner)
			if (response.status != 200) {
				show(error)
				return ""
			}
    		return response.json()
  		}).then(function(json) {
  			if (json != "") {
				handleData(json)
			}
		}).catch(function(ex) {
			console.log('parsing failed', ex)
		})
	})

	var buttonSite = document.querySelector("#form-website button")
	buttonSite.addEventListener('click', function (event) {
		event.preventDefault()
		hide(error)
		show(spinner)
		var inputUrl = document.querySelector("#form-website #urlsite").value
		var inputTopic = document.querySelector("#form-website #topic").value
		var inputNumber = document.querySelector("#form-website #numberResults").value
		fetch('/api/website?url=' + inputUrl 
			+ '&topic=' + inputTopic 
			+ "&quantity=" + inputNumber).then(function(response) {
			hide(spinner)
			if (response.status != 200) {
				show(error)
				return ""
			}
    		return response.json()
  		}).then(function(json) {
  			if (json != "") {
				handleData(json)
			}
		}).catch(function(ex) {
			console.log('parsing failed', ex)
		})
	})

	setTimeout(function () {
		handleData({
			"polarity": [
				0.07293211129148629,
				0.2174031579455767
			],
			"positivity": [
				0.20833333333333334,
				0.4061164310337067
			],
			"wordPerSentence": [
				28.604166666666668,
				11.501339746839157
			],
			"subjectivity": [
				0.07293211129148629,
				0.2174031579455767
			],
			"modality": [
				0.6422299488705738,
				0.3142989273647446
			],
			"moods": {
				"conditional": 10,
				"indicative": 37,
				"subjunctive": 1
			}
		})
	}, 100)
}