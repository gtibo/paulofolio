<script>
  let container, parentNode;

  import {
    onMount
  } from "svelte";
  import * as THREE from 'three';
  import {
    GLTFLoader
  } from 'three/examples/jsm/loaders/GLTFLoader.js';
  import {
    fly
  } from 'svelte/transition';

  let scene, camera, renderer, mixer, clock;

  let model;

  let center = new THREE.Vector3(0, 0, 0);
  let camera_origin = new THREE.Vector3(0, 0, 2.5);

  const cubes = [];

  let camera_offset_x = 0;
  let isMobile;

  onMount(() => {
    parentNode = container.parentNode;
    window.addEventListener("resize", resize, true);
    isMobile = /android.+mobile|ip(hone|[oa]d)/i.test(navigator.userAgent);
    if (DeviceMotionEvent && isMobile) {
      window.addEventListener("deviceorientation", handleOrientation, true);
    } else {
      window.addEventListener("mousemove", mouvemove, true);
    }
    clock = new THREE.Clock();
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, parentNode.clientWidth / parentNode.clientHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({
      alpha: true
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(parentNode.clientWidth, parentNode.clientHeight);
    set_camera(0,0);
    container.appendChild(renderer.domElement);
    const gltfLoader = new GLTFLoader();
    const url = '/model.glb';
    gltfLoader.load(url, (gltf) => {
      model = gltf.scene;
      scene.add(model);
      mixer = new THREE.AnimationMixer(gltf.scene);
      model.traverse((o) => {
        if (o.isMesh) {
          o.material = new THREE.MeshPhongMaterial({
            color: 0xffffff,
            polygonOffset: true,
            polygonOffsetFactor: 1, // positive value pushes polygon further away
            polygonOffsetUnits: 1
          });
          let c = o.clone();
          c.material = new THREE.MeshBasicMaterial({
            color: 0x26C94A,
            wireframe: true,
          });
          scene.add(c);

          if(o.name.includes("Cube")){
            cubes.push({
              full:o,
              wire:c,
              axis:o.rotation
            });
          }


        }
      });
      gltf.animations.forEach((clip) => {
        mixer.clipAction(clip).play();
      });
      animate();
    });

  });


  function set_camera(x,y){
    camera_offset_x = (parentNode.clientWidth <= 600) ? 0 : 2;
    camera.position.x = camera_origin.x + x + camera_offset_x;
    camera.position.y = camera_origin.y + y;
    camera.position.z = camera_origin.z;
    camera.lookAt(center);

  }

  function resize() {
    set_camera(0,0);
    camera.aspect = parentNode.clientWidth / parentNode.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(parentNode.clientWidth, parentNode.clientHeight);
  }


  function animate(time) {
    requestAnimationFrame(animate);
    let delta = clock.getDelta();

    cubes.forEach((cube,i)=>{
      cube.full.rotateOnAxis(new THREE.Vector3(0, 1, 0), .1 * delta * (i+1));
      cube.wire.rotateOnAxis(new THREE.Vector3(0, 1, 0), .1 * delta * (i+1));

    });

    if (mixer) mixer.update(delta);
    renderer.render(scene, camera);
  }

  function mouvemove(e) {
    set_camera(
      ((e.clientX / window.innerWidth) - .5) ,
      ((e.clientY / window.innerHeight) - .5)
    );
  }

  function handleOrientation(e) {
    var x = event.beta;
    var y = event.gamma;
    if (x > 90) {
      x = 90
    };
    if (x < -90) {
      x = -90
    };
    x -= 45;
    set_camera(
      -y / 180 * 2 ,
      -x / 180 * 2
    );
  }

</script>

<div bind:this={container} transition:fly={{y:-10}}></div>
