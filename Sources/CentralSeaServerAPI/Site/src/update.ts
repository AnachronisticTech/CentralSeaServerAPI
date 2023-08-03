import "./styles.less";
import { API } from "./API";

const secret = document.getElementById("secret") as HTMLInputElement;
const result = document.getElementById("result") as HTMLDivElement;
const updateDatapackButton = document.getElementById("update-datapack") as HTMLButtonElement;
updateDatapackButton.addEventListener("click", () => update("datapack-form"));
updateDatapackButton.addEventListener("touchstart", () => update("datapack-form"));
const updateResourcesButton = document.getElementById("update-resources") as HTMLButtonElement;
updateResourcesButton.addEventListener("click", () => update("resources-form"));
updateResourcesButton.addEventListener("touchstart", () => update("resources-form"));

function update(formName: string) {
    const form = document.getElementById(formName) as HTMLFormElement;
    const data = new FormData(form);
    data.append("secret", secret.value);

    const request = new XMLHttpRequest();
    request.open('POST', `${API.baseURL}/css-api/shopping/${form.dataset["name"]}`, true);

    result.innerHTML = "";
    request.onload = function() {
        result.appendChild(createResponseView(this.status >= 200 && this.status < 400 ? new Success() : new Failure(this.statusText)));
        // if (this.status >= 200 && this.status < 400) {
        //     result.classList.remove("hidden")
        //     result.classList.remove("information")
        //     result.classList.remove("error")
        //     result.classList.add("success")
        //     result.innerHTML = "<b>Success:</b> Upload complete"
        // } else {
        //     result.classList.remove("hidden")
        //     result.classList.remove("information")
        //     result.classList.remove("success")
        //     result.classList.add("error")
        //     result.innerHTML = `<b>Error:</b> Upload failed: ${this.statusText}`
        // }
    }

    request.send(data);
}

function createResponseView(status: Success | Failure): HTMLDivElement {
    const view = document.createElement("div");
    if (status instanceof Success) {
        view.innerHTML = "<b>Success:</b> Upload complete";
    } else if (status instanceof Failure) {
        view.innerHTML = `<b>Error:</b> Upload failed: ${status.message}`;
    }

    return view;
}

class Success {}
class Failure {
    message: string;

    constructor(message: string) {
        this.message = message;
    }
}
