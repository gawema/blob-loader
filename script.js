// Array of possible colors (bright, saturated colors that blend well)
const colors = [
  '#00FFF0', 
  '#3300FF', 
  '#51DA4C', 
  '#9747FF', 
  '#FFC989', 
  '#FFFFFF', 
  '#000000', 
];


let currentStep = 0;

function getRandomColor(usedColors) {
  // Filter out colors that are already in use
  const availableColors = colors.filter(color => !usedColors.includes(color));
  // Get random color from remaining colors
  const randomIndex = Math.floor(Math.random() * availableColors.length);
  return availableColors[randomIndex];
}

function updateColors() {
  const blobs = document.querySelectorAll('.blob');
  const textContainer = document.querySelector('.text-container');
  const spans = document.querySelectorAll('.animated-text span');
  const usedColors = [];

  blobs.forEach(blob => {
      const newColor = getRandomColor(usedColors);
      usedColors.push(newColor);
      blob.style.backgroundColor = newColor;
  });

  // Reset all spans if we're starting a new cycle
  if (currentStep === 0) {
      spans.forEach(span => {
          span.classList.remove('active');
      });
  }

  // Handle text visibility based on step
  if (currentStep === 4) {
      // Fade out all spans on the last step
      spans.forEach(span => {
          span.classList.remove('active');
      });
  } else {
      // Show current span and keep previous spans visible
      spans.forEach(span => {
          const stepNum = parseInt(span.dataset.step);
          if (stepNum === currentStep) {
              setTimeout(() => {
                  span.classList.add('active');
              }, 200);
          }
      });
  }
  
  // Update progress line
  textContainer.className = 'text-container progress-step-' + currentStep;
  
  // Update step counter (now with 5 steps)
  currentStep = (currentStep + 1) % 5;
}

// Divide the screen into sections
function getSectionCoordinates(index, totalBlobs) {
  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;
  
  // Create a grid of sections (2x3 grid for 5 blobs)
  const sectionsX = 2;
  const sectionsY = 3;
  
  const sectionWidth = screenWidth / sectionsX;
  const sectionHeight = screenHeight / sectionsY;
  
  // Calculate which section this blob should go to
  const sectionX = index % sectionsX;
  const sectionY = Math.floor(index / sectionsX);
  
  // Get random position within the assigned section
  const minX = sectionX * sectionWidth - 500;
  const maxX = (sectionX + 1) * sectionWidth - 500;
  const minY = sectionY * sectionHeight - 500;
  const maxY = (sectionY + 1) * sectionHeight - 500;
  
  return {
      x: minX + (Math.random() * (maxX - minX)),
      y: minY + (Math.random() * (maxY - minY))
  };
}

function moveBlobs() {
  const blobs = document.querySelectorAll('.blob');
  // Create array of indices and shuffle it
  const indices = Array.from({ length: blobs.length }, (_, i) => i);
  for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
  }
  
  // Move each blob to a random position within its assigned section
  blobs.forEach((blob, i) => {
      const coords = getSectionCoordinates(indices[i], blobs.length);
      blob.style.left = `${coords.x}px`;
      blob.style.top = `${coords.y}px`;
  });
}

function initializeBlobs() {
  const blobs = document.querySelectorAll('.blob');
  
  // Initial position and colors for blobs
  updateColors();
  moveBlobs();
  
  // Move blobs and update colors every 4 seconds
  setInterval(() => {
      updateColors();
      moveBlobs();
  }, 2000);
}

// Initialize when the page loads
window.addEventListener('load', () => {
  initializeBlobs();
}); 