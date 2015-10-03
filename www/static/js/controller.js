"use strict"

if (document.readyState !== 'loading') {
	run()
} else {
	document.addEventListener('DOMContentLoaded', run)
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

function wordPerSentence(avg, deviation) {
	var max = 100;

	var div = document.querySelector('#word-per-sentence')
	var width = div.offsetWidth

	var avgPos = (avg / max) * width;
	var boxLeftPos = ((avg - deviation) / max) * width;
	console.log(avg, deviation, max, width, boxLeftPos)
	var boxWidth = ((avg + deviation) / max) * width - boxLeftPos;
	
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

function handleData(data) {
	addPin(data.polarity[0], data.subjectivity[0])
	wordPerSentence(data.wordPerSentence[0], data.wordPerSentence[1])
}

function run() {
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
}