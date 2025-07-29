document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("myForm");
  const clearButton = document.getElementById("clearButton");
  const confirmationPopup = document.getElementById("confirmationPopup");
  const confirmClearButton = document.getElementById("confirmClear");
  const cancelClearButton = document.getElementById("cancelClear");

  // Country-State-City data structure
  const locationData = {
    "India": {
      "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Tiruchirappalli"],
      "Kerala": ["Thiruvananthapuram", "Kochi", "Kozhikode", "Thrissur"],
      "Karnataka": ["Bangalore", "Mysore", "Hubli", "Mangalore"]
    },
    "United Kingdom": {
      "England": ["London", "Manchester", "Birmingham", "Liverpool"],
      "Scotland": ["Edinburgh", "Glasgow", "Aberdeen", "Dundee"],
      "Wales": ["Cardiff", "Swansea", "Newport", "Bangor"]
    },
    "United States": {
      "California": ["Los Angeles", "San Francisco", "San Diego", "Sacramento"],
      "Texas": ["Houston", "Dallas", "Austin", "San Antonio"],
      "New York": ["New York City", "Buffalo", "Rochester", "Albany"]
    }
  };

  // Common courses for all colleges
  const commonCourses = [
    "Bachelor of Science - Computer Science",
    "Bachelor of Science - Information Technology",
    "Bachelor of Commerce",
    "Bachelor of Business Administration",
    "Bachelor of Arts - English",
    "Master of Computer Applications",
    "Master of Business Administration"
  ];

  // DOM elements
  const countrySelect = document.getElementById("country");
  const stateSelect = document.getElementById("state");
  const citySelect = document.getElementById("city");
  const collegeSelect = document.getElementById("collegeName");
  const courseSelect = document.getElementById("courseName");
  const photoInput = document.getElementById("photo");
  const profilePicture = document.getElementById("profile-picture");
  const photoError = document.getElementById("photo-error");

  // Show confirmation popup when Clear button is clicked
  clearButton.addEventListener("click", function() {
    confirmationPopup.classList.add("active");
  });

  // Handle confirmation to clear the form
  confirmClearButton.addEventListener("click", function() {
    resetForm();
    confirmationPopup.classList.remove("active");
  });

  // Handle cancellation of clear action
  cancelClearButton.addEventListener("click", function() {
    confirmationPopup.classList.remove("active");
  });

  // Function to reset the form
  function resetForm() {
    form.reset();
    
    // Reset location selects
    stateSelect.disabled = true;
    citySelect.disabled = true;
    stateSelect.innerHTML = '<option value="">Select State</option>';
    citySelect.innerHTML = '<option value="">Select City</option>';
    
    // Reset college and course selects
    courseSelect.disabled = true;
    courseSelect.innerHTML = '<option value="">Select Course</option>';
    
    // Reset profile picture
    const img = profilePicture.querySelector('img');
    if (img) {
      profilePicture.removeChild(img);
    }
    if (!profilePicture.querySelector('.profile-picture-icon')) {
      const icon = document.createElement('div');
      icon.className = 'profile-picture-icon';
      icon.innerHTML = '<i class="fas fa-user"></i>';
      profilePicture.appendChild(icon);
    }
    
    // Clear all errors
    document.querySelectorAll('.error-label').forEach(el => {
      el.style.display = 'none';
    });
    document.querySelectorAll('.error').forEach(el => {
      el.classList.remove('error');
    });
  }

  // Photo upload preview
  photoInput.addEventListener('change', function() {
    const file = this.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function(e) {
        // Remove the icon
        const icon = profilePicture.querySelector('.profile-picture-icon');
        if (icon) {
          profilePicture.removeChild(icon);
        }
        
        // Create or update the image
        let img = profilePicture.querySelector('img');
        if (!img) {
          img = document.createElement('img');
          profilePicture.appendChild(img);
        }
        img.src = e.target.result;
        photoError.style.display = 'none';
      }
      reader.readAsDataURL(file);
    } else {
      // If no file selected, show the icon again
      const img = profilePicture.querySelector('img');
      if (img) {
        profilePicture.removeChild(img);
      }
      if (!profilePicture.querySelector('.profile-picture-icon')) {
        const icon = document.createElement('div');
        icon.className = 'profile-picture-icon';
        icon.innerHTML = '<i class="fas fa-user"></i>';
        profilePicture.appendChild(icon);
      }
    }
  });

  // Populate countries
  Object.keys(locationData).forEach(country => {
    const option = document.createElement("option");
    option.value = country;
    option.textContent = country;
    countrySelect.appendChild(option);
  });

  // College change handler - now uses common courses for all colleges
  collegeSelect.addEventListener("change", function() {
    // Reset course
    courseSelect.innerHTML = '<option value="">Select Course</option>';
    
    // Enable course select if any college is selected
    courseSelect.disabled = !this.value;
    
    // Populate the same courses for all colleges
    commonCourses.forEach(course => {
      const option = document.createElement("option");
      option.value = course;
      option.textContent = course;
      courseSelect.appendChild(option);
    });
  });

  // Country change handler
  countrySelect.addEventListener("change", function() {
    // Reset state and city
    stateSelect.innerHTML = '<option value="">Select State</option>';
    citySelect.innerHTML = '<option value="">Select City</option>';
    
    // Enable/disable state select
    if (this.value) {
      stateSelect.disabled = false;
      
      // Populate states
      const states = locationData[this.value];
      Object.keys(states).forEach(state => {
        const option = document.createElement("option");
        option.value = state;
        option.textContent = state;
        stateSelect.appendChild(option);
      });
    } else {
      stateSelect.disabled = true;
      citySelect.disabled = true;
    }
    
    // Clear any errors
    document.getElementById("state-error").style.display = "none";
    document.getElementById("city-error").style.display = "none";
    stateSelect.classList.remove("error");
    citySelect.classList.remove("error");
  });

  // State change handler
  stateSelect.addEventListener("change", function() {
    // Reset city
    citySelect.innerHTML = '<option value="">Select City</option>';
    
    // Enable/disable city select
    if (this.value) {
      citySelect.disabled = false;
      
      // Populate cities
      const country = countrySelect.value;
      const cities = locationData[country][this.value];
      cities.forEach(city => {
        const option = document.createElement("option");
        option.value = city;
        option.textContent = city;
        citySelect.appendChild(option);
      });
    } else {
      citySelect.disabled = true;
    }
    
    // Clear any errors
    document.getElementById("city-error").style.display = "none";
    citySelect.classList.remove("error");
  });

  // Function to validate a field
  function validateField(field, errorId, validationFn) {
    const errorElement = document.getElementById(errorId);
    let isValid = false;
    
    if (validationFn) {
      isValid = validationFn(field.value);
    } else if (field.type === 'checkbox' || field.type === 'radio') {
      isValid = field.checked;
    } else if (field.tagName === 'SELECT') {
      isValid = field.value !== '';
    } else if (field.type === 'file') {
      isValid = field.files.length > 0;
    } else {
      isValid = field.value.trim() !== '';
    }
    
    if (!isValid) {
      field.classList.add('error');
      errorElement.style.display = 'block';
      return false;
    } else {
      field.classList.remove('error');
      errorElement.style.display = 'none';
      return true;
    }
  }

  // Field validation functions
  function validateMobile(value) {
    return /^\d{10}$/.test(value);
  }

  function validateEmail(value) {
    return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.com$/.test(value);
  }

  function validateRegNumber(value) {
    return /^\d{7}$/.test(value);
  }

  function validateCGPA(value) {
    const num = parseFloat(value);
    return !isNaN(num) && num >= 0 && num <= 10;
  }

  function validateDOB(value) {
    if (!value) return false;
    
    const enteredDate = new Date(value);
    const today = new Date();
    const age = today.getFullYear() - enteredDate.getFullYear();
    const monthDiff = today.getMonth() - enteredDate.getMonth();
    const isOldEnough = age > 10 || (age === 10 && monthDiff >= 0);
    
    return enteredDate < today && isOldEnough;
  }

  // Set up blur event listeners for all required fields
  const requiredFields = [
    { id: 'name', errorId: 'name-error' },
    { id: 'gender', errorId: 'gender-error' },
    { id: 'dob', errorId: 'dob-error', validationFn: validateDOB },
    { id: 'mobile', errorId: 'mobile-error', validationFn: validateMobile },
    { id: 'email', errorId: 'email-error', validationFn: validateEmail },
    { id: 'country', errorId: 'country-error' },
    { id: 'state', errorId: 'state-error' },
    { id: 'city', errorId: 'city-error' },
    { id: 'fatherName', errorId: 'fatherName-error' },
    { id: 'fatherOccupation', errorId: 'fatherOccupation-error' },
    { id: 'motherName', errorId: 'motherName-error' },
    { id: 'motherOccupation', errorId: 'motherOccupation-error' },
    { id: 'fatherPhone', errorId: 'fatherPhone-error', validationFn: validateMobile },
    { id: 'motherPhone', errorId: 'motherPhone-error', validationFn: validateMobile },
    { id: 'address', errorId: 'address-error' },
    { id: 'regNumber', errorId: 'regNumber-error', validationFn: validateRegNumber },
    { id: 'doj', errorId: 'doj-error' },
    { id: 'cgpa', errorId: 'cgpa-error', validationFn: validateCGPA },
    { id: 'photo', errorId: 'photo-error' }
  ];

  // Validate all fields on submit
  function validateAllFields() {
    let isValid = true;
    
    requiredFields.forEach(fieldInfo => {
      const field = document.getElementById(fieldInfo.id);
      const fieldValid = validateField(field, fieldInfo.errorId, fieldInfo.validationFn);
      
      if (!fieldValid) {
        isValid = false;
      }
      
      // Special case for DOB
      if (fieldInfo.id === 'dob' && field.value && !validateDOB(field.value)) {
        document.getElementById('dob-age-error').style.display = 'block';
        field.classList.add('error');
        isValid = false;
      }
    });
    
    return isValid;
  }

  // Set up blur event listeners for all required fields
  requiredFields.forEach(fieldInfo => {
    const field = document.getElementById(fieldInfo.id);
    if (field.type !== 'file') { // Skip file input for blur events
      field.addEventListener('blur', function() {
        validateField(field, fieldInfo.errorId, fieldInfo.validationFn);
        
        // Special case for DOB to show age error
        if (fieldInfo.id === 'dob' && field.value && !validateDOB(field.value)) {
          document.getElementById('dob-age-error').style.display = 'block';
          field.classList.add('error');
        } else if (fieldInfo.id === 'dob') {
          document.getElementById('dob-age-error').style.display = 'none';
        }
      });
    }
  });

  // Prevent non-numeric input in mobile, fatherPhone, motherPhone, and registration fields
  document.getElementById("mobile").addEventListener("input", function(e) {
    this.value = this.value.replace(/[^0-9]/g, '');
  });
  
  document.getElementById("fatherPhone").addEventListener("input", function(e) {
    this.value = this.value.replace(/[^0-9]/g, '');
  });

  document.getElementById("motherPhone").addEventListener("input", function(e) {
    this.value = this.value.replace(/[^0-9]/g, '');
  });
  
  document.getElementById("regNumber").addEventListener("input", function(e) {
    this.value = this.value.replace(/[^0-9]/g, '');
  });

  // Only allow numbers and decimal for CGPA
  document.getElementById("cgpa").addEventListener("input", function(e) {
    this.value = this.value.replace(/[^0-9.]/g, '');
    // Ensure only one decimal point
    if ((this.value.match(/\./g) || []).length > 1) {
      this.value = this.value.substring(0, this.value.lastIndexOf('.'));
    }
  });

  // Form submission handler
  form.addEventListener("submit", function(e) {
    e.preventDefault();
    
    // Validate all fields
    const isValid = validateAllFields();

    if (isValid) {
      alert("Student Details Successfully Submitted !");
      resetForm();
    } else {
      // Find the first error and scroll to it
      const firstErrorField = document.querySelector('.error');
      if (firstErrorField) {
        firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
        firstErrorField.focus();
      }
    }
  });
});