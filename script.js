document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("myForm");

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

  // DOM elements
  const countrySelect = document.getElementById("country");
  const stateSelect = document.getElementById("state");
  const citySelect = document.getElementById("city");

  // Populate countries
  Object.keys(locationData).forEach(country => {
    const option = document.createElement("option");
    option.value = country;
    option.textContent = country;
    countrySelect.appendChild(option);
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
    const isValid = validationFn ? validationFn(field.value) : field.value.trim() !== '';
    
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
    { id: 'regNumber', errorId: 'regNumber-error', validationFn: validateRegNumber },
    { id: 'doj', errorId: 'doj-error' },
    { id: 'cgpa', errorId: 'cgpa-error', validationFn: validateCGPA }
  ];

  requiredFields.forEach(fieldInfo => {
    const field = document.getElementById(fieldInfo.id);
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
  });

  // Prevent non-numeric input in mobile and registration fields
  document.getElementById("mobile").addEventListener("input", function(e) {
    this.value = this.value.replace(/[^0-9]/g, '');
  });
  
  document.getElementById("regNumber").addEventListener("input", function(e) {
    this.value = this.value.replace(/[^0-9]/g, '');
  });

  // Form submission handler
  form.addEventListener("submit", function(e) {
    e.preventDefault();
    let isValid = true;

    // Validate all required fields
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

    if (isValid) {
      alert("Form submitted successfully!");
      form.reset();
      
      // Reset location selects
      stateSelect.disabled = true;
      citySelect.disabled = true;
      stateSelect.innerHTML = '<option value="">Select State</option>';
      citySelect.innerHTML = '<option value="">Select City</option>';
      
      // Clear all errors after successful submission
      document.querySelectorAll('.error-label').forEach(el => {
        el.style.display = 'none';
      });
      document.querySelectorAll('.error').forEach(el => {
        el.classList.remove('error');
      });
    } else {
      // Scroll to the first error
      const firstError = document.querySelector('.error-label[style="display: block;"], .error-label[style="display: block"]');
      if (firstError) {
        firstError.previousElementSibling.scrollIntoView({ behavior: 'smooth', block: 'center' });
        firstError.previousElementSibling.focus();
      }
    }
  });

  // Clear form handler
  form.querySelector('button[type="reset"]').addEventListener('click', function() {
    // Reset location selects
    stateSelect.disabled = true;
    citySelect.disabled = true;
    stateSelect.innerHTML = '<option value="">Select State</option>';
    citySelect.innerHTML = '<option value="">Select City</option>';
    
    // Clear all errors
    document.querySelectorAll('.error-label').forEach(el => {
      el.style.display = 'none';
    });
    document.querySelectorAll('.error').forEach(el => {
      el.classList.remove('error');
    });
  });
});