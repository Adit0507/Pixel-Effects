const canvas = document.getElementById('canvas1')
const ctx = canvas.getContext('2d')
canvas.width = 550
canvas.height = 900

class Cell {
    constructor(effect, x, y, index) {
        this.effect = effect
        this.x = x
        this.y = y
        this.index = index
        this.postionX = Math.random()*this.effect.width
        this.postionY = this.effect.height
        this.speedX
        this.speedY
        this.width = this.effect.cellWidth
        this.height = this.effect.cellHeight
        this.image = document.getElementById('projectImg')
        this.slideX = 0
        this.slideY = 0
        this.vx = 0
        this.vy = 0
        this.ease = 0.01
        this.friction = 0.9
        this.randomize = Math.random() * 100 + 2
        setTimeout(()=>{
            this.start()
        }, this.index*10)
    }

    draw(context) {
        context.drawImage(this.image, this.x + this.slideX, this.y + this.slideY, this.width, this.height, this.postionX, this.postionY, this.width, this.height)
        context.strokeRect(this.postionX, this.postionY, this.width, this.height)
    }
    start(){
        this.speedX = (this.x - this.postionX) / this.randomize
        this.speedY = (this.y - this.postionY) / this.randomize
    }
    update() {
        // cell postion
        if (Math.abs(this.speedX) > 0.02 || Math.abs(this.speedY) > 0.02) {
            this.speedX = (this.x - this.postionX) / this.randomize
            this.speedY = (this.y - this.postionY) / this.randomize
            this.postionX += this.speedX
            this.postionY += this.speedY
        }

        // crop
        const dx = this.effect.mouse.x - this.x
        const dy = this.effect.mouse.y - this.y
        const distance = Math.hypot(dx, dy)
        if (distance < this.effect.mouse.radius) {
            const angle = Math.atan2(dy, dx)
            const force = distance / this.effect.mouse.radius
            this.vx = force * Math.sin(angle + 60)
            this.vy = force * Math.cos(angle)
            // Radiating Effect
            // this.vx = force *Math.cos(angle)
            // this.vy = force *Math.sin(angle)
        }
        // else{
        //     this.vx = 0
        //     this.vy = 0
        // }
        this.slideX += (this.vx *= this.friction) - this.slideX * this.ease
        this.slideY += (this.vy *= this.friction) - this.slideY * this.ease
        // this.slideX += this.vx 
        // this.slideY += this.vy 
    }
}

class Effect {
    constructor(canvas) {
        this.canvas = canvas
        this.width = this.canvas.width
        this.height = this.canvas.height
        this.cellWidth = this.width / 25
        this.cellHeight = this.height / 35
        this.cell = new Cell(this, 0, 0)
        this.imageGrid = []
        this.createGrid()
        this.mouse = {
            x: undefined,
            y: undefined,
            radius: 100
        }
        this.canvas.addEventListener('mousemove', e => {
            this.mouse.x = e.offsetX
            this.mouse.y = e.offsetY
        })
        this.canvas.addEventListener('mouseleave', e => {
            this.mouse.x = undefined
            this.mouse.y = undefined
        })

    }
    createGrid() {
        let index = 0
        for (let y = 0; y < this.height; y += this.cellHeight) {
            for (let x = 0; x < this.width; x += this.cellWidth) {
                index ++
                this.imageGrid.unshift(new Cell(this, x, y,index))
            }
        }
    }

    render(context) {
        this.imageGrid.forEach((cell, i) => {
            cell.update()
            cell.draw(context)
        })
    }
}

const effect = new Effect(canvas)

function animate() {
    // ctx.clearRect(0, 0,canvas.width, canvas.height)
    effect.render(ctx)
    requestAnimationFrame(animate)
}

requestAnimationFrame(animate)