/**
 * Modern Product Image Zoom
 * Desktop: Click to open lightbox with pan & zoom
 * Mobile: Pinch-to-zoom + tap for full-screen view
 */

if (!customElements.get('product-image-zoom')) {
  customElements.define('product-image-zoom', class ProductImageZoom extends HTMLElement {
    constructor() {
      super();
      this.modal = null;
      this.currentImageIndex = 0;
      this.images = [];
      this.scale = 1;
      this.panning = false;
      this.pointX = 0;
      this.pointY = 0;
      this.start = { x: 0, y: 0 };

      this.init();
    }

    init() {
      // Get all product images
      const imageElements = this.querySelectorAll('.product__media-item img');
      this.images = Array.from(imageElements).map(img => ({
        src: img.src.replace(/_(small|compact|medium|grande|large|master|pico|icon|thumb)\./, '.'),
        alt: img.alt,
        element: img.closest('.product__media-item')
      }));

      // Add click listeners to images
      imageElements.forEach((img, index) => {
        img.style.cursor = 'zoom-in';
        img.addEventListener('click', (e) => {
          e.preventDefault();
          this.openZoom(index);
        });
      });

      // Add pinch-to-zoom for mobile
      this.addMobilePinchZoom();
    }

    addMobilePinchZoom() {
      const imageContainers = this.querySelectorAll('.product__media-item');

      imageContainers.forEach(container => {
        let initialDistance = 0;
        let initialScale = 1;
        const img = container.querySelector('img');

        container.addEventListener('touchstart', (e) => {
          if (e.touches.length === 2) {
            e.preventDefault();
            initialDistance = this.getDistance(e.touches[0], e.touches[1]);
            initialScale = parseFloat(img.style.transform?.match(/scale\(([\d.]+)\)/)?.[1] || 1);
          }
        }, { passive: false });

        container.addEventListener('touchmove', (e) => {
          if (e.touches.length === 2) {
            e.preventDefault();
            const currentDistance = this.getDistance(e.touches[0], e.touches[1]);
            const scale = Math.min(Math.max(initialScale * (currentDistance / initialDistance), 1), 3);

            img.style.transform = `scale(${scale})`;
            img.style.transformOrigin = 'center center';
            img.style.transition = 'transform 0.1s ease-out';
          }
        }, { passive: false });

        container.addEventListener('touchend', (e) => {
          if (e.touches.length < 2) {
            const currentScale = parseFloat(img.style.transform?.match(/scale\(([\d.]+)\)/)?.[1] || 1);
            if (currentScale <= 1.1) {
              img.style.transform = 'scale(1)';
            }
          }
        });
      });
    }

    getDistance(touch1, touch2) {
      const dx = touch1.clientX - touch2.clientX;
      const dy = touch1.clientY - touch2.clientY;
      return Math.sqrt(dx * dx + dy * dy);
    }

    openZoom(index) {
      this.currentImageIndex = index;
      this.createModal();
      this.showImage(index);
      document.body.style.overflow = 'hidden';
    }

    createModal() {
      // Create modal structure
      this.modal = document.createElement('div');
      this.modal.className = 'product-zoom-modal';
      this.modal.innerHTML = `
        <div class="product-zoom-overlay"></div>
        <div class="product-zoom-container">
          <button class="product-zoom-close" aria-label="Close zoom">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>

          ${this.images.length > 1 ? `
            <button class="product-zoom-nav product-zoom-prev" aria-label="Previous image">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
            </button>
            <button class="product-zoom-nav product-zoom-next" aria-label="Next image">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>
          ` : ''}

          <div class="product-zoom-image-wrapper">
            <img class="product-zoom-image" src="" alt="" draggable="false">
          </div>

          <div class="product-zoom-controls">
            <button class="product-zoom-control" data-action="zoom-in" aria-label="Zoom in">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="11" y1="8" x2="11" y2="14"></line>
                <line x1="8" y1="11" x2="14" y2="11"></line>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </button>
            <button class="product-zoom-control" data-action="zoom-out" aria-label="Zoom out">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="8" y1="11" x2="14" y2="11"></line>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </button>
            <button class="product-zoom-control" data-action="reset" aria-label="Reset zoom">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="23 4 23 10 17 10"></polyline>
                <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
              </svg>
            </button>
          </div>

          ${this.images.length > 1 ? `
            <div class="product-zoom-counter">
              <span class="current-index">1</span> / <span class="total-images">${this.images.length}</span>
            </div>
          ` : ''}
        </div>
      `;

      document.body.appendChild(this.modal);
      this.attachModalListeners();

      // Trigger animation
      setTimeout(() => this.modal.classList.add('active'), 10);
    }

    attachModalListeners() {
      const closeBtn = this.modal.querySelector('.product-zoom-close');
      const overlay = this.modal.querySelector('.product-zoom-overlay');
      const prevBtn = this.modal.querySelector('.product-zoom-prev');
      const nextBtn = this.modal.querySelector('.product-zoom-next');
      const image = this.modal.querySelector('.product-zoom-image');
      const imageWrapper = this.modal.querySelector('.product-zoom-image-wrapper');

      // Close modal
      closeBtn.addEventListener('click', () => this.closeModal());
      overlay.addEventListener('click', () => this.closeModal());

      // Keyboard navigation
      document.addEventListener('keydown', this.handleKeydown.bind(this));

      // Navigation
      if (prevBtn) prevBtn.addEventListener('click', () => this.navigate(-1));
      if (nextBtn) nextBtn.addEventListener('click', () => this.navigate(1));

      // Zoom controls
      this.modal.querySelectorAll('.product-zoom-control').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const action = e.currentTarget.dataset.action;
          this.handleZoomControl(action);
        });
      });

      // Pan functionality
      imageWrapper.addEventListener('mousedown', this.startPan.bind(this));
      imageWrapper.addEventListener('mousemove', this.pan.bind(this));
      imageWrapper.addEventListener('mouseup', this.endPan.bind(this));
      imageWrapper.addEventListener('mouseleave', this.endPan.bind(this));

      // Mouse wheel zoom
      imageWrapper.addEventListener('wheel', (e) => {
        e.preventDefault();
        const delta = e.deltaY > 0 ? -0.1 : 0.1;
        this.scale = Math.min(Math.max(this.scale + delta, 1), 5);
        this.updateImageTransform();
      }, { passive: false });

      // Touch pinch zoom for modal
      let initialTouchDistance = 0;
      imageWrapper.addEventListener('touchstart', (e) => {
        if (e.touches.length === 2) {
          initialTouchDistance = this.getDistance(e.touches[0], e.touches[1]);
        }
      });

      imageWrapper.addEventListener('touchmove', (e) => {
        if (e.touches.length === 2) {
          e.preventDefault();
          const currentDistance = this.getDistance(e.touches[0], e.touches[1]);
          const scaleChange = currentDistance / initialTouchDistance;
          this.scale = Math.min(Math.max(this.scale * scaleChange, 1), 5);
          this.updateImageTransform();
          initialTouchDistance = currentDistance;
        }
      }, { passive: false });
    }

    handleKeydown(e) {
      if (!this.modal || !this.modal.classList.contains('active')) return;

      switch(e.key) {
        case 'Escape':
          this.closeModal();
          break;
        case 'ArrowLeft':
          this.navigate(-1);
          break;
        case 'ArrowRight':
          this.navigate(1);
          break;
      }
    }

    handleZoomControl(action) {
      switch(action) {
        case 'zoom-in':
          this.scale = Math.min(this.scale + 0.3, 5);
          break;
        case 'zoom-out':
          this.scale = Math.max(this.scale - 0.3, 1);
          break;
        case 'reset':
          this.scale = 1;
          this.pointX = 0;
          this.pointY = 0;
          break;
      }
      this.updateImageTransform();
    }

    startPan(e) {
      if (this.scale <= 1) return;
      this.panning = true;
      this.start = { x: e.clientX - this.pointX, y: e.clientY - this.pointY };
      e.preventDefault();
    }

    pan(e) {
      if (!this.panning) return;
      e.preventDefault();
      this.pointX = e.clientX - this.start.x;
      this.pointY = e.clientY - this.start.y;
      this.updateImageTransform();
    }

    endPan() {
      this.panning = false;
    }

    updateImageTransform() {
      const image = this.modal.querySelector('.product-zoom-image');
      image.style.transform = `translate(${this.pointX}px, ${this.pointY}px) scale(${this.scale})`;
      image.style.cursor = this.scale > 1 ? 'grab' : 'default';
      if (this.panning) image.style.cursor = 'grabbing';
    }

    navigate(direction) {
      this.currentImageIndex += direction;
      if (this.currentImageIndex < 0) this.currentImageIndex = this.images.length - 1;
      if (this.currentImageIndex >= this.images.length) this.currentImageIndex = 0;

      this.showImage(this.currentImageIndex);
    }

    showImage(index) {
      const image = this.modal.querySelector('.product-zoom-image');
      const counter = this.modal.querySelector('.current-index');

      // Reset zoom
      this.scale = 1;
      this.pointX = 0;
      this.pointY = 0;

      // Update image
      image.src = this.images[index].src;
      image.alt = this.images[index].alt;

      // Update counter
      if (counter) counter.textContent = index + 1;

      this.updateImageTransform();
    }

    closeModal() {
      this.modal.classList.remove('active');
      document.removeEventListener('keydown', this.handleKeydown.bind(this));

      setTimeout(() => {
        this.modal.remove();
        this.modal = null;
        document.body.style.overflow = '';
      }, 300);
    }
  });
}
