const handleCategories = async () => {
    const categoryContainer = document.getElementById('button-container');

    const response = await fetch(`https://openapi.programming-hero.com/api/videos/categories`);
    const data = await response.json();
    const categories = data.data;

    categories.forEach(category => {
        const categoryButton = document.createElement('div');
        categoryButton.innerHTML = `
        <button onclick="loadCategories('${category.category_id}')" class="btn rounded-lg md:text-lg bg-gray-200 font-medium text-[#252525] capitalize">${category.category}</button>
        `;
        categoryContainer.appendChild(categoryButton);
    })
}

let isSort = false;
let currentCategory;

const loadCategories = async (category_id, isSort) => {
    const cardContainer = document.getElementById('card-container');
    cardContainer.textContent = '';
    currentCategory = category_id;

    const response = await fetch(`https://openapi.programming-hero.com/api/videos/category/${category_id}`);
    const data = await response.json();
    const videos = data.data;

    let compare = (a, b) => {
        if (parseInt(b.others?.views) < parseInt(a.others?.views)) return -1;
        if (parseInt(b.others?.views) > parseInt(a.others?.views)) return 1;
        return 0;
    }

    if (isSort == true) {
        videos.sort(compare)
    }

    if (videos.length > 0) {
        videos.forEach(video => {
            const seconds = parseInt(video.others?.posted_date);
            const hours = parseInt(seconds / 3600);
            const minutes = parseInt((seconds % 3600) / 60);
            const time = `${hours} hrs ${minutes} min ago`;
            const div = `<span id="time-display" class="absolute top-[150px] right-2 bg-[#171717] px-2 py-1 rounded text-white text-[10px]">${time}</span>`;

            const videoCard = document.createElement('div');
            videoCard.innerHTML = `
                <div class="card bg-base-100 shadow-xl rounded-lg">
                    <figure><img src=${video.thumbnail} class="h-[180px] w-full rounded-lg"/></figure>
                    <div>${video.others?.posted_date ? div : ''}</div>
                    <div class="flex gap-2 mt-4 mb-4 ps-2">
                        <div>
                            <div class="avatar">
                                <div class="w-10 rounded-full">
                                <img src=${video.authors[0]?.profile_picture} />
                                </div>
                            </div>
                        </div>
                        <div>
                            <h2 class="card-title">${video.title}</h2>
                            <div class="flex gap-1 items-center card-text mt-1 mb-2">
                                <p>${video.authors[0]?.profile_name}</p>
                                <span>${video.authors[0]?.verified ? "<img src='./images/verified.png'>" : ""}</span>
                            </div>
                            <p class="card-text">${video.others?.views} views</p>
                        </div>
                    </div>
                </div>
            `;
            cardContainer.classList = 'grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-10 px-8 md:px-16 lg:px-0';
            cardContainer.appendChild(videoCard);
        })
    }
    else {
        const error = document.createElement('div');
        error.innerHTML = `
            <div class="text-center">
                <img src="./images/Icon.png" alt="error" class="block mx-auto">
                <h2 class="text-[#171717] text-2xl md:text-3xl font-bold mt-5">Oops!! Sorry, There is no <br> content here</h2>
            </div>
        `;
        cardContainer.classList = 'mt-12';
        cardContainer.appendChild(error);
    }
}

const sortByView =  () => {
    isSort = true;
    loadCategories(currentCategory, isSort);
}

const showBlogs = () => {
    window.location.href = "./blog.html";
}

handleCategories();
loadCategories('1000')