const form = document.getElementById('contact-form');
const result = document.getElementById('result');
const popup = document.getElementById('popup');

form.addEventListener('submit', function(e) {

    e.preventDefault();

    const formData = new FormData(form);
    const object = Object.fromEntries(formData);
    const json = JSON.stringify(object);
    result.innerHTML = "Please wait..."

    fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: json
        })
        .then(async (response) => {
            let json = await response.json();
            if (response.status == 200) {
                result.innerHTML = "Form submitted successfully";
            } else {
                console.log(response);
                result.innerHTML = json.message;
            }
        })
        .catch(error => {
            console.log(error);
            result.innerHTML = "Something went wrong!";
        })
        .then(function() {
            form.reset();
            setTimeout(() => {
                result.style.display = "none";
            }, 3000);
        });

        setTimeout(function() {
            popup.style.display = 'block';
            document.getElementById('contact-form').reset();
        }, 500);

        document.getElementById('popup-close').addEventListener('click', function() {
            popup.style.display = 'none';
        });

        document.getElementById('popup-close-btn').addEventListener('click', function() {
            popup.style.display = 'none';
        });
});