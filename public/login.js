fetch(`/request?origin=${window.location.origin}`)
    .then((res) => res.json())
    .then((data) => {
        if (data?.request) {
            const button = document.getElementById('login-button');

            button.dataset.didSiop = data.request;
            /* to extension to detect the login button */
            localStorage.setItem('new-content', 'true');
        }
    });
