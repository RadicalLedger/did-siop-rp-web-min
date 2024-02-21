fetch(`/request?origin=${window.location.origin}`)
    .then((res) => res.json())
    .then((data) => {
        if (data?.request) {
            $('#login-button').attr('data-did-siop', data.request);
            /* to extension to detect the login button */
            localStorage.setItem('new-content', 'true');
        }
    });
