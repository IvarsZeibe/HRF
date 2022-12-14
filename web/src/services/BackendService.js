import { url } from "../constants";
import AuthenticationService from "./AuthenticationService";

class BackendService {
    async requestFromAPI(method, to, data = null, withAuth = true, returnType = "none") {
        if (withAuth && !AuthenticationService.isSignedIn()) {
            AuthenticationService.signOut();
            return;
        }
        let bearer = 'Bearer ' + sessionStorage.getItem('jwtToken');
        let headers = {};
        let body = null;
        if (withAuth) {
            headers["Authorization"] = bearer;
        }
        if (data !== null) {
            headers["Content-Type"] = "application/json";
            body = JSON.stringify(data); 
        }
        return await fetch(url + to, {
            method: method,
            mode: 'cors',
            cache: 'no-cache',
            credentials: 'same-origin',
            headers: headers,
            body: body
        })
        .then(response => {
            if (response.ok) {
                if (method === "GET") {
                    return response.json();
                } else {
                    return response.text();
                }
            } else {
                if (returnType == "json") {
                    return response.json().then(res => {throw res});
                } else if (returnType == "text") {
                    return response.text().then(res => {throw res});
                } else {
                    throw Error(response.statusText);
                }
            }
        });
    }
    async getUsers() {
        return await this.requestFromAPI("GET", "Users", null, true, "none");
    }
    async getMyUser() {
        return await this.requestFromAPI("GET", "Users/current", null, true, "none");
    }
    async deleteUser(id) {
        return await this.requestFromAPI("DELETE", `Users/${id}`, null, true, "none");
    }
    async deleteMyUser() {
        return await this.requestFromAPI("DELETE", "Users", null, true, "none");
    }
    // can't change id
    async changeUserData(id, username, email, isAdmin, password) {
        let data = { Id: id, Password: password, Email: email, Username: username, IsAdmin: isAdmin };
        return await this.requestFromAPI("PUT", "Users", data, true, "json");
    }
    async changeMyPassword(newPassword, oldPassword) {
        let data = { NewPassword: newPassword, OldPassword: oldPassword };
        return await this.requestFromAPI("POST", "Users/password", data, true, "text");
    }
    async changeMyEmail(email) {
        return await this.requestFromAPI("POST", "Users/email", {Value: email}, true, "text");
    }
    async changeMyUsername(username) {
        return await this.requestFromAPI("POST", "Users/username", {Value: username}, true, "text");
    }
    async getAllTestResultsFor(testType) {
        return await this.requestFromAPI("GET", testType+"/all", null, false, "none");
    }
    async getMyTestResults(testType) {
        return await this.requestFromAPI("GET", testType, null, true, "none");
    }
    async deleteTestResult(testType, id) {
        return await this.requestFromAPI("DELETE", testType+"/"+id, null, true, "none");
    }
    async changeTestResult(testType, data) {
        return await this.requestFromAPI("PUT", testType, data, true, "json");
    }
    async deleteAllMyResultsIn(testType) {
        return await this.requestFromAPI("DELETE", testType, null, true, "none");
    }
    async getMyTestResultSummary(testType) {
        return await this.requestFromAPI("GET", testType+"/my/summary", null, true, "none");
    }
    async getTestResultSummary(testType) {
        return await this.requestFromAPI("GET", testType+"/summary", null, true, "none");
    }
    async addMyTestResult(testType, data) {
        return await this.requestFromAPI("POST", testType, data, true, "none");
    }
}

export default new BackendService();