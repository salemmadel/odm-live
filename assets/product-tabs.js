/* Product Tabs Component */

class ProductTabs extends HTMLElement {
  constructor() {
    super();
    this.sectionId = this.dataset.sectionId;
    this.tabButtons = this.querySelectorAll('.product-tabs__button');
    this.accordionButtons = this.querySelectorAll('.product-tabs__accordion-button');
    this.panels = this.querySelectorAll('.product-tabs__panel');

    this.init();
  }

  init() {
    // Desktop tab functionality
    this.tabButtons.forEach((button) => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        const tabNumber = button.dataset.tab;
        this.switchTab(tabNumber);
      });
    });

    // Mobile accordion functionality
    this.accordionButtons.forEach((button) => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        const accordionNumber = button.dataset.accordion;
        this.toggleAccordion(accordionNumber, button);
      });
    });
  }

  switchTab(tabNumber) {
    // Remove active class from all tab buttons
    this.tabButtons.forEach((btn) => {
      btn.classList.remove('active');
      btn.setAttribute('aria-selected', 'false');
    });

    // Remove active class from all panels
    this.panels.forEach((panel) => {
      panel.classList.remove('active');
    });

    // Add active class to clicked tab button
    const activeButton = this.querySelector(`[data-tab="${tabNumber}"]`);
    if (activeButton) {
      activeButton.classList.add('active');
      activeButton.setAttribute('aria-selected', 'true');
    }

    // Add active class to corresponding panel
    const activePanel = this.querySelector(`#tab-panel-${this.sectionId}-${tabNumber}`);
    if (activePanel) {
      activePanel.classList.add('active');
    }

    // Also update accordion button state (for when resizing)
    const activeAccordionButton = this.querySelector(`[data-accordion="${tabNumber}"]`);
    if (activeAccordionButton) {
      activeAccordionButton.classList.add('active');
      activeAccordionButton.setAttribute('aria-expanded', 'true');
    }
  }

  toggleAccordion(accordionNumber, button) {
    const isActive = button.classList.contains('active');
    const panel = this.querySelector(`#tab-panel-${this.sectionId}-${accordionNumber}`);

    if (isActive) {
      // Close this accordion
      button.classList.remove('active');
      button.setAttribute('aria-expanded', 'false');
      if (panel) {
        panel.classList.remove('active');
      }
    } else {
      // Close all other accordions
      this.accordionButtons.forEach((btn) => {
        btn.classList.remove('active');
        btn.setAttribute('aria-expanded', 'false');
      });
      this.panels.forEach((p) => {
        p.classList.remove('active');
      });

      // Open this accordion
      button.classList.add('active');
      button.setAttribute('aria-expanded', 'true');
      if (panel) {
        panel.classList.add('active');
      }

      // Also update desktop tab button state (for when resizing)
      const tabButton = this.querySelector(`[data-tab="${accordionNumber}"]`);
      if (tabButton) {
        this.tabButtons.forEach((btn) => {
          btn.classList.remove('active');
          btn.setAttribute('aria-selected', 'false');
        });
        tabButton.classList.add('active');
        tabButton.setAttribute('aria-selected', 'true');
      }
    }
  }
}

// Register custom element
if (!customElements.get('product-tabs')) {
  customElements.define('product-tabs', ProductTabs);
}
