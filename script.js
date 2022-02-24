const postsContainerEl = document.getElementById("posts-container");
const filter = document.getElementById("filter");
const loading = document.querySelector(".loading");

let limit = 50;

//Fetch API
async function getPosts() {
  const res = await fetch(
    `https://us-central1-dadsofunny.cloudfunctions.net/DadJokes/random/jokes/${limit}`
  );
  const data = await res.json();
  return data;
}

//Show posts to DOM
async function showPosts() {
  const posts = await getPosts();

  posts.forEach((post) => {
    const postEl = document.createElement("div");
    postEl.classList.add("post");

    if (typeof post.id === "number") {
      postEl.innerHTML = `
    <div class="number">${post.id}</div>
    <div class="post-info">
      <h2 class="post-title">${post.setup}</h2>
      <p class="post-body">${post.punchline}</p>
    </div>`;
    } else {
      postEl.classList.add("hide");
    }

    postsContainerEl.appendChild(postEl);
  });
}

showPosts();

//Show loading and fetch more posts
function showLoading() {
  loading.classList.add("show");

  setTimeout(() => {
    loading.classList.remove("show");

    setTimeout(() => {
      showPosts();
    }, 300);
  }, 1000);
}

//Add infinite scrolling
window.addEventListener("scroll", () => {
  const { scrollTop, scrollHeight, clientHeight } = document.documentElement;

  if (scrollTop + clientHeight >= scrollHeight - 5) {
    showLoading();
  }
});

//Filter search and fetch post
filter.addEventListener("input", filterPosts);

function filterPosts(e) {
  const searchTerm = e.target.value.toLowerCase();
  const posts = document.querySelectorAll(".post");

  posts.forEach((post) => {
    const insidePost = post.innerText.toLowerCase();

    //Check if the searchTerm match post.innerText
    if (insidePost.indexOf(searchTerm) > -1) {
      post.style.display = "flex";
    } else {
      post.style.display = "none";
    }
  });
}
