<template>
    <WebGL />
</template>

<script>

import WebGL from '../../components/WebGL.vue'
import GL from '../../assets/js/webgl/GL'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import CustomInteractionManager from '../../assets/js/managers/CustomInteractionManager'
import EventBusManager from '../../assets/js/managers/EventBusManager'
import HighlightManager from '../../assets/js/managers/HighlightManager'


export default {
    components: {
        WebGL
    },

    data: () => ({
        gl: GL,
        selectedObjects: [],
        modelToImport: null
    }),

    mounted() {
        this.gl = GL.getInstance()
        const gltfLoader = new GLTFLoader()

        const themeLight = new THREE.PointLight('#ffffff', 3, 8)
        this.gl.scene.add(themeLight)

        gltfLoader.load('/models/planet_skirt_v2--animation.gltf', (gltf) => {
            this.modelToImport = gltf.scene.children[0]
            let scissors = null
            this.modelToImport.traverse((child) => {
                if (child.name === 'scissors') {
                    scissors = child
                }
            })

            this.modelToImport.position.set(0, 1, 0)
            this.modelToImport.scale.set(0.02, 0.02, 0.02)

            const customInteractionManager = CustomInteractionManager.getInstance(this.gl.renderer, this.gl.camera)
            customInteractionManager.add(this.modelToImport)

            let self = this

            if (scissors) {
                scissors.addEventListener('mouseover', () => {
                    document.body.style.cursor = 'pointer';
                })
                scissors.addEventListener('mouseout', () => {
                    document.body.style.cursor = 'default';
                })

                scissors.addEventListener('click', (event) => {
                    self.addSelectedObject(event.target)
                    self.gl.highlightManager.outlinePass.selectedObjects = this.selectedObjects;
                })
            }            

            themeLight.position.set(this.modelToImport.position.x, this.modelToImport.position.y + 2, this.modelToImport.position.z)
            this.gl.scene.add(this.modelToImport)
            this.gl.interactionManager.add(scissors);
        })
    },

    methods: {
        addSelectedObject(object) {
            this.selectedObjects = [];
            this.selectedObjects.push(object);
        },
    }
}
</script>

<style>
</style>