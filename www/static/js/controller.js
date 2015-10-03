"use strict"

google.load('visualization', '1', {packages: ['corechart', 'bar']});
google.setOnLoadCallback(checkLoaded);

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

	var box = document.createElement('div')
	box.classList.add('box')
	box.style.left =  boxLeftPos + 'px'
	box.style.width = boxWidth + 'px'
	box.style.background = color

	var avgDiv = document.createElement('div')
	avgDiv.classList.add('avg')
	avgDiv.style.left =  avgPos + 'px'
	avgDiv.style.background = darken(color)
	console.log(darken(color))

	div.appendChild(box)
	div.appendChild(avgDiv)
}

function modality(avg, deviation, color) {
	boxPlot(avg, deviation, -1, 1, '#modality', color)
}

function wordPerSentence(avg, deviation, color) {
	boxPlot(avg, deviation, 0, 100, '#word-per-sentence', color)
}

function moods(data, color)
{
	var data = google.visualization.arrayToDataTable([
		['', ''],
		['Indicative', data["indicative"]],
		['Imperative', data["imperative"]],
		['Conditonal', data["conditional"]],
		['Subjunctive', data["subjunctive"]],
	]);

	var options = {
		colors: [color, darken(color)],
		hAxis: { maxValue: 100 },
		backgroundColor: { fill:'transparent' }
	};

	var material = new google.visualization.BarChart(document.getElementById('mood'));
	material.draw(data, options);
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
	'#bcf0b6',
	'#f0b6c4',
	'#d7b6f0',
	'#fbeb9e'
]

var lastUsedPredefinedColors = 0

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

function run() {
	var tabText = document.querySelector('#tab-text')
	tabText.addEventListener('click', function () {
		showTab('#form-text')
		removeActiveClass()
		tabText.classList.add('active')
	})

	var tabWebpage = document.querySelector('#tab-webpage')
	tabWebpage.addEventListener('click', function () {
		showTab('#form-webpage')
		removeActiveClass()
		tabWebpage.classList.add('active')
	})

	var tabWebsite = document.querySelector('#tab-website')
	tabWebsite.addEventListener('click', function () {
		showTab('#form-website')
		removeActiveClass()
		tabWebsite.classList.add('active')
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
				"subjunctive": 62
			}
		})
	}, 100)
}
