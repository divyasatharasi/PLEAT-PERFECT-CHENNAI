// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Navbar scroll effect
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.15)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    }
});

// Portfolio filter functionality
document.addEventListener('DOMContentLoaded', function() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');

            const filterValue = this.getAttribute('data-filter');

            portfolioItems.forEach(item => {
                if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, 100);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
});

// Price calculator for booking form
document.addEventListener('DOMContentLoaded', function() {
    const serviceSelect = document.getElementById('serviceType');
    const sareeCountSelect = document.getElementById('sareeCount');
    const additionalServices = document.querySelectorAll('input[name="additionalServices"]');
    const totalPriceElement = document.getElementById('totalPrice');

    function calculatePrice() {
        let basePrice = 0;
        let count = parseInt(sareeCountSelect.value) || 1;
        let additionalPrice = 0;

        // Base service price
        const serviceType = serviceSelect.value;
        switch(serviceType) {
            case 'basic':
                basePrice = 250;
                break;
            case 'premium':
                basePrice = 400;
                break;
            case 'bridal':
                basePrice = 650;
                break;
        }

        // Additional services
        additionalServices.forEach(service => {
            if (service.checked) {
                switch(service.value) {
                    case 'fall':
                        additionalPrice += 100;
                        break;
                    case 'pico':
                        additionalPrice += 80;
                        break;
                    case 'express':
                        additionalPrice += 150;
                        break;
                }
            }
        });

        // Calculate total
        const total = (basePrice * count) + additionalPrice;
        totalPriceElement.textContent = `₹${total}`;
    }

    // Add event listeners
    if (serviceSelect) serviceSelect.addEventListener('change', calculatePrice);
    if (sareeCountSelect) sareeCountSelect.addEventListener('change', calculatePrice);
    additionalServices.forEach(service => {
        service.addEventListener('change', calculatePrice);
    });

    // Set minimum date to today
    const pickupDateInput = document.getElementById('pickupDate');
    if (pickupDateInput) {
        const today = new Date().toISOString().split('T')[0];
        pickupDateInput.setAttribute('min', today);
    }
});

// Form submission handlers
document.addEventListener('DOMContentLoaded', function() {
    // Booking form submission
    const bookingForm = document.getElementById('bookingForm');
    if (bookingForm) {
        bookingForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const bookingData = {};
            for (let [key, value] of formData.entries()) {
                if (bookingData[key]) {
                    // Handle multiple values (like additional services)
                    if (Array.isArray(bookingData[key])) {
                        bookingData[key].push(value);
                    } else {
                        bookingData[key] = [bookingData[key], value];
                    }
                } else {
                    bookingData[key] = value;
                }
            }

            // Create WhatsApp message
            const message = createWhatsAppMessage(bookingData);
            
            // Show loading state
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<span class="loading"></span> Processing...';
            submitBtn.disabled = true;

            // Simulate processing time
            setTimeout(() => {
                // Open WhatsApp
                window.open(`https://wa.me/919876543210?text=${encodeURIComponent(message)}`, '_blank');
                
                // Reset button and show success message
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                
                // Show success alert
                showAlert('Booking request sent! We will contact you shortly to confirm.', 'success');
                
                // Reset form
                this.reset();
                document.getElementById('totalPrice').textContent = '₹0';
            }, 2000);
        });
    }

    // Contact form submission
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const name = formData.get('name') || 'Customer';
            const email = formData.get('email') || '';
            const phone = formData.get('phone') || '';
            const subject = formData.get('subject') || 'General Inquiry';
            const message = formData.get('message') || '';

            const whatsappMessage = `Hello! I'm ${name} and I have a ${subject.toLowerCase()}.

${message}

Contact Details:
📧 Email: ${email}
📱 Phone: ${phone}

Please get back to me at your earliest convenience.`;

            // Show loading state
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<span class="loading"></span> Sending...';
            submitBtn.disabled = true;

            setTimeout(() => {
                window.open(`https://wa.me/919876543210?text=${encodeURIComponent(whatsappMessage)}`, '_blank');
                
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                
                showAlert('Message sent! We will get back to you soon.', 'success');
                this.reset();
            }, 1500);
        });
    }
});

// Create WhatsApp message from booking data
function createWhatsAppMessage(data) {
    const serviceNames = {
        'basic': 'Basic Pleating (₹250)',
        'premium': 'Premium Pleating (₹400)',
        'bridal': 'Bridal Special (₹650)'
    };

    const timeSlots = {
        'morning': 'Morning (9 AM - 12 PM)',
        'afternoon': 'Afternoon (12 PM - 4 PM)',
        'evening': 'Evening (4 PM - 7 PM)'
    };

    let message = `🌸 *New Booking Request - Pleat Perfect Chennai* 🌸

👤 *Customer Details:*
Name: ${data.customerName}
Phone: ${data.phoneNumber}
Email: ${data.email || 'Not provided'}

📍 *Pickup Address:*
${data.address}

🛍️ *Service Details:*
Service: ${serviceNames[data.serviceType] || data.serviceType}
Number of Sarees: ${data.sareeCount}
Pickup Date: ${data.pickupDate}
Preferred Time: ${timeSlots[data.pickupTime] || data.pickupTime}`;

    // Add additional services
    if (data.additionalServices) {
        message += `\n\n➕ *Additional Services:*`;
        const services = Array.isArray(data.additionalServices) ? data.additionalServices : [data.additionalServices];
        services.forEach(service => {
            switch(service) {
                case 'fall':
                    message += `\n• Fall (+₹100)`;
                    break;
                case 'pico':
                    message += `\n• Pico (+₹80)`;
                    break;
                case 'express':
                    message += `\n• Express Service (+₹150)`;
                    break;
            }
        });
    }

    // Add special requirements
    if (data.specialRequirements && data.specialRequirements.trim()) {
        message += `\n\n📝 *Special Requirements:*\n${data.specialRequirements}`;
    }

    message += `\n\n💰 *Estimated Total:* ${document.getElementById('totalPrice').textContent}

Please confirm this booking and let me know the exact pickup time. Thank you! 🙏`;

    return message;
}

// Alert function
function showAlert(message, type = 'info') {
    // Remove existing alerts
    const existingAlert = document.querySelector('.custom-alert');
    if (existingAlert) {
        existingAlert.remove();
    }

    // Create alert element
    const alert = document.createElement('div');
    alert.className = `custom-alert alert-${type}`;
    alert.innerHTML = `
        <div class="alert-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
        <button class="alert-close">&times;</button>
    `;

    // Add styles
    alert.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#d4edda' : '#d1ecf1'};
        color: ${type === 'success' ? '#155724' : '#0c5460'};
        border: 1px solid ${type === 'success' ? '#c3e6cb' : '#bee5eb'};
        border-radius: 10px;
        padding: 15px 20px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        z-index: 9999;
        max-width: 400px;
        animation: slideInRight 0.3s ease;
    `;

    // Add animation styles
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        .custom-alert .alert-content {
            display: flex;
            align-items: center;
            gap: 10px;
        }
        .custom-alert .alert-close {
            position: absolute;
            top: 5px;
            right: 10px;
            background: none;
            border: none;
            font-size: 20px;
            cursor: pointer;
            color: inherit;
        }
    `;
    document.head.appendChild(style);

    // Add to page
    document.body.appendChild(alert);

    // Close functionality
    const closeBtn = alert.querySelector('.alert-close');
    closeBtn.addEventListener('click', () => {
        alert.style.animation = 'slideInRight 0.3s ease reverse';
        setTimeout(() => alert.remove(), 300);
    });

    // Auto remove after 5 seconds
    setTimeout(() => {
        if (alert.parentNode) {
            alert.style.animation = 'slideInRight 0.3s ease reverse';
            setTimeout(() => alert.remove(), 300);
        }
    }, 5000);
}

// Intersection Observer for animations
document.addEventListener('DOMContentLoaded', function() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Observe elements for animation
    document.querySelectorAll('.service-card, .pricing-card, .testimonial-card, .portfolio-card').forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });
});

// Testimonials slider auto-scroll
document.addEventListener('DOMContentLoaded', function() {
    const slider = document.querySelector('.testimonials-slider');
    if (slider) {
        let isScrolling = false;
        let scrollDirection = 1;

        function autoScroll() {
            if (isScrolling) return;

            const maxScroll = slider.scrollWidth - slider.clientWidth;
            
            if (slider.scrollLeft >= maxScroll) {
                scrollDirection = -1;
            } else if (slider.scrollLeft <= 0) {
                scrollDirection = 1;
            }

            slider.scrollBy({
                left: scrollDirection * 300,
                behavior: 'smooth'
            });
        }

        // Auto scroll every 5 seconds
        const autoScrollInterval = setInterval(autoScroll, 5000);

        // Pause auto scroll on hover
        slider.addEventListener('mouseenter', () => {
            isScrolling = true;
        });

        slider.addEventListener('mouseleave', () => {
            isScrolling = false;
        });

        // Handle manual scrolling
        slider.addEventListener('scroll', () => {
            isScrolling = true;
            clearTimeout(slider.scrollTimeout);
            slider.scrollTimeout = setTimeout(() => {
                isScrolling = false;
            }, 1000);
        });
    }
});

// Phone number formatting
document.addEventListener('DOMContentLoaded', function() {
    const phoneInputs = document.querySelectorAll('input[type="tel"]');
    phoneInputs.forEach(input => {
        input.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 10) {
                value = value.slice(0, 10);
            }
            e.target.value = value;
        });
    });
});

// Form validation enhancement
document.addEventListener('DOMContentLoaded', function() {
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
        
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });

            input.addEventListener('input', function() {
                if (this.classList.contains('is-invalid')) {
                    validateField(this);
                }
            });
        });
    });
});

function validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';

    // Remove existing validation classes
    field.classList.remove('is-valid', 'is-invalid');

    // Check if field is required and empty
    if (field.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = 'This field is required';
    }

    // Email validation
    if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid email address';
        }
    }

    // Phone validation
    if (field.type === 'tel' && value) {
        if (value.length !== 10) {
            isValid = false;
            errorMessage = 'Phone number must be 10 digits';
        }
    }

    // Apply validation classes
    field.classList.add(isValid ? 'is-valid' : 'is-invalid');

    // Show/hide error message
    let errorDiv = field.parentNode.querySelector('.invalid-feedback');
    if (!isValid) {
        if (!errorDiv) {
            errorDiv = document.createElement('div');
            errorDiv.className = 'invalid-feedback';
            field.parentNode.appendChild(errorDiv);
        }
        errorDiv.textContent = errorMessage;
        errorDiv.style.display = 'block';
    } else if (errorDiv) {
        errorDiv.style.display = 'none';
    }

    return isValid;
}

// Back to top button
document.addEventListener('DOMContentLoaded', function() {
    // Create back to top button
    const backToTop = document.createElement('button');
    backToTop.innerHTML = '<i class="fas fa-arrow-up"></i>';
    backToTop.className = 'back-to-top';
    backToTop.style.cssText = `
        position: fixed;
        bottom: 100px;
        right: 30px;
        width: 50px;
        height: 50px;
        background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
        color: white;
        border: none;
        border-radius: 50%;
        font-size: 20px;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 999;
        box-shadow: 0 4px 15px rgba(214, 51, 132, 0.3);
    `;

    document.body.appendChild(backToTop);

    // Show/hide button based on scroll position
    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            backToTop.style.opacity = '1';
            backToTop.style.visibility = 'visible';
        } else {
            backToTop.style.opacity = '0';
            backToTop.style.visibility = 'hidden';
        }
    });

    // Scroll to top on click
    backToTop.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Hover effect
    backToTop.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-3px)';
        this.style.boxShadow = '0 6px 20px rgba(214, 51, 132, 0.4)';
    });

    backToTop.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
        this.style.boxShadow = '0 4px 15px rgba(214, 51, 132, 0.3)';
    });
});

// Portfolio modal functionality
function openPortfolioModal(itemId) {
    // This would open a modal with detailed images and information
    // For now, we'll just show an alert
    showAlert('Portfolio details would open in a modal. This feature can be enhanced with a proper image gallery.', 'info');
}

// Search functionality (if needed)
function initSearch() {
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = 'Search services...';
    searchInput.className = 'form-control search-input';
    
    // Add search logic here if needed
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        // Implement search logic
    });
}

// Loading screen
document.addEventListener('DOMContentLoaded', function() {
    // Remove loading screen if exists
    const loader = document.getElementById('loader');
    if (loader) {
        setTimeout(() => {
            loader.style.opacity = '0';
            setTimeout(() => {
                loader.remove();
            }, 500);
        }, 1000);
    }
});

// Error handling for images
document.addEventListener('DOMContentLoaded', function() {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('error', function() {
            // Replace with placeholder image or hide
            this.style.display = 'none';
            
            // Create placeholder
            const placeholder = document.createElement('div');
            placeholder.style.cssText = `
                width: 100%;
                height: 200px;
                background: linear-gradient(135deg, #f8f9fa, #e9ecef);
                display: flex;
                align-items: center;
                justify-content: center;
                color: #6c757d;
                font-size: 18px;
                border-radius: 10px;
            `;
            placeholder.innerHTML = '<i class="fas fa-image"></i> Image Coming Soon';
            
            this.parentNode.insertBefore(placeholder, this);
        });
    });
});

console.log('Pleat Perfect Chennai - Website loaded successfully! 🌸');