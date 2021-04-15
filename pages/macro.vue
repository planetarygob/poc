<template>
    <WebGL />
</template>

<script lang="ts">
import WebGL from '../components/WebGL.vue'
import GL from '../assets/js/webgl/GL'
import { PointsMaterial, BufferGeometry, BufferAttribute, Points } from 'three'


export default {
    components: {
        WebGL
    },
    data() {
        return {
            gl: null as unknown as GL
        }
    },
    mounted() {
        const gl = GL.getInstance()
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
        gl.scene.add(particles)
    },
    methods: {
    }
}
</script>

<style>
</style>