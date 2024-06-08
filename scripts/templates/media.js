// media.js
function loadImages(photographer) {
    const gallery = document.getElementById('gallery');
    const imageFolder = `FishEye_Photos/Sample Photos/Ellie Rose${photographer}/`;

    const images = [
        'Architecture_Connected_Curves.jpg',
        'Architecture_Cross_Bar.jpg',
        'Architecture_Horseshoe.jpg',
        'Architecture_Water_on_Modern.jpg',
        'Architecture_White_Light.jpg'
        'Sport_Jump.jpg',
        'Sport_Next_Hold.jpg',
        'Sport_Race_End.jpg',
        'Sport_Sky_Cross.jpg'
        // Ajoutez plus d'images ici
    ];

    images.forEach(image => {
        const img = document.createElement('img');
        img.src = imageFolder + image;
        img.alt = `${photographer} photo`;
        gallery.appendChild(img);
    });
}
