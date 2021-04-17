<template>
    <WebGL />
</template>

<script lang="ts">

import WebGL from '../../components/WebGL.vue'
import GL from '../../assets/js/webgl/GL'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import EventBusManager from '../../assets/js/managers/EventBusManager'
import CustomInteractionManager from '../../assets/js/managers/CustomInteractionManager'



export default {
    components: {
        WebGL
    },

    data: () => ({
        gl: null as unknown as GL
    }),

    mounted () {
        this.gl = GL.getInstance()
        const gltfLoader = new GLTFLoader()

        const themeLight = new THREE.PointLight('#ffffff', 3, 8)
        this.gl.scene.add(themeLight)

        gltfLoader.load('/models/planet_skirt_v2--animation--chara.glb', (gltf) => {
            
            const modelToImport = gltf.scene
            const customInteractionManager = CustomInteractionManager.getInstance(this.gl.renderer, this.gl.camera)
            customInteractionManager.add(modelToImport)

            this.gl.mixer = new THREE.AnimationMixer(modelToImport)
            const animation = this.gl.mixer.clipAction(gltf.animations[0])

            animation.setLoop(THREE.LoopOnce, 2)

            let self = this

            modelToImport.addEventListener('click', function modelClicked (event) {
                animation.play()
                customInteractionManager.remove(modelToImport)
                modelToImport.removeEventListener('click', modelClicked)
                animation.clampWhenFinished
                
                self.gl.mixer.addEventListener('finished', () => {
                    // cleanMethods on the doc doesnt work...
                    self.gl.mixer = null
                });
            })

            modelToImport.position.set(0, 1, 0)
            modelToImport.scale.set(0.02, 0.02, 0.02)
            modelToImport.rotation.y = Math.PI
            themeLight.position.set(modelToImport.position.x, modelToImport.position.y + 2, modelToImport.position.z)
            this.gl.scene.add(modelToImport)
        })
    }
}
</script>

<style>
</style>