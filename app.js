let scene;
let camera;
let renderer;


function main() {
    const canvas = document.querySelector('#c');



    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 2;

    scene.add(camera);

    renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, });
    renderer.setSize(window.innerWidth, window.innerHeight);
    
    document.body.appendChild(renderer.domElement);

    // Custom shader for the background
    const vertexShader = `
    varying vec2 vUv;
    void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
`;

    const fragmentShader = `
    varying vec2 vUv;
    uniform vec3 color1;
    uniform vec3 color2;
    
    void main() {
        float pct = distance(vec2(0.5), vUv);
        vec3 color = mix(color1, color2, pct);
        gl_FragColor = vec4(color, 1.0);
    }
`;

    // Create a shader material using the custom shaders
    const gradientMaterial = new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms: {
            color1: { value: new THREE.Color('#1b2735') },
            color2: { value: new THREE.Color('#090a0f') }
        }
    });

    // Create a full-screen quad to represent the background
    const geometry = new THREE.PlaneBufferGeometry(11, 11);
    const backgroundMesh = new THREE.Mesh(geometry, gradientMaterial);

    // Set the background mesh to be rendered before the rest of the scene
    backgroundMesh.renderOrder = -1;

    // Add the background mesh to the scene
    scene.add(backgroundMesh);


    // create earthgeometry

    const earthgeometry = new THREE.SphereGeometry(0.6, 32, 32);

    const eatrhmaterial = new THREE.MeshPhongMaterial({
        roughness: 1,
        metalness: 0,
        map: THREE.ImageUtils.loadTexture('texture/earthmap1k.jpg'),
        bumpMap: THREE.ImageUtils.loadTexture('texture/earthbump.jpg'),
        bumpScale: 1.3,
    });

    const earthmesh = new THREE.Mesh(earthgeometry, eatrhmaterial);
    earthmesh.position.x = 1.2;
    earthmesh.position.z = 0.1;

    scene.add(earthmesh);

    // set ambientlight

    const ambientlight = new THREE.AmbientLight(0xffffff, 0.2);
    scene.add(ambientlight);

    // set point light

    const pointerlight = new THREE.PointLight(0xffffff, 0.9);

    // set light position

    pointerlight.position.set(5, 3, 5);
    scene.add(pointerlight);

    // cloud
    const cloudgeometry = new THREE.SphereGeometry(0.63, 32, 32);

    const cloudmaterial = new THREE.MeshPhongMaterial({
        map: THREE.ImageUtils.loadTexture('texture/earthCloud.png'),
        transparent: true
    });

    const cloudmesh = new THREE.Mesh(cloudgeometry, cloudmaterial);
    cloudmesh.position.x = 1.2;
    cloudmesh.position.z = 0.1;
    scene.add(cloudmesh);


    // star

    const stargeometry = new THREE.SphereGeometry(80, 64, 64);

    const starmaterial = new THREE.MeshBasicMaterial({

        //map: THREE.ImageUtils.loadTexture('texture/galaxy.png'),

        //side: THREE.BackSide
    });

    const starmesh = new THREE.Mesh(stargeometry, starmaterial);

    scene.add(starmesh);

    const animate = () => {
        requestAnimationFrame(animate);
        earthmesh.rotation.y -= 0.0015;
        cloudmesh.rotation.y += 0.0015;
        starmesh.rotation.y += 0.0005;

        render();
    }

    const render = () => {
        renderer.render(scene, camera);
    }

    animate();
}

window.onload = main;