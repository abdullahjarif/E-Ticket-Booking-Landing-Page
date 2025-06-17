// Global variables
let selectedSeats = [];
const pricePerSeat = 560;
const bookedSeats = ['A1', 'A3', 'B2', 'C4', 'D1', 'E3', 'F2'];

// DOM elements
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileMenu = document.getElementById('mobileMenu');
const seatsContainer = document.getElementById('seatsContainer');
const confirmBtn = document.getElementById('confirmBtn');
const successModal = document.getElementById('successModal');
const modalClose = document.getElementById('modalClose');
const continueBtn = document.getElementById('continueBtn');

// Form elements
const fromLocation = document.getElementById('fromLocation');
const toLocation = document.getElementById('toLocation');
const travelDate = document.getElementById('travelDate');
const travelTime = document.getElementById('travelTime');

// Summary elements
const summaryRoute = document.getElementById('summaryRoute');
const summaryDate = document.getElementById('summaryDate');
const summaryTime = document.getElementById('summaryTime');
const summarySeats = document.getElementById('summarySeats');
const totalPrice = document.getElementById('totalPrice');
const seatCount = document.getElementById('seatCount');

// Modal elements
const modalSeats = document.getElementById('modalSeats');
const modalTotal = document.getElementById('modalTotal');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeSeats();
    updateSummary();
    attachEventListeners();
});

// Mobile menu toggle
function toggleMobileMenu() {
    mobileMenu.classList.toggle('show');
    
    // Animate hamburger menu
    const spans = mobileMenuBtn.querySelectorAll('span');
    if (mobileMenu.classList.contains('show')) {
        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
    } else {
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    }
}

// Initialize seat layout
function initializeSeats() {
    seatsContainer.innerHTML = '';
    
    for (let row = 0; row < 10; row++) {
        const rowLetter = String.fromCharCode(65 + row);
        const seatRow = document.createElement('div');
        seatRow.className = 'seat-row';
        
        // Left side seats (A1, A2)
        const leftGroup = document.createElement('div');
        leftGroup.className = 'seat-group';
        
        for (let col = 1; col <= 2; col++) {
            const seatId = `${rowLetter}${col}`;
            const seat = createSeat(seatId);
            leftGroup.appendChild(seat);
        }
        
        // Spacer
        const spacer = document.createElement('div');
        spacer.className = 'seat-spacer';
        
        // Right side seats (A3, A4)
        const rightGroup = document.createElement('div');
        rightGroup.className = 'seat-group';
        
        for (let col = 3; col <= 4; col++) {
            const seatId = `${rowLetter}${col}`;
            const seat = createSeat(seatId);
            rightGroup.appendChild(seat);
        }
        
        seatRow.appendChild(leftGroup);
        seatRow.appendChild(spacer);
        seatRow.appendChild(rightGroup);
        seatsContainer.appendChild(seatRow);
    }
}

// Create individual seat element
function createSeat(seatId) {
    const seat = document.createElement('button');
    seat.className = 'seat';
    seat.textContent = seatId;
    seat.dataset.seatId = seatId;
    
    if (bookedSeats.includes(seatId)) {
        seat.classList.add('booked');
        seat.disabled = true;
    } else {
        seat.addEventListener('click', () => handleSeatClick(seatId));
    }
    
    return seat;
}

// Handle seat selection
function handleSeatClick(seatId) {
    const seatElement = document.querySelector(`[data-seat-id="${seatId}"]`);
    
    if (selectedSeats.includes(seatId)) {
        // Deselect seat
        selectedSeats = selectedSeats.filter(seat => seat !== seatId);
        seatElement.classList.remove('selected');
    } else {
        // Select seat (max 4 seats)
        if (selectedSeats.length < 4) {
            selectedSeats.push(seatId);
            seatElement.classList.add('selected');
        } else {
            showNotification('Maximum 4 seats can be selected');
        }
    }
    
    updateSummary();
}

// Update booking summary
function updateSummary() {
    // Update route
    const from = fromLocation.value;
    const to = toLocation.value;
    summaryRoute.textContent = `${from} → ${to}`;
    
    // Update date
    const date = new Date(travelDate.value);
    const formattedDate = date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
    summaryDate.textContent = formattedDate;
    
    // Update time
    const time = travelTime.value;
    const formattedTime = formatTime(time);
    summaryTime.textContent = formattedTime;
    
    // Update selected seats
    if (selectedSeats.length > 0) {
        summarySeats.textContent = selectedSeats.join(', ');
        seatCount.textContent = `${selectedSeats.length} seat${selectedSeats.length > 1 ? 's' : ''} selected`;
        seatCount.style.display = 'block';
    } else {
        summarySeats.textContent = 'None';
        seatCount.style.display = 'none';
    }
    
    // Update total price
    const total = selectedSeats.length * pricePerSeat;
    totalPrice.textContent = `৳${total}`;
    
    // Update confirm button
    if (selectedSeats.length > 0) {
        confirmBtn.disabled = false;
        confirmBtn.textContent = 'Confirm Booking';
        confirmBtn.style.background = '#22c55e';
    } else {
        confirmBtn.disabled = true;
        confirmBtn.textContent = 'Select Seats First';
        confirmBtn.style.background = '#d1d5db';
    }
}

// Format time for display
function formatTime(time) {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
}

// Handle booking confirmation
function confirmBooking() {
    if (selectedSeats.length === 0) return;
    
    // Update modal content
    modalSeats.textContent = `Seats: ${selectedSeats.join(', ')}`;
    modalTotal.textContent = `Total: ৳${selectedSeats.length * pricePerSeat}`;
    
    // Show modal
    successModal.classList.add('show');
    document.body.style.overflow = 'hidden';
}

// Close modal and reset
function closeModal() {
    successModal.classList.remove('show');
    document.body.style.overflow = 'auto';
    
    // Reset selections
    selectedSeats = [];
    document.querySelectorAll('.seat.selected').forEach(seat => {
        seat.classList.remove('selected');
    });
    
    updateSummary();
}

// Show notification (simple alert for now)
function showNotification(message) {
    alert(message);
}

// Attach event listeners
function attachEventListeners() {
    // Mobile menu
    mobileMenuBtn.addEventListener('click', toggleMobileMenu);
    
    // Form changes
    fromLocation.addEventListener('change', updateSummary);
    toLocation.addEventListener('change', updateSummary);
    travelDate.addEventListener('change', updateSummary);
    travelTime.addEventListener('change', updateSummary);
    
    // Booking confirmation
    confirmBtn.addEventListener('click', confirmBooking);
    
    // Modal controls
    modalClose.addEventListener('click', closeModal);
    continueBtn.addEventListener('click', closeModal);
    
    // Close modal on overlay click
    successModal.addEventListener('click', function(e) {
        if (e.target === successModal) {
            closeModal();
        }
    });
    
    // Close modal on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && successModal.classList.contains('show')) {
            closeModal();
        }
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!mobileMenuBtn.contains(e.target) && !mobileMenu.contains(e.target)) {
            if (mobileMenu.classList.contains('show')) {
                toggleMobileMenu();
            }
        }
    });
}

// Smooth scrolling for anchor links
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

// Add loading animation for buttons
function addLoadingState(button, originalText) {
    button.disabled = true;
    button.textContent = 'Loading...';
    
    setTimeout(() => {
        button.disabled = false;
        button.textContent = originalText;
    }, 1000);
}

// Add hover effects for offer cards
document.querySelectorAll('.offer-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-8px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Add animation for stats on scroll
function animateStats() {
    const stats = document.querySelectorAll('.stat-number span');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const text = target.textContent;
                const number = parseInt(text.replace(/[^\d]/g, ''));
                
                if (number) {
                    animateNumber(target, 0, number, text);
                }
                observer.unobserve(target);
            }
        });
    });
    
    stats.forEach(stat => observer.observe(stat));
}

// Animate number counting
function animateNumber(element, start, end, suffix) {
    const duration = 2000;
    const increment = end / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= end) {
            current = end;
            clearInterval(timer);
        }
        
        const displayValue = Math.floor(current);
        if (suffix.includes('K')) {
            element.textContent = `${Math.floor(displayValue / 1000)}K+`;
        } else if (suffix.includes('Lacks')) {
            element.textContent = `${(displayValue / 100000).toFixed(1)} Lacks`;
        } else {
            element.textContent = `${displayValue}+`;
        }
    }, 16);
}

// Initialize animations when page loads
window.addEventListener('load', () => {
    animateStats();
});

// Add form validation
function validateForm() {
    const from = fromLocation.value;
    const to = toLocation.value;
    const date = new Date(travelDate.value);
    const today = new Date();
    
    if (from === to) {
        showNotification('Origin and destination cannot be the same');
        return false;
    }
    
    if (date < today.setHours(0, 0, 0, 0)) {
        showNotification('Please select a future date');
        return false;
    }
    
    return true;
}

// Add seat selection sound effect (optional)
function playSelectSound() {
    // Create audio context for click sound
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 800;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.1);
}