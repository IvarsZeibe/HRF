import { url } from "../constants";

class AuthenticationSerivce {
    async signIn(Email, Password) {
        await fetch(url + "Auth/login", {
          method: 'POST',
          mode: 'cors',
          cache: 'no-cache',
          credentials: 'same-origin',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({Email, Password})
        })
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                response.text().then(res => {throw Error(res)});
                throw Error(response.status);
            }
        })
        .then(data => {
            sessionStorage.setItem('jwtToken', data.token);
            sessionStorage.setItem('jwtExpirationTime', data.tokenExpirationTime);
        });
    }
    async signUp(Email, Username, Password) {
        await fetch(url + "Auth/register", {
            method: 'POST',
            mode: 'cors',
            cache: 'no-cache',
            credentials: 'same-origin',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({Username, Password, Email})
          })
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw Error(response.statusText);
            }
        })
        .then(data => {
            sessionStorage.setItem('jwtToken', data.token);
            sessionStorage.setItem('jwtExpirationTime', data.tokenExpirationTime);
        });
    }
    signOut() {
        sessionStorage.removeItem('jwtToken');
        sessionStorage.removeItem('jwtExpirationTime');
        window.location.reload();
    }
    isSignedIn() {
        return sessionStorage.getItem('jwtToken') !== null && sessionStorage.getItem('jwtExpirationTime') > Math.floor(Date.now() / 1000);
    }
    async getUser() {
        if (!this.isSignedIn()) {
            return null;
        }
        let bearer = 'Bearer ' + sessionStorage.getItem('jwtToken');
        return await fetch(url + "Users/current", {
            method: 'GET',
            mode: 'cors',
            cache: 'no-cache',
            credentials: 'same-origin',
            headers: {'Authorization': bearer}
        })
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw Error(response.statusText);
            }
        });
    }
}

export default new AuthenticationSerivce();