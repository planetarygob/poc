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

        gltfLoader.load('/models/planet_hippie_v3.gltf', (gltf) => {
            const modelToImport = gltf.scene.children[0]
            this.gl.model = modelToImport
            modelToImport.position.set(0, 1, 0)
            modelToImport.scale.set(0.02, 0.02, 0.02)
            themeLight.position.set(modelToImport.position.x, modelToImport.position.y + 2, modelToImport.position.z)
            this.gl.scene.add(modelToImport)
        })

        gltfLoader.load('/models/bubble_skirt_v1.gltf', (gltf) => {
            const modelToImport = gltf.scene.children[0]
            this.gl.model2 = modelToImport
            modelToImport.position.set(5, 1, 0)
            modelToImport.scale.set(0.008, 0.008, 0.008)
            themeLight.position.set(modelToImport.position.x, modelToImport.position.y + 2, modelToImport.position.z)

            modelToImport.addEventListener('mouseover', () => {
                document.body.style.cursor = 'pointer';
            })

            modelToImport.addEventListener('mouseout', () => {
                document.body.style.cursor = 'default';
            })

            this.gl.scene.add(modelToImport)
            this.gl.interactionManager.add(modelToImport);
        })
    },

    methods: {
    }
}
</script>

<style>
</style>