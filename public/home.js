if (window.location.search.includes('code')) {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');

    fetch(`/validate?code=${code}&origin=${window.location.origin}`)
        .then((res) => res.json())
        .then((data) => {
            if (!data?.valid) {
                window.location.assign('/');
            } else {
                document.getElementById('home-title').textContent =
                    'You have successfully logged in';
            }
        })
        .catch((err) => {
            console.log(err);

            document.getElementById('home-title').textContent = `Error: ${
                err.message || 'Failed to validate the request'
            }`;
        });
} else {
    window.location.assign('/');
}
