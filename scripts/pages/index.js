
async function getPhotographers() {

    // Ce que j'ai fais pour afficher les photographes 
    let allPhotographers = [];
    
    await fetch('./data/photographers.json')
        .then((response) => response.json())
        .then((data) => {
            allPhotographers = data.photographers
        });

    // et bien retourner le tableau photographers seulement une fois récupéré
    return ({
        photographers: allPhotographers
    })
}

async function displayData(photographers) {
    const photographersSection = document.querySelector(".photographer_section");

    photographers.forEach((photographer) => {
        const photographerModel = photographerTemplate(photographer);
        const userCardDOM = photographerModel.getUserCardDOM();
        photographersSection.appendChild(userCardDOM);
    });
}

async function init() {
    // Récupère les datas des photographes
    const { photographers } = await getPhotographers();
    displayData(photographers);
}

init();


// PARTIE 3


function displayPhotographers() {
    const photographersSection = document.querySelector(".photographer_section");
    photographers.forEach(photographer => {
        const photographerModel = photographerTemplate(photographer);
        const userCardDOM = photographerModel.getUserCardDOM();
        photographersSection.appendChild(userCardDOM);
    });
}

document.addEventListener('DOMContentLoaded', displayPhotographers);