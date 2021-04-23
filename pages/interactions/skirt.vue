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
import { Vector3 } from 'three'

export default {
    components: {
        WebGL
    },

    data: () => ({
        gl: null as unknown as GL,
        scenery: null as any,
        customInteractionManager: null as any,
        animation: null as any,
        scissors: null as any,
        selectedObjects: [] as any,
        initialPosition: new Vector3(0, 0, 0) as Vector3
    }),

    mounted () {
        this.gl = GL.getInstance()
        const gltfLoader = new GLTFLoader()

        const axesHelper = new THREE.AxesHelper( 5 );
        this.gl.scene.add( axesHelper );

        gltfLoader.load('/models/planet_skirt_v2--animation--chara.glb', (gltf) => {
            this.scenery = gltf.scene
            this.customInteractionManager = CustomInteractionManager.getInstance(this.gl.renderer, this.gl.camera)
            this.customInteractionManager.add(this.scenery)

            this.gl.mixer = new THREE.AnimationMixer(this.scenery)
            this.animation = this.gl.mixer.clipAction(gltf.animations[0])

            this.animation.setLoop(THREE.LoopOnce, 2)

            this.scenery.addEventListener('click', this.modelClicked.bind(this), false)

            this.scenery.position.set(0, 0, 0)
            this.scenery.scale.set(0.02, 0.02, 0.02)
            this.scenery.rotation.y = Math.PI

            this.createLight()
            this.gl.scene.add(this.scenery)

            this.scenery.traverse((child: any) => {
                if (child.name === 'scissors') {
                    this.scissors = child
                }
            })

            if (this.scissors) {
                this.initialPosition = this.scissors.position
                this.scissors.addEventListener('mouseover', () => {
                    document.body.style.cursor = 'pointer';
                })
                this.scissors.addEventListener('mouseout', () => {
                    document.body.style.cursor = 'default';
                })

                this.scissors.addEventListener('click', (e: any) => {
                    this.addSelectedObject(e.target)
                    this.scissors.rotation.x = 45
                    this.gl.highlightManager.outlinePass.selectedObjects = this.selectedObjects;

                    window.addEventListener('mousemove', (e: any) => {
                        const mouse = e.clientX / this.gl.canvas.width - 0.5
                        this.scissors.position.x -= mouse * 2
                        this.scissors.position.z += mouse

                        if ((this.scissors.position.x <= -18) && (this.scissors.position.x >= -28)) {
                            console.log("jupe")
                            console.log(this.initialPosition.x, this.initialPosition.z)
                            this.scissors.position.x = this.initialPosition.x
                            this.scissors.position.z = this.initialPosition.z
                        }
                    })
                })
                this.gl.interactionManager.add(this.scissors);
            }   
        })
    }, 
    methods : {
        createLight() {
            const themeLight = new THREE.PointLight('#ffffff', 3, 8)
            themeLight.position.set(this.scenery.position.x, this.scenery.position.y + 2, this.scenery.position.z)
            this.gl.scene.add(themeLight)
        },
        modelClicked() {
            this.animation.play()
            this.customInteractionManager.remove(this.scenery)
            this.scenery.removeEventListener('click', this.modelClicked)
            this.animation.clampWhenFinished
            
            this.gl.mixer.addEventListener('finished', () => {
                // cleanMethods on the doc doesnt work...
                this.gl.mixer = null
            });
        },
        addSelectedObject(object: any) {
            this.selectedObjects = [];
            this.selectedObjects.push(object);
        },
    }
}
</script>

<style>
</style>