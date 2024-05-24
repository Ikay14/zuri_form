const myForm = document.getElementById("myForm");
const firstName = document.getElementById("firstName");
const lastName = document.getElementById("lastName");
const otherName = document.getElementById("otherName");
const email = document.getElementById("email");
const phone = document.getElementById("phone");
const gender = document.getElementById("gender");

// Function to validate the form
async function validateForm(event) {
  // Prevent the default form submission
  event.preventDefault();

  // Define the required length for names and set the pattern for the phone number
  const nameLength = 2;
  const phoneNumberPattern = /^\d{10,}$/;

  // Initialize isValid to true
  let isValid = true;

  // Validate firstName and lastName
  if (!firstName.value || firstName.value.trim().length < nameLength) {
    isValid = false;
  }

  if (!lastName.value || lastName.value.trim().length < nameLength) {
    isValid = false;
  }

  // Validate otherName
  if (otherName.value.trim() !== "" && otherName.value.trim() <= 2) {
    isValid = false;
  }

  // Validate email
  if (!email.validity.valid) {
    isValid = false;
  }

  // Validate phone
  if (!phoneNumberPattern.test(phone.value)) {
    isValid = false;
  }

  // Validate gender
  if (!gender.value) {
    isValid = false;
  }

  // Submit the form if all inputs are valid
  if (isValid) {
    // A FormData object would be better here but your bootcamp will definitely teach you that
    try {
      const response = await fetch("/submit-form", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: firstName.value,
          lastName: lastName.value,
          otherNames: otherName.value,
          email: email.value,
          phone: phone.value,
          gender: gender.value,
        }),
      });

      if (response.ok) {
        alert("Form submitted successfully!");
      }
    } catch (error) {
        console.table(error)
      alert(`Error submitting form`);
    }
  } else {
    alert("Please correct the errors in the form.");
  }
}

// Attach the validation function to the form's submit event
myForm.addEventListener("submit", validateForm);
