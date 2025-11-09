let cart = [];

const searchMeals = () => {
    const query = document.getElementById("searchInput").value.trim();
    const container = document.getElementById("meal-container");
    container.innerHTML = "";

    if (query === "") {
        container.innerHTML = "<p>Please type something to search.</p>";
        return;
    }

    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`)
        .then(res => res.json())
        .then(data => {
            if (!data.meals) {
                container.innerHTML = "<p>No meals found.</p>";
                return;
            }

            data.meals.forEach(meal => {
                const div = document.createElement("div");
                div.classList.add("meal-card");
                div.innerHTML = `
          <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
          <h4>${meal.strMeal}</h4>
          <p>${meal.strCategory || "No Category"}</p>
          <button class="add-btn" onclick="addToCart('${meal.idMeal}', '${meal.strMeal}', '${meal.strMealThumb}')">Add to Cart</button>
          <button class="details-btn" onclick="showDetails('${meal.idMeal}')">Details</button>
        `;
                container.appendChild(div);
            });
        })
        .catch(() => {
            container.innerHTML = "<p>Error fetching data.</p>";
        });
};

const addToCart = (id, name, img) => {
    const meal = { id, name, img };
    cart.push(meal);
    updateCart();
};

const updateCart = () => {
    const container = document.getElementById("cart-container");
    container.innerHTML = "";
    document.getElementById("cart-count").innerText = cart.length;

    cart.forEach(meal => {
        const div = document.createElement("div");
        div.classList.add("cart-item");
        div.innerHTML = `
      <img src="${meal.img}" alt="${meal.name}">
      <span>${meal.name.slice(0, 15)}...</span>
    `;
        div.onclick = () => removeFromCart(meal.id);
        container.appendChild(div);
    });
};

const removeFromCart = (id) => {
    cart = cart.filter(meal => meal.id !== id);
    updateCart();
};

const showDetails = (id) => {
    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`)
        .then(res => res.json())
        .then(data => {
            const meal = data.meals[0];
            const modalBody = document.getElementById("modal-body");
            modalBody.innerHTML = `
        <h2>${meal.strMeal}</h2>
        <img src="${meal.strMealThumb}" width="100%" style="border-radius:10px;">
        <p><b>Category:</b> ${meal.strCategory}</p>
        <p><b>Area:</b> ${meal.strArea}</p>
        <p><b>Tags:</b> ${meal.strTags || "None"}</p>
        <p><b>Instructions:</b> ${meal.strInstructions.slice(0, 200)}...</p>
        <a href="${meal.strYoutube}" target="_blank">📺 Watch on YouTube</a>
      `;
            document.getElementById("modal").style.display = "block";
        });
};

const closeModal = () => {
    document.getElementById("modal").style.display = "none";
};
