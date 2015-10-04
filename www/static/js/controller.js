"use strict"

google.load('visualization', '1', {packages: ['corechart', 'bar']});
google.setOnLoadCallback(checkLoaded);

//parties={"conservatives","labour","snp","libdems","dup"}
var parties=["conservatives"]
var newspapers=["guardian","dailytelegraph","times","independent"]
//examples=[{"folder":"political-parties","files":newspapers}]

function loadExample(folder,files)
{
    for (var i = 0; i < files.length; i++) {
	var url="/static/examples/"+folder+"/"+files[i]+".json"
	console.log(url)
	fetch(url)
	    .then(function(response) {
		return response.json()
  	    }).then(function(json) {
		handleData(json)
	    })
    }
}

function checkLoaded() {
	if (document.readyState !== 'loading') {
	run()
	} else {
	document.addEventListener('DOMContentLoaded', run)
	}
}

function shadeColor2(color, percent) {   
	var f=parseInt(color.slice(1),16),t=percent<0?0:255,p=percent<0?percent*-1:percent,R=f>>16,G=f>>8&0x00FF,B=f&0x0000FF;
	return "#"+(0x1000000+(Math.round((t-R)*p)+R)*0x10000+(Math.round((t-G)*p)+G)*0x100+(Math.round((t-B)*p)+B)).toString(16).slice(1);
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
function addPin(x, y, data, color) {
	var triangle = document.querySelector('#triangle')

	var pin = document.createElement('div')
	pin.classList.add('pin')
	var coords = pattern2html(x, y)
	pin.style.left = coords.x + 'px'
	pin.style.top = coords.y + 'px'
	pin.style.background = darken(color)
	
	var info = document.createElement('div')
	info.classList.add('info')
	info.style.background = darken(color)

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

function boxPlot(avg, deviation, min, max, parent, color) {
	var div = document.querySelector(parent)
	var width = div.offsetWidth
	
	var avgPos = ((avg - min) / (max - min)) * width
	var boxLeftPos = ((avg - deviation - min) / (max - min)) * width
	var boxWidth = ((avg + deviation - min) / (max - min)) * width - boxLeftPos

	var boxPlot = document.createElement('div')
	boxPlot.classList.add('boxPlot')

	var box = document.createElement('div')
	box.classList.add('box')
	box.style.left =  boxLeftPos + 'px'
	box.style.width = boxWidth + 'px'
	box.style.background = color

	var avgDiv = document.createElement('div')
	avgDiv.classList.add('avg')
	avgDiv.style.left =  avgPos + 'px'
	avgDiv.style.background = darken(color)

	div.appendChild(boxPlot)
	boxPlot.appendChild(box)
	boxPlot.appendChild(avgDiv)
}

function modality(avg, deviation, color) {
	boxPlot(avg, deviation, -1, 1, '#modality', color)
}

function wordPerSentence(avg, deviation, color) {
	boxPlot(avg, deviation, 0, 100, '#word-per-sentence', color)
}

// FIXME I'm seriously ugly
var moodsInitialized = false
var material
var previousData
function moods(data, color) {
	var options = {
		colors: predefinedColors,
		hAxis: { maxValue: 100 },
		backgroundColor: { fill:'transparent' }
	}

	if (!moodsInitialized) {
		previousData = [
			['', ''],
			['Indicative', data["indicative"]],
			['Imperative', data["imperative"]],
			['Conditonal', data["conditional"]],
			['Subjunctive', data["subjunctive"]]
		]

		var dataTable = google.visualization.arrayToDataTable(previousData);

		material = new google.visualization.BarChart(document.getElementById('mood'))
		material.draw(dataTable, options)
		moodsInitialized = true
	} else {
		var newData = []

		previousData[0].push('')
		previousData[1].push(data["indicative"])
		previousData[2].push(data["imperative"])
		previousData[3].push(data["conditional"])
		previousData[4].push(data["subjunctive"])

		var dataTable = google.visualization.arrayToDataTable(previousData)

		material.draw(dataTable, options)
	}
}

function handleData(data) {
	var color = getNewColor()
	addPin(data.polarity[0], data.subjectivity[0], '', color)
	wordPerSentence(data.wordPerSentence[0], data.wordPerSentence[1], color)
	modality(data.modality[0], data.modality[1], color)
	moods(data.moods, color)
}

function darken(color) {
	return shadeColor2(color, -0.25)
}

var predefinedColors = [
	'#f0b6c4',
	'#bcf0b6',
	'#d7b6f0',
	'#fbeb9e'
]

var lastUsedPredefinedColors = 0

function getCurrentColor() {
	return predefinedColors[lastUsedPredefinedColors]
}

function getNewColor() {
	var color = '#f0b6c4'
	if (lastUsedPredefinedColors >= predefinedColors.length) {
		// TODO get a light random color (https://github.com/davidmerfield/randomColor)
	} else {
		color = predefinedColors[lastUsedPredefinedColors]
		lastUsedPredefinedColors++
	}

	return color
}

function show(div) {
	div.style.display = "block"
}

function hide(div) {
	div.style.display = "none"
}

function addTextLegend(text, color) {
	var dataset = document.querySelector('#data-set')
	var legend = document.createElement('div')
	legend.classList.add('legend')

	var txt = document.createTextNode("Text: " + text)
	legend.appendChild(txt)
	legend.style.background = color
	dataset.appendChild(legend)
}

function addWebsiteLegend(url, color) {
	var dataset = document.querySelector('#data-set')
	var legend = document.createElement('div')
	legend.classList.add('legend')

	var txt = document.createTextNode("Website: " + url)
	legend.appendChild(txt)
	legend.style.background = color
	dataset.appendChild(legend)
}

function addWebpageLegend(inputUrl, inputTopic, inputNumber, color) {
	var dataset = document.querySelector('#data-set')
	var legend = document.createElement('div')
	legend.classList.add('legend')

	var txt = document.createTextNode("Website: " + inputUrl + " | Topic: " + inputTopic + " | Nuber of Pages: " + inputNumber)
	legend.appendChild(txt)
	legend.style.background = color
	dataset.appendChild(legend)
}

function run() {
	var spinner = document.querySelector("#spinner")
	var error = document.querySelector("#error")

	var tabText = document.querySelector('#tab-text')
	tabText.addEventListener('click', function () {
		hide(error)
		showTab('#form-text')
		removeActiveClass()
		tabText.classList.add('active')
	})

	var tabWebpage = document.querySelector('#tab-webpage')
	tabWebpage.addEventListener('click', function () {
		hide(error)
		showTab('#form-webpage')
		removeActiveClass()
		tabWebpage.classList.add('active')
	})

	var tabWebsite = document.querySelector('#tab-website')
	tabWebsite.addEventListener('click', function () {
		hide(error)
		showTab('#form-website')
		removeActiveClass()
		tabWebsite.classList.add('active')
	})

	var buttonText = document.querySelector('#form-text button')
	buttonText.addEventListener('click', function (event) {
		event.preventDefault()
		hide(error)
		show(spinner)
		startSpinner()
		var form = document.querySelector("#form-text")
		
		var textInput = document.querySelector("#form-text textarea").value
		addTextLegend(textInput, getCurrentColor())
		setTimeout(function(){
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
		})}, 2000)
	})

	var buttonPage = document.querySelector("#form-webpage button")
	buttonPage.addEventListener('click', function (event) {
		event.preventDefault()
		hide(error)
		show(spinner)
		startSpinner()
		var inputUrl = document.querySelector("#form-webpage #urlpage").value

		addWebsiteLegend(inputUrl, getCurrentColor())

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
		startSpinner()
		var inputUrl = document.querySelector("#form-website #urlsite").value
		var inputTopic = document.querySelector("#form-website #topic").value
		var inputNumber = document.querySelector("#form-website #numberResults").value

		addWebpageLegend(inputUrl, inputTopic, inputNumber, getCurrentColor())

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

    
    loadExample("parties-immigration",parties)
	// setTimeout(function () {
	// 	handleData({
	// 		"polarity": [
	// 			0.07293211129148629,
	// 			0.2174031579455767
	// 		],
	// 		"positivity": [
	// 			0.20833333333333334,
	// 			0.4061164310337067
	// 		],
	// 		"wordPerSentence": [
	// 			28.604166666666668,
	// 			11.501339746839157
	// 		],
	// 		"subjectivity": [
	// 			0.07293211129148629,
	// 			0.2174031579455767
	// 		],
	// 		"modality": [
	// 			0.6422299488705738,
	// 			0.3142989273647446
	// 		],
	// 		"moods": {
	// 			"conditional": 10,
	// 			"indicative": 37,
	// 			"subjunctive": 62
	// 		}
	// 	})
	// }, 100)
}
