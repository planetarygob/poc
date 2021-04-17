<template>
    <WebGL />
</template>

<script lang="ts">

import WebGL from '../../components/WebGL.vue'
import GL from '../../assets/js/webgl/GL'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import { KTX2Loader } from 'three/examples/jsm/loaders/KTX2Loader.js';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
import { RoughnessMipmapper } from 'three/examples/jsm/utils/RoughnessMipmapper.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';

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

        this.gl.renderer.setPixelRatio( window.devicePixelRatio );
        this.gl.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.gl.renderer.toneMappingExposure = 1;
        this.gl.renderer.outputEncoding = THREE.sRGBEncoding;

        const environment = new RoomEnvironment();
        const pmremGenerator = new THREE.PMREMGenerator( this.gl.renderer );

        this.gl.scene.environment = pmremGenerator.fromScene( environment ).texture;

        const ktx2Loader = new KTX2Loader()
            .setTranscoderPath( 'js/libs/basis/' )
            .detectSupport( this.gl.renderer );

        let self = this

        const loader = new GLTFLoader().setPath( '/models/' );
        loader.setKTX2Loader( ktx2Loader );
        loader.setMeshoptDecoder( MeshoptDecoder );
        loader.load('planet_skirt_v2--animation--chara.glb', function (gltf) {
            gltf.scene.scale.set(0.05, 0.05, 0.05)
            self.gl.scene.add(gltf.scene);
            self.gl.render();
        } );
    },
}
</script>

<style>
</style>