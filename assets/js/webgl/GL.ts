import Scene from './core/Scene'
import Renderer from './core/Renderer'
import { 
    PerspectiveCamera,
    Clock,
    AmbientLight,
    DirectionalLight,
    PointsMaterial,
    BufferGeometry,
    BufferAttribute,
    Points
} from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import Bubble from './custom/Bubble'
import Stats from 'stats.js'


interface Size {
    width: number
    height: number
    ratio: number
}

class GL {
    private static instance: GL
    stats: Stats
    canvas: HTMLCanvasElement
    scene: Scene 
    renderer: Renderer 
    camera: PerspectiveCamera
    controls: OrbitControls
    clock: Clock
    size: Size

    constructor() {
        this.stats = new Stats()
        this.stats.showPanel(0)
        document.body.appendChild(this.stats.dom)

        this.size = {
            width: window.innerWidth,
            height: window.innerHeight,
            ratio: window.innerWidth / window.innerHeight
        }

        this.canvas = document.querySelector('.webgl') as HTMLCanvasElement
        if (this.canvas) {
            this.canvas.width = this.size.width
            this.canvas.height = this.size.height
        } else {
            console.log("No canvas")
        }

        this.scene = new Scene()

        this.camera = new PerspectiveCamera(75, this.size.width / this.size.height, 0.1, 1000)
        this.camera.position.set(0, 10, -15)

        this.controls = new OrbitControls(this.camera, this.canvas)
        this.controls.enableDamping = true

        this.clock = new Clock()

        this.renderer = new Renderer(
            { canvas: this.canvas }, 
            this.size.width, 
            this.size.height
        )
        this.renderer.render(this.scene, this.camera)
        
        this.addElements()
        this.addEvents()

        this.animate();    
    }

    public static getInstance(): GL {
        if (!GL.instance) {
            GL.instance = new GL();
        }
 
        return GL.instance;
    }

    // ---------------- METHODS

    addElements() {
        this.scene.add(this.camera)

        const ambientLight = new AmbientLight(0xffffff, 0.8)
        this.scene.add(ambientLight)

        const directionalLight = new DirectionalLight(0xffffff, 1)
        directionalLight.position.set(0, 5, -5)
        this.scene.add(directionalLight)

        this.addBackgroundParticles()
    }

    addEvents() {
        window.addEventListener('resize', this.resize.bind(this))
        window.addEventListener('click', this.scene.trigger)
    }  

    addBackgroundParticles () {
        const particlesMaterial = new PointsMaterial({
            size: 0.02,
            sizeAttenuation: true
        })
        const particlesGeometry = new BufferGeometry()
        const count = 2000

        const positions = new Float32Array(count * 3) // Multiply by 3 because each position is composed of 3 values (x, y, z)

        for(let i = 0; i < count * 3; i++) {
            positions[i] = (Math.random() - 0.5) * 100 // Math.random() - 0.5 to have a random value between -0.5 and +0.5
        }

        particlesGeometry.setAttribute('position', new BufferAttribute(positions, 3))
        const particles = new Points(particlesGeometry, particlesMaterial)
        this.scene.add(particles)
    }
    
    resize() {
        this.size.width = window.innerWidth;
        this.size.height = window.innerHeight;

        this.camera.aspect = this.size.width / this.size.height
        this.renderer.setSize(this.size.width, this.size.height)

        this.camera.updateProjectionMatrix()
    }

    // ---------------- LIFECYCLE

    animate() {
        this.stats.begin()

        window.requestAnimationFrame(this.animate.bind(this))
        this.render()

        this.stats.end()
    }

    render() {
        this.controls.update()

        this.renderer.render(this.scene, this.camera)
    }
}

export default GL