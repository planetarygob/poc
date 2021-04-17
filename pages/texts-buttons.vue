<template>
    <div class="relative">
        <div
            class="container flex flex-col justify-center p-8 w-3/12 absolute text-white mx-auto"
            style="left: 70%; top: 25%">
            <h1 class="font-extrabold text-2xl">MODE</h1>
            <span class="text-gray-400 text-sm mt-2">Lorem ipsum dolor sit amet consectetur adipisicing elit. Omnis quia voluptate eveniet, ipsa eius velit reprehenderit minus deserunt quos exercitationem a qui est, dolores atque labore quod vel cum dicta.</span>
            <button
                class="mt-10 w-40 bg-white bg-opacity-25 text-white border-white border hover:bg-white hover:text-purple-500 font-bold py-2 px-4 rounded-full"
                @click="buttonClicked">
                DECOUVRIR
            </button>
        </div>
        <WebGL />
    </div>
</template>

<script lang="ts">

import WebGL from '../components/WebGL.vue'
import GL from '../assets/js/webgl/GL'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'


export default {
    components: {
        WebGL
    },

    data: () => ({
        gl: null as unknown as GL
    }),

    mounted() {
        this.gl = GL.getInstance()

        const gltfLoader = new GLTFLoader()

        const themeLight = new THREE.PointLight('#ffffff', 3, 8)
        this.gl.scene.add(themeLight)

        gltfLoader.load('/models/planet_hippie_v3.gltf', (gltf) => {
            const modelToImport = gltf.scene.children[0]
            modelToImport.position.set(0, 1, 0)
            modelToImport.scale.set(0.02, 0.02, 0.02)
            themeLight.position.set(modelToImport.position.x, modelToImport.position.y + 2, modelToImport.position.z)
            this.gl.scene.add(modelToImport)
        })
    },

    methods: {
        buttonClicked () {
            console.log('clicked', );
        }
    }
}
</script>

<style>
</style>