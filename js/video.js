console.log("sajib")
// create load catagories
const loadCategories = () =>{
    // fetch
    fetch("https://openapi.programming-hero.com/api/phero-tube/categories")
        .then((res) => res.json())
        .then((data) => displayCategories(data.categories))
        .catch((error) => console.log(error));
};

const removeActiveClass = () => {
    const button = document.getElementsByClassName('category-btn');
    for(let btn of button){
        btn.classList.remove('active')
    }
};

// create category videos

const categoryVideos = (id) => {
    fetch(`https://openapi.programming-hero.com/api/phero-tube/category/${id}`)
        .then((res) => res.json())
        .then((data) => {
            removeActiveClass();
            const activeBtn = document.getElementById(`btn-${id}`);
            activeBtn.classList.add('active')
            displayVideo(data.category)
        })
        .catch((error) => console.log(error));
};

// create video section

const loadvideo = (searchText = "") =>{
    // fetch
    fetch(`https://openapi.programming-hero.com/api/phero-tube/videos?title=${searchText}`)
        .then((res) => res.json())
        .then((data) => displayVideo(data.videos))
        .catch((error) => console.log(error));
};

// create details 

const loadDetails = async (videoId) => {
    const uri = `https://openapi.programming-hero.com/api/phero-tube/video/${videoId}`;
    const res = await fetch(uri);
    const data = await res.json();
    displayDetails(data.video)
    
};

// display details

const displayDetails = (video) => {
    const detailContainer = document.getElementById('modal-content');
    detailContainer.innerHTML = `
    <img src=${video.thumbnail} />
    <p>${video.description}</p>
    `
    // modal show
    document.getElementById('show-detail').click();
}

// time

function getTime(time){
    // get day

    const day = parseInt(time / 86400);
    let remainingSecond2 = time % 86400;

    // get hours
    const hours = parseInt(remainingSecond2 / 3600);
    let remainingSecond = remainingSecond2 % 3600;
    // get minute
    const minute = parseInt(remainingSecond / 60);
    let remainingSecond1 = remainingSecond % 60;
    return `${hours} hour ${minute} minute ${remainingSecond1} second ago`
}

// create display categories

const displayCategories = (data) =>{
    const categoryContainner = document.getElementById('nav-containner');
    data.forEach( (item) => {
        // create button
        const button = document.createElement('div');
        button.innerHTML = `
        <button id="btn-${item.category_id}" onclick="categoryVideos(${item.category_id})" class="btn category-btn">
            ${item.category}
        </button>
        `
        // add button to navbar containner
        categoryContainner.append(button);
    });
}

// create display video

const displayVideo = (data) => {
    const videoContainner = document.getElementById('video');
    videoContainner.innerHTML = '';
    // if condition
    if(data.length == 0){
        videoContainner.classList.remove('grid');
        videoContainner.innerHTML =  `
        <div class="min-h-[400px] flex flex-col justify-center items-center space-y-5">
            <img src="assets/Icon.png" />
            <p class="text-center text-xl font-bold">No Content in this Category</p>
        </div>
        `;
        return;
    }else{
        videoContainner.classList.add('grid')
    }

    // loop
    data.forEach((item) => {
        // create card
        const cards = document.createElement('div');
        cards.classList = 'card card-compact bg-base-100 w-auto ';
        cards.innerHTML = `
         <figure class="h-[200px] relative">
            <img class="h-full w-full object-cover"
            src="${item.thumbnail}" />
            ${
                item.others.posted_date?.length == 0 ? "" : `<span class="text-xs bg-black text-white absolute bottom-2 right-2 rounded-xl p-1">${getTime(item.others.posted_date)}</span>`
            }
            
        </figure>
        <div class="px-0 py-2 flex gap-4">
            <div>
            <img class="h-10 w-10 rounded-full object-cover" src="${item.authors[0].profile_picture}" />
            </div>
            <div>
                <h2 class="font-bold">${item.title}</h2>
                <div class="flex items-center gap-2">
                    <p>${item.authors[0].profile_name}</p>
                    ${item.authors[0].verified ? '<img class="w-5 h-5 object-cover" src="https://img.icons8.com/?size=96&id=D9RtvkuOe31p&format=png" />' : ""}
                </div>
                <p><button onclick="loadDetails('${item.video_id}')" class="btn btn-sm btn-error">Details</button></p>
            </div>
        </div>
        `;
        // add cards to video section
        videoContainner.append(cards);
    })
}


document.getElementById('input').addEventListener('keyup', (e) => {
    loadvideo(e.target.value)
})

loadCategories()
loadvideo()