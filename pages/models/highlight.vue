<template>
    <WebGL />
</template>

<script>

import WebGL from '../../components/WebGL.vue'
import GL from '../../assets/js/webgl/GL'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'


export default {
    components: {
        WebGL
    },
    data: () => ({
        gl: GL,
        selectedObjects: []
    }),

    mounted() {
        this.gl = GL.getInstance()
        const gltfLoader = new GLTFLoader()

        const themeLight = new THREE.PointLight('#ffffff', 3, 8)
        this.gl.scene.add(themeLight)

        gltfLoader.load('/models/planet_skirt_v2--animation.gltf', (gltf) => {
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
                this.addSelectedObject(event.target)
                this.gl.outlinePass.selectedObjects = this.selectedObjects;
            })

            themeLight.position.set(modelToImport.position.x, modelToImport.position.y + 2, modelToImport.position.z)
            this.gl.scene.add(modelToImport)
            this.gl.interactionManager.add(modelToImport);
        })
    },

    methods: {
        addSelectedObject(object) {
            this.selectedObjects = [];
            this.selectedObjects.push(object);
        }
    }
}
</script>

<style>
</style>