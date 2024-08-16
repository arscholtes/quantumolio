document.addEventListener("DOMContentLoaded", function() {
  // Set up scene, camera, and renderer
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ antialias: true });

  renderer.setSize(window.innerWidth, window.innerHeight);
  document.getElementById('container').appendChild(renderer.domElement);

  // Create a black hole (a simple sphere with a dark material)
  const blackHoleGeometry = new THREE.SphereGeometry(1, 32, 32);
  const blackHoleMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
  const blackHole = new THREE.Mesh(blackHoleGeometry, blackHoleMaterial);
  scene.add(blackHole);

  // Background: Universe with Nebulas and Galaxies
  const universeTexture = new THREE.TextureLoader().load('path_to_your_universe_texture.jpg'); // Replace with your own texture
  const universeGeometry = new THREE.SphereGeometry(100, 64, 64);
  const universeMaterial = new THREE.MeshBasicMaterial({
    map: universeTexture,
    side: THREE.BackSide, // Render inside the sphere
  });
  const universe = new THREE.Mesh(universeGeometry, universeMaterial);
  scene.add(universe);

  // Particle system for the outer accretion disk
  const outerParticleCount = 5000;
  const outerParticles = new THREE.BufferGeometry();
  const outerPositions = [];

  for (let p = 0; p < outerParticleCount; p++) {
    const angle = Math.random() * 2 * Math.PI; // Random angle for circular disk
    const radius = Math.random() * 5 + 2; // Radius spread further from the black hole
    const pX = Math.cos(angle) * radius;
    const pY = (Math.random() - 0.5) * 0.1; // Thin disk, small Y-axis range
    const pZ = Math.sin(angle) * radius;

    outerPositions.push(pX, pY, pZ);
  }

  outerParticles.setAttribute('position', new THREE.Float32BufferAttribute(outerPositions, 3));

  const outerPMaterial = new THREE.PointsMaterial({
    color: 0xaaaaaa,
    size: 0.01, // Make the particles much smaller
  });

  const outerParticleSystem = new THREE.Points(outerParticles, outerPMaterial);
  scene.add(outerParticleSystem);

  // Particle system for particles close to the black hole surface (inner disk)
  const surfaceParticleCount = 2000;
  const surfaceParticles = new THREE.BufferGeometry();
  const surfacePositions = [];

  for (let p = 0; p < surfaceParticleCount; p++) {
    const angle = Math.random() * 2 * Math.PI; // Random angle for circular orbit
    const radius = Math.random() * 1 + 1.5; // Close to the black hole
    const pX = Math.cos(angle) * radius;
    const pY = (Math.random() - 0.5) * 0.05; // Very thin layer
    const pZ = Math.sin(angle) * radius;

    surfacePositions.push(pX, pY, pZ);
  }

  surfaceParticles.setAttribute('position', new THREE.Float32BufferAttribute(surfacePositions, 3));

  const surfacePMaterial = new THREE.PointsMaterial({
    color: 0xaaaaaa,
    size: 0.005, // Even smaller particles close to the black hole
  });

  const surfaceParticleSystem = new THREE.Points(surfaceParticles, surfacePMaterial);
  scene.add(surfaceParticleSystem);

  // Particle system for particles near the poles (top and bottom surfaces)
  const poleParticleCount = 3000;
  const poleParticles = new THREE.BufferGeometry();
  const polePositions = [];

  for (let p = 0; p < poleParticleCount; p++) {
    const angle = Math.random() * 2 * Math.PI; // Random angle
    const radius = Math.random() * 0.5 + 1.2; // Close to the black hole
    const height = (Math.random() - 0.5) * 2; // Full height around the poles
    const pX = Math.cos(angle) * radius;
    const pY = height; // Spread in Y-axis for top and bottom
    const pZ = Math.sin(angle) * radius;

    polePositions.push(pX, pY, pZ);
  }

  poleParticles.setAttribute('position', new THREE.Float32BufferAttribute(polePositions, 3));

  const polePMaterial = new THREE.PointsMaterial({
    color: 0xaaaaaa,
    size: 0.005, // Small particles for pole regions
  });

  const poleParticleSystem = new THREE.Points(poleParticles, polePMaterial);
  scene.add(poleParticleSystem);

  // Animation loop
  camera.position.z = 10;

  function animate() {
    requestAnimationFrame(animate);

    blackHole.rotation.y += 0.005; // Slow rotation for the black hole
    outerParticleSystem.rotation.y += 0.002; // Slow rotation for outer particles
    surfaceParticleSystem.rotation.y += 0.01; // Faster rotation for surface particles
    poleParticleSystem.rotation.y += 0.01; // Rotate pole particles as well

    renderer.render(scene, camera);
  }
  animate();

  // Retract black hole after 4 seconds
  setTimeout(() => {
    gsap.to(camera.position, { z: 15, duration: 2 });

    // Show buttons
    const buttons = document.querySelector('.buttons');
    buttons.style.display = 'flex';
    const fadeInButtons = document.querySelectorAll('.fade-in');
    fadeInButtons.forEach(button => {
      button.style.opacity = '1';
      button.style.transform = 'scale(1)';
    });
  }, 4000);

  // Handle window resizing
  window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
  });
});
