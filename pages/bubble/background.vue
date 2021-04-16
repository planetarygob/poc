<template>
    <WebGL />
</template>

<script>

import WebGL from '../../components/WebGL.vue'
import GL from '../../assets/js/webgl/GL'
import { themes } from '../../assets/js/datas/themes.js'
import Sky from '../../assets/js/webgl/custom/Sky'

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
        const sky = new Sky( this.gl.canvas.width, this.gl.canvas.height )
        this.gl.scene.add( sky.mesh )
    },

    methods: {

    }
}
</script>

<style>
</style>