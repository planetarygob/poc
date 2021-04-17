<template>
    <WebGL />
</template>

<script lang="ts">

import WebGL from '../../components/WebGL.vue'
import GL from '../../assets/js/webgl/GL'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'


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
        this.gl = GL.getInstance()
        const gltfLoader = new GLTFLoader()

        const themeLight = new THREE.PointLight('#ffffff', 3, 8)
        this.gl.scene.add(themeLight)

        gltfLoader.load('/models/planet_skirt_v2--animation--chara.glb', (gltf) => {
            this.gl.mixer = new THREE.AnimationMixer(gltf.scene)
            const animation = this.gl.mixer.clipAction(gltf.animations[0])

            animation.play()

            const modelToImport = gltf.scene
            modelToImport.position.set(0, 1, 0)
            modelToImport.scale.set(0.02, 0.02, 0.02)
            modelToImport.rotation.y = Math.PI
            themeLight.position.set(modelToImport.position.x, modelToImport.position.y + 2, modelToImport.position.z)
            this.gl.scene.add(modelToImport)
        })
    },
    methods: {
    }
}
</script>

<style>
</style>