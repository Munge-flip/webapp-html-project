// Wait for the DOM to fully load before running code
document.addEventListener('DOMContentLoaded', function() {
    
    let isSignUp = true;

    // Get all the elements we need
    const toggleBtn = document.getElementById('toggleBtn');
    const promoTitle = document.getElementById('promoTitle');
    const promoText = document.getElementById('promoText');
    const formTitle = document.getElementById('formTitle');
    const signupForm = document.getElementById('signupForm');
    const signinForm = document.getElementById('signinForm');

    // Add click event listener to toggle button
    toggleBtn.addEventListener('click', toggleForm);

    // Add submit event listeners to forms
    signupForm.addEventListener('submit', handleSignUp);
    signinForm.addEventListener('submit', handleSignIn);

    // Toggle between Sign Up and Sign In
    function toggleForm() {
        isSignUp = !isSignUp;
        
        if (isSignUp) {
            // Switch to Sign Up
            promoTitle.textContent = 'ALREADY HAVE AN ACCOUNT?';
            promoText.textContent = 'Sign in to our account and enjoy your service with Hoyo Piloting service';
            toggleBtn.textContent = 'Sign In';
            formTitle.textContent = 'SIGN UP';
            signupForm.classList.add('active');
            signinForm.classList.remove('active');
        } else {
            // Switch to Sign In
            promoTitle.textContent = 'NEED AN ACCOUNT?';
            promoText.textContent = 'Sign up an account and enjoy the services';
            toggleBtn.textContent = 'Create New Account';
            formTitle.textContent = 'SIGN IN';
            signupForm.classList.remove('active');
            signinForm.classList.add('active');
        }
    }

    // Handle Sign Up form submission
    function handleSignUp(e) {
        e.preventDefault(); // Prevent form from actually submitting
        
        // Get form values
        const name = signupForm.querySelector('input[type="text"]').value;
        const email = signupForm.querySelectorAll('input[type="email"]')[0].value;
        const phone = signupForm.querySelector('input[type="tel"]').value;
        const password = signupForm.querySelectorAll('input[type="password"]')[0].value;
        const confirmPassword = signupForm.querySelectorAll('input[type="password"]')[1].value;

        // Basic validation
        if (password !== confirmPassword) {
            alert('Passwords do not match!');
            return;
        }

        // TODO: Connect to your backend here
        console.log('Sign Up Data:', { name, email, phone, password });
        alert('Sign Up functionality - connect to your backend');
    }

    // Handle Sign In form submission
    function handleSignIn(e) {
        e.preventDefault(); // Prevent form from actually submitting
        
        // Get form values
        const email = signinForm.querySelector('input[type="email"]').value;
        const password = signinForm.querySelector('input[type="password"]').value;

        // TODO: Connect to your backend here
        console.log('Sign In Data:', { email, password });
        alert('Sign In functionality - connect to your backend');
    }

    // Form validation styling
    document.querySelectorAll('input').forEach(input => {
        input.addEventListener('invalid', function(e) {
            e.preventDefault();
            this.style.boxShadow = '0 0 0 3px rgba(255, 0, 0, 0.3)';
        });
        
        input.addEventListener('input', function() {
            this.style.boxShadow = '';
        });
    });

});