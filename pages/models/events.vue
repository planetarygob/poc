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
    data: () => ({
        gl: null as unknown as GL,
        selectedObjects: []
    }),

    mounted() {
        const gl = GL.getInstance()
        const gltfLoader = new GLTFLoader()

        const themeLight = new THREE.PointLight('#ffffff', 3, 8)
        gl.scene.add(themeLight)

        gltfLoader.load('/models/sun_mode_v2.gltf', (gltf) => {
            const modelToImport = gltf.scene.children[0]
            modelToImport.position.set(0, 1, 0)
            modelToImport.scale.set(0.02, 0.02, 0.02)

            modelToImport.addEventListener('mouseover', () => {
                document.body.style.cursor = 'pointer';
            })

            modelToImport.addEventListener('mouseout', () => {
                document.body.style.cursor = 'default';
            })

            modelToImport.addEventListener('click', (event) => {
                
            })

            themeLight.position.set(modelToImport.position.x, modelToImport.position.y + 2, modelToImport.position.z)
            gl.scene.add(modelToImport)
            gl.interactionManager.add(modelToImport);
        })
    }
}
</script>

<style>
</style>