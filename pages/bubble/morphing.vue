<template>
    <WebGL />
</template>

<script>

import WebGL from '../../components/WebGL.vue'
import GL from '../../assets/js/webgl/GL'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { themes } from '../../assets/js/datas/themes.js'
import Proton from 'three.proton.js';
import dot from "../../static/images/dot";
import Bubble from '~/assets/js/webgl/custom/Bubble'

export default {
    components: {
        WebGL
    },
    data: () => ({
        gl: GL,
        selectedObjects: [],
        emitter: null,
        bubbleModel: null,
        themeSelected: null,
        bubbleSelected: null,
        themeLight: null,
        themes: themes,
        canClick: true,
        canMouseOver: true
    }),

    mounted() {
        this.gl = GL.getInstance()

        const bubble = new Bubble(1, 32)
        this.gl.scene.add(bubble.mesh)
    },

    methods: {

    }
}
</script>

<style>
</style>