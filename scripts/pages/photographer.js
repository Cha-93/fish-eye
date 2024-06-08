document.addEventListener('DOMContentLoaded', () => {
    let name = document.getElementById("nom");
    let city = document.getElementById("ville");
    let country = document.getElementById("pays");
    let tagline = document.getElementById("tag");

    let imgListe = document.getElementsByClassName('logo');
    let img = imgListe[0];

    img.onclick = function() {
        window.location.href = 'index.html';
    };

    // Récupérer ID dans l'URL
    let url = new URL(window.location.href);
    let id = url.searchParams.get("id");

    async function getPhotographers() {
        let allPhotographers = [];
        await fetch('./data/photographers.json')
            .then((response) => response.json())
            .then((data) => {
                allPhotographers = data.photographers;
            });
        return { photographers: allPhotographers };
    }

    async function getMedias() {
        let allMedias = [];
        await fetch('./data/photographers.json')
            .then((response) => response.json())
            .then((data) => {
                allMedias = data.media;
            });
        return allMedias;
    }

    document.addEventListener('keydown', function(event) {
        if (event.key === 'ArrowLeft') {
          changeMedia(-1);
        } else if (event.key === 'ArrowRight') {
          changeMedia(1);
        }
      });

    (async () => {
        try {
            let allPhotographers = await getPhotographers();
            allPhotographers = allPhotographers.photographers;

            let photographer = allPhotographers.find(item => item.id == id);

            document.getElementById('nom').innerHTML = photographer.name;
            document.getElementById('ville').innerText = photographer.name;
            document.getElementById('pays').innerHTML = photographer.country;
            document.getElementById('tag').innerHTML = photographer.tagline;
            document.getElementById('prix_photographe').innerHTML = `${photographer.price}€ / jour`;
            document.getElementById('portrait').src = `assets/photographers/${photographer.portrait}`;

            let medias = await getMedias();
            let photographerMedia = medias.filter(m => m.photographerId == id);
            let mediaContainer = document.getElementById('photos');

            let totalLikes = 0;
            // la variable photographerMedia contient tout les medias d'un photographe
            photographerMedia.forEach((m) => {
                if (m.image) {
                    m.type = "image";
                } else if (m.video) {
                    m.type = "video";
                }
                let mediaElement = MediaFactory.createMedia(m);
                mediaContainer.innerHTML += mediaElement.createMediaElement();
                totalLikes += m.likes;
            });

            document.querySelectorAll('.media').forEach((mediaElement, index) => {
                mediaElement.addEventListener('click', () => {
                    openModal(index, photographerMedia);
                });
            });

            // ajout de l'encart sur les likes totaux
            document.querySelector('.encart_likes label').innerText = totalLikes;

            // on détecte quand on change de filtre en s'abonnant à l'événement "change" sur le
            // composant de filtrage "pictures-select", qui appelle les fonction de tri et d'affichage
            document.getElementById('pictures-select').addEventListener('change', (event) => {
                sortMedias(event.target.value, photographerMedia);
                displayMedias(photographerMedia);
            });
            addLikeEventListeners();
        } catch (error) {
            console.error(error);
        }
    })();

    function sortMedias(criteria, mediaArray) {
        if (criteria === 'popularity') {
            // pour la popularité, on utilise la fonction sort() qui trie les valeurs une à une et retourne la plus grande valeur
            mediaArray.sort((a, b) => b.likes - a.likes);
        } else if (criteria === 'date') {
            // pour la date, on utilise la fonction sort() qui trie les valeurs une à une et retourne la plus grande valeur
            mediaArray.sort((a, b) => new Date(b.date) - new Date(a.date));
        } else if (criteria === 'title') {
            // pour le titre, on utilise la fonction localeCompare() qui compare les titres par ordre alphabétique
            mediaArray.sort((a, b) => a.title.localeCompare(b.title));
        }
    }

    function displayMedias(mediaArray) {
        let mediaContainer = document.getElementById('photos');
        // on vide l'ancien conteneur avant d'afficher les nouveaux, pour s'assurer qu'il soit vide
        mediaContainer.innerHTML = '';

        // on crée les balises html de chaque media et on l'injecte dans le html de la page
        mediaArray.forEach((m) => {
            let mediaElement = MediaFactory.createMedia(m);
            mediaContainer.innerHTML += mediaElement.createMediaElement();
        });

        // on ajoute l'événement de click sur chaque media pour que si on clique ça ouvre la modale des medias
        document.querySelectorAll('.media').forEach((mediaElement, index) => {
            mediaElement.addEventListener('click', () => {
                openModal(index, mediaArray);
            });
        });
        addLikeEventListeners();
    }


    function addLikeEventListeners() {
        // on parcourt tous les medias
        document.querySelectorAll('.media_likes_img').forEach((likeButton, index) => {
            likeButton.addEventListener('click', (event) => {
                // condition pour vérifier si le bouton ne possède pas la classe "liked", autrement dit si il a déjà été liké
                if (!likeButton.classList.contains('liked')) {
                    // ajout de la classe "liked"  au bouton liké
                    likeButton.classList.add('liked');
                    // on incrémente (on ajoute 1) au compteur de likes total
                    incrementLikes(index);
                }
            });
        });
    }

    function incrementLikes(index) {
        const mediaElement = document.querySelectorAll('.photo, .video')[index];
        const likeCountElement = mediaElement.querySelector('.photo_likes_nombre, .video_likes_nombre');
        // on récupère le nombre actuel de likes sur la photo, c'est une chaîne de caractère donc on la converti en nombre avec la fonction parseInt()
        const currentLikes = parseInt(likeCountElement.innerText);
        // on fait +1 sur le nombre de likes
        likeCountElement.innerText = currentLikes + 1;

        // même chose mais sur le nombre de likes total
        const totalLikesElement = document.querySelector('.encart_likes label');
        const currentTotalLikes = parseInt(totalLikesElement.innerText);
        totalLikesElement.innerText = currentTotalLikes + 1;
    }

    // creation du patron de conception ( factory )
    class MediaFactory {
        static createMedia(media) {
            if (media.type == "image") {
                return new Photo(media);
            } else if (media.type == "video") {
                return new Video(media);
            }
        }
    }

    // Variable de base d'un media 
    class Media {
        constructor(media) {
            this.id = media.id;
            this.photographerId = media.photographerId;
            this.title = media.title;
            this.likes = media.likes;
            this.date = media.date;
            this.price = media.price;
        }
    }
// des photos donc classe photo qui etend la classe Media et ajoute en plus la variable image en plus
    class Photo extends Media {
        constructor(media) {
            super(media);
            // Ajout de la variable image
            this.image = media.image;
        }
// Fonction qui retourne le html de l'image qui va être injecter dans le html de la page
        createMediaElement() {
            return `
                <div class="photo">
                    <img src="FishEye_Photos/Sample Photos/${this.photographerId}/${this.image}" class="media" alt="${this.title}">
                    <div class="photo_description">
                        <h3 class="photo_nom">${this.title}</h3>
                        <div class="photo_likes">
                            <p class="photo_likes_nombre">${this.likes}</p>
                            <img src="assets/icons/heart-red.svg" class="media_likes_img"/>
                        </div>
                    </div>
                </div>`;
        }
    }

    class Video extends Media {
        constructor(media) {
            super(media);
            this.video = media.video;
        }


        // Fonction qui retourne le html de la video qui va être injecter dans le html de la page
        createMediaElement() {
            return `
                <div class="video">
                    <video controls class="media">
                        <source src="FishEye_Photos/Sample Photos/${this.photographerId}/${this.video}" type="video/mp4">
                        Your browser does not support the video tag.
                    </video>
                    <div class="video_description">
                        <h3 class="video_nom">${this.title}</h3>
                        <div class="video_likes">
                            <p class="video_likes_nombre">${this.likes}</p>
                            <img src="assets/icons/heart-red.svg" class="media_likes_img"/>
                        </div>
                    </div>
                </div>`;
        }
    }

    //creation de modal media ( images et vidéos)

    let currentIndex = 0;
    let mediaItems = [];

    //index est l'indice de l'image qu'on veut ouvrir, items liste de tout les medias
    function openModal(index, items) {
        currentIndex = index;
        mediaItems = items;
        showMedia(currentIndex);
        //Ce qu'on recupère dans le document et affichage
        document.getElementById('media-modal').style.display = "block";
    }
//On récupère la modal des medias et on la cache
    function closeModal() {
        document.getElementById('media-modal').style.display = "none";
    }

    //Change media quand la modal est ouverte et qu'on clique sur une des flèches
    function changeMedia(direction) {
        currentIndex += direction;
        if (currentIndex < 0) {
            currentIndex = mediaItems.length - 1;
        } else if (currentIndex >= mediaItems.length) {
            currentIndex = 0;
        }
        showMedia(currentIndex);
    }
//Ici on voit si on affiche une image ou une video
    function showMedia(index) {
        const media = mediaItems[index];
        const modalImage = document.getElementById('modal-image');
        const modalVideo = document.getElementById('modal-video');

        if (media.type === "image") {
            modalVideo.style.display = "none";
            modalImage.style.display = "block";
            modalImage.src = `FishEye_Photos/Sample Photos/${media.photographerId}/${media.image}`;
        } else if (media.type === "video") {
            modalImage.style.display = "none";
            modalVideo.style.display = "block";
            modalVideo.src = `FishEye_Photos/Sample Photos/${media.photographerId}/${media.video}`;
        }
    }
//On affiche et on ferme la modal de contacte
   function displayContactModal() {
        document.getElementById('contact-modal').style.display = 'block';
    }

    function closeContactModal() {
        document.getElementById('contact-modal').style.display = 'none';
    }

    //Pour que les fonctions soit disponible globalement( pas de msg d'erreur" fonction non defini")
    window.closeModal = closeModal;
    window.changeMedia = changeMedia;
    window.displayContactModal = displayContactModal;
    window.closeContactModal = closeContactModal;
});

function handleSubmit(event) {
    event.preventDefault();

    const form = document.getElementById('form');
    // on récupère les données du formulaire
    const formData = new FormData(form);

    // parcours des données et on les ajoute dans un objet
    const formObject = {};
    formData.forEach((value, key) => {
      formObject[key] = value;
    });

    // afficher les données du formulaire dans la console
    console.log(formObject);

    // fermer la modale
    closeContactModal();
  }