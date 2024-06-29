function photographerTemplate(data) {
    const { name, portrait, country, city, price, tagline, id } = data;

    const picture = `assets/photographers/${portrait}`;
    
    function getUserCardDOM() {
        const article = document.createElement('article');
        article.setAttribute("tabindex", 0);
        article.addEventListener('keydown', function(event) {
            if (event.key === 'Enter' || event.key === ' ') {
                displayModal();
            }
        });


        const img = document.createElement('img');
        img.setAttribute("src", picture);
        const h2 = document.createElement( 'h2');
        h2.textContent = name;
        const h3 = document.createElement( 'p');
        h3.textContent = price + '€/jour';
        const h4 = document.createElement( 'h4');
        h4.textContent = country+', '+ city;
        const h5 = document.createElement('h5');
        h5.textContent = tagline;
        article.appendChild(img);
        article.appendChild(h2);
        article.appendChild(h3);
        article.appendChild(h4);
        article.appendChild(h5);

        // Etape 4 permet d'exécuter une action quand je cliques sur l'article donc là l'article c'est un photographe, et quand je clics ça récupères la location actuelle de la page, et ça la change en fonction de l'id du photographe
        article.addEventListener('click', function() {
            window.location.href = `photographer.html?id=${id}`;
        });
        

        article.addEventListener('keydown', function(event) {
            if (event.key === 'Enter') {
                window.location.href = `photographer.html?id=${id}`;
            }
        });
        // fin etape 4
       
        return (article);
    }

    return { name, picture, country, city, price, tagline, id, getUserCardDOM }
    
}



// Etape 4

function getPhotographerId() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    return urlParams.get('id');
}

async function displayPhotographer() {
    const photographerId = getPhotographerId();
    const response = await fetch('./data/photographers.json');
    const data = await response.json();
    const photographers = data.photographers;
    const photographer = photographers.find(p => p.id.toString() === photographerId);

    const photographHeader = document.querySelector('.photograph-header');
    photographHeader.innerHTML = `
        <h1>${photographer.name}</h1>
        <h2>${photographer.city}, ${photographer.country}</h2>
        <p>${photographer.tagline}</p>
        <img src="assets/photographers/${photographer.portrait}" alt="Portrait of ${photographer.name}" class="portrait">
    `;
}

function displayModal() {
    const modal = document.getElementById('contact_modal');
    modal.style.display = 'block';
}

function closeModal() {
    const modal = document.getElementById('contact_modal');
    modal.style.display = 'none';
}

document.addEventListener('DOMContentLoaded', function() {
    displayPhotographer();
});