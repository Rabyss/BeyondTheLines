function startSpinner() {
	var c = document.querySelector('#spinner')
	var w = spinner.offsetWidth
	var h = spinner.offsetHeight

	var ctx = c.getContext("2d")
	ctx.canvas.width  = w
	ctx.canvas.height = h

	var iteration = 0
	var triangles = [ { size: 4, life: 0 } ]
	var spawned = 0

	function drawTriangle(size, rot) {
		ctx.save()
		ctx.translate(w/2, h/2)
		ctx.rotate(rot)

		ctx.beginPath()
		ctx.moveTo(0, -2 * size/3)
		ctx.lineTo(size / Math.sqrt(3), size/3)
		ctx.lineTo(-size / Math.sqrt(3), size/3)
		ctx.closePath()
		ctx.stroke()
		ctx.restore()
	}

	render()

	function deg2rad(a) {
		return a * Math.PI / 180
	}

	function ease(x) {
		return Math.pow(x, 3/2) / 1000;
	}

	function render() {
		ctx.clearRect(0, 0, w, h)
		
		if (iteration % 8 === 0) {
			triangles.push({ size: 10, life: iteration })
			spawned++
		}

		for (var i = 0; i < triangles.length; i++) {
			/*
			if (iteration < 100) {
				triangles[i].size -= 4 * Math.log(spawned) * Math.cos(spawned / 5)
			} else {
				triangles[i].size += 11
			}
			*/
	
			triangles[i].size += 10

			ctx.lineWidth = Math.round(10 - (triangles[i].size / 200))
			ctx.strokeStyle = 'rgba(' + (triangles[i].size / 5 + 80) + ', 182, 196, 1)'
			drawTriangle(triangles[i].size, deg2rad(-triangles[i].size / 100 - triangles[i].life * 1.4))
		}

		if (triangles[0].size > 2000) {
			triangles.shift()
		}
		
		iteration++
		requestAnimationFrame(render)
	}
}
