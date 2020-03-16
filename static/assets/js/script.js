(() => {
  const form = document.querySelector('form');
  const formResponse = document.getElementById('notice-area');
  const noticeText = document.getElementById('js-form-response');
  const submitButton = document.getElementById( 'submit' );
  const errors = document.getElementsByClassName('error-message')
  
  var name = document.getElementById("potential_lead_name");
  var company = document.getElementById("potential_lead_company");
  var email = document.getElementById("potential_lead_email");
  var phone = document.getElementById("potential_lead_phone");
  var website = document.getElementById("potential_lead_website");

  var city1 = document.getElementById("potential_lead_cities_1");
  var city2 = document.getElementById("potential_lead_cities_2");
  var city3 = document.getElementById("potential_lead_cities_3");

  document.getElementById("submit").onclick = function() { 
    if ( location.hostname === "dev.free.rynoss.com" ) {
      document.getElementById("create-lead").action = "https://29qe8990aj.execute-api.us-east-1.amazonaws.com/dev/create_lead";
    } else {
      document.getElementById("create-lead").action = "https://by3kowtpsa.execute-api.us-east-1.amazonaws.com/prod/create_lead";
    }
    document.getElementById("create-lead").submit
  };

  form.onsubmit = e => {
    e.preventDefault();
    
    submitButton.disabled = true;

    for (var i=0, len=errors.length|0; i<len; i=i+1|0) {
      errors[i].style.opacity = "0"
    }
    email.parentNode.querySelector('.email-error-message').style.opacity = "0";
    website.parentNode.querySelector('.website-error-message').style.opacity = "0";

    // Prepare data to send
    const data = {};
    const formElements = Array.from(form);
    formElements.map(input => (data[input.name] = input.value));

    var canSubmit = true;

    if ( name.value == '' ) {
      name.parentNode.querySelector('.error-message').style.opacity = "1";
      canSubmit = false;
    }

    if ( company.value == '' ) {
      company.parentNode.querySelector('.error-message').style.opacity = "1";
      canSubmit = false;
    }

    if ( email.value == '' ) {
      email.parentNode.querySelector('.error-message').style.opacity = "1";
      canSubmit = false;
    } else {
      if ( validateEmail( email.value ) === false ) {
        email.parentNode.querySelector('.email-error-message').style.opacity = "1";
        canSubmit = false;
      }
    }
    
    if ( phone.value == '' ) {
      phone.parentNode.querySelector('.error-message').style.opacity = "1";
      canSubmit = false;
    }
    
    if ( website.value == '' ) {
      website.parentNode.querySelector('.error-message').style.opacity = "1";
      canSubmit = false;
    } else {
      if ( validURL( website.value ) === false ) {
        website.parentNode.querySelector('.website-error-message').style.opacity = "1";
        canSubmit = false;
      }
      
    }
    
    if ( city1.value == '' ) {
      city1.parentNode.querySelector('.error-message').style.opacity = "1";
      canSubmit = false;
    }

    if ( city2.value == '' ) {
      city2.parentNode.querySelector('.error-message').style.opacity = "1";
      canSubmit = false;
    }
    
    if ( city3.value == '' ) {
      city3.parentNode.querySelector('.error-message').style.opacity = "1";
      canSubmit = false;
    }
    
    if ( canSubmit == true ) {
      // Construct an HTTP request
      var xhr = new XMLHttpRequest();
      xhr.open(form.method, form.action, true);
      xhr.setRequestHeader('Accept', 'application/json; charset=utf-8');
      xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
      xhr.setRequestHeader('Access-Control-Allow-Origin', '*');

      // Send the collected data as JSON
      xhr.send(JSON.stringify(data));

      // Callback function
      xhr.onloadend = response => {
        if (response.target.status === 200) {
          // The form submission was successful
          form.reset();
          noticeText.innerHTML = 'Thanks for your submission. We will be in touch shortly.';
          submitButton.disabled = false;
        } else {
          // The form submission failed
          noticeText.innerHTML = 'Something went wrong';
          console.error(JSON.parse(response.target.response).message);
          submitButton.disabled = false;
        }

        formResponse.style.opacity = "1";
        setTimeout(function(){ formResponse.style.opacity = "0"; }, 5000);
      };
    } else {
      submitButton.disabled = false;
    }
  };
})()

function validateEmail(email) {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

function validURL(url) {
  var pattern = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/;
  return pattern.test(url);
}