// declaring variables

const button_shorten = document.querySelector(".button-shorten");
const button_menu = document.querySelector(".menu-logo");
const modal = document.querySelector(".modal-signup")
const input = document.querySelector(".input-url");
const error_text = document.querySelector(".error-text");
const link_wrapper = document.querySelector(".links-wrapper");

const clickingMenuButton = () => {
    button_menu.addEventListener("click", () => {
        modal.classList.toggle("hidden");
    })
}

const ifLinkNotValid = (input, error, res) => {
    if(input.value == "" || res.status == 400) {
        error.classList.remove("hidden");
        input.style.border = "3px solid #F46363";
        input.classList.add("error");
    } else {
        error.classList.add("hidden");
        input.style.border = "3px solid #FFFFFF";
        input.classList.remove("error");
    }
}

const copyLinks = (button, link) => {
    for(let i = 0; i < button.length; i++) {
        button[i].onclick = () => {
           button[i].classList.add("copied");
           button[i].innerHTML = "Copied!";
           navigator.clipboard.writeText(link[i].innerHTML);
        }
    }
}

const addingLinkContainers = (link, shortlink) => {
    const container = document.createElement("div");
    container.classList.add("links-container");
    container.innerHTML = `
    <div class="links-panel">
        <div class="close">X</div>
        <a href="${link}" class="link-panel">${link}</a>
    </div>
    <a href=${shortlink} class="shortlink-panel">${shortlink}</a>
    <button class="button-copy">Copy</button>`
    link_wrapper.appendChild(container); 
    let shortlink_panel = document.querySelectorAll(".shortlink-panel");
    let button_copy = document.querySelectorAll(".button-copy");
    removeLinks();
    copyLinks(button_copy, shortlink_panel)
}

const fetchAPI = async () => {
    let api = "https://api.shrtco.de/v2/shorten?url=";
    let link = input.value;
    let url = `${api}${link}`
    try {
        const response = await fetch(url);
        ifLinkNotValid(input, error_text, response);
        const jsonData = await response.json();
        let shortlink = jsonData.result.full_short_link;
        addingLinkContainers(link, shortlink);
    } catch(error) {
        console.log(error);
    }
}

const localStorageFunc = () => {
    let linkwrapper = link_wrapper.innerHTML;
    localStorage.setItem("link", linkwrapper);
}

setInterval(localStorageFunc, 0);


const clickingShortenButton = () => {
    button_shorten.addEventListener("click", () => {
        fetchAPI();
        localStorageFunc();
    })
}

const removeLinks = () => {
    let containers = document.querySelectorAll(".links-container");
    let button_close = document.querySelectorAll(".close");
    for(let i = 0; i < button_close.length; i++) {
        button_close[i].onclick = () => {
            link_wrapper.removeChild(containers[i]);
        }
    }
}

document.addEventListener("DOMContentLoaded", () => {
    link_wrapper.innerHTML = localStorage.getItem("link");
    removeLinks();
    clickingShortenButton();
    clickingMenuButton();
})

